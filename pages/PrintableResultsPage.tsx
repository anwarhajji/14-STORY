// FIX: Implemented the PrintableResultsPage component, which was previously a placeholder.
import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { stories } from '../data/storyData';
import { useLocalization } from '../hooks/useLocalization';
import { useUser } from '../contexts/UserContext';

const PrintableResultsPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const story = stories.find(s => s.id === id);
    const { getLocalizedStory, direction, t } = useLocalization();
    const { user } = useUser();
    
    useEffect(() => {
        // Trigger print dialog on load
        setTimeout(() => window.print(), 1000);
    }, []);

    const translations = {
        storyNotFound: { fr: "Histoire non trouvée !", en: "Story not found!", ar: "لم يتم العثور على القصة!" },
        backToHub: { fr: "Retour au Hub", en: "Back to Hub", ar: "العودة للركن" },
        resultsFor: { fr: "Résultats pour", en: "Results for", ar: "نتائج" },
        student: { fr: "Élève", en: "Student", ar: "الطالب" },
        activity: { fr: "Activité", en: "Activity", ar: "النشاط" },
        score: { fr: "Score", en: "Score", ar: "النتيجة" },
        qcm: { fr: "QCM", en: "MCQ", ar: "الاختيار من متعدد" },
        dragDrop: { fr: "Glisser-déposer", en: "Drag & Drop", ar: "السحب والإفلات" },
        wordScramble: { fr: "Mots Mêlés", en: "Word Scramble", ar: "ترتيب الكلمات" },
    };

    if (!story) {
        return (
            <div className="text-center p-8">
                <h1 className="text-3xl font-bold">{t(translations.storyNotFound)}</h1>
                <Link to="/educators" className="text-blue-500 hover:underline mt-4 inline-block no-print">{t(translations.backToHub)}</Link>
            </div>
        );
    }

    const localizedContent = getLocalizedStory(story);
    const scoreData = [
        { name: t(translations.qcm), total: localizedContent.qcm.length },
        { name: t(translations.dragDrop), total: localizedContent.dragDrop.length },
        { name: t(translations.wordScramble), total: localizedContent.wordScramble.length },
    ].filter(item => item.total > 0);

    return (
        <div className="bg-white p-8 printable-page" dir={direction}>
            <style>{`
                @media print {
                    body { -webkit-print-color-adjust: exact; }
                    .no-print { display: none; }
                }
            `}</style>
            
            <div className="text-center border-b-2 pb-4 mb-6">
                <h1 className="text-3xl font-bold">{t(translations.resultsFor)}: {localizedContent.title}</h1>
                <p className="text-xl mt-2">{t(translations.student)}: {user?.name || '____________________'}</p>
            </div>

            <div className="overflow-x-auto">
                <table className="table-auto w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-gray-200">
                            <th className="border p-2">{t(translations.activity)}</th>
                            <th className="border p-2">{t(translations.score)}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {scoreData.map((item, index) => (
                            <tr key={index}>
                                <td className="border p-2 font-semibold">{item.name}</td>
                                <td className="border p-2">______ / {item.total}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <p className="mt-8 text-center text-gray-500">Robot Explorers &copy; {new Date().getFullYear()}</p>
        </div>
    );
};

export default PrintableResultsPage;
