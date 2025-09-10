// FIX: Implemented the StudentResults component, which was previously a placeholder.
import React from 'react';
import { Link } from 'react-router-dom';
import { Story } from '../types';
import { useLocalization } from '../hooks/useLocalization';
import { useUser } from '../contexts/UserContext';

interface ScoreInfo {
    score: number;
    total: number;
    percentage: number;
}
interface StudentResultsProps {
  story: Story;
  scores: {
    qcm: ScoreInfo;
    dragDrop: ScoreInfo;
    wordScramble: ScoreInfo;
  };
}

const StudentResults: React.FC<StudentResultsProps> = ({ story, scores }) => {
    const { getLocalizedStory, t, direction } = useLocalization();
    const { user } = useUser();
    const localizedContent = getLocalizedStory(story);

    const translations = {
        resultsFor: { fr: "Résultats pour", en: "Results for", ar: "نتائج" },
        student: { fr: "Élève", en: "Student", ar: "الطالب" },
        qcm: { fr: "QCM", en: "MCQ", ar: "الاختيار من متعدد" },
        dragDrop: { fr: "Glisser-déposer", en: "Drag & Drop", ar: "السحب والإفلات" },
        wordScramble: { fr: "Mots Mêlés", en: "Word Scramble", ar: "ترتيب الكلمات" },
        totalScore: { fr: "Score Total", en: "Total Score", ar: "النتيجة الإجمالية" },
        printResults: { fr: "Imprimer les résultats", en: "Print Results", ar: "طباعة النتائج" },
    };

    const totalQuestions = scores.qcm.total + scores.dragDrop.total + scores.wordScramble.total;
    const totalCorrect = scores.qcm.score + scores.dragDrop.score + scores.wordScramble.score;
    const totalPercentage = totalQuestions > 0 ? Math.round((totalCorrect / totalQuestions) * 100) : 0;
    
    const scoreEntries = [
        { name: t(translations.qcm), ...scores.qcm },
        { name: t(translations.dragDrop), ...scores.dragDrop },
        { name: t(translations.wordScramble), ...scores.wordScramble },
    ].filter(entry => entry.total > 0);

    return (
        <div className="card bg-base-100 shadow-xl" dir={direction}>
            <div className="card-body items-center text-center">
                <h2 className="card-title text-3xl mb-4">{t(translations.resultsFor)} "{localizedContent.title}"</h2>
                {user?.name && <p className="text-lg mb-6"><span className="font-bold">{t(translations.student)}:</span> {user.name}</p>}

                <div className="w-full max-w-md space-y-4">
                    {scoreEntries.map((entry, index) => (
                         <div key={index} className="flex justify-between items-center">
                            <span className="font-semibold">{entry.name}</span>
                             <div className="flex items-center gap-4">
                                <span>{entry.score} / {entry.total}</span>
                                <progress className="progress progress-primary w-32" value={entry.percentage} max="100"></progress>
                                <span>{entry.percentage}%</span>
                             </div>
                         </div>
                    ))}
                    <div className="divider"></div>
                     <div className="flex justify-between items-center font-bold text-xl">
                        <span>{t(translations.totalScore)}</span>
                         <div className="flex items-center gap-4">
                            <span>{totalCorrect} / {totalQuestions}</span>
                             <progress className="progress progress-accent w-32" value={totalPercentage} max="100"></progress>
                            <span>{totalPercentage}%</span>
                         </div>
                     </div>
                </div>

                <div className="card-actions justify-center mt-8">
                    <Link to={`/results/${story.id}`} target="_blank" className="btn btn-secondary">
                        {t(translations.printResults)}
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default StudentResults;