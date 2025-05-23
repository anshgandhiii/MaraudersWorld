// src/components/LoginPage.tsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import type { User } from '../types'; // Assuming User interface is in src/types.ts

interface LoginPageProps {
  onLoginSuccess: (user: User, accessToken: string, refreshToken: string) => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess }) => {
  const [identifier, setIdentifier] = useState(''); // Can be username or email
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    // --- MOCK API CALL for JWT Authentication ---
    // Replace this with your actual API call to Django for token authentication
    try {
      // Example:
      // const response = await fetch('/api/auth/token/', { // Your DRF JWT endpoint
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ username: identifier, password }) // or email: identifier
      // });

      // if (!response.ok) {
      //   const errData = await response.json();
      //   throw new Error(errData.detail || 'Login failed. Invalid credentials.');
      // }
      // const data = await response.json(); // Should contain access & refresh tokens
      // const { access, refresh } = data;

      // --- Mock successful login with dummy tokens & user data ---
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate network delay
      
      // For mock, determine if identifier is email or username
      const isEmail = identifier.includes('@');
      const mockUsername = isEmail ? identifier.split('@')[0] : identifier;

      if (identifier === "testuser" && password === "password123" || identifier === "test@example.com" && password === "password123") {
        const mockUser: User = { id: 1, username: mockUsername, email: isEmail ? identifier : `${mockUsername}@example.com` };
        const mockAccessToken = 'mockAccessTokenString';
        const mockRefreshToken = 'mockRefreshTokenString';

        console.log('Login successful:', mockUser);
        console.log('Access Token:', mockAccessToken);
        console.log('Refresh Token:', mockRefreshToken);

        // Store tokens (e.g., in localStorage or secure HttpOnly cookies handled by backend)
        localStorage.setItem('accessToken', mockAccessToken);
        localStorage.setItem('refreshToken', mockRefreshToken);

        onLoginSuccess(mockUser, mockAccessToken, mockRefreshToken);
        // Navigate to sorting hat if no house, or game if house assigned (logic in App.tsx)
        // App.tsx will handle the navigation based on whether a house is already assigned.
        // If a house is already assigned for this user (fetched after login),
        // App.tsx's logic should navigate to /game. Otherwise, /sorting-hat.
        // For now, we just signal success, App.tsx will check state.
        // navigate('/sorting-hat'); // Or navigate('/game') based on fetched user profile
      } else {
        throw new Error('Invalid username or password.');
      }
      // --- End Mock ---

    } catch (err) {
      setError((err as Error).message || 'An unknown error occurred.');
      localStorage.removeItem('accessToken'); // Clear any stale tokens on failure
      localStorage.removeItem('refreshToken');
    } finally {
      setIsLoading(false);
    }
    // --- END MOCK API CALL ---
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-800 via-gray-900 to-black p-6">
      <div className="bg-gray-800 p-8 md:p-12 rounded-lg shadow-2xl w-full max-w-md border border-yellow-500/30">
        <h1 className="text-4xl font-bold text-yellow-400 mb-2 text-center font-['Lumos']">Welcome Back, Wizard!</h1>
        <p className="text-gray-400 mb-8 text-center">Enter your credentials to continue your journey.</p>

        {error && <p className="bg-red-500/30 text-red-300 p-3 rounded mb-4 text-sm">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="identifier" className="block text-sm font-medium text-yellow-300/80">
              Username or Owl Post (Email)
            </label>
            <input
              type="text"
              id="identifier"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              required
              className="mt-1 block w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md shadow-sm focus:ring-yellow-500 focus:border-yellow-500 sm:text-sm text-gray-200 placeholder-gray-500"
              placeholder="e.g., MagicalUser123 or you@example.com"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-yellow-300/80">
              Secret Incantation (Password)
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="mt-1 block w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md shadow-sm focus:ring-yellow-500 focus:border-yellow-500 sm:text-sm text-gray-200"
            />
          </div>
          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-gray-900 bg-yellow-400 hover:bg-yellow-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-yellow-500 disabled:opacity-50 transition duration-150"
            >
              {isLoading ? 'Checking Ministry Records...' : 'Login'}
            </button>
          </div>
        </form>
        <p className="mt-8 text-center text-sm text-gray-400">
          New to the Wizarding World?{' '}
          <Link to="/signup" className="font-medium text-yellow-400 hover:text-yellow-300">
            Enroll Here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;