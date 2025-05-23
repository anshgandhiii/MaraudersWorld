// src/components/SignupPage.tsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import type { User } from '../types';

interface SignupPageProps {
  onSignupSuccess: (user: User, accessToken: string, refreshToken: string) => void;
}

const SignupPage: React.FC<SignupPageProps> = ({ onSignupSuccess }) => {
  const [username, setUsername] = useState('');
  const [wizardName, setWizardName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError("Passwords do not match!");
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }

    setIsLoading(true);

    try {
      const requestBody = {
        username,
        email,
        password,
        password2: confirmPassword,
        wizard_name: wizardName,
      };

      const response = await fetch('https://maraudersworld.onrender.com/auth/register/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      const responseData = await response.json();

      if (!response.ok) {
        let errorMessage = 'Signup failed. Please check your details and try again.';
        if (responseData) {
          if (responseData.detail) {
            errorMessage = responseData.detail;
          } else {
            const fieldErrors = Object.entries(responseData)
              .map(([field, errors]) => {
                const errorMessages = Array.isArray(errors) ? errors.join(', ') : String(errors);
                const formattedField = field.charAt(0).toUpperCase() + field.slice(1).replace('_', ' ');
                return `${formattedField}: ${errorMessages}`;
              })
              .join(' | ');
            if (fieldErrors) errorMessage = fieldErrors;
          }
        }
        throw new Error(errorMessage);
      }

      if (!responseData.user || !responseData.access || !responseData.refresh) {
        console.error("Unexpected response structure from backend after signup:", responseData);
        throw new Error("Signup succeeded, but token or user data was not received correctly.");
      }

      const backendUser = responseData.user;
      const accessToken = responseData.access;
      const refreshToken = responseData.refresh;

      const registeredUser: User = {
        id: backendUser.id,
        username: backendUser.username,
        email: backendUser.email,
        wizardName: wizardName,
        house: null,
        xp: 0,
        level: 1,
        wand: { wood: '', core: '', length: '' },
        spells: [],
        inventory: [],
        gold: 0,
        achievements: 0,
        questsCompleted: 0, // Add questsCompleted
        currencies: [], // Add currencies
        active_accessories: [], // Add active_accessories
      };

      console.log('Signup successful:', registeredUser);
      console.log('Access Token Received');
      console.log('Refresh Token Received');
      console.log('Backend Message:', responseData.message);

      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);

      onSignupSuccess(registeredUser, accessToken, refreshToken);
    } catch (err) {
      setError((err as Error).message || 'An unknown error occurred during signup.');
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-800 via-gray-900 to-black p-6">
      <div className="bg-gray-800 p-8 md:p-12 rounded-lg shadow-2xl w-full max-w-md border border-yellow-500/30">
        <h1 className="text-4xl font-bold text-yellow-400 mb-2 text-center font-['Lumos']">Enroll at Hogwarts</h1>
        <p className="text-gray-400 mb-8 text-center">Create your wizarding identity.</p>

        {error && <p className="bg-red-500/30 text-red-300 p-3 rounded mb-4 text-sm whitespace-pre-wrap">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-yellow-300/80">
              Username (for Login)
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
            <label htmlFor="wizardName" className="block text-sm font-medium text-yellow-300/80">
              Your Wizard Name (Profile)
            </label>
            <input
              type="text"
              id="wizardName"
              value={wizardName}
              onChange={(e) => setWizardName(e.target.value)}
              required
              className="mt-1 block w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md shadow-sm focus:ring-yellow-500 focus:border-yellow-500 sm:text-sm text-gray-200 placeholder-gray-500"
              placeholder="e.g., Albus Dumbledore Jr."
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-yellow-300/80">
              Owl Post Address (Email)
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
              className="mt-1 block w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md shadow-sm focus:ring-yellow-500 focus:border-yellow-500 sm:text-sm text-gray-200 placeholder-gray-500"
              placeholder="you@example.com"
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
              autoComplete="new-password"
              className="mt-1 block w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md shadow-sm focus:ring-yellow-500 focus:border-yellow-500 sm:text-sm text-gray-200"
            />
          </div>
          <div>
            <label htmlFor="password2" className="block text-sm font-medium text-yellow-300/80">
              Confirm Incantation
            </label>
            <input
              type="password"
              id="password2"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              autoComplete="new-password"
              className="mt-1 block w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md shadow-sm focus:ring-yellow-500 focus:border-yellow-500 sm:text-sm text-gray-200"
            />
          </div>
          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-gray-900 bg-yellow-400 hover:bg-yellow-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-yellow-500 disabled:opacity-50 transition duration-150"
            >
              {isLoading ? 'Sending Owl...' : 'Complete Enrollment'}
            </button>
          </div>
        </form>
        <p className="mt-8 text-center text-sm text-gray-400">
          Already have an account?{' '}
          <Link to="/login" className="font-medium text-yellow-400 hover:text-yellow-300">
            Login Here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignupPage;