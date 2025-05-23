// src/pages/GameMapPage.tsx
import React from 'react';

const GameMapPage: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6">
      <h1 className="text-4xl font-bold text-yellow-400 mb-6">The Marauder's Map</h1>
      <p className="text-gray-300 text-lg">
        Your journey begins here... (Map and game elements will appear soon!)
      </p>
      {/* HERE Map SDK integration will go here */}
    </div>
  );
};

export default GameMapPage;