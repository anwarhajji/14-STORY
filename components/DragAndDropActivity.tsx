
import React, { useState, useMemo } from 'react';
import { DragDrop } from '../types';
import { useLocalization } from '../hooks/useLocalization';

interface DragAndDropActivityProps {
  dragDropData: DragDrop[];
  onComplete: (score: number, total: number) => void;
}

// Helper to shuffle array
const shuffleArray = (array: any[]) => {
  return [...array].sort(() => Math.random() - 0.5);
};

const DragAndDropActivity: React.FC<DragAndDropActivityProps> = ({ dragDropData, onComplete }) => {
  const [answers, setAnswers] = useState<(string | null)[]>(Array(dragDropData.length).fill(null));
  const [submitted, setSubmitted] = useState(false);
  const { t } = useLocalization();

  const shuffledOptions = useMemo(() => {
    const allOptions = dragDropData.map(dd => dd.correctAnswer);
    return shuffleArray(allOptions);
  }, [dragDropData]);

  const [availableOptions, setAvailableOptions] = useState<string[]>(shuffledOptions);

  const handleDrop = (questionIndex: number, option: string) => {
    if (submitted || !availableOptions.includes(option)) return;
    
    const newAnswers = [...answers];
    const oldAnswer = newAnswers[questionIndex];
    newAnswers[questionIndex] = option;
    setAnswers(newAnswers);

    const newAvailableOptions = availableOptions.filter(opt => opt !== option);
    if (oldAnswer) {
      newAvailableOptions.push(oldAnswer);
    }
    setAvailableOptions(newAvailableOptions);
  };

  const handleResetAnswer = (questionIndex: number) => {
    if (submitted) return;
    const answerToReset = answers[questionIndex];
    if (answerToReset) {
      const newAnswers = [...answers];
      newAnswers[questionIndex] = null;
      setAnswers(newAnswers);
      setAvailableOptions(prev => [...prev, answerToReset].sort(() => Math.random() - 0.5));
    }
  };

  const handleSubmit = () => {
    let score = 0;
    answers.forEach((answer, index) => {
      if (answer === dragDropData[index].correctAnswer) {
        score++;
      }
    });
    setSubmitted(true);
    onComplete(score, dragDropData.length);
  };
  
  const getDropZoneClass = (questionIndex: number) => {
    if (!submitted) return 'bg-base-200';
    return answers[questionIndex] === dragDropData[questionIndex].correctAnswer ? 'bg-success text-success-content' : 'bg-error text-error-content';
  };

  const translations = {
    matchPrompt: { fr: "Faites correspondre les réponses aux questions.", en: "Match the answers to the questions.", ar: "طابق الإجابات مع الأسئلة." },
    answers: { fr: "Réponses", en: "Answers", ar: "الإجابات" },
    dragHere: { fr: "Déposez ici", en: "Drop here", ar: "اسحب إلى هنا" },
    checkAnswers: { fr: "Vérifier les réponses", en: "Check Answers", ar: "تحقق من الإجابات" },
    score: { fr: "Votre score", en: "Your Score", ar: "نتيجتك" },
    correctAnswer: { fr: "Réponse correcte", en: "Correct Answer", ar: "الإجابة الصحيحة" },
  };

  const score = answers.reduce((acc, answer, index) => {
    return answer === dragDropData[index].correctAnswer ? acc + 1 : acc;
  }, 0);
  
  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, option: string) => {
      e.dataTransfer.setData("text/plain", option);
  };
  
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
  };
  
  const handleOnDrop = (e: React.DragEvent<HTMLDivElement>, questionIndex: number) => {
      const option = e.dataTransfer.getData("text/plain");
      handleDrop(questionIndex, option);
  };

  return (
    <div>
        <h2 className="text-xl text-center mb-4">{t(translations.matchPrompt)}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Questions/Drop Zones */}
            <div className="space-y-4">
            {dragDropData.map((q, index) => (
                <div key={index} className="flex items-center gap-4">
                <div className="w-2/3 font-semibold">{index + 1}. {q.question}</div>
                <div 
                    className={`w-1/3 p-4 rounded-lg text-center transition-colors min-h-[4rem] flex items-center justify-center ${getDropZoneClass(index)}`}
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleOnDrop(e, index)}
                >
                    {answers[index] ? (
                        <div className="flex justify-between items-center w-full">
                            <span>{answers[index]}</span>
                            {!submitted && <button onClick={() => handleResetAnswer(index)} className="btn btn-xs btn-circle btn-ghost">✕</button>}
                        </div>
                    ) : (
                        <span className="text-base-content/50">{t(translations.dragHere)}</span>
                    )}
                     {submitted && answers[index] !== q.correctAnswer && (
                        <div className="text-xs mt-1">({t(translations.correctAnswer)}: {q.correctAnswer})</div>
                    )}
                </div>
                </div>
            ))}
            </div>

            {/* Options/Draggable Items */}
            {!submitted && (
                <div className="p-4 bg-base-200 rounded-lg self-start">
                    <h3 className="font-bold text-center mb-4">{t(translations.answers)}</h3>
                    <div className="flex flex-wrap gap-2 justify-center">
                    {availableOptions.map(option => (
                        <div 
                            key={option} 
                            className="badge badge-lg badge-primary p-4 cursor-move"
                            draggable
                            onDragStart={(e) => handleDragStart(e, option)}
                        >
                        {option}
                        </div>
                    ))}
                    </div>
                </div>
            )}
        </div>
        
        <div className="text-center mt-8">
            {!submitted ? (
            <button onClick={handleSubmit} className="btn btn-primary btn-lg" disabled={answers.includes(null)}>
                {t(translations.checkAnswers)}
            </button>
            ) : (
            <div className="text-2xl font-bold p-4 bg-success text-success-content rounded-lg inline-block">
                {t(translations.score)}: {score} / {dragDropData.length}
            </div>
            )}
        </div>
    </div>
  );
};

export default DragAndDropActivity;
