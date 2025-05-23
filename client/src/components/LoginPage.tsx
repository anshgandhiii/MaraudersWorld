import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import type { User } from '../types';

interface LoginPageProps {
  onLoginSuccess: (user: Pick<User, 'id' | 'username' | 'email'>, accessToken: string, refreshToken: string) => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchUserProfile = async (accessToken: string) => {
    const response = await fetch('https://maraudersworld.onrender.com/game/profile/', {
      headers: { 'Authorization': `Bearer ${accessToken}` },
    });
    if (!response.ok) {
      throw new Error('Failed to fetch user profile');
    }
    return await response.json();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      // Step 1: Perform the login request
      const loginResponse = await fetch('https://maraudersworld.onrender.com/auth/login/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const loginData = await loginResponse.json();

      if (!loginResponse.ok) {
        throw new Error(loginData.detail || 'Login failed. Please check your credentials.');
      }

      if (!loginData.access || !loginData.refresh) {
        throw new Error('Missing access or refresh token in response.');
      }

      // Step 2: Fetch user profile with the access token
      const userData = await fetchUserProfile(loginData.access);

      // Step 3: Construct the User object
      const user: User = {
        id: userData.id,
        username: userData.username,
        email: userData.email,
        wizardName: userData.wizardName || userData.username,
        house: userData.house || null,
        xp: userData.xp || 0,
        level: userData.level || 1,
        wand: userData.wand || { wood: '', core: '', length: '' },
        spells: userData.spells || [],
        inventory: userData.inventory || [],
        gold: userData.gold || 0,
        achievements: userData.achievements || 0,
        questsCompleted: userData.questsCompleted || 0,
        currencies: userData.currencies || [],
        active_accessories: userData.active_accessories || [],
      };

      // Step 4: Call onLoginSuccess with the required data
      onLoginSuccess(
        { id: user.id, username: user.username, email: user.email },
        loginData.access,
        loginData.refresh
      );
    } catch (err) {
      setError((err as Error).message || 'An unknown error occurred during login.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-800 via-gray-900 to-black p-6">
      <div className="bg-gray-800 p-8 md:p-12 rounded-lg shadow-2xl w-full max-w-md border border-yellow-500/30">
        <h1 className="text-4xl font-bold text-yellow-400 mb-2 text-center font-['Lumos']">Login to Hogwarts</h1>
        <p className="text-gray-400 mb-8 text-center">Access your wizarding profile.</p>

        {error && <p className="bg-red-500/30 text-red-300 p-3 rounded mb-4 text-sm">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-yellow-300/80">
              Username
            </label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              autoComplete="username"
              className="mt-1 block w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md shadow-sm focus:ring-yellow-500 focus:border-yellow-500 sm:text-sm text-gray-200 placeholder-gray-500"
              placeholder="e.g., MagicalUser123"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-yellow-300/80">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
              className="mt-1 block w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md shadow-sm focus:ring-yellow-500 focus:border-yellow-500 sm:text-sm text-gray-200"
            />
          </div>
          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-gray-900 bg-yellow-400 hover:bg-yellow-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-yellow-500 disabled:opacity-50 transition duration-150"
            >
              {isLoading ? 'Casting Spell...' : 'Login'}
            </button>
          </div>
        </form>
        <p className="mt-8 text-center text-sm text-gray-400">
          Don't have an account?{' '}
          <Link to="/signup" className="font-medium text-yellow-400 hover:text-yellow-300">
            Sign Up Here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;