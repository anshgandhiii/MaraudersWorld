// src/App.tsx
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import SignupPage from './components/SignupPage';
import SortingHatQuizPage from './components/SortingHatQuizPage';
import HouseRevealPage from './components/HouseRevealPage';
import GameMapPage from './components/GameMapPage';
import { useState } from 'react';
import type { User, HogwartsHouse } from './types'; 

function App() {
  // Simple auth state for now, replace with context/redux later
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [assignedHouse, setAssignedHouse] = useState<HogwartsHouse | null>(null);

  // Dummy login function
  const handleLoginSuccess = (user: User) => {
    setCurrentUser(user);
  };

  // Dummy house assignment
  const handleHouseAssigned = (house: HogwartsHouse) => {
    setAssignedHouse(house);
  };

  return (
    <Router>
      <div className="min-h-screen bg-gray-900 text-gray-100 font-serif">
        <Routes>
          <Route path="/signup" element={
            currentUser ? <Navigate to="/sorting-hat" /> : <SignupPage onSignupSuccess={handleLoginSuccess} />
          } />
          <Route path="/sorting-hat" element={
            !currentUser ? <Navigate to="/signup" /> : (assignedHouse ? <Navigate to="/house-reveal"/> : <SortingHatQuizPage user={currentUser} onHouseAssigned={handleHouseAssigned} />)
          } />
          <Route path="/house-reveal" element={
            !currentUser || !assignedHouse ? <Navigate to="/signup" /> : <HouseRevealPage house={assignedHouse} />
          } />
          <Route path="/game" element={
            !currentUser || !assignedHouse ? <Navigate to="/signup" /> : <GameMapPage />
          } />
          <Route path="*" element={<Navigate to={currentUser && assignedHouse ? "/game" : (currentUser ? "/sorting-hat" : "/signup")} />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;