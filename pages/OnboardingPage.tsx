// FIX: Implemented the OnboardingPage component, which was previously a placeholder.
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';
import { useLocalization } from '../hooks/useLocalization';
import { APP_TITLE } from '../constants';

const OnboardingPage: React.FC = () => {
    const [role, setRole] = useState<'student' | 'educator' | null>(null);
    const [name, setName] = useState('');
    const { login } = useUser();
    const navigate = useNavigate();
    const { t, direction } = useLocalization();

    const translations = {
        welcome: { fr: `Bienvenue à ${APP_TITLE}`, en: `Welcome to ${APP_TITLE}`, ar: `مرحباً بك في ${APP_TITLE}` },
        chooseRole: { fr: "Qui êtes-vous ?", en: "Who are you?", ar: "من أنت؟" },
        student: { fr: "Je suis un élève", en: "I am a Student", ar: "أنا طالب" },
        educator: { fr: "Je suis un éducateur", en: "I am an Educator", ar: "أنا معلم" },
        enterName: { fr: "Entrez votre nom pour commencer !", en: "Enter your name to begin!", ar: "أدخل اسمك لتبدأ!" },
        namePlaceholder: { fr: "Votre nom", en: "Your Name", ar: "اسمك" },
        startButton: { fr: "Commencer l'exploration", en: "Start Exploring", ar: "ابدأ الاستكشاف" },
    };
    
    const handleEducatorSelect = () => {
        login({ role: 'educator' });
        navigate('/educators');
    };

    const handleStudentSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (name.trim()) {
            login({ role: 'student', name: name.trim() });
            navigate('/home');
        }
    };

    return (
        <div className="hero min-h-screen bg-base-200" dir={direction}>
            <div className="hero-content text-center">
                <div className="max-w-md">
                    <h1 className="text-5xl font-bold">{t(translations.welcome)}</h1>
                    
                    {!role ? (
                        <>
                            <p className="py-6">{t(translations.chooseRole)}</p>
                            <div className="flex flex-col items-center gap-4">
                                <button onClick={() => setRole('student')} className="btn btn-primary w-64">{t(translations.student)}</button>
                                <button onClick={handleEducatorSelect} className="btn btn-secondary w-64">{t(translations.educator)}</button>
                            </div>
                        </>
                    ) : (
                        <>
                            <p className="py-6">{t(translations.enterName)}</p>
                            <form onSubmit={handleStudentSubmit} className="flex flex-col items-center gap-4">
                                <input
                                    type="text"
                                    placeholder={t(translations.namePlaceholder)}
                                    className="input input-bordered input-primary w-full max-w-xs"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required
                                    aria-label="Student name"
                                />
                                <button type="submit" className="btn btn-primary" disabled={!name.trim()}>
                                    {t(translations.startButton)}
                                </button>
                            </form>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default OnboardingPage;