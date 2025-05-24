export type Quest = {
  id: number;
  name: string;
  description: string;
  locations: {
    name: string;
    lat: number;
    lng: number;
    task: string;
  }[];
  reward_points: number;
};
export type Item = {
  id: number;
  name: string;
  cost: number;
  description: string;
};