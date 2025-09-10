// FIX: Implemented the LandingPage component, which was previously a placeholder.
import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';
import { useLocalization } from '../hooks/useLocalization';
import { APP_TITLE } from '../constants';

const LandingPage: React.FC = () => {
    const { isOnboarded } = useUser();
    const navigate = useNavigate();
    const { t, direction } = useLocalization();

    useEffect(() => {
        if (isOnboarded) {
            navigate('/home', { replace: true });
        }
    }, [isOnboarded, navigate]);

    const translations = {
        title: { fr: "Explorez le Monde des Robots", en: "Explore the World of Robots", ar: "استكشف عالم الروبوتات" },
        subtitle: { fr: "Des histoires interactives pour inspirer la prochaine génération d'innovateurs.", en: "Interactive stories to inspire the next generation of innovators.", ar: "قصص تفاعلية لإلهام الجيل القادم من المبتكرين." },
        getStarted: { fr: "Commencer", en: "Get Started", ar: "ابدأ الآن" },
    };

    if (isOnboarded) {
        return null; // Or a loading spinner
    }

    return (
        <div className="hero min-h-[calc(100vh-15rem)] bg-base-200" dir={direction}>
            <div className="hero-content text-center">
                <div className="max-w-xl">
                    <h1 className="text-5xl font-bold">{t(translations.title)}</h1>
                    <p className="py-6">{t(translations.subtitle)}</p>
                    <Link to="/onboarding" className="btn btn-primary">{t(translations.getStarted)}</Link>
                </div>
            </div>
        </div>
    );
};

export default LandingPage;
