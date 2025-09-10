// FIX: Implemented the HomePage component, which was previously a placeholder.
import React from 'react';
import { Link } from 'react-router-dom';
import { stories } from '../data/storyData';
import { useLocalization } from '../hooks/useLocalization';
import { useUser } from '../contexts/UserContext';
import { Story } from '../types';

const StoryCard: React.FC<{ story: Story }> = ({ story }) => {
    const { getLocalizedStory, t } = useLocalization();
    const localizedContent = getLocalizedStory(story);

    const translations = {
        seeActivity: { fr: "Voir l'activité", en: "See the activity", ar: "شاهد النشاط" },
    };

    return (
        <div className="card card-compact w-full bg-base-100 shadow-xl transition-transform hover:scale-105">
            <figure><img src={story.image} alt={localizedContent.title} className="h-48 w-full object-cover" /></figure>
            <div className="card-body">
                <h2 className="card-title">{localizedContent.title}</h2>
                <p>{localizedContent.storyText[0].substring(0, 100)}...</p>
                <div className="card-actions justify-end">
                    <Link to={`/story/${story.id}`} className="btn btn-primary">{t(translations.seeActivity)}</Link>
                </div>
            </div>
        </div>
    );
};

const HomePage: React.FC = () => {
    const { user } = useUser();
    const { t, direction } = useLocalization();

    const translations = {
        welcome: { fr: `Bienvenue`, en: `Welcome`, ar: `أهلاً بك` },
        explorer: { fr: "Explorateur", en: "Explorer", ar: "مستكشف" },
        subtitle: { fr: "Choisissez une histoire pour commencer votre exploration.", en: "Choose a story to begin your exploration.", ar: "اختر قصة لتبدأ رحلتك الاستكشافية." },
    };
    
    const welcomeName = user?.name || t(translations.explorer);

    return (
        <div className="container mx-auto px-4 py-8" dir={direction}>
            <div className="text-center mb-12">
                <h1 className="text-4xl md:text-5xl font-black text-base-content mb-2">{t(translations.welcome)}, {welcomeName}!</h1>
                <p className="text-lg text-base-content/70">{t(translations.subtitle)}</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {stories.map(story => (
                    <StoryCard key={story.id} story={story} />
                ))}
            </div>
        </div>
    );
};

export default HomePage;