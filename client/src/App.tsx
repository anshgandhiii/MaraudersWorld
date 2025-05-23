// src/App.tsx
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import SignupPage from './components/SignupPage';
import LoginPage from './components/LoginPage';
import SortingHatQuizPage from './components/SortingHatQuizPage';
import HouseRevealPage from './components/HouseRevealPage';
import HomeDashboardPage from './pages/Dashboard';
import InventoryPage from './pages/InventoryPage';
import MapPage from './pages/MapPage';
import { useState, useEffect, useCallback } from 'react';
import type { User, HogwartsHouse } from './types';
import { jwtDecode } from 'jwt-decode';
import ErrorBoundary from './components/ErrorBoundary';
import QuestsPage from './pages/QuestPage';
import SpellbookPage from './pages/SpellBookPage';
import { Sparkles } from 'lucide-react';

interface DecodedToken {
  user_id: number;
  username: string;
  email: string;
  exp: number;
  iat: number;
  jti: string;
  wizard_name?: string;
  house?: string;
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://maraudersworld.onrender.com';

const normalizeHouseName = (house: string | null | undefined): HogwartsHouse | null => {
  if (!house) return null;
  const houseMap: Record<string, HogwartsHouse> = {
    ravenclaw: 'Ravenclaw',
    gryffindor: 'Gryffindor',
    hufflepuff: 'Hufflepuff',
    slytherin: 'Slytherin',
  };
  const normalized = house.toLowerCase();
  return houseMap[normalized] || null;
};

function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoadingApp, setIsLoadingApp] = useState(true);

  const handleLogout = useCallback(() => {
    console.log("[App.tsx handleLogout] Logging out.");
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    setCurrentUser(null);
  }, []);

  const fetchUserProfile = useCallback(async (userIdFromToken: number, token: string): Promise<User | null> => {
    console.log("[App.tsx fetchUserProfile] Fetching for user ID (from token):", userIdFromToken);
    try {
      const response = await fetch(`${API_BASE_URL}/game/profile/`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (!response.ok) {
        console.error("[App.tsx fetchUserProfile] Response not OK. Status:", response.status);
        if (response.status === 401 || response.status === 403) {
          console.error("[App.tsx fetchUserProfile] Unauthorized or Token expired.");
          handleLogout();
        }
        return null;
      }
      const profileData = await response.json();
      console.log("[App.tsx fetchUserProfile] RAW profileData from API:", JSON.stringify(profileData, null, 2));

      const normalizedHouseApi = normalizeHouseName(profileData.house);
      if (!normalizedHouseApi && profileData.house) {
        console.warn("[App.tsx fetchUserProfile] Invalid house value from backend profile:", profileData.house);
      }

      const userObjectToSet: User = {
        id: profileData.id || userIdFromToken,
        username: profileData.username || "UnknownUsername",
        email: profileData.email || "UnknownEmail",
        wizardName: profileData.wizard_name || profileData.username || "Wizard",
        house: normalizedHouseApi,
        xp: profileData.xp ?? 0,
        level: profileData.level ?? 1,
        wand: (profileData.wand && typeof profileData.wand === 'object')
              ? {
                  wood: profileData.wand.wood || '',
                  core: profileData.wand.core || '',
                  length: profileData.wand.length || '',
                }
              : { wood: '', core: '', length: '' },
        spells: profileData.spells || [], // Add spells
        inventory: profileData.inventory || [], // Add inventory
        gold: profileData.gold ?? 0, // Add gold
        achievements: profileData.achievements ?? 0,
        questsCompleted: profileData.quests_completed ?? 0,
        currencies: profileData.currencies || [],
        active_theme: profileData.active_theme,
        active_accessories: profileData.active_accessories || [],
        current_latitude: profileData.current_latitude,
        current_longitude: profileData.current_longitude,
      };

      console.log("[App.tsx fetchUserProfile] User object to be set:", JSON.stringify(userObjectToSet, null, 2));
      setCurrentUser(userObjectToSet);
      console.log("[App.tsx fetchUserProfile] setCurrentUser called with full profile.");
      return userObjectToSet;
    } catch (error) {
      console.error("[App.tsx fetchUserProfile] Catch block error:", error);
      handleLogout();
      return null;
    }
  }, [handleLogout]);

  useEffect(() => {
    const initializeAuth = async () => {
      console.log("[App.tsx initializeAuth] Initializing authentication...");
      const accessToken = localStorage.getItem('accessToken');
      if (accessToken) {
        console.log("[App.tsx initializeAuth] Access token found.");
        try {
          const decodedToken = jwtDecode<DecodedToken>(accessToken);
          console.log("[App.tsx initializeAuth] Decoded token:", decodedToken);

          if (decodedToken.exp * 1000 < Date.now()) {
            console.log("[App.tsx initializeAuth] Access token expired on app load.");
            handleLogout();
            setIsLoadingApp(false);
            return;
          }

          const minimalUserFromToken: User = {
            id: decodedToken.user_id,
            username: decodedToken.username,
            email: decodedToken.email,
            wizardName: decodedToken.wizard_name || decodedToken.username || '',
            house: normalizeHouseName(decodedToken.house),
            xp: 0,
            level: 1,
            wand: { wood: '', core: '', length: '' },
            spells: [], // Add spells
            inventory: [], // Add inventory
            gold: 0, // Add gold
            achievements: 0,
            questsCompleted: 0,
            currencies: [],
            active_accessories: [],
          };
          setCurrentUser(minimalUserFromToken);
          console.log("[App.tsx initializeAuth] Minimal user set from token. Fetching full profile...");
          await fetchUserProfile(decodedToken.user_id, accessToken);
        } catch (error) {
          console.error("[App.tsx initializeAuth] Error decoding token or during initial fetch:", error);
          handleLogout();
        }
      } else {
        console.log("[App.tsx initializeAuth] No access token found.");
      }
      setIsLoadingApp(false);
    };

    initializeAuth();
  }, [fetchUserProfile, handleLogout]);

  const handleSignupSuccess = (signedUpUser: User, accessToken: string, refreshToken: string) => {
    console.log("[App.tsx handleSignupSuccess] User signed up:", signedUpUser.username);
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
    setCurrentUser(signedUpUser);
    setIsLoadingApp(false);
  };

  const handleLoginSuccess = async (loggedInUserBase: Pick<User, 'id' | 'username' | 'email'>, accessToken: string, refreshToken: string) => {
    console.log("[App.tsx handleLoginSuccess] User logged in:", loggedInUserBase.username);
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
    const minimalUser: User = {
      ...loggedInUserBase,
      wizardName: loggedInUserBase.username,
      house: null,
      xp: 0,
      level: 1,
      wand: { wood: '', core: '', length: '' },
      spells: [], // Add spells
      inventory: [], // Add inventory
      gold: 0, // Add gold
      achievements: 0,
      questsCompleted: 0,
      currencies: [],
      active_accessories: [],
    };
    setCurrentUser(minimalUser);
    setIsLoadingApp(true);
    console.log("[App.tsx handleLoginSuccess] Fetching full profile after login...");
    await fetchUserProfile(loggedInUserBase.id, accessToken);
    setIsLoadingApp(false);
  };

  const handleHouseAssigned = (house: HogwartsHouse) => {
    console.log("[App.tsx handleHouseAssigned] House assigned:", house);
    if (currentUser) {
      const updatedUser = { ...currentUser, house };
      setCurrentUser(updatedUser);
      console.log("[App.tsx handleHouseAssigned] currentUser updated with new house.");
    }
  };

  if (isLoadingApp) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="text-center">
          <Sparkles className="text-yellow-400 text-5xl animate-pulse mx-auto mb-4" />
          <p className="text-yellow-400 text-2xl font-['Lumos']">Loading Ancient Tomes...</p>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <div className="min-h-screen bg-gray-900 text-gray-100 font-serif">
        {currentUser && (
          <nav className="p-4 bg-gray-800/80 backdrop-blur-sm text-right fixed top-0 left-0 right-0 z-[1000] shadow-lg">
            <span className="text-gray-300 mr-4 text-sm">
              Welcome, {currentUser.wizardName || currentUser.username}! 
              {currentUser.house && ` (House ${currentUser.house})`}
            </span>
            <button onClick={handleLogout} className="text-yellow-400 hover:text-yellow-200 text-sm px-3 py-1 rounded hover:bg-yellow-400/10 transition-colors">
              Logout
            </button>
          </nav>
        )}
        <div className={currentUser ? "pt-16" : ""}>
          <Routes>
            <Route path="/login" element={
              currentUser ? <Navigate to={currentUser.house ? "/dashboard" : "/sorting-hat"} replace /> : <LoginPage onLoginSuccess={handleLoginSuccess} />
            } />
            <Route path="/signup" element={
              currentUser ? <Navigate to="/sorting-hat" replace /> : <SignupPage onSignupSuccess={handleSignupSuccess} />
            } />
            <Route path="/sorting-hat" element={
              !currentUser ? <Navigate to="/login" replace /> :
              (currentUser.house ? <Navigate to="/house-reveal" replace /> : <SortingHatQuizPage user={currentUser} onHouseAssigned={handleHouseAssigned} />)
            } />
            <Route path="/house-reveal" element={
              !currentUser ? <Navigate to="/login" replace /> :
              (!currentUser.house ? <Navigate to="/sorting-hat" replace /> : <HouseRevealPage house={currentUser.house} />)
            } />
            <Route path="/dashboard" element={
              !currentUser ? <Navigate to="/login" replace /> :
              (!currentUser.house ? <Navigate to="/sorting-hat" replace /> : (
                <ErrorBoundary>
                  <HomeDashboardPage user={currentUser} />
                </ErrorBoundary>
              ))
            } />
            <Route path="/inventory" element={
              !currentUser ? <Navigate to="/login" replace /> :
              (!currentUser.house ? <Navigate to="/sorting-hat" replace /> : <InventoryPage user={currentUser} />)
            } />
            <Route path="/map" element={
              !currentUser ? <Navigate to="/login" replace /> :
              (!currentUser.house ? <Navigate to="/sorting-hat" replace /> : <MapPage user={currentUser} />)
            } />
            <Route path="/quests" element={
              !currentUser ? <Navigate to="/login" replace /> :
              (!currentUser.house ? <Navigate to="/sorting-hat" replace /> : <QuestsPage user={currentUser} />)
            } />
            <Route path="/spellbook" element={
              !currentUser ? <Navigate to="/login" replace /> :
              (!currentUser.house ? <Navigate to="/sorting-hat" replace /> : <SpellbookPage user={currentUser} />)
            } />
            <Route path="*" element={
              <Navigate to={currentUser ? (currentUser.house ? "/dashboard" : "/sorting-hat") : "/login"} replace />
            }/>
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;