import React, { useEffect, useState } from "react";
import {
  Star,
  Wand2,
  BookOpen,
  Map as MapIcon,
  Compass,
  Trophy,
  Sparkles,
  Package,
} from "lucide-react";
import { Link } from "react-router-dom";
import type { User, HogwartsHouse } from "../types";

interface NavigationCardProps {
  to: string;
  icon: React.ComponentType<{ size?: number }>;
  title: string;
  description: string;
  delay: string;
}

interface HomeDashboardPageProps {
  user: User;
}

export const houseStyles = {
  Gryffindor: {
    bg: "from-red-900 via-red-800 to-red-900",
    text: "text-yellow-200",
    border: "border-yellow-400",
    accent: "text-yellow-400",
    glow: "shadow-red-500/30",
  },
  Slytherin: {
    bg: "from-green-900 via-green-800 to-emerald-900",
    text: "text-slate-200",
    border: "border-emerald-400",
    accent: "text-emerald-300",
    glow: "shadow-green-500/30",
  },
  Ravenclaw: {
    bg: "from-blue-900 via-blue-800 to-indigo-900",
    text: "text-amber-200",
    border: "border-amber-400",
    accent: "text-amber-300",
    glow: "shadow-blue-500/30",
  },
  Hufflepuff: {
    bg: "from-yellow-700 via-yellow-600 to-amber-700",
    text: "text-black",
    border: "border-yellow-900",
    accent: "text-yellow-900",
    glow: "shadow-yellow-500/30",
  },
  Default: {
    bg: "from-gray-900 via-gray-800 to-gray-900",
    text: "text-amber-200",
    border: "border-amber-400",
    accent: "text-amber-400",
    glow: "shadow-amber-500/30",
  },
};

// Type guard to check if house is a valid HogwartsHouse
const isValidHouse = (house: User['house']): house is HogwartsHouse =>
  house !== null && house in houseStyles;

export const NavigationCard: React.FC<NavigationCardProps> = ({
  to,
  icon: Icon,
  title,
  description,
  delay,
}) => (
  <Link to={to} onClick={() => console.log(`Navigating to ${to}`)}>
    <div
      className={`group relative overflow-hidden rounded-2xl bg-gradient-to-br from-amber-100 via-yellow-50 to-amber-100 p-6 shadow-xl border-2 border-amber-300 hover:shadow-2xl hover:shadow-amber-500/25 transform hover:-translate-y-2 transition-all duration-500 ease-out cursor-pointer animate-in`}
      style={{ animationDelay: delay }}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-amber-400/10 to-yellow-400/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      <div className="relative z-10">
        <div className="flex items-center space-x-4 mb-4">
          <div className="p-3 rounded-xl bg-amber-500 text-white shadow-lg group-hover:scale-110 transition-transform duration-300">
            <Icon size={24} />
          </div>
          <h3 className="text-xl font-bold text-stone-800">{title}</h3>
        </div>
        <p className="text-stone-600 text-sm leading-relaxed">{description}</p>
        <div className="mt-4 flex items-center text-amber-600 font-semibold">
          <span className="text-sm">Explore</span>
          <svg
            className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-300"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </div>
      </div>
    </div>
  </Link>
);

const HomeDashboardPage: React.FC<HomeDashboardPageProps> = ({ user }) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!isValidHouse(user.house)) {
    console.warn("Invalid or null house detected:", user.house);
    return (
      <div className="min-h-screen flex items-center justify-center text-xl text-amber-200">
        No house assigned. Please complete the Sorting Hat quiz.
      </div>
    );
  }

  const currentHouseStyle = houseStyles[user.house] || houseStyles.Default;
  const xpProgress = (user.xp % 1000) / 10;
  const nextLevelXP = 1000 - (user.xp % 1000);

  const houseDescriptions: Record<HogwartsHouse, string> = {
    Gryffindor:
      "Where dwell the brave at heart, their daring, nerve, and chivalry set Gryffindors apart.",
    Slytherin:
      "Or perhaps in Slytherin, you'll make your real friends, those cunning folk use any means to achieve their ends.",
    Ravenclaw:
      "Or yet in wise old Ravenclaw, if you've a ready mind, where those of wit and learning will always find their kind.",
    Hufflepuff:
      "You might belong in Hufflepuff, where they are just and loyal, those patient Hufflepuffs are true and unafraid of toil.",
  };

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
            {user.active_accessories?.length > 0 && (
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
              Welcome, {user.wizardName}
            </h1>
            <div className="absolute -top-4 -right-4 animate-spin-slow">
              <Sparkles className="text-amber-400" size={32} />
            </div>
          </div>
          <p className="text-2xl text-amber-200 italic font-light tracking-wide">
            The Wizard Who Thrives
          </p>
        </header>

        <div
          className={`relative rounded-3xl p-8 shadow-2xl mb-12 border-2 ${currentHouseStyle.border} bg-gradient-to-r ${currentHouseStyle.bg} ${currentHouseStyle.glow} transition-all duration-500 hover:shadow-3xl transform hover:-translate-y-1 animate-in`}
          style={{ animationDelay: "200ms" }}
        >
          <div className="absolute inset-0 bg-white/5 rounded-3xl"></div>
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <h2
                className={`text-4xl md:text-5xl font-bold ${currentHouseStyle.text} drop-shadow-lg`}
              >
                House: {user.house}
              </h2>
              <Trophy
                className={`${currentHouseStyle.accent} animate-pulse`}
                size={32}
              />
            </div>
            <p
              className={`text-lg md:text-xl italic leading-relaxed ${currentHouseStyle.text} opacity-90`}
            >
              {houseDescriptions[user.house]}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
          <div
            className={`relative rounded-2xl p-6 shadow-xl border-2 ${currentHouseStyle.border} bg-gradient-to-br ${currentHouseStyle.bg} ${currentHouseStyle.glow} animate-in`}
            style={{ animationDelay: "300ms" }}
          >
            <div className="flex items-center space-x-4 mb-4">
              <Wand2 className={`${currentHouseStyle.accent}`} size={28} />
              <h3 className={`text-2xl font-semibold ${currentHouseStyle.text}`}>
                Your Wand
              </h3>
            </div>
            <p className={`${currentHouseStyle.text} text-sm`}>
              {user.wand.wood}, {user.wand.core}, {user.wand.length}
            </p>
          </div>
          <div
            className={`relative rounded-2xl p-6 shadow-xl border-2 ${currentHouseStyle.border} bg-gradient-to-br ${currentHouseStyle.bg} ${currentHouseStyle.glow} animate-in`}
            style={{ animationDelay: "400ms" }}
          >
            <div className="flex items-center space-x-4 mb-4">
              <Star className={`${currentHouseStyle.accent}`} size={28} />
              <h3 className={`text-2xl font-semibold ${currentHouseStyle.text}`}>
                Experience
              </h3>
            </div>
            <p className={`${currentHouseStyle.text} text-sm`}>
              Level {user.level} ({user.xp} XP)
            </p>
            <div className="mt-2 bg-gray-700/50 rounded-full h-2 overflow-hidden">
              <div
                className="bg-amber-400 h-full"
                style={{ width: `${xpProgress}%` }}
              ></div>
            </div>
            <p className={`${currentHouseStyle.text} text-xs mt-1`}>
              {nextLevelXP} XP to next level
            </p>
          </div>
          <div
            className={`relative rounded-2xl p-6 shadow-xl border-2 ${currentHouseStyle.border} bg-gradient-to-br ${currentHouseStyle.bg} ${currentHouseStyle.glow} animate-in`}
            style={{ animationDelay: "500ms" }}
          >
            <div className="flex items-center space-x-4 mb-4">
              <Trophy className={`${currentHouseStyle.accent}`} size={28} />
              <h3 className={`text-2xl font-semibold ${currentHouseStyle.text}`}>
                Achievements
              </h3>
            </div>
            <p className={`${currentHouseStyle.text} text-sm`}>
              {user.achievements} Achievements Unlocked
            </p>
            <p className={`${currentHouseStyle.text} text-sm`}>
              {user.questsCompleted} Quests Completed
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <NavigationCard
            to="/quests"
            icon={Compass}
            title="View Quests"
            description="Embark on magical adventures and earn valuable experience points"
            delay="700ms"
          />
          <NavigationCard
            to="/spellbook"
            icon={BookOpen}
            title="Open Spellbook"
            description="Study ancient spells and master the mystical arts of wizardry"
            delay="800ms"
          />
          <NavigationCard
            to="/map"
            icon={MapIcon}
            title="Explore the Map"
            description="Discover hidden locations and secret passages throughout Hogwarts"
            delay="900ms"
          />
          <NavigationCard
            to="/inventory"
            icon={Package}
            title="View Inventory"
            description="Inspect your collection of magical items and treasures"
            delay="1000ms"
          />
        </div>

        <footer className="text-center mt-20 py-8 border-t border-amber-400/20 animate-in" style={{ animationDelay: "1100ms" }}>
          <p className="text-amber-200/60 text-sm tracking-wide">
            Hogwarts Student Dashboard © Ministry of Magic Archives, Restricted Section
          </p>
        </footer>
      </div>
    </div>
  );
};

export default HomeDashboardPage;