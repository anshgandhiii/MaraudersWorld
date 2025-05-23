import React, { useState, useEffect } from "react";
import { Star, Wand2, BookOpen, Map, Compass, Trophy, Sparkles } from "lucide-react";
import axios from "axios";

const HomeDashboardPage = () => {
  const [mounted, setMounted] = useState(false);
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);


  const user = {
    name: "Harry Potter",
    house: "Gryffindor",
    xp: 1480,
    level: 5,
    wand: {
      wood: "Holly",
      core: "Phoenix Feather",
      length: "11\"",
    },
    achievements: 12,
    questsCompleted: 8,
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  const houseStyles = {
    Gryffindor: { 
      bg: "from-red-900 via-red-800 to-red-900", 
      text: "text-yellow-200", 
      border: "border-yellow-400",
      accent: "text-yellow-400",
      glow: "shadow-red-500/30"
    },
    Slytherin: { 
      bg: "from-green-900 via-green-800 to-emerald-900", 
      text: "text-slate-200", 
      border: "border-emerald-400",
      accent: "text-emerald-300",
      glow: "shadow-green-500/30"
    },
    Ravenclaw: { 
      bg: "from-blue-900 via-blue-800 to-indigo-900", 
      text: "text-amber-200", 
      border: "border-amber-400",
      accent: "text-amber-300",
      glow: "shadow-blue-500/30"
    },
    Hufflepuff: { 
      bg: "from-yellow-700 via-yellow-600 to-amber-700", 
      text: "text-black", 
      border: "border-yellow-900",
      accent: "text-yellow-900",
      glow: "shadow-yellow-500/30"
    },
  };

  const currentHouseStyle = houseStyles[user.house as keyof typeof houseStyles] || houseStyles.Gryffindor;
  const xpProgress = (user.xp % 1000) / 10;
  const nextLevelXP = 1000 - (user.xp % 1000);
  interface NavigationCardProps {
    to: string;
    icon: React.ComponentType<{ size?: number }>;
    title: string;
    description: string;
    delay: string;
  }
  const NavigationCard: React.FC<NavigationCardProps> = ({ to, icon: Icon, title, description, delay }) => (
    <div 
      className={`group relative overflow-hidden rounded-2xl bg-gradient-to-br from-amber-100 via-yellow-50 to-amber-100 p-6 shadow-xl border-2 border-amber-300 hover:shadow-2xl hover:shadow-amber-500/25 transform hover:-translate-y-2 transition-all duration-500 ease-out cursor-pointer ${mounted ? 'animate-in slide-in-from-bottom-8' : 'opacity-0'}`}
      style={{ animationDelay: delay }}
      onMouseEnter={() => setHoveredCard(title)}
      onMouseLeave={() => setHoveredCard(null)}
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
          <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-gray-900 to-stone-950 text-amber-50 relative overflow-hidden">
      {/* Magical Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 2}s`
            }}
          >
            <Sparkles className="text-amber-400/20" size={Math.random() * 16 + 8} />
          </div>
        ))}
      </div>

      <div className="relative z-10 p-6 sm:p-8 lg:p-12">
        {/* Header */}
        <header className={`text-center mb-16 ${mounted ? 'animate-in fade-in slide-in-from-top-8' : 'opacity-0'}`}>
          <div className="relative">
            <h1 className="text-6xl sm:text-7xl lg:text-8xl font-bold bg-gradient-to-r from-amber-300 via-yellow-400 to-amber-300 bg-clip-text text-transparent drop-shadow-2xl mb-4 leading-tight">
              Welcome, {user.name}
            </h1>
            <div className="absolute -top-4 -right-4 animate-spin-slow">
              <Sparkles className="text-amber-400" size={32} />
            </div>
          </div>
          <p className="text-2xl text-amber-200 italic font-light tracking-wide">The Boy Who Lived</p>
        </header>

        {/* House Banner */}
        <div className={`relative rounded-3xl p-8 shadow-2xl mb-12 border-2 ${currentHouseStyle.border} bg-gradient-to-r ${currentHouseStyle.bg} ${currentHouseStyle.glow} transition-all duration-500 hover:shadow-3xl transform hover:-translate-y-1 ${mounted ? 'animate-in slide-in-from-left-8' : 'opacity-0'}`} style={{ animationDelay: '200ms' }}>
          <div className="absolute inset-0 bg-white/5 rounded-3xl"></div>
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <h2 className={`text-4xl md:text-5xl font-bold ${currentHouseStyle.text} drop-shadow-lg`}>
                House: {user.house}
              </h2>
              <Trophy className={`${currentHouseStyle.accent} animate-pulse`} size={32} />
            </div>
            <p className={`text-lg md:text-xl italic leading-relaxed ${currentHouseStyle.text} opacity-90`}>
              {user.house === "Gryffindor" && "Where dwell the brave at heart, their daring, nerve, and chivalry set Gryffindors apart."}
              {user.house == "Slytherin" && "Or perhaps in Slytherin, you'll make your real friends, those cunning folk use any means to achieve their ends."}
             {user.house === "Ravenclaw" && "Or yet in wise old Ravenclaw, if you've a ready mind, where those of wit and learning will always find their kind."}
             {user.house === "Hufflepuff" && "You might belong in Hufflepuff, where they are just and loyal, those patient Hufflepuffs are true and unafraid of toil."}
            </p>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
          {/* Wand Card */}
          <div className={`relative group rounded-3xl bg-gradient-to-br from-amber-50 via-yellow-50 to-amber-100 p-8 shadow-2xl border-2 border-amber-300 hover:shadow-amber-500/25 transition-all duration-500 transform hover:-translate-y-2 ${mounted ? 'animate-in slide-in-from-bottom-8' : 'opacity-0'}`} style={{ animationDelay: '400ms' }}>
            <div className="absolute inset-0 bg-gradient-to-r from-amber-400/10 to-yellow-400/10 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative z-10">
              <div className="flex items-center space-x-3 mb-6">
                <Wand2 className="text-amber-600" size={28} />
                <h3 className="text-2xl font-bold text-stone-800">Your Wand</h3>
              </div>
              <div className="space-y-4">
                {Object.entries(user.wand).map(([key, value]) => (
                  <div key={key} className="flex justify-between items-center p-3 bg-white/60 rounded-xl">
                    <span className="font-semibold text-stone-700 capitalize">{key}:</span>
                    <span className="text-stone-900 font-medium">{value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* XP & Level Card */}
          <div className={`relative group rounded-3xl bg-gradient-to-br from-amber-50 via-yellow-50 to-amber-100 p-8 shadow-2xl border-2 border-amber-300 hover:shadow-amber-500/25 transition-all duration-500 transform hover:-translate-y-2 ${mounted ? 'animate-in slide-in-from-bottom-8' : 'opacity-0'}`} style={{ animationDelay: '500ms' }}>
            <div className="absolute inset-0 bg-gradient-to-r from-amber-400/10 to-yellow-400/10 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative z-10">
              <div className="flex items-center space-x-3 mb-6">
                <Star className="text-amber-600" size={28} />
                <h3 className="text-2xl font-bold text-stone-800">Experience</h3>
              </div>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-3 bg-white/60 rounded-xl">
                  <span className="font-semibold text-stone-700">Level:</span>
                  <span className="text-2xl font-bold text-amber-600">{user.level}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-white/60 rounded-xl">
                  <span className="font-semibold text-stone-700">XP:</span>
                  <span className="text-stone-900 font-medium">{user.xp.toLocaleString()}</span>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm text-stone-600">
                    <span>Progress to Level {user.level + 1}</span>
                    <span>{nextLevelXP} XP needed</span>
                  </div>
                  <div className="w-full bg-stone-300 rounded-full h-3 overflow-hidden shadow-inner">
                    <div 
                      className="bg-gradient-to-r from-amber-500 to-yellow-500 h-full rounded-full transition-all duration-1000 ease-out shadow-lg"
                      style={{ width: `${xpProgress}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Achievements Card */}
          <div className={`relative group rounded-3xl bg-gradient-to-br from-amber-50 via-yellow-50 to-amber-100 p-8 shadow-2xl border-2 border-amber-300 hover:shadow-amber-500/25 transition-all duration-500 transform hover:-translate-y-2 ${mounted ? 'animate-in slide-in-from-bottom-8' : 'opacity-0'}`} style={{ animationDelay: '600ms' }}>
            <div className="absolute inset-0 bg-gradient-to-r from-amber-400/10 to-yellow-400/10 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative z-10">
              <div className="flex items-center space-x-3 mb-6">
                <Trophy className="text-amber-600" size={28} />
                <h3 className="text-2xl font-bold text-stone-800">Achievements</h3>
              </div>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-3 bg-white/60 rounded-xl">
                  <span className="font-semibold text-stone-700">Unlocked:</span>
                  <span className="text-2xl font-bold text-amber-600">{user.achievements}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-white/60 rounded-xl">
                  <span className="font-semibold text-stone-700">Quests:</span>
                  <span className="text-stone-900 font-medium">{user.questsCompleted} completed</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation */}
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
            icon={Map}
            title="Explore the Map"
            description="Discover hidden locations and secret passages throughout Hogwarts"
            delay="900ms"
          />
        </div>

        {/* Footer */}
        <footer className={`text-center mt-20 py-8 border-t border-amber-400/20 ${mounted ? 'animate-in fade-in' : 'opacity-0'}`} style={{ animationDelay: '1000ms' }}>
          <p className="text-amber-200/60 text-sm tracking-wide">
            Hogwarts Student Dashboard © Ministry of Magic Archives, Restricted Section
          </p>
        </footer>
      </div>

      <style>{`
        @keyframes animate-in {
          from {
            opacity: 0;
            transform: translateY(16px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-in {
          animation: animate-in 0.6s ease-out forwards;
        }
        .animate-spin-slow {
          animation: spin 8s linear infinite;
        }
        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
};

export default HomeDashboardPage;