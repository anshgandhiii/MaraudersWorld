import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import HomeDashboardPage from "./pages/Dashboard";

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<HomeDashboardPage />} />
          {/* Add more routes here as you build more pages */}
        </Routes>
      </div>
    </BrowserRouter>
  );
};

export default App;
