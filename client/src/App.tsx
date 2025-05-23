// src/App.tsx
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import SignupPage from './components/SignupPage';
import LoginPage from './components/LoginPage'; // <-- IMPORT LOGIN PAGE
import SortingHatQuizPage from './components/SortingHatQuizPage';
import HouseRevealPage from './components/HouseRevealPage';
import GameMapPage from './components/GameMapPage';
import { useState, useEffect } from 'react'; // <-- IMPORT useEffect
import type { User, HogwartsHouse } from './types';

function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [assignedHouse, setAssignedHouse] = useState<HogwartsHouse | null>(null);
  const [isLoadingProfile, setIsLoadingProfile] = useState(true); // To manage initial profile load

  // This function would ideally fetch the full user profile from your backend
  // including their assigned house after a successful login or on app load if tokens exist.
  const fetchUserProfile = async (userId: number, token: string) => {
    console.log("Fetching user profile for user ID:", userId);
    // --- MOCK API CALL to get user profile (including house) ---
    // Example:
    // const response = await fetch(`/api/profiles/${userId}/`, {
    //   headers: { 'Authorization': `Bearer ${token}` }
    // });
    // if (response.ok) {
    //   const profileData = await response.json();
    //   setCurrentUser({id: profileData.user.id, username: profileData.user.username, email: profileData.user.email});
    //   setAssignedHouse(profileData.house as HogwartsHouse || null);
    // } else {
    //   console.error("Failed to fetch profile");
    //   // Handle token expiry or invalid token - potentially log out user
    //   localStorage.removeItem('accessToken');
    //   localStorage.removeItem('refreshToken');
    //   setCurrentUser(null);
    //   setAssignedHouse(null);
    // }
    // --- Mock ---
    await new Promise(resolve => setTimeout(resolve, 500));
    // Simulate a user who has already been sorted
    if (userId === 1) { // Assuming our mock login user has ID 1
        // Check a mock flag or make a "profile" lookup
        const mockProfile = { house: 'Gryffindor' as HogwartsHouse }; // Or null if not sorted
        setAssignedHouse(mockProfile.house);
        console.log("Mock profile fetched, house:", mockProfile.house);
    } else {
        setAssignedHouse(null); // Default for other users or if no house yet
        console.log("Mock profile fetched, no house assigned yet.");
    }
    // --- End Mock ---
  };


  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    // Here you would also validate the token and get user details from it or an API
    // For simplicity, we'll just check if a token exists and assume it's valid for this mock
    if (token) {
      // Decode token to get user ID or make an API call to /api/users/me/
      // Mocking user retrieval based on token presence
      const mockUserFromToken: User = { id: 1, username: "testuserFromToken", email: "test@example.com" }; // You'd get this from token or API
      setCurrentUser(mockUserFromToken);
      fetchUserProfile(mockUserFromToken.id, token).finally(() => setIsLoadingProfile(false));
    } else {
      setIsLoadingProfile(false);
    }
  }, []);


  const handleSignupSuccess = (user: User, accessToken: string, refreshToken: string) => {
    // Tokens are already stored by SignupPage in this example
    // Or you can pass them here and store them
    setCurrentUser(user);
    // After signup, user definitely won't have a house yet
    setAssignedHouse(null);
    setIsLoadingProfile(false); // Profile is new, no need to fetch old house
    // Navigation will be handled by Routes logic based on currentUser and !assignedHouse
  };

  const handleLoginSuccess = async (user: User, accessToken: string, refreshToken: string) => {
    // Tokens are already stored by LoginPage in this example
    setCurrentUser(user);
    setIsLoadingProfile(true); // Set loading while we fetch the profile
    await fetchUserProfile(user.id, accessToken); // Fetch profile which sets the house
    setIsLoadingProfile(false);
    // Navigation will be handled by Routes logic below
  };

  const handleHouseAssigned = (house: HogwartsHouse) => {
    setAssignedHouse(house);
    // API call to save house to backend is done in SortingHatQuizPage
  };

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    setCurrentUser(null);
    setAssignedHouse(null);
    // Navigate to login, will be handled by Routes
  };


  if (isLoadingProfile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <p className="text-yellow-400 text-2xl animate-pulse font-['Lumos']">Loading Ancient Tomes...</p>
      </div>
    );
  }

  return (
    <Router>
      <div className="min-h-screen bg-gray-900 text-gray-100 font-serif">
        {/* Basic Nav for Logout - Can be improved */}
        {currentUser && (
            <nav className="p-4 bg-gray-800/50 text-right">
                <span className="text-gray-300 mr-4">Welcome, {currentUser.username}!</span>
                <button onClick={handleLogout} className="text-yellow-400 hover:text-yellow-200">Logout</button>
            </nav>
        )}
        <Routes>
          <Route path="/login" element={
            currentUser ? <Navigate to={assignedHouse ? "/game" : "/sorting-hat"} /> : <LoginPage onLoginSuccess={handleLoginSuccess} />
          } />
          <Route path="/signup" element={
            currentUser ? <Navigate to={assignedHouse ? "/game" : "/sorting-hat"} /> : <SignupPage onSignupSuccess={handleSignupSuccess} />
          } />
          <Route path="/sorting-hat" element={
            !currentUser ? <Navigate to="/login" /> : (assignedHouse ? <Navigate to="/house-reveal"/> : <SortingHatQuizPage user={currentUser} onHouseAssigned={handleHouseAssigned} />)
          } />
          <Route path="/house-reveal" element={
            !currentUser || !assignedHouse ? <Navigate to="/login" /> : <HouseRevealPage house={assignedHouse} />
          } />
          <Route path="/game" element={
            !currentUser ? <Navigate to="/login" /> : (!assignedHouse ? <Navigate to="/sorting-hat" /> : <GameMapPage />)
          } />
          {/* Default route */}
          <Route path="*" element={
            <Navigate to={currentUser ? (assignedHouse ? "/game" : "/sorting-hat") : "/login"} />
          }/>
        </Routes>
      </div>
    </Router>
  );
}

export default App;