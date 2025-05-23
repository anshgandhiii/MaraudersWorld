// src/pages/HouseRevealPage.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import type { HogwartsHouse } from '../types'; // Assuming type is in App.tsx or a types file
 // Assuming type is in App.tsx or a types file

interface HouseRevealPageProps {
  house: HogwartsHouse | null;
}

const houseDetails: Record<HogwartsHouse, { color: string; description: string; crest?: string }> = {
  Gryffindor: { color: "red-500", description: "Known for bravery, daring, nerve, and chivalry.", crest: "🦁" },
  Hufflepuff: { color: "yellow-400", description: "Values hard work, dedication, patience, loyalty, and fair play.", crest: "🦡" },
  Ravenclaw: { color: "blue-500", description: "Values intelligence, learning, wisdom, and wit.", crest: "🦅" },
  Slytherin: { color: "green-500", description: "Values ambition, cunning, leadership, and resourcefulness.", crest: "🐍" },
};


const HouseRevealPage: React.FC<HouseRevealPageProps> = ({ house }) => {
  const navigate = useNavigate();

  if (!house) {
    // Should not happen if routing is correct, but good for robustness
    navigate('/sorting-hat');
    return null;
  }

  const details = houseDetails[house];

  const handleContinue = () => {
    navigate('/game'); // Navigate to the main game map
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 p-6 text-center">
      <div className={`bg-gray-800 p-8 md:p-16 rounded-lg shadow-2xl w-full max-w-lg border-t-8 border-${details.color}`}>
        <div className="text-6xl mb-6">{details.crest || '✨'}</div>
        <h1 className={`text-5xl font-bold text-${details.color} mb-4 font-['Lumos']`}>{house}!</h1>
        <p className="text-gray-300 text-lg mb-8">
          "{details.description}"
        </p>
        <p className="text-gray-400 mb-10">
          Welcome to {house}. Your adventure in the wizarding world begins now!
        </p>
        <button
          onClick={handleContinue}
          className={`w-full py-3 px-4 border border-transparent rounded-md shadow-sm text-lg font-medium text-gray-900 bg-${details.color} hover:opacity-80 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-${details.color} transition duration-150`}
        >
          Enter the Marauder's Map
        </button>
      </div>
    </div>
  );
};

export default HouseRevealPage;