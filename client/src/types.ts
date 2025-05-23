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

export type HogwartsHouse = 'Gryffindor' | 'Hufflepuff' | 'Ravenclaw' | 'Slytherin';

export type QuestStatus = 'PENDING' | 'ACCEPTED' | 'IN_PROGRESS' | 'COMPLETED' | 'FAILED';