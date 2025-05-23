export interface User {
  id: number;
  username: string;
  email: string;
  wizardName: string;
  house: 'Gryffindor' | 'Hufflepuff' | 'Ravenclaw' | 'Slytherin' | null;
  xp: number;
  level: number;
  wand: {
    wood: string;
    core: string;
    length: string;
  };
  achievements: number;
  questsCompleted: number;
  currencies: { currency_type: 'GALLEON' | 'GEM' | 'XP'; amount: number }[];
  active_theme?: {
    id: number;
    name: string;
    description: string;
    item_type: 'THEME';
    image_url?: string;
    rarity: number;
    cost_galleons: number;
    cost_gems: number;
  };
  active_accessories: {
    id: number;
    name: string;
    description: string;
    item_type: 'ACCESSORY';
    image_url?: string;
    rarity: number;
    cost_galleons: number;
    cost_gems: number;
  }[];
  current_latitude?: number; // Added
  current_longitude?: number; // Added
}

export interface InventoryItem {
  id: number;
  item: {
    id: number;
    name: string;
    description: string;
    item_type: 'INGREDIENT' | 'POTION' | 'ARTIFACT' | 'SPELL_SCROLL' | 'COLLECTIBLE' | 'WAND' | 'ACCESSORY' | 'THEME';
    image_url?: string;
    rarity: number;
    cost_galleons: number;
    cost_gems: number;
  };
  quantity: number;
}

export interface Quest {
  id: number;
  title: string;
  description: string;
  xp_reward: number;
  galleon_reward: number;
  gem_reward: number;
  item_reward?: InventoryItem['item'];
  min_player_level: number;
  target_location?: {
    id: number;
    name: string;
    description: string;
    latitude: number;
    longitude: number;
    poi_type: string;
    real_world_identifier?: string;
    is_active: boolean;
  };
  is_repeatable: boolean;
  is_active: boolean;
}

export interface QuestProgress {
  id: number;
  quest: Quest;
  status: 'PENDING' | 'ACCEPTED' | 'IN_PROGRESS' | 'COMPLETED' | 'FAILED';
  started_at?: string;
  completed_at?: string;
}

export type HogwartsHouse = 'Gryffindor' | 'Hufflepuff' | 'Ravenclaw' | 'Slytherin';

export type QuestStatus = 'PENDING' | 'ACCEPTED' | 'IN_PROGRESS' | 'COMPLETED' | 'FAILED';