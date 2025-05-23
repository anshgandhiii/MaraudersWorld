// src/pages/SignupPage.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { User } from '../types'; // Assuming User interface is in App.tsx or a types file

interface SignupPageProps {
  onSignupSuccess: (user: User) => void;
}

const SignupPage: React.FC<SignupPageProps> = ({ onSignupSuccess }) => {
  const [username, setUsername] = useState('');
  const [wizardName, setWizardName] = useState(''); // For avatar/profile
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

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

    // --- MOCK API CALL ---
    // Replace this with your actual API call to Django
    try {
      // Example: const response = await fetch('/api/auth/register/', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ username, email, password, wizard_name: wizardName })
      // });
      // if (!response.ok) {
      //   const errData = await response.json();
      //   throw new Error(errData.detail || 'Signup failed');
      // }
      // const data = await response.json();

      // Mock successful signup
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate network delay
      const mockUser: User = { id: Date.now(), username, email };
      console.log('Signup successful:', mockUser, 'Wizard Name:', wizardName);
      onSignupSuccess(mockUser); // Update global state
      navigate('/sorting-hat');

    } catch (err) {
      setError((err as Error).message || 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
    // --- END MOCK API CALL ---
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-800 via-gray-900 to-black p-6">
      <div className="bg-gray-800 p-8 md:p-12 rounded-lg shadow-2xl w-full max-w-md border border-yellow-500/30">
        <h1 className="text-4xl font-bold text-yellow-400 mb-2 text-center font-['Lumos']">Enroll at Hogwarts</h1> {/* You might need to add a custom font */}
        <p className="text-gray-400 mb-8 text-center">Create your wizarding identity.</p>

        {error && <p className="bg-red-500/30 text-red-300 p-3 rounded mb-4 text-sm">{error}</p>}

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
              className="mt-1 block w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md shadow-sm focus:ring-yellow-500 focus:border-yellow-500 sm:text-sm text-gray-200 placeholder-gray-500"
              placeholder="e.g., MagicalUser123"
            />
          </div>
          <div>
            <label htmlFor="wizardName" className="block text-sm font-medium text-yellow-300/80">
              Your Wizard Name
            </label>
            <input
              type="text"
              id="wizardName"
              value={wizardName}
              onChange={(e) => setWizardName(e.target.value)}
              required
              className="mt-1 block w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md shadow-sm focus:ring-yellow-500 focus:border-yellow-500 sm:text-sm text-gray-200 placeholder-gray-500"
              placeholder="e.g., Albus D. (or your character's name)"
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
              className="mt-1 block w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md shadow-sm focus:ring-yellow-500 focus:border-yellow-500 sm:text-sm text-gray-200"
            />
          </div>
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-yellow-300/80">
              Confirm Incantation
            </label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
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
              {isLoading ? 'Sending Owl...' : 'Complete Enrollment'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignupPage;