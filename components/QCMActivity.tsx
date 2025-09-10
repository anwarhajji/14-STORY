// FIX: Implemented the QCMActivity component, which was previously a placeholder.
import React, { useState } from 'react';
import { QCM } from '../types';
import { useLocalization } from '../hooks/useLocalization';

interface QCMActivityProps {
  qcmData: QCM[];
  onComplete: (score: number, total: number) => void;
}

const QCMActivity: React.FC<QCMActivityProps> = ({ qcmData, onComplete }) => {
  const [answers, setAnswers] = useState<(string | null)[]>(Array(qcmData.length).fill(null));
  const [submitted, setSubmitted] = useState(false);
  const { t } = useLocalization();

  const handleOptionChange = (questionIndex: number, option: string) => {
    if (submitted) return;
    const newAnswers = [...answers];
    newAnswers[questionIndex] = option;
    setAnswers(newAnswers);
  };

  const handleSubmit = () => {
    let score = 0;
    answers.forEach((answer, index) => {
      if (answer === qcmData[index].correctAnswer) {
        score++;
      }
    });
    setSubmitted(true);
    onComplete(score, qcmData.length);
  };

  const getOptionClass = (questionIndex: number, option: string) => {
    if (!submitted) return 'btn';
    const correctAnswer = qcmData[questionIndex].correctAnswer;
    const userAnswer = answers[questionIndex];
    if (option === correctAnswer) return 'btn btn-success';
    if (option === userAnswer && option !== correctAnswer) return 'btn btn-error';
    return 'btn btn-disabled';
  };

  const translations = {
    checkAnswers: { fr: "Vérifier les réponses", en: "Check Answers", ar: "تحقق من الإجابات" },
    score: { fr: "Votre score", en: "Your Score", ar: "نتيجتك" },
  };

  const score = answers.reduce((acc, answer, index) => {
    return answer === qcmData[index].correctAnswer ? acc + 1 : acc;
  }, 0);

  return (
    <div className="space-y-6">
      {qcmData.map((q, index) => (
        <div key={index} className="card bg-base-100 shadow-md">
          <div className="card-body">
            <p className="font-semibold text-lg">{index + 1}. {q.question}</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-4">
              {q.options.map(option => (
                <button
                  key={option}
                  onClick={() => handleOptionChange(index, option)}
                  className={`${getOptionClass(index, option)} ${answers[index] === option && !submitted ? 'btn-primary' : ''}`}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
        </div>
      ))}
      <div className="text-center mt-6">
        {!submitted ? (
          <button onClick={handleSubmit} className="btn btn-primary btn-lg" disabled={answers.includes(null)}>
            {t(translations.checkAnswers)}
          </button>
        ) : (
          <div className="text-2xl font-bold p-4 bg-success text-success-content rounded-lg">
            {t(translations.score)}: {score} / {qcmData.length}
          </div>
        )}
      </div>
    </div>
  );
};

export default QCMActivity;
