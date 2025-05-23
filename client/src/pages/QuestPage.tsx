import React, { useEffect, useState } from "react";
import axios from "axios";
import { Compass, Sparkles } from "lucide-react";
import type { User, Quest, QuestProgress } from "../types";
import { houseStyles } from "./Dashboard";

interface QuestsPageProps {
  user: User;
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000';

const QuestsPage: React.FC<QuestsPageProps> = ({ user }) => {
  const [mounted, setMounted] = useState(false);
  const [availableQuests, setAvailableQuests] = useState<Quest[]>([]);
  const [questProgress, setQuestProgress] = useState<QuestProgress[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setMounted(true);
    const fetchQuests = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        if (!token) throw new Error('No access token found');

        const availableResponse = await axios.get(`${API_BASE_URL}/api/quests/available/`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setAvailableQuests(availableResponse.data);

        const progressResponse = await axios.get(`${API_BASE_URL}/api/quests/me/`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setQuestProgress(progressResponse.data);

        setLoading(false);
      } catch (error) {
        console.error("Error fetching quests:", error);
        setLoading(false);
      }
    };
    fetchQuests();
  }, []);

  const handleAcceptQuest = async (questId: number) => {
    try {
      const token = localStorage.getItem('accessToken');
      await axios.post(
        `${API_BASE_URL}/api/quests/${questId}/accept/`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      // Refresh quest progress
      const progressResponse = await axios.get(`${API_BASE_URL}/api/quests/me/`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setQuestProgress(progressResponse.data);
      alert("Quest accepted!");
    } catch (error) {
      console.error("Error accepting quest:", error);
      alert("Failed to accept quest.");
    }
  };

  const handleCompleteQuest = async (progressId: number) => {
    try {
      const token = localStorage.getItem('accessToken');
      await axios.patch(
        `${API_BASE_URL}/api/quests/progress/${progressId}/`,
        { status: "COMPLETED" },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      // Refresh quest progress
      const progressResponse = await axios.get(`${API_BASE_URL}/api/quests/me/`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setQuestProgress(progressResponse.data);
      alert("Quest completed! Rewards added to your inventory.");
    } catch (error) {
      console.error("Error completing quest:", error);
      alert("Failed to complete quest.");
    }
  };

  if (!user.house) {
    return (
      <div className="min-h-screen flex items-center justify-center text-xl text-amber-200">
        No house assigned. Please complete the Sorting Hat quiz.
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-xl text-amber-200">
        Loading quests...
      </div>
    );
  }

  const currentHouseStyle = houseStyles[user.house];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-gray-900 to-stone-950 text-amber-50 relative overflow-hidden">
      {user.active_theme?.image_url && (
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `url(${user.active_theme.image_url})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        ></div>
      )}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 2}s`,
            }}
          >
            <Sparkles
              className="text-amber-400/20"
              size={Math.random() * 16 + 8}
            />
          </div>
        ))}
      </div>

      <div className="relative z-10 p-6 sm:p-8 lg:p-12">
        <header
          className={`text-center mb-16 ${mounted ? "animate-in fade-in slide-in-from-top-8" : "opacity-0"}`}
        >
          <div className="relative">
            {user.active_accessories.length > 0 && (
              <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 flex space-x-2">
                {user.active_accessories.map((accessory) => (
                  <img
                    key={accessory.id}
                    src={accessory.image_url}
                    alt={accessory.name}
                    className="w-12 h-12 rounded-full"
                  />
                ))}
              </div>
            )}
            <h1 className="text-6xl sm:text-7xl lg:text-8xl font-bold bg-gradient-to-r from-amber-300 via-yellow-400 to-amber-300 bg-clip-text text-transparent drop-shadow-2xl mb-4 leading-tight">
              Quests, {user.wizardName}
            </h1>
            <div className="absolute -top-4 -right-4 animate-spin-slow">
              <Sparkles className="text-amber-400" size={32} />
            </div>
          </div>
          <p className="text-2xl text-amber-200 italic font-light tracking-wide">
            Embark on Magical Adventures
          </p>
        </header>

        <div className="mb-16">
          <h2 className={`text-3xl font-semibold ${currentHouseStyle.text} mb-6`}>
            Available Quests
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {availableQuests.map((quest, index) => (
              <div
                key={quest.id}
                className={`relative rounded-2xl p-6 shadow-xl border-2 ${currentHouseStyle.border} bg-gradient-to-br ${currentHouseStyle.bg} ${currentHouseStyle.glow} animate-in`}
                style={{ animationDelay: `${300 + index * 100}ms` }}
              >
                <div className="flex items-center space-x-4 mb-4">
                  <Compass className={`${currentHouseStyle.accent}`} size={28} />
                  <h3 className={`text-2xl font-semibold ${currentHouseStyle.text}`}>
                    {quest.title}
                  </h3>
                </div>
                <p className={`${currentHouseStyle.text} text-sm`}>{quest.description}</p>
                <p className={`${currentHouseStyle.text} text-sm mt-2`}>
                  Rewards: {quest.xp_reward} XP, {quest.galleon_reward} Galleons, {quest.gem_reward} Gems
                </p>
                {quest.item_reward && (
                  <p className={`${currentHouseStyle.text} text-sm`}>
                    Item: {quest.item_reward.name}
                  </p>
                )}
                <button
                  onClick={() => handleAcceptQuest(quest.id)}
                  className={`mt-4 px-4 py-2 rounded-lg bg-amber-500 text-white hover:bg-amber-600 ${currentHouseStyle.text}`}
                >
                  Accept Quest
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="mb-16">
          <h2 className={`text-3xl font-semibold ${currentHouseStyle.text} mb-6`}>
            Quest Progress
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {questProgress.map((progress, index) => (
              <div
                key={progress.id}
                className={`relative rounded-2xl p-6 shadow-xl border-2 ${currentHouseStyle.border} bg-gradient-to-br ${currentHouseStyle.bg} ${currentHouseStyle.glow} animate-in`}
                style={{ animationDelay: `${300 + index * 100}ms` }}
              >
                <div className="flex items-center space-x-4 mb-4">
                  <Compass className={`${currentHouseStyle.accent}`} size={28} />
                  <h3 className={`text-2xl font-semibold ${currentHouseStyle.text}`}>
                    {progress.quest.title}
                  </h3>
                </div>
                <p className={`${currentHouseStyle.text} text-sm`}>{progress.quest.description}</p>
                <p className={`${currentHouseStyle.text} text-sm mt-2`}>Status: {progress.status}</p>
                {progress.status === "IN_PROGRESS" && progress.quest.target_location && (
                  <button
                    onClick={() => handleCompleteQuest(progress.id)}
                    className={`mt-4 px-4 py-2 rounded-lg bg-amber-500 text-white hover:bg-amber-600 ${currentHouseStyle.text}`}
                  >
                    Complete Quest
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        <footer className="text-center mt-20 py-8 border-t border-amber-400/20 animate-in" style={{ animationDelay: "1000ms" }}>
          <p className="text-amber-200/60 text-sm tracking-wide">
            Hogwarts Quest Archives © Ministry of Magic Archives, Restricted Section
          </p>
        </footer>
      </div>
    </div>
  );
};

export default QuestsPage;