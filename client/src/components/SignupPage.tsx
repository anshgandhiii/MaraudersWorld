// src/pages/SignupPage.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { User } from '../types'; // Assuming User interface is in types.ts or similar

interface SignupPageProps {
  onSignupSuccess: (user: User) => void;
}

const SignupPage: React.FC<SignupPageProps> = ({ onSignupSuccess }) => {
  const [username, setUsername] = useState('');
  const [wizardName, setWizardName] = useState('');
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

    try {
      const response = await fetch('http://127.0.0.1:8000/auth/register/', { // Updated API endpoint
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // If your Django backend requires a CSRF token for this endpoint,
          // you'll need to fetch and include it. For many DRF JWT setups,
          // CSRF might be disabled for API endpoints or handled differently.
          // 'X-CSRFToken': getCookie('csrftoken'), // Example if using cookies for CSRF
        },
        body: JSON.stringify({
          username,
          email,
          password,
          wizard_name: wizardName, // Send as snake_case if your Django serializer expects that
          // If your Django backend expects password confirmation, send it too:
          // password2: confirmPassword,
        }),
      });

      const responseData = await response.json();

      if (!response.ok) {
        // Handle errors from the backend
        // DRF often returns errors as an object: e.g., { username: ["already exists"], email: ["invalid"] }
        let errorMessage = 'Signup failed. Please try again.';
        if (responseData) {
          if (responseData.detail) {
            errorMessage = responseData.detail;
          } else {
            // Concatenate multiple field errors if they exist
            const fieldErrors = Object.entries(responseData)
              .map(([field, errors]) => {
                if (Array.isArray(errors)) {
                  return `${field}: ${errors.join(', ')}`;
                }
                return `${field}: ${errors}`;
              })
              .join(' | ');
            if (fieldErrors) errorMessage = fieldErrors;
          }
        }
        throw new Error(errorMessage);
      }

      // Assuming successful signup returns the user object (or part of it)
      // Adjust according to your actual backend response structure
      // For example, DRF might return the created user directly, or nested.
      // Let's assume it returns something like: { id: 1, username: "newuser", email: "new@example.com", ... }
      // or { "user": { id: 1, ... }, "message": "User created" }

      let createdUser: User;
      if (responseData.user && responseData.user.id) { // Example if nested under 'user'
         createdUser = {
            id: responseData.user.id,
            username: responseData.user.username,
            email: responseData.user.email,
            // wizardName: responseData.user.wizard_name // if returned and part of User type
         };
      } else if (responseData.id) { // Example if returned directly
         createdUser = {
            id: responseData.id,
            username: responseData.username,
            email: responseData.email,
            // wizardName: responseData.wizard_name // if returned and part of User type
         };
      } else {
        // Fallback if response structure is unknown but signup was "ok"
        // This is not ideal, backend should return consistent user data
        console.warn("Signup successful, but user data structure from backend is unexpected.", responseData);
        createdUser = { id: Date.now(), username, email }; // Use form data as a fallback
      }


      console.log('Signup successful:', createdUser, 'Wizard Name used:', wizardName);
      onSignupSuccess(createdUser); // Update global state
      navigate('/sorting-hat'); // Or navigate to login page, or dashboard if auto-login

    } catch (err) {
      setError((err as Error).message || 'An unknown error occurred during signup.');
    } finally {
      setIsLoading(false);
    }
  };

  // Helper function to get CSRF cookie if needed (place outside component or in a utils file)
  // function getCookie(name: string) {
  //   let cookieValue = null;
  //   if (document.cookie && document.cookie !== '') {
  //     const cookies = document.cookie.split(';');
  //     for (let i = 0; i < cookies.length; i++) {
  //       const cookie = cookies[i].trim();
  //       if (cookie.substring(0, name.length + 1) === (name + '=')) {
  //         cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
  //         break;
  //       }
  //     }
  //   }
  //   return cookieValue;
  // }

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
            <label htmlFor="password2" className="block text-sm font-medium text-yellow-300/80">
              Confirm Incantation
            </label>
            <input
              type="password"
              id="password2"
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