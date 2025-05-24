// import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
// import SignupPage from './components/SignupPage';
// import LoginPage from './components/LoginPage';
// import SortingHatQuizPage from './components/SortingHatQuizPage';
// import HouseRevealPage from './components/HouseRevealPage';
// import HomeDashboardPage from './pages/Dashboard';
// import InventoryPage from './pages/InventoryPage';
// import MapPage from './pages/MapPage';
// import { useState, useEffect } from 'react';
// import type { User, HogwartsHouse } from './types';
// import { jwtDecode } from 'jwt-decode';
// import ErrorBoundary from './components/ErrorBoundary';

// interface DecodedToken {
//   user_id: number;
//   username: string;
//   email: string;
//   exp: number;
//   iat: number;
//   jti: string;
// }

// const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://maraudersworld.onrender.com';

// // Normalize house name to title case
// const normalizeHouseName = (house: string | null): HogwartsHouse | null => {
//   if (!house) return null;
//   const houseMap: Record<string, HogwartsHouse> = {
//     ravenclaw: 'Ravenclaw',
//     gryffindor: 'Gryffindor',
//     hufflepuff: 'Hufflepuff',
//     slytherin: 'Slytherin',
//   };
//   const normalized = house.toLowerCase();
//   return houseMap[normalized] || null;
// };

// function App() {
//   const [currentUser, setCurrentUser] = useState<User | null>(null);
//   const [assignedHouse, setAssignedHouse] = useState<HogwartsHouse | null>(null);
//   const [isLoadingApp, setIsLoadingApp] = useState(true);

//   const fetchUserProfile = async (userId: number, token: string): Promise<User | null> => {
//     console.log("Fetching user profile for user ID:", userId);
//     try {
//       const response = await fetch(`${API_BASE_URL}/game/profile/`, {
//         headers: { 'Authorization': `Bearer ${token}` }
//       });

//       if (!response.ok) {
//         if (response.status === 401 || response.status === 403) {
//           console.error("Unauthorized or Token expired while fetching profile.");
//           handleLogout();
//         } else {
//           console.error("Failed to fetch profile, status:", response.status);
//         }
//         return null;
//       }
//       const profileData = await response.json();
//       const normalizedHouse = normalizeHouseName(profileData.house);
//       if (!normalizedHouse && profileData.house) {
//         console.warn("Invalid house value received:", profileData.house);
//       }
//       const user: User = {
//         id: profileData.user.id,
//         username: profileData.user.username,
//         email: profileData.user.email,
//         wizardName: profileData.user.wizard_name || profileData.user.username,
//         house: normalizedHouse,
//         xp: profileData.xp || 0,
//         level: profileData.level || 1,
//         wand: profileData.wand || { wood: '', core: '', length: '' },
//         achievements: profileData.achievements || 0,
//         questsCompleted: profileData.quests_completed || 0,
//         currencies: profileData.currencies || [],
//         active_theme: profileData.active_theme,
//         active_accessories: profileData.active_accessories || [],
//         current_latitude: profileData.current_latitude,
//         current_longitude: profileData.current_longitude,
//       };
//       setCurrentUser(user);
//       setAssignedHouse(normalizedHouse);
//       console.log("Profile fetched successfully:", profileData);
//       return user;
//     } catch (error) {
//       console.error("Error fetching user profile:", error);
//       return null;
//     }
//   };

//   useEffect(() => {
//     const initializeAuth = async () => {
//       const accessToken = localStorage.getItem('accessToken');
//       if (accessToken) {
//         try {
//           const decodedToken = jwtDecode<DecodedToken>(accessToken);
//           if (decodedToken.exp * 1000 < Date.now()) {
//             console.log("Access token expired on app load.");
//             handleLogout();
//             setIsLoadingApp(false);
//             return;
//           }

//           const userFromToken: User = {
//             id: decodedToken.user_id,
//             username: decodedToken.username,
//             email: decodedToken.email,
//             wizardName: '',
//             house: null,
//             xp: 0,
//             level: 1,
//             wand: { wood: '', core: '', length: '' },
//             achievements: 0,
//             questsCompleted: 0,
//             currencies: [],
//             active_accessories: [],
//             current_latitude: undefined,
//             current_longitude: undefined,
//           };
//           setCurrentUser(userFromToken);
//           await fetchUserProfile(userFromToken.id, accessToken);
//         } catch (error) {
//           console.error("Error decoding token or fetching profile on app load:", error);
//           handleLogout();
//         }
//       }
//       setIsLoadingApp(false);
//     };

//     initializeAuth();
//   }, []);

//   const handleSignupSuccess = (user: User, accessToken: string, refreshToken: string) => {
//     localStorage.setItem('accessToken', accessToken);
//     localStorage.setItem('refreshToken', refreshToken);
//     setCurrentUser(user);
//     setAssignedHouse(null);
//     setIsLoadingApp(false);
//   };

//   const handleLoginSuccess = async (user: User, accessToken: string, refreshToken: string) => {
//     localStorage.setItem('accessToken', accessToken);
//     localStorage.setItem('refreshToken', refreshToken);
//     setCurrentUser(user);
//     setIsLoadingApp(true);
//     await fetchUserProfile(user.id, accessToken);
//     setIsLoadingApp(false);
//   };

//   const handleHouseAssigned = (house: HogwartsHouse) => {
//     setAssignedHouse(house);
//     if (currentUser) {
//       setCurrentUser({ ...currentUser, house });
//     }
//   };

//   const handleLogout = () => {
//     localStorage.removeItem('accessToken');
//     localStorage.removeItem('refreshToken');
//     setCurrentUser(null);
//     setAssignedHouse(null);
//   };

//   if (isLoadingApp) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-gray-900">
//         <p className="text-yellow-400 text-2xl animate-pulse font-['Lumos']">Loading Ancient Tomes...</p>
//       </div>
//     );
//   }

//   return (
//     <Router>
//       <div className="min-h-screen bg-gray-900 text-gray-100 font-serif">
//         {currentUser && (
//           <nav className="p-4 bg-gray-800/50 text-right fixed top-0 left-0 right-0 z-50">
//             <span className="text-gray-300 mr-4">Welcome, Wizard {currentUser.wizardName}! {assignedHouse && `(${assignedHouse})`}</span>
//             <button onClick={handleLogout} className="text-yellow-400 hover:text-yellow-200">Logout</button>
//           </nav>
//         )}
//         <div className={currentUser ? "pt-16" : ""}>
//           <Routes>
//             <Route path="/login" element={
//               currentUser ? <Navigate to={assignedHouse ? "/dashboard" : "/sorting-hat"} /> : <LoginPage onLoginSuccess={handleLoginSuccess} />
//             } />
//             <Route path="/signup" element={
//               currentUser ? <Navigate to="/sorting-hat" /> : <SignupPage onSignupSuccess={handleSignupSuccess} />
//             } />
//             <Route path="/sorting-hat" element={
//               !currentUser ? <Navigate to="/login" /> :
//               (assignedHouse ? <Navigate to="/house-reveal"/> : <SortingHatQuizPage user={currentUser} onHouseAssigned={handleHouseAssigned} />)
//             } />
//             <Route path="/house-reveal" element={
//               !currentUser || !assignedHouse ? <Navigate to="/login" /> : <HouseRevealPage house={assignedHouse} />
//             } />
//             <Route path="/dashboard" element={
//               !currentUser ? <Navigate to="/login" /> :
//               (!assignedHouse ? <Navigate to="/sorting-hat" /> : (
//                 <ErrorBoundary>
//                   <HomeDashboardPage user={currentUser} />
//                 </ErrorBoundary>
//               ))
//             } />
//             <Route path="/inventory" element={
//               !currentUser ? <Navigate to="/login" /> :
//               (!assignedHouse ? <Navigate to="/sorting-hat" /> : <InventoryPage user={currentUser} />)
//             } />
//             <Route path="/map" element={
//               !currentUser ? <Navigate to="/login" /> :
//               (!assignedHouse ? <Navigate to="/sorting-hat" /> : <MapPage user={currentUser} />)
//             } />
//             <Route path="*" element={
//               <Navigate to={currentUser ? (assignedHouse ? "/dashboard" : "/sorting-hat") : "/login"} />
//             }/>
//           </Routes>
//         </div>
//       </div>
//     </Router>
//   );
// }

// export default App;



import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import SignupPage from './components/SignupPage';
import LoginPage from './components/LoginPage';
import SortingHatQuizPage from './components/SortingHatQuizPage';
import HouseRevealPage from './components/HouseRevealPage';
import HomeDashboardPage from './pages/Dashboard';
import InventoryPage from './pages/InventoryPage';
import MapPage from './pages/MapPage';
import QuestsPage from './pages/QuestPage';
import QuestPlayPage from './pages/QuestPlayPage'; // <-- Add
import ShopPage from './pages/ShopPage'; // <-- Add
import HospitalPage from './pages/HospitalPage'; // <-- Add
import { useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import ErrorBoundary from './components/ErrorBoundary';

interface DecodedToken {
  user_id: number;
  username: string;
  email: string;
  exp: number;
  iat: number;
  jti: string;
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://maraudersworld.onrender.com';

// Normalize house name to title case
const normalizeHouseName = (house: string | null): HogwartsHouse | null => {
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
  const [assignedHouse, setAssignedHouse] = useState<HogwartsHouse | null>(null);
  const [isLoadingApp, setIsLoadingApp] = useState(true);

  const fetchUserProfile = async (userId: number, token: string): Promise<User | null> => {
    console.log("Fetching user profile for user ID:", userId);
    try {
      const response = await fetch(`${API_BASE_URL}/game/profile/`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
          console.error("Unauthorized or Token expired while fetching profile.");
          handleLogout();
        } else {
          console.error("Failed to fetch profile, status:", response.status);
        }
        return null;
      }
      const profileData = await response.json();
      const normalizedHouse = normalizeHouseName(profileData.house);
      if (!normalizedHouse && profileData.house) {
        console.warn("Invalid house value received:", profileData.house);
      }
      const user: User = {
        id: profileData.user.id,
        username: profileData.user.username,
        email: profileData.user.email,
        wizardName: profileData.user.wizard_name || profileData.user.username,
        house: normalizedHouse,
        xp: profileData.xp || 0,
        level: profileData.level || 1,
        wand: profileData.wand || { wood: '', core: '', length: '' },
        achievements: profileData.achievements || 0,
        questsCompleted: profileData.quests_completed || 0,
        currencies: profileData.currencies || [],
        active_theme: profileData.active_theme,
        active_accessories: profileData.active_accessories || [],
        current_latitude: profileData.current_latitude,
        current_longitude: profileData.current_longitude,
      };
      setCurrentUser(user);
      setAssignedHouse(normalizedHouse);
      console.log("Profile fetched successfully:", profileData);
      return user;
    } catch (error) {
      console.error("Error fetching user profile:", error);
      return null;
    }
  };

  useEffect(() => {
    const initializeAuth = async () => {
      const accessToken = localStorage.getItem('accessToken');
      if (accessToken) {
        try {
          const decodedToken = jwtDecode<DecodedToken>(accessToken);
          if (decodedToken.exp * 1000 < Date.now()) {
            console.log("Access token expired on app load.");
            handleLogout();
            setIsLoadingApp(false);
            return;
          }

          const userFromToken: User = {
            id: decodedToken.user_id,
            username: decodedToken.username,
            email: decodedToken.email,
            wizardName: '',
            house: null,
            xp: 0,
            level: 1,
            wand: { wood: '', core: '', length: '' },
            achievements: 0,
            questsCompleted: 0,
            currencies: [],
            active_accessories: [],
            current_latitude: undefined,
            current_longitude: undefined,
          };
          setCurrentUser(userFromToken);
          await fetchUserProfile(userFromToken.id, accessToken);
        } catch (error) {
          console.error("Error decoding token or fetching profile on app load:", error);
          handleLogout();
        }
      }
      setIsLoadingApp(false);
    };

    initializeAuth();
  }, []);

  const handleSignupSuccess = (user: User, accessToken: string, refreshToken: string) => {
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
    setCurrentUser(user);
    setAssignedHouse(null);
    setIsLoadingApp(false);
  };

  const handleLoginSuccess = async (user: User, accessToken: string, refreshToken: string) => {
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
    setCurrentUser(user);
    setIsLoadingApp(true);
    await fetchUserProfile(user.id, accessToken);
    setIsLoadingApp(false);
  };

  const handleHouseAssigned = (house: HogwartsHouse) => {
    setAssignedHouse(house);
    if (currentUser) {
      setCurrentUser({ ...currentUser, house });
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    setCurrentUser(null);
    setAssignedHouse(null);
  };

  if (isLoadingApp) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <p className="text-yellow-400 text-2xl animate-pulse font-['Lumos']">Loading Ancient Tomes...</p>
      </div>
    );
  }

  return (
    <Router>
      <div className="min-h-screen bg-gray-900 text-gray-100 font-serif">
        {currentUser && (
          <nav className="p-4 bg-gray-800/50 text-right fixed top-0 left-0 right-0 z-50">
            <span className="text-gray-300 mr-4">Welcome, Wizard {currentUser.wizardName}! {assignedHouse && `(${assignedHouse})`}</span>
            <button onClick={handleLogout} className="text-yellow-400 hover:text-yellow-200">Logout</button>
          </nav>
        )}
        <div className={currentUser ? "pt-16" : ""}>
          <Routes>
            <Route path="/login" element={
              currentUser ? <Navigate to={assignedHouse ? "/dashboard" : "/sorting-hat"} /> : <LoginPage onLoginSuccess={handleLoginSuccess} />
            } />
            <Route path="/signup" element={
              currentUser ? <Navigate to="/sorting-hat" /> : <SignupPage onSignupSuccess={handleSignupSuccess} />
            } />
            <Route path="/sorting-hat" element={
              !currentUser ? <Navigate to="/login" /> :
              (assignedHouse ? <Navigate to="/house-reveal"/> : <SortingHatQuizPage user={currentUser} onHouseAssigned={handleHouseAssigned} />)
            } />
            <Route path="/house-reveal" element={
              !currentUser || !assignedHouse ? <Navigate to="/login" /> : <HouseRevealPage house={assignedHouse} />
            } />
            <Route path="/dashboard" element={
              !currentUser ? <Navigate to="/login" /> :
              (!assignedHouse ? <Navigate to="/sorting-hat" /> : (
                <ErrorBoundary>
                  <HomeDashboardPage user={currentUser} />
                </ErrorBoundary>
              ))
            } />
            <Route path="/inventory" element={
              !currentUser ? <Navigate to="/login" /> :
              (!assignedHouse ? <Navigate to="/sorting-hat" /> : <InventoryPage user={currentUser} />)
            } />
            <Route path="/map" element={
              !currentUser ? <Navigate to="/login" /> :
              (!assignedHouse ? <Navigate to="/sorting-hat" /> : <MapPage user={currentUser} />)
            } />
            {/* --- NEW GAME ROUTES --- */}
            <Route path="/quests" element={
              !currentUser ? <Navigate to="/login" /> :
              (!assignedHouse ? <Navigate to="/sorting-hat" /> : <QuestsPage />)
            } />
            <Route path="/quests/:questId" element={
              !currentUser ? <Navigate to="/login" /> :
              (!assignedHouse ? <Navigate to="/sorting-hat" /> : <QuestPlayPage />)
            } />
            <Route path="/shop" element={
              !currentUser ? <Navigate to="/login" /> :
              (!assignedHouse ? <Navigate to="/sorting-hat" /> : <ShopPage />)
            } />
            <Route path="/hospital" element={
              !currentUser ? <Navigate to="/login" /> :
              (!assignedHouse ? <Navigate to="/sorting-hat" /> : <HospitalPage />)
            } />
            <Route path="*" element={
              <Navigate to={currentUser ? (assignedHouse ? "/dashboard" : "/sorting-hat") : "/login"} />
            }/>
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;