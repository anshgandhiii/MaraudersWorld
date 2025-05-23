import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import type { User, HogwartsHouse } from '../types';
import { Map as MapIcon, Satellite, Mountain, Route } from 'lucide-react';

export const houseStyles = {
  Gryffindor: {
    bg: 'from-red-900 via-red-800 to-red-900',
    text: 'text-yellow-200',
    border: 'border-yellow-400',
    accent: 'text-yellow-400',
    glow: 'shadow-red-500/30',
  },
  Slytherin: {
    bg: 'from-green-900 via-green-800 to-emerald-900',
    text: 'text-slate-200',
    border: 'border-emerald-400',
    accent: 'text-emerald-300',
    glow: 'shadow-green-500/30',
  },
  Ravenclaw: {
    bg: 'from-blue-900 via-blue-800 to-indigo-900',
    text: 'text-amber-200',
    border: 'border-amber-400',
    accent: 'text-amber-300',
    glow: 'shadow-blue-500/30',
  },
  Hufflepuff: {
    bg: 'from-yellow-700 via-yellow-600 to-amber-700',
    text: 'text-black',
    border: 'border-yellow-900',
    accent: 'text-yellow-900',
    glow: 'shadow-yellow-500/30',
  },
  Default: {
    bg: 'from-gray-900 via-gray-800 to-gray-900',
    text: 'text-amber-200',
    border: 'border-amber-400',
    accent: 'text-amber-400',
    glow: 'shadow-amber-500/30',
  },
};

const isValidHouse = (house: User['house']): house is HogwartsHouse =>
  house !== null && house in houseStyles;

interface MapPageProps {
  user: User;
}

type MapViewType = 'normal' | 'satellite' | 'terrain';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000';
const HERE_API_KEY = 'fni7yJt1UNpagDbFd68KWE_0mOGAqlvsBWlQG6Kfyxg'; // Replace if this is a placeholder

const MapPage: React.FC<MapPageProps> = ({ user }) => {
  const [locationError, setLocationError] = useState<string | null>(null);
  const [locationAccuracy, setLocationAccuracy] = useState<number | null>(null);
  const [latitude, setLatitude] = useState<number | null>(user.current_latitude ?? null);
  const [longitude, setLongitude] = useState<number | null>(user.current_longitude ?? null);
  const [currentMapView, setCurrentMapView] = useState<MapViewType>('normal');

  const mapRef = useRef<HTMLDivElement>(null);
  const platformRef = useRef<H.service.Platform | null>(null);
  const mapInstanceRef = useRef<H.Map | null>(null);
  const markerRef = useRef<H.map.Marker | null>(null);
  const defaultLayersRef = useRef<H.service.DefaultLayers | null>(null);
  const uiRef = useRef<H.ui.UI | null>(null); // Ref for HERE UI instance
  const isMapActiveRef = useRef<boolean>(false); // Ref to track if map is active and component mounted

  const updateUserLocationAPI = async (lat: number, lon: number) => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      console.error('No access token found');
      setLocationError('Authentication error: Please log in again');
      return;
    }
    const payload = { current_latitude: lat, current_longitude: lon };
    try {
      await axios.patch(`${API_BASE_URL}/game/profile/`, payload, {
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      });
      console.log('Location updated successfully in DB');
    } catch (error: any) {
      console.error('Error updating user location in DB:', error);
      let msg = 'Failed to save location to database: ';
      if (error.response) msg += `${error.response.status} ${error.response.data.detail || error.message}`;
      else msg += `Network error: ${error.message}`;
      setLocationError(msg);
    }
  };

  const getLocation = () => {
    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported by your browser.');
      console.error('[GEOLOCATION] Not supported by browser.');
      return;
    }
    setLocationError(null);
    setLocationAccuracy(null);
    console.log('[GEOLOCATION] Requesting location...');

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude: lat, longitude: lon, accuracy } = position.coords;
        console.log('[GEOLOCATION] Retrieved:', { lat, lon, accuracy: `${accuracy.toFixed(2)}m` });
        setLocationError(null);
        setLatitude(lat);
        setLongitude(lon);
        setLocationAccuracy(accuracy);
        updateUserLocationAPI(lat, lon);
      },
      (error) => {
        console.error('[GEOLOCATION] Error:', error.message, 'Code:', error.code);
        let errorMessage = 'Unable to access location: ';
        switch (error.code) {
          case error.PERMISSION_DENIED: errorMessage += 'Permission denied.'; break;
          case error.POSITION_UNAVAILABLE: errorMessage += 'Location information is unavailable.'; break;
          case error.TIMEOUT: errorMessage += 'Request timed out.'; break;
          default: errorMessage += 'An unknown error occurred.';
        }
        setLocationError(errorMessage);
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 }
    );
  };

  // Effect for initial geolocation fetch on mount
  useEffect(() => {
    console.log('[EFFECT Mount] MapPage mounted, fetching initial geolocation.');
    getLocation();
  }, []);

  // Effect for initializing map platform and instance
  useEffect(() => {
    console.log('[EFFECT Map Setup] Triggered. API Key available:', !!HERE_API_KEY);
    if (!HERE_API_KEY) {
      setLocationError('Configuration error: HERE API key is missing.');
      console.error('[EFFECT Map Setup] HERE API key is missing');
      return;
    }
    if (!mapRef.current) {
      console.log('[EFFECT Map Setup] Map ref not available yet for setup.');
      return;
    }
    if (mapInstanceRef.current) {
      console.log('[EFFECT Map Setup] Map instance already exists, skipping re-initialization.');
      return;
    }

    console.log('[EFFECT Map Setup] Initializing HERE Maps platform and map instance...');
    const platform = new H.service.Platform({ apikey: HERE_API_KEY });
    platformRef.current = platform;

    const layers = platform.createDefaultLayers();
    defaultLayersRef.current = layers;

    const initialCenterLat = latitude ?? user.current_latitude ?? 51.5074;
    const initialCenterLng = longitude ?? user.current_longitude ?? -0.1278;

    const map = new H.Map(
      mapRef.current,
      layers.vector.normal.map,
      {
        zoom: (latitude && longitude) ? 15 : 13,
        center: { lat: initialCenterLat, lng: initialCenterLng },
        pixelRatio: window.devicePixelRatio || 1,
      }
    );
    mapInstanceRef.current = map;

    new H.mapevents.Behavior(new H.mapevents.MapEvents(map));
    const ui = H.ui.UI.createDefault(map, layers);
    uiRef.current = ui; // Store UI instance

    isMapActiveRef.current = true; // <<< SET FLAG HERE, after all map objects are created
    console.log('[EFFECT Map Setup] HERE Maps setup complete. Map is active.');

    return () => {
      console.log('[EFFECT Map Setup] Cleanup: Disposing map, UI, and clearing active flag.');
      isMapActiveRef.current = false; // <<< CLEAR FLAG FIRST
      
      if (uiRef.current) {
          uiRef.current.dispose();
          uiRef.current = null;
      }
      if (mapInstanceRef.current) {
        mapInstanceRef.current.dispose();
        mapInstanceRef.current = null;
      }
      // platformRef.current = null; // Platform can often be reused if other maps need it
      // defaultLayersRef.current = null;
    };
  }, [HERE_API_KEY]); // Dependency: API Key

  // Effect for updating map center, marker, and base layer
  useEffect(() => {
    if (!isMapActiveRef.current) { // <<< CHECK FLAG HERE
        console.log('[EFFECT Marker/View] Skipping: Map not active or component unmounting/disposed.');
        return;
    }

    const map = mapInstanceRef.current; // Should be valid if flag is true
    const layers = defaultLayersRef.current; // Should be valid

    // This extra check is belt-and-suspenders, isMapActiveRef should cover it.
    if (!map || !layers) {
        console.log('[EFFECT Marker/View] Map or layers unexpectedly null despite active flag. Exiting.');
        return;
    }

    console.log(
      '[EFFECT Marker/View] Processing. Lat:', latitude?.toFixed(4), 'Lon:', longitude?.toFixed(4),
      'MapView:', currentMapView
    );
    
    if (latitude !== null && longitude !== null) {
      console.log('[EFFECT Marker/View] Valid lat/lon found. Setting center and zoom.');
      map.setCenter({ lat: latitude, lng: longitude });
      map.setZoom(15);

      if (markerRef.current) {
        console.log('[EFFECT Marker/View] Updating existing marker geometry.');
        markerRef.current.setGeometry({ lat: latitude, lng: longitude });
      } else {
        console.log('[EFFECT Marker/View] Creating and adding new marker to map.');
        const newMarker = new H.map.Marker({ lat: latitude, lng: longitude });
        map.addObject(newMarker);
        markerRef.current = newMarker;
      }
    } else {
      console.log('[EFFECT Marker/View] No valid lat/lon. Checking to remove marker.');
      if (markerRef.current) {
        console.log('[EFFECT Marker/View] Removing existing marker from map.');
        map.removeObject(markerRef.current);
        markerRef.current = null;
      }
    }

    let newLayer: H.map.layer.Layer | undefined;
    switch (currentMapView) {
      case 'satellite': newLayer = layers.raster.satellite.map; break;
      case 'terrain': newLayer = layers.raster.terrain.map; break;
      case 'normal': default: newLayer = layers.vector.normal.map; break;
    }

    if (newLayer && map.getBaseLayer() !== newLayer) {
      console.log(`[EFFECT Marker/View] Changing map view to: ${currentMapView}`);
      map.setBaseLayer(newLayer);
    }
  }, [latitude, longitude, currentMapView]);

  const handleManualUpdate = () => {
    console.log('Manual location update triggered');
    getLocation();
  };

  if (!isValidHouse(user.house)) {
    console.warn('Invalid or null house detected:', user.house);
    return (
      <div className="min-h-screen flex items-center justify-center text-xl text-amber-200 bg-slate-900">
        No house assigned. Please complete the Sorting Hat quiz.
      </div>
    );
  }

  const currentHouseStyle = houseStyles[user.house] || houseStyles.Default;

  const mapButtonClass = (view: MapViewType) => 
    `px-3 py-1.5 rounded-md text-sm font-medium transition-colors flex items-center space-x-2 ` +
    `${currentHouseStyle.text} ` +
    `${currentMapView === view 
      ? `${currentHouseStyle.accent} bg-opacity-20 ring-1 ${currentHouseStyle.border}` 
      : `hover:bg-gray-700 bg-gray-800`
    }`;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-gray-900 to-stone-950 text-amber-50 relative overflow-hidden">
      <div className="relative z-10 p-4 sm:p-6 lg:p-8">
        <header className="text-center mb-8 animate-in fade-in slide-in-from-top-8">
          <h1 className={`text-4xl sm:text-5xl font-bold ${currentHouseStyle.text} bg-clip-text drop-shadow-2xl mb-3`}>
            Explore the Map, {user.wizardName}
          </h1>
          <p className="text-lg sm:text-xl text-amber-200 italic">
            Discover magical locations around Hogwarts
          </p>
        </header>

        {locationError && (
          <div
            className={`mb-6 p-3 rounded-lg border-2 ${currentHouseStyle.border} bg-gradient-to-r ${currentHouseStyle.bg} ${currentHouseStyle.glow} animate-in`}
          >
            <p className={`${currentHouseStyle.text} text-center text-sm sm:text-base`}>{locationError}</p>
          </div>
        )}

        <div className={`relative rounded-2xl p-4 sm:p-6 shadow-2xl border-2 ${currentHouseStyle.border} bg-gradient-to-r ${currentHouseStyle.bg} ${currentHouseStyle.glow} animate-in`}>
          <div className="mb-4 text-center">
            <div className="flex items-center justify-center mb-2">
              <MapIcon size={32} className={`${currentHouseStyle.accent} mr-2`} />
              <div>
                <p className={`${currentHouseStyle.text} text-base sm:text-lg`}>
                  Current Location:{' '}
                  {latitude && longitude
                    ? `(${latitude.toFixed(4)}, ${longitude.toFixed(4)})`
                    : 'Not retrieved'}
                </p>
                {locationAccuracy !== null && (
                  <p className={`${currentHouseStyle.text} text-xs sm:text-sm`}>
                    Accuracy: ~{locationAccuracy.toFixed(0)} meters
                  </p>
                )}
                 <p className={`${currentHouseStyle.text} text-xs italic opacity-70`}>
                  DB: ({user.current_latitude?.toFixed(4) ?? 'N/A'}, {user.current_longitude?.toFixed(4) ?? 'N/A'})
                </p>
              </div>
            </div>
            <button
              onClick={handleManualUpdate}
              className={`mt-3 px-4 py-1.5 rounded-lg ${currentHouseStyle.accent} bg-gray-800 hover:bg-gray-700 transition-colors text-sm sm:text-base`}
            >
              Refresh Location
            </button>
          </div>

          <div className="mb-3 flex justify-center space-x-2 sm:space-x-3">
            <button onClick={() => setCurrentMapView('normal')} className={mapButtonClass('normal')}>
                <Route size={18}/> <span>Normal</span>
            </button>
            <button onClick={() => setCurrentMapView('satellite')} className={mapButtonClass('satellite')}>
                <Satellite size={18}/> <span>Satellite</span>
            </button>
            <button onClick={() => setCurrentMapView('terrain')} className={mapButtonClass('terrain')}>
                <Mountain size={18}/> <span>Terrain</span>
            </button>
          </div>

          <div
            ref={mapRef}
            className="relative w-full h-[350px] sm:h-[450px] md:h-[500px] rounded-lg overflow-hidden border border-gray-700 shadow-inner"
            aria-label="Interactive map"
          >
             {(!latitude || !longitude) && !locationError && !isMapActiveRef.current && (
                 <div className="absolute inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
                    <p className="text-amber-200 text-lg">Initializing map & acquiring location...</p>
                 </div>
            )}
             {(!latitude || !longitude) && !locationError && isMapActiveRef.current && (
                 <div className="absolute inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
                    <p className="text-amber-200 text-lg">Map ready. Acquiring location...</p>
                 </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapPage;