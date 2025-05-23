import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Sparkles,
  Package,
  Compass,
  BookOpen,
  Map
} from "lucide-react";
import type { User, InventoryItem } from "../types";
import { houseStyles, NavigationCard } from "./Dashboard";

interface InventoryCardProps {
  item: InventoryItem;
  houseStyle: typeof houseStyles[keyof typeof houseStyles];
  delay: string;
  onUse: (itemId: number) => void;
}

const InventoryCard: React.FC<InventoryCardProps> = ({ item, houseStyle, delay, onUse }) => (
  <div
    className={`relative rounded-2xl p-6 shadow-xl border-2 ${houseStyle.border} bg-gradient-to-br ${houseStyle.bg} ${houseStyle.glow} animate-in`}
    style={{ animationDelay: delay }}
  >
    <div className="flex items-center space-x-4 mb-4">
      <Package className={`${houseStyle.accent}`} size={28} />
      <h3 className={`text-2xl font-semibold ${houseStyle.text}`}>
        {item.item.name}
      </h3>
    </div>
    <p className={`${houseStyle.text} text-sm`}>Type: {item.item.item_type}</p>
    <p className={`${houseStyle.text} text-sm`}>Quantity: {item.quantity}</p>
    <p className={`${houseStyle.text} text-sm`}>Rarity: {item.item.rarity}/5</p>
    <p className={`${houseStyle.text} text-sm`}>Cost: {item.item.cost_galleons} Galleons, {item.item.cost_gems} Gems</p>
    <p className={`${houseStyle.text} text-sm mt-2`}>{item.item.description}</p>
    {item.item.image_url && (
      <img
        src={item.item.image_url}
        alt={item.item.name}
        className="mt-4 rounded-lg max-w-full h-auto"
      />
    )}
    {(item.item.item_type === 'THEME' || item.item.item_type === 'ACCESSORY') && (
      <button
        onClick={() => onUse(item.item.id)}
        className={`mt-4 px-4 py-2 rounded-lg bg-amber-500 text-white hover:bg-amber-600 ${houseStyle.text}`}
      >
        Use Item
      </button>
    )}
  </div>
);

interface InventoryPageProps {
  user: User;
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000';

const InventoryPage: React.FC<InventoryPageProps> = ({ user }) => {
  const [mounted, setMounted] = useState(false);
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setMounted(true);
    const fetchInventory = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        if (!token) {
          throw new Error('No access token found');
        }
        const response = await axios.get<InventoryItem[]>(`${API_BASE_URL}/game/inventory/me/`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setInventory(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching inventory:", error);
        setLoading(false);
      }
    };
    fetchInventory();
  }, []);

  const handleUseItem = async (itemId: number) => {
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        throw new Error('No access token found');
      }
      await axios.patch(`${API_BASE_URL}/api/profiles/me/`, {
        active_theme: itemId, // Simplified, adjust based on item type
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      // Refresh user profile
      const response = await axios.get(`${API_BASE_URL}/api/profiles/me/`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const updatedUser: User = {
        ...user,
        active_theme: response.data.active_theme,
        active_accessories: response.data.active_accessories,
      };
      // Note: Update user state in App.tsx for global effect
      console.log("Item used:", updatedUser);
    } catch (error) {
      console.error("Error using item:", error);
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
        Loading inventory...
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
              Your Inventory, {user.wizardName}
            </h1>
            <div className="absolute -top-4 -right-4 animate-spin-slow">
              <Sparkles className="text-amber-400" size={32} />
            </div>
          </div>
          <p className="text-2xl text-amber-200 italic font-light tracking-wide">
            Treasures of a Wizard
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {inventory.length === 0 ? (
            <p className="text-center text-amber-200 col-span-full">
              Your inventory is empty. Embark on quests to collect magical items!
            </p>
          ) : (
            inventory.map((item, index) => (
              <InventoryCard
                key={item.id}
                item={item}
                houseStyle={currentHouseStyle}
                delay={`${300 + index * 100}ms`}
                onUse={handleUseItem}
              />
            ))
          )}
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
            icon={Map}
            title="Explore the Map"
            description="Discover hidden locations and secret passages throughout Hogwarts"
            delay="900ms"
          />
        </div>

        <footer className="text-center mt-20 py-8 border-t border-amber-400/20 animate-in" style={{ animationDelay: "1000ms" }}>
          <p className="text-amber-200/60 text-sm tracking-wide">
            Hogwarts Inventory Vault © Ministry of Magic Archives, Restricted Section
          </p>
        </footer>
      </div>
    </div>
  );
};

export default InventoryPage;