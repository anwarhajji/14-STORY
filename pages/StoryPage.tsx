// FIX: Implemented the StoryPage component, which was previously a placeholder.
import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { stories } from '../data/storyData';
import { useLocalization } from '../hooks/useLocalization';
import RobotIdCard from '../components/RobotIdCard';
import QCMActivity from '../components/QCMActivity';
import DragAndDropActivity from '../components/DragAndDropActivity';
import WordScrambleActivity from '../components/WordScrambleActivity';
import StudentResults from '../components/StudentResults';
import { Story } from '../types';

type Activity = 'story' | 'qcm' | 'dragDrop' | 'wordScramble' | 'results';
type Scores = {
    qcm: { score: number; total: number; percentage: number };
    dragDrop: { score: number; total: number; percentage: number };
    wordScramble: { score: number; total: number; percentage: number };
};

const StoryPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const story = stories.find(s => s.id === id);
    const { getLocalizedStory, getLocalizedTeacherResources, direction, t } = useLocalization();
    
    const [activeTab, setActiveTab] = useState<Activity>('story');
    const [scores, setScores] = useState<Scores>({
        qcm: { score: 0, total: 0, percentage: 0 },
        dragDrop: { score: 0, total: 0, percentage: 0 },
        wordScramble: { score: 0, total: 0, percentage: 0 },
    });
    const [completedActivities, setCompletedActivities] = useState<Partial<Record<Activity, boolean>>>({});
    
    const translations = {
        storyNotFound: { fr: "Histoire non trouvée !", en: "Story not found!", ar: "لم يتم العثور على القصة!" },
        backToHome: { fr: "Retour à l'accueil", en: "Back to Home", ar: "العودة للرئيسية" },
        tabStory: { fr: "L'histoire", en: "The Story", ar: "القصة" },
        tabQCM: { fr: "QCM", en: "MCQ", ar: "الاختيار من متعدد" },
        tabDragDrop: { fr: "Jeu de Correspondance", en: "Matching Game", ar: "لعبة المطابقة" },
        tabWordScramble: { fr: "Mots Mêlés", en: "Word Scramble", ar: "ترتيب الكلمات" },
        tabResults: { fr: "Résultats", en: "Results", ar: "النتائج" },
        teacherResources: { fr: "Ressources pour les éducateurs", en: "Educator Resources", ar: "مصادر للمعلمين" },
        discussionPrompts: { fr: "Pistes de discussion", en: "Discussion Prompts", ar: "محاور للنقاش" },
        video: { fr: "Vidéo", en: "Video", ar: "فيديو" },
    };

    if (!story) {
        return (
            <div className="text-center">
                <h1 className="text-3xl font-bold">{t(translations.storyNotFound)}</h1>
                <Link to="/home" className="text-blue-500 hover:underline mt-4 inline-block">{t(translations.backToHome)}</Link>
            </div>
        );
    }

    const localizedContent = getLocalizedStory(story);
    const localizedTeacherResources = getLocalizedTeacherResources(story);

    const handleActivityComplete = (activity: Activity, score: number, total: number) => {
        if (total > 0) {
            setScores(prev => ({
                ...prev,
                [activity]: { score, total, percentage: Math.round((score / total) * 100) },
            }));
        }
        setCompletedActivities(prev => ({...prev, [activity]: true}));
    };
    
    const allActivitiesCompleted = 
        (!localizedContent.qcm.length || completedActivities.qcm) &&
        (!localizedContent.dragDrop.length || completedActivities.dragDrop) &&
        (!localizedContent.wordScramble.length || completedActivities.wordScramble);
        
    const activityTabs: { id: Activity; label: string; data: any[] }[] = [
        { id: 'story', label: t(translations.tabStory), data: [1] },
        { id: 'qcm', label: t(translations.tabQCM), data: localizedContent.qcm },
        { id: 'dragDrop', label: t(translations.tabDragDrop), data: localizedContent.dragDrop },
        { id: 'wordScramble', label: t(translations.tabWordScramble), data: localizedContent.wordScramble },
    ];
    
    return (
        <div className="container mx-auto px-4 py-8" dir={direction}>
            <div className="text-center mb-8">
                <h1 className="text-4xl md:text-5xl font-black text-base-content mb-2">{localizedContent.title}</h1>
            </div>

            <div className="tabs tabs-boxed mb-6">
                {activityTabs.filter(tab => tab.data.length > 0).map(tab => (
                    <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`tab tab-lg ${activeTab === tab.id ? 'tab-active' : ''}`}>
                        {tab.label}
                    </button>
                ))}
                {allActivitiesCompleted && (
                    <button onClick={() => setActiveTab('results')} className={`tab tab-lg ${activeTab === 'results' ? 'tab-active' : ''}`}>
                        {t(translations.tabResults)}
                    </button>
                )}
            </div>

            <div className="p-4 bg-base-100 rounded-box shadow-lg">
                {activeTab === 'story' && (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-2 prose max-w-none">
                            {localizedContent.storyText.map((paragraph, index) => <p key={index}>{paragraph}</p>)}
                        </div>
                        <div className="space-y-6">
                            <RobotIdCard image={story.image} info={story.technicalInfo.robotInfo} title={localizedContent.title} />
                            <div className="card bg-base-100 shadow-xl">
                                <div className="card-body">
                                    <h2 className="card-title">{t(translations.teacherResources)}</h2>
                                    <h3 className="font-bold mt-2">{t(translations.discussionPrompts)}:</h3>
                                    <ul className="list-disc list-inside">
                                        {localizedTeacherResources.discussionPrompts.map((prompt, i) => <li key={i}>{prompt}</li>)}
                                    </ul>
                                    <div className="card-actions justify-center mt-4">
                                        <a href={story.technicalInfo.videoUrl} target="_blank" rel="noopener noreferrer" className="btn btn-primary">
                                            {t(translations.video)}
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
                {activeTab === 'qcm' && <QCMActivity qcmData={localizedContent.qcm} onComplete={(s, t) => handleActivityComplete('qcm', s, t)} />}
                {activeTab === 'dragDrop' && <DragAndDropActivity dragDropData={localizedContent.dragDrop} onComplete={(s, t) => handleActivityComplete('dragDrop', s, t)} />}
                {activeTab === 'wordScramble' && <WordScrambleActivity wordScrambleData={localizedContent.wordScramble} onComplete={(s, t) => handleActivityComplete('wordScramble', s, t)} />}
                {activeTab === 'results' && allActivitiesCompleted && <StudentResults story={story as Story} scores={scores} />}
            </div>
        </div>
    );
};

export default StoryPage;
