// src/components/SignupPage.tsx
import React, { useState } from 'react';
import { Link} from 'react-router-dom';
import type { User } from '../types'; // Assuming User interface is in src/types.ts

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
  // useNavigate is not strictly needed here anymore if App.tsx handles all post-auth navigation
  // const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError("Passwords do not match!");
      return;
    }
    if (password.length < 8) { // Basic password policy
      setError("Password must be at least 8 characters long.");
      return;
    }

    setIsLoading(true);

    // --- MOCK API CALL for User Registration and JWT Token Retrieval ---
    // Replace this with your actual API call to Django.
    // Your Django endpoint should register the user and ideally return tokens upon successful registration.
    // If it doesn't return tokens, you might need a subsequent call to a login/token endpoint.
    try {
      // Example structure for API call:
      // const response = await fetch('/api/auth/register/', { // Your DRF registration endpoint
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({
      //     username,
      //     email,
      //     password,
      //     // Include wizard_name or other profile fields if your backend handles profile creation during registration
      //     // For example, if PlayerProfile is created via a signal or in the same view:
      //     profile: { wizard_name: wizardName } // Adjust based on your DRF serializer
      //   })
      // });

      // if (!response.ok) {
      //   const errData = await response.json();
      //   // Common DRF errors: errData might be { username: ["User with this username already exists."]}
      //   let errorMessage = 'Signup failed.';
      //   if (typeof errData === 'object' && errData !== null) {
      //       const firstErrorKey = Object.keys(errData)[0];
      //       if (firstErrorKey && Array.isArray(errData[firstErrorKey])) {
      //           errorMessage = errData[firstErrorKey][0];
      //       } else if (errData.detail) {
      //           errorMessage = errData.detail;
      //       }
      //   }
      //   throw new Error(errorMessage);
      // }
      // const data = await response.json();
      // // Assuming registration returns user data and tokens:
      // // const registeredUser: User = { id: data.user.id, username: data.user.username, email: data.user.email };
      // // const accessToken = data.access_token;
      // // const refreshToken = data.refresh_token;

      // --- Mock successful signup & token generation ---
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate network delay
      const mockUserId = Date.now();
      const mockUser: User = { id: mockUserId, username, email };
      const mockAccessToken = `mockAccess-${mockUserId}-${username}`;
      const mockRefreshToken = `mockRefresh-${mockUserId}-${username}`;

      console.log('Signup successful:', mockUser, 'Wizard Name:', wizardName);
      console.log('Access Token:', mockAccessToken);
      console.log('Refresh Token:', mockRefreshToken);

      // Store tokens (e.g., in localStorage or secure HttpOnly cookies handled by backend)
      // This is consistent with how LoginPage.tsx mock behaves
      localStorage.setItem('accessToken', mockAccessToken);
      localStorage.setItem('refreshToken', mockRefreshToken);

      // Call the success handler passed from App.tsx
      onSignupSuccess(mockUser, mockAccessToken, mockRefreshToken);
      // App.tsx will handle navigation to /sorting-hat because assignedHouse will be null for a new user.

    } catch (err) {
      setError((err as Error).message || 'An unknown error occurred.');
      // Clear any stale tokens on failure, though unlikely to be set during signup fail
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
    } finally {
      setIsLoading(false);
    }
    // --- END MOCK API CALL ---
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-800 via-gray-900 to-black p-6">
      <div className="bg-gray-800 p-8 md:p-12 rounded-lg shadow-2xl w-full max-w-md border border-yellow-500/30">
        <h1 className="text-4xl font-bold text-yellow-400 mb-2 text-center font-['Lumos']">Enroll at Hogwarts</h1>
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