import React, { useEffect, useState } from "react";
import axios from "axios";
import { BookOpen, Sparkles } from "lucide-react";
import type { User, InventoryItem } from "../types";
import { houseStyles } from "./Dashboard";

interface SpellbookPageProps {
  user: User;
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000';

const SpellbookPage: React.FC<SpellbookPageProps> = ({ user }) => {
  const [mounted, setMounted] = useState(false);
  const [spells, setSpells] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setMounted(true);
    const fetchSpells = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        if (!token) throw new Error('No access token found');

        const inventoryResponse = await axios.get(`${API_BASE_URL}/api/inventory/me/`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const spellItems = inventoryResponse.data.filter(
          (item: InventoryItem) => item.item.item_type === 'SPELL_SCROLL'
        );
        setSpells(spellItems);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching spells:", error);
        setLoading(false);
      }
    };
    fetchSpells();
  }, []);

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
        Loading spellbook...
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
              Spellbook, {user.wizardName}
            </h1>
            <div className="absolute -top-4 -right-4 animate-spin-slow">
              <Sparkles className="text-amber-400" size={32} />
            </div>
          </div>
          <p className="text-2xl text-amber-200 italic font-light tracking-wide">
            Master the Mystical Arts
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {spells.length === 0 ? (
            <p className="text-center text-amber-200 col-span-full">
              No spells or lore unlocked yet. Visit libraries to find spell scrolls!
            </p>
          ) : (
            spells.map((spell, index) => (
              <div
                key={spell.id}
                className={`relative rounded-2xl p-6 shadow-xl border-2 ${currentHouseStyle.border} bg-gradient-to-br ${currentHouseStyle.bg} ${currentHouseStyle.glow} animate-in`}
                style={{ animationDelay: `${300 + index * 100}ms` }}
              >
                <div className="flex items-center space-x-4 mb-4">
                  <BookOpen className={`${currentHouseStyle.accent}`} size={28} />
                  <h3 className={`text-2xl font-semibold ${currentHouseStyle.text}`}>
                    {spell.item.name}
                  </h3>
                </div>
                <p className={`${currentHouseStyle.text} text-sm`}>{spell.item.description}</p>
                <p className={`${currentHouseStyle.text} text-sm mt-2`}>Quantity: {spell.quantity}</p>
                {spell.item.image_url && (
                  <img
                    src={spell.item.image_url}
                    alt={spell.item.name}
                    className="mt-4 rounded-lg max-w-full h-auto"
                  />
                )}
              </div>
            ))
          )}
        </div>

        <footer className="text-center mt-20 py-8 border-t border-amber-400/20 animate-in" style={{ animationDelay: "1000ms" }}>
          <p className="text-amber-200/60 text-sm tracking-wide">
            Hogwarts Spellbook Archives © Ministry of Magic Archives, Restricted Section
          </p>
        </footer>
      </div>
    </div>
  );
};

export default SpellbookPage;