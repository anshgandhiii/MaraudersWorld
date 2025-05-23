// src/pages/SortingHatQuizPage.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { User, HogwartsHouse } from '../types';

interface QuizQuestion {
  id: number;
  text: string;
  options: { text: string; housePoints: Partial<Record<HogwartsHouse, number>> }[];
}

const quizQuestions: QuizQuestion[] = [
  {
    id: 1,
    text: "Dawn or Dusk?",
    options: [
      { text: "Dawn", housePoints: { Gryffindor: 2, Ravenclaw: 1 } },
      { text: "Dusk", housePoints: { Slytherin: 2, Hufflepuff: 1 } },
    ],
  },
  {
    id: 2,
    text: "Which path tempts you most?",
    options: [
      { text: "The wide, sunny, grassy path", housePoints: { Hufflepuff: 3 } },
      { text: "The narrow, dark, lantern-lit alley", housePoints: { Slytherin: 3 } },
      { text: "The twisting, leaf-strewn path through woods", housePoints: { Gryffindor: 2, Ravenclaw: 1 } },
      { text: "The cobbled street lined with ancient buildings", housePoints: { Ravenclaw: 2, Gryffindor: 1 } },
    ],
  },
  {
    id: 3,
    text: "What are you most proud of?",
    options: [
      { text: "My Courage", housePoints: { Gryffindor: 3 } },
      { text: "My Ambition", housePoints: { Slytherin: 3 } },
      { text: "My Intelligence", housePoints: { Ravenclaw: 3 } },
      { text: "My Loyalty", housePoints: { Hufflepuff: 3 } },
    ],
  },
  // Add more questions for better sorting
];

interface SortingHatQuizPageProps {
  user: User;
  onHouseAssigned: (house: HogwartsHouse) => void;
}

const SortingHatQuizPage: React.FC<SortingHatQuizPageProps> = ({ user, onHouseAssigned }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Partial<Record<HogwartsHouse, number>>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleAnswer = (optionPoints: Partial<Record<HogwartsHouse, number>>) => {
    const newAnswers = { ...answers };
    (Object.keys(optionPoints) as HogwartsHouse[]).forEach(house => {
      newAnswers[house] = (newAnswers[house] || 0) + (optionPoints[house] || 0);
    });
    setAnswers(newAnswers);

    if (currentQuestionIndex < quizQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      // Quiz finished, determine house
      determineHouse(newAnswers);
    }
  };

  const determineHouse = async (finalScores: Partial<Record<HogwartsHouse, number>>) => {
    setIsLoading(true);
    setError(null);
    let sortedHouse: HogwartsHouse = 'Gryffindor'; // Default
    let maxScore = -1;

    const houses: HogwartsHouse[] = ['Gryffindor', 'Hufflepuff', 'Ravenclaw', 'Slytherin'];
    const tiedHouses: HogwartsHouse[] = [];

    for (const house of houses) {
      const score = finalScores[house] || 0;
      if (score > maxScore) {
        maxScore = score;
        tiedHouses.length = 0; // Clear previous ties
        tiedHouses.push(house);
      } else if (score === maxScore) {
        tiedHouses.push(house);
      }
    }
    
    if (tiedHouses.length > 0) {
        sortedHouse = tiedHouses[Math.floor(Math.random() * tiedHouses.length)]; // Pick random from ties
    } else {
        // Fallback if something went wrong, though tiedHouses should always have at least one
        sortedHouse = houses[Math.floor(Math.random() * houses.length)];
    }


    // --- MOCK API CALL ---
    // Replace with API call to save house to user profile
    // e.g., await fetch(`/api/player/${user.id}/assign-house/`, { method: 'POST', body: JSON.stringify({ house: sortedHouse }) });
    try {
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate network delay
      console.log(`User ${user.username} sorted into ${sortedHouse}`);
      onHouseAssigned(sortedHouse);
      navigate('/house-reveal');
    } catch (err) {
      setError('Failed to save house. Please try again.');
      console.error("Error assigning house:", err);
    } finally {
      setIsLoading(false);
    }
    // --- END MOCK API CALL ---
  };

  const handleRandomAssignment = async () => {
    setIsLoading(true);
    setError(null);
    const houses: HogwartsHouse[] = ['Gryffindor', 'Hufflepuff', 'Ravenclaw', 'Slytherin'];
    const randomHouse = houses[Math.floor(Math.random() * houses.length)];

    // --- MOCK API CALL ---
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log(`User ${user.username} randomly sorted into ${randomHouse}`);
      onHouseAssigned(randomHouse);
      navigate('/house-reveal');
    } catch (err) {
      setError('Failed to save house. Please try again.');
    } finally {
      setIsLoading(false);
    }
    // --- END MOCK API CALL ---
  };

  const currentQuestion = quizQuestions[currentQuestionIndex];

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 p-6">
      <div className="bg-gray-800 p-8 md:p-12 rounded-lg shadow-2xl w-full max-w-2xl border border-yellow-500/30">
        <h1 className="text-4xl font-bold text-yellow-400 mb-6 text-center font-['Lumos']">The Sorting Ceremony</h1>
        <p className="text-gray-300 mb-8 text-center">
          Welcome, {user.username}! The Sorting Hat awaits your answers.
        </p>

        {error && <p className="bg-red-500/30 text-red-300 p-3 rounded mb-4 text-sm">{error}</p>}

        {currentQuestionIndex < quizQuestions.length && (
          <div className="mb-8">
            <h2 className="text-2xl text-yellow-200/90 mb-6 text-center">"{currentQuestion.text}"</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {currentQuestion.options.map((opt, index) => (
                <button
                  key={index}
                  onClick={() => handleAnswer(opt.housePoints)}
                  disabled={isLoading}
                  className="block w-full text-left p-4 bg-gray-700 hover:bg-yellow-600/70 hover:text-gray-900 rounded-md shadow transition duration-150 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 focus:ring-offset-gray-800 disabled:opacity-50"
                >
                  {opt.text}
                </button>
              ))}
            </div>
          </div>
        )}

        {currentQuestionIndex >= quizQuestions.length && !isLoading && (
            <p className="text-yellow-300 text-xl text-center my-8">The Sorting Hat is deliberating...</p>
        )}

        {isLoading && (
            <p className="text-yellow-300 text-xl text-center my-8 animate-pulse">Sorting...</p>
        )}

        <div className="mt-10 text-center">
          <p className="text-gray-500 mb-2 text-sm">Or, if you trust fate...</p>
          <button
            onClick={handleRandomAssignment}
            disabled={isLoading}
            className="px-6 py-2 border border-yellow-500/50 text-yellow-400/80 rounded-md hover:bg-yellow-500/20 transition duration-150 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 focus:ring-offset-gray-800 disabled:opacity-50"
          >
            {isLoading ? 'Thinking...' : 'Let the Hat Decide Randomly'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SortingHatQuizPage;