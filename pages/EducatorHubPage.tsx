// FIX: Implemented the EducatorHubPage component, which was previously a placeholder.
import React from 'react';
import { Link } from 'react-router-dom';
import { stories } from '../data/storyData';
import { useLocalization } from '../hooks/useLocalization';
import { Story } from '../types';

const EducatorStoryCard: React.FC<{ story: Story }> = ({ story }) => {
    const { getLocalizedStory, t } = useLocalization();
    const localizedContent = getLocalizedStory(story);

    const translations = {
        viewActivity: { fr: "Voir l'activité", en: "See the activity", ar: "شاهد النشاط" },
        printablePack: { fr: "Pack Imprimable", en: "Printable Pack", ar: "ملفات للطباعة" },
        packIncludes: { fr: "Le pack imprimable inclut :", en: "The printable pack includes:", ar: "تحتوي الحزمة القابلة للطباعة على:" },
        readingSheet: { fr: "Fiche de lecture complète", en: "Full Reading Sheet", ar: "ورقة قراءة كاملة" },
        robotId: { fr: "Carte d'identité du robot", en: "Robot ID Card", ar: "بطاقة هوية الروبوت" },
        qcm: { fr: "Questionnaire à choix multiples", en: "Multiple Choice Quiz", ar: "أسئلة الاختيار من متعدد" },
        discussion: { fr: "Pistes de discussion", en: "Discussion Prompts", ar: "محاور للنقاش" },
        coloring: { fr: "Illustration à colorier", en: "Coloring Illustration", ar: "رسمة للتلوين" },
    };

    return (
        <div className="card lg:card-side bg-base-100 shadow-xl">
            <figure className="lg:w-1/3"><img src={story.image} alt={localizedContent.title} className="w-full h-full object-cover" /></figure>
            <div className="card-body lg:w-2/3">
                <h2 className="card-title">{localizedContent.title}</h2>
                <p>{localizedContent.storyText[0].substring(0, 150)}...</p>
                
                <div className="mt-4">
                    <h3 className="font-bold">{t(translations.packIncludes)}</h3>
                    <ul className="list-disc list-inside text-sm pl-2">
                        <li>{t(translations.readingSheet)}</li>
                        <li>{t(translations.robotId)}</li>
                        <li>{t(translations.qcm)}</li>
                        <li>{t(translations.discussion)}</li>
                        <li>{t(translations.coloring)}</li>
                    </ul>
                </div>

                <div className="card-actions justify-end mt-4">
                    <Link to={`/story/${story.id}`} className="btn btn-secondary btn-outline">{t(translations.viewActivity)}</Link>
                    <Link to={`/printable/${story.id}`} target="_blank" className="btn btn-primary">{t(translations.printablePack)}</Link>
                </div>
            </div>
        </div>
    );
};

const EducatorHubPage: React.FC = () => {
    const { t, direction } = useLocalization();

    const translations = {
        hubTitle: { fr: "Espace Éducateurs", en: "Educator Hub", ar: "ركن المعلمين" },
        hubSubtitle: { fr: "Ressources et outils pour accompagner les histoires.", en: "Resources and tools to accompany the stories.", ar: "موارد وأدوات مرافقة للقصص." },
    };

    return (
        <div className="container mx-auto px-4 py-8" dir={direction}>
            <div className="text-center mb-12">
                <h1 className="text-4xl md:text-5xl font-black text-base-content mb-2">{t(translations.hubTitle)}</h1>
                <p className="text-lg text-base-content/70">{t(translations.hubSubtitle)}</p>
            </div>
            <div className="space-y-8">
                {stories.map(story => (
                    <EducatorStoryCard key={story.id} story={story} />
                ))}
            </div>
        </div>
    );
};

export default EducatorHubPage;