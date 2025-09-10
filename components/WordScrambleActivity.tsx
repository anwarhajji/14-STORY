
import React, { useState, useEffect, useMemo } from 'react';
import { WordScramble } from '../types';
import { useLocalization } from '../hooks/useLocalization';

// Helper to shuffle array with unique keys for React rendering
const shuffleWithKeys = (arr: string[]) => 
  [...arr]
    .map((value, index) => ({ value, sort: Math.random(), id: `${value}_${index}` }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ value, id }) => ({ char: value, id }));


interface ScrambleBoardProps {
    scrambled: string;
    correct: string;
    isSubmitted: boolean;
    onAnswerChange: (answer: string) => void;
}

type CharObject = { char: string; id: string };

const ScrambleBoard: React.FC<ScrambleBoardProps> = ({ scrambled, correct, isSubmitted, onAnswerChange }) => {
    const initialSourceChars = useMemo(() => shuffleWithKeys(scrambled.split('')), [scrambled]);
    const [sourceChars, setSourceChars] = useState<CharObject[]>(initialSourceChars);
    const [targetChars, setTargetChars] = useState<(CharObject | null)[]>(Array(correct.length).fill(null));
    const [draggedItem, setDraggedItem] = useState<{ item: CharObject; origin: 'source' | 'target'; index: number } | null>(null);

    useEffect(() => {
        onAnswerChange(targetChars.map(item => item?.char).join(''));
    }, [targetChars, onAnswerChange]);

    const handleDragStart = (item: CharObject, origin: 'source' | 'target', index: number) => {
        if (isSubmitted) return;
        setDraggedItem({ item, origin, index });
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
    };

    const handleDrop = (targetIndex: number) => {
        if (!draggedItem || isSubmitted) return;

        const newSourceChars = [...sourceChars];
        const newTargetChars = [...targetChars];
        const { item: droppedItem, origin, index: originIndex } = draggedItem;

        // The character currently in the target slot, if any
        const existingItemInTarget = newTargetChars[targetIndex];

        // Place the dropped item in the target slot
        newTargetChars[targetIndex] = droppedItem;

        if (origin === 'source') {
            // Remove from source
            newSourceChars.splice(originIndex, 1);
            // If target slot had an item, move it back to source
            if (existingItemInTarget) {
                newSourceChars.push(existingItemInTarget);
            }
        } else { // origin === 'target'
            // If there was an item in the target, swap them
            if (existingItemInTarget) {
                newTargetChars[originIndex] = existingItemInTarget;
            } else {
                // otherwise, the origin slot is now empty
                newTargetChars[originIndex] = null;
            }
        }

        setSourceChars(shuffleWithKeys(newSourceChars.map(c => c.char)));
        setTargetChars(newTargetChars);
        setDraggedItem(null);
    };

    const handleDropOnSource = () => {
        if (!draggedItem || draggedItem.origin === 'source' || isSubmitted) return;

        const newSourceChars = [...sourceChars];
        const newTargetChars = [...targetChars];
        
        // Remove from target
        newTargetChars[draggedItem.index] = null;
        // Add back to source
        newSourceChars.push(draggedItem.item);

        setSourceChars(shuffleWithKeys(newSourceChars.map(c => c.char)));
        setTargetChars(newTargetChars);
        setDraggedItem(null);
    };
    
    const isCorrect = isSubmitted && correct.toLowerCase() === targetChars.map(c => c?.char).join('').toLowerCase();
    
    return (
         <div className="flex flex-col items-center gap-4">
            {/* Target Slots (Answer Area) */}
            <div className="flex flex-wrap justify-center gap-2 p-4 bg-base-300 rounded-lg min-h-[4rem] w-full">
                {targetChars.map((item, index) => (
                    <div
                        key={index}
                        onDragOver={handleDragOver}
                        onDrop={() => handleDrop(index)}
                        className={`
                            kbd kbd-lg w-12 h-12 flex justify-center items-center text-xl
                            transition-all
                            ${isSubmitted ? (isCorrect ? 'bg-success text-success-content' : 'bg-error text-error-content') : 'bg-base-100'}
                            ${draggedItem ? 'cursor-pointer' : ''}
                        `}
                    >
                         {item && (
                             <span
                                draggable={!isSubmitted}
                                onDragStart={() => handleDragStart(item, 'target', index)}
                                className={`cursor-grab ${isSubmitted ? 'cursor-not-allowed' : ''}`}
                             >
                                 {item.char}
                             </span>
                         )}
                    </div>
                ))}
            </div>

            {/* Source Letters */}
            <div
                onDragOver={handleDragOver}
                onDrop={handleDropOnSource}
                className="flex flex-wrap justify-center gap-2 p-4 bg-base-200 rounded-lg min-h-[4rem] w-full"
            >
                {sourceChars.map((item, index) => (
                    <div
                        key={item.id}
                        draggable={!isSubmitted}
                        onDragStart={() => handleDragStart(item, 'source', index)}
                        className={`kbd kbd-lg cursor-grab ${isSubmitted ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                        {item.char}
                    </div>
                ))}
            </div>
        </div>
    );
};


const WordScrambleActivity: React.FC<{
  wordScrambleData: WordScramble[];
  onComplete: (score: number, total: number) => void;
}> = ({ wordScrambleData, onComplete }) => {
  const [answers, setAnswers] = useState<string[]>(Array(wordScrambleData.length).fill(''));
  const [submitted, setSubmitted] = useState(false);
  const { t } = useLocalization();

  const handleAnswerChange = (index: number, value: string) => {
    if (submitted) return;
    const newAnswers = [...answers];
    newAnswers[index] = value;
    setAnswers(newAnswers);
  };

  const handleSubmit = () => {
    let score = 0;
    answers.forEach((answer, index) => {
      if (answer.toLowerCase() === wordScrambleData[index].correct.toLowerCase()) {
        score++;
      }
    });
    setSubmitted(true);
    onComplete(score, wordScrambleData.length);
  };
  
  const translations = {
    hint: { fr: "Indice", en: "Hint", ar: "تلميح" },
    scrambledWord: { fr: "Mot mélangé", en: "Scrambled Word", ar: "الكلمة المبعثرة" },
    yourAnswer: { fr: "Votre réponse", en: "Your Answer", ar: "إجابتك" },
    checkAnswers: { fr: "Vérifier les réponses", en: "Check Answers", ar: "تحقق من الإجابات" },
    score: { fr: "Votre score", en: "Your Score", ar: "نتيجتك" },
    correctAnswerIs: { fr: "La bonne réponse est", en: "Correct answer is", ar: "الإجابة الصحيحة هي" },
  };

  const score = answers.reduce((acc, answer, index) => {
      return answer.toLowerCase() === wordScrambleData[index].correct.toLowerCase() ? acc + 1 : acc;
  }, 0);
  
  const allAnswered = answers.every((ans, i) => ans.length === wordScrambleData[i].correct.length);

  return (
    <div className="space-y-6">
      {wordScrambleData.map((ws, index) => (
        <div key={index} className="card bg-base-100 shadow-md">
          <div className="card-body">
            
            <ScrambleBoard 
                scrambled={ws.scrambled}
                correct={ws.correct}
                isSubmitted={submitted}
                onAnswerChange={(answer) => handleAnswerChange(index, answer)}
            />

            {submitted && answers[index].toLowerCase() !== ws.correct.toLowerCase() && (
                <div className="text-center text-success mt-2">
                    {t(translations.correctAnswerIs)}: {ws.correct}
                </div>
            )}
            
            <div className="collapse collapse-arrow bg-base-200 mt-4">
              <input type="checkbox" /> 
              <div className="collapse-title text-sm font-medium">
                {t(translations.hint)}
              </div>
              <div className="collapse-content"> 
                <p>{ws.hint}</p>
              </div>
            </div>
          </div>
        </div>
      ))}
      <div className="text-center mt-6">
        {!submitted ? (
          <button onClick={handleSubmit} className="btn btn-primary btn-lg" disabled={!allAnswered}>
            {t(translations.checkAnswers)}
          </button>
        ) : (
          <div className="text-2xl font-bold p-4 bg-success text-success-content rounded-lg inline-block">
            {t(translations.score)}: {score} / {wordScrambleData.length}
          </div>
        )}
      </div>
    </div>
  );
};

export default WordScrambleActivity;
