// HERE API Utils
const HERE_API_KEY = import.meta.env.VITE_HERE_API_KEY as string;

export const getCurrentPosition = (): Promise<GeolocationPosition> =>
  new Promise((resolve, reject) => {
    if (!navigator.geolocation) reject("Geolocation not supported");
    navigator.geolocation.getCurrentPosition(resolve, reject, { enableHighAccuracy: true });
  });

export const isNearLocation = (
  userLat: number,
  userLng: number,
  targetLat: number,
  targetLng: number,
  radiusMeters = 80
): boolean => {
  // Haversine
  const R = 6371000;
  const dLat = ((targetLat - userLat) * Math.PI) / 180;
  const dLon = ((targetLng - userLng) * Math.PI) / 180;
  const lat1 = (userLat * Math.PI) / 180;
  const lat2 = (targetLat * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.sin(dLon / 2) ** 2 * Math.cos(lat1) * Math.cos(lat2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c;
  return d <= radiusMeters;
};

export const loadHereMapScript = (): Promise<void> =>
  new Promise((resolve, reject) => {
    if (document.getElementById("here-maps-script")) return resolve();
    const script = document.createElement("script");
    script.id = "here-maps-script";
    script.src = `https://js.api.here.com/v3/3.1/mapsjs.bundle.js`;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = reject;
    document.body.appendChild(script);
  });

export const getHereApiKey = () => HERE_API_KEY;