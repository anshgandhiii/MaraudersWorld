// src/components/LoginPage.tsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode'; // Import jwt-decode
import type { User } from '../types'; // Assuming User interface is in src/types/game.ts

// Define the expected API response structure for login (standard Simple JWT)
interface LoginApiResponse {
  access: string;
  refresh: string;
  // User object is NOT expected directly in the login response anymore
}

// Define the structure of the decoded JWT payload (customize based on your MyTokenObtainPairSerializer claims)
interface DecodedToken {
  user_id: number;
  username: string;
  email: string;
  // Add any other custom claims you put in the token
  exp: number; // Expiration timestamp
  iat: number; // Issued at timestamp
  jti: string; // JWT ID
  // house?: string | null; // Example if you added house to token claims
}


interface LoginPageProps {
  onLoginSuccess: (user: User, accessToken: string, refreshToken: string) => void;
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000';

const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess }) => {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const payload = {
        // Assuming your backend's TokenObtainPairSerializer expects 'username'
        // and can handle it if 'identifier' is an email (via custom auth backend or serializer logic)
        username: identifier,
        password: password,
      };

      const response = await fetch(`${API_BASE_URL}/auth/login/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const responseData = await response.json();

      if (!response.ok) {
        let errorMessage = 'Login failed. Invalid credentials or server error.';
        if (responseData.detail) {
          errorMessage = responseData.detail;
        } else if (responseData.non_field_errors) {
          errorMessage = responseData.non_field_errors.join(' ');
        }
        throw new Error(errorMessage);
      }

      const { access, refresh } = responseData as LoginApiResponse;

      if (!access || !refresh) {
        throw new Error('Login successful, but token data is missing in the response.');
      }

      // Decode the access token to get user information
      const decodedToken = jwtDecode<DecodedToken>(access);
      
      // Construct the User object from the decoded token
      // Ensure your User type matches these fields
      const user: User = {
        id: decodedToken.user_id,
        username: decodedToken.username,
        email: decodedToken.email,
        // Add other fields if they are in the token and your User type
        // e.g., house: decodedToken.house
      };

      console.log('Login successful. Decoded User Info:', user);
      console.log('Access Token:', access);
      console.log('Refresh Token:', refresh);

      localStorage.setItem('accessToken', access);
      localStorage.setItem('refreshToken', refresh);

      onLoginSuccess(user, access, refresh);

    } catch (err) {
      console.error("Login error:", err);
      let message = 'An unknown error occurred during login.';
      if (err instanceof Error) {
        message = err.message;
      }
      setError(message);
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
    } finally {
      setIsLoading(false);
    }
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