// src/types.ts
export interface User {
  id: number;
  username: string;
  email: string;
  wizardName: string;
}

export type HogwartsHouse = 'Gryffindor' | 'Hufflepuff' | 'Ravenclaw' | 'Slytherin';

// You can also add other shared types here as your app grows
export type QuestStatus = 'PENDING' | 'ACCEPTED' | 'IN_PROGRESS' | 'COMPLETED' | 'FAILED';
// ... and so on for POIType, ItemType, etc. from the data modeling step