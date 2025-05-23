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
}

export interface InventoryItem {
  id: number;
  item: {
    id: number;
    name: string;
    description: string;
    item_type: 'INGREDIENT' | 'POTION' | 'ARTIFACT' | 'SPELL_SCROLL' | 'COLLECTIBLE';
    image_url?: string;
    rarity: number;
  };
  quantity: number;
}

export type HogwartsHouse = 'Gryffindor' | 'Hufflepuff' | 'Ravenclaw' | 'Slytherin';

export type QuestStatus = 'PENDING' | 'ACCEPTED' | 'IN_PROGRESS' | 'COMPLETED' | 'FAILED';