
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { stories } from '../data/storyData';
import { useLocalization } from '../hooks/useLocalization';

const PrintableResourcePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const story = stories.find(s => s.id === id);
  const { getLocalizedStory, getLocalizedTeacherResources, direction, t } = useLocalization();

  const translations = {
    print: { fr: 'Imprimer', en: 'Print', ar: 'طباعة' },
    storyNotFound: { fr: "Histoire non trouvée !", en: "Story not found!", ar: "لم يتم العثور على القصة!" },
    backToHub: { fr: "Retour au Hub", en: "Back to Hub", ar: "العودة للركن" },
    readingSheet: { fr: "Fiche de Lecture", en: "Reading Sheet", ar: "ورقة القراءة" },
    robotId: { fr: "Carte d'Identité du Robot", en: "Robot ID Card", ar: "بطاقة هوية الروبوت" },
    qcm: { fr: "Questionnaire à Choix Multiples", en: "Multiple Choice Quiz", ar: "أسئلة الاختيار من متعدد" },
    discussion: { fr: "Pistes de Discussion", en: "Discussion Prompts", ar: "محاور للنقاش" },
    coloring: { fr: "Illustration à Colorier", en: "Coloring Illustration", ar: "رسمة للتلوين" },
  };

  if (!story) {
    return (
      <div className="text-center">
        <h1 className="text-3xl font-bold">{t(translations.storyNotFound)}</h1>
        <Link to="/educators" className="text-brand-primary hover:underline mt-4 inline-block">{t(translations.backToHub)}</Link>
      </div>
    );
  }

  const localizedContent = getLocalizedStory(story);
  const localizedTeacherResources = getLocalizedTeacherResources(story);
  const { robotInfo, coloringImage } = story.technicalInfo;

  return (
    <div className="bg-white p-8 printable-page" dir={direction}>
      <style>{`
        @media print {
          body * { visibility: hidden; }
          .printable-page, .printable-page * { visibility: visible; }
          .printable-page { position: absolute; left: 0; top: 0; width: 100%; }
          .no-print { display: none; }
          .page-break { page-break-after: always; }
        }
      `}</style>

      <div className="flex justify-between items-center mb-8 no-print">
        <h1 className="text-3xl font-bold">Printable Pack</h1>
        <button onClick={() => window.print()} className="bg-brand-primary text-white font-bold py-2 px-4 rounded hover:bg-brand-secondary">
          <i className="fas fa-print mr-2"></i>
          {t(translations.print)}
        </button>
      </div>

      <div className="page-break">
        <h2 className="text-2xl font-bold border-b-2 pb-2 mb-4">{localizedContent.title} - {t(translations.readingSheet)}</h2>
        {localizedContent.storyText.map((p, i) => <p key={i} className="mb-4">{p}</p>)}
      </div>

      <div className="page-break">
        <h2 className="text-2xl font-bold border-b-2 pb-2 mb-4">{t(translations.robotId)}</h2>
        <div className="border-2 border-dashed p-4 rounded-lg mb-8 inline-block">
            {Object.entries(robotInfo).map(([key, value]) => (
                <p key={key}><span className="font-bold">{key}:</span> {value}</p>
            ))}
        </div>

        <h2 className="text-2xl font-bold border-b-2 pb-2 mb-4">{t(translations.qcm)}</h2>
        <ul className="list-decimal list-inside space-y-4">
            {localizedContent.qcm.map((q, i) => (
                <li key={i}>
                    <p className="font-semibold">{q.question}</p>
                    <div className="flex space-x-4 ml-6 mt-2">
                        {q.options.map(opt => <span key={opt}>&#9633; {opt}</span>)}
                    </div>
                </li>
            ))}
        </ul>
      </div>

      <div className="page-break">
        <h2 className="text-2xl font-bold border-b-2 pb-2 mb-4">{t(translations.discussion)}</h2>
        <ul className="list-disc list-inside space-y-2">
            {localizedTeacherResources.discussionPrompts.map((p, i) => <li key={i}>{p}</li>)}
        </ul>

        <h2 className="text-2xl font-bold border-b-2 pb-2 mb-4 mt-8">{t(translations.coloring)}</h2>
        <img src={coloringImage} alt="Coloring page" className="w-full border-2 border-gray-300" />
      </div>

    </div>
  );
};

export default PrintableResourcePage;
