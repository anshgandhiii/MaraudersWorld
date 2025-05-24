import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import type { User, HogwartsHouse } from '../types';
import {
  Map as MapIcon,
  Satellite,
  Mountain,
  Route,
  Camera as CameraIcon,
  UploadCloud,
  RefreshCw,
  XCircle,
  AlertTriangle,
  FileJson,
  CheckCircle
} from 'lucide-react';

// POI data
import malls from '../data/malls.json';
import hospitals from '../data/hospitals.json';

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

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://maraudersworld.onrender.com';
const HERE_API_KEY = 'fni7yJt1UNpagDbFd68KWE_0mOGAqlvsBWlQG6Kfyxg';
const MARKER_UPLOAD_URL = 'https://10.10.51.160:3000/uploadMarker';

const IS_FRONTEND_SECURE_CONTEXT = window.location.protocol === 'https:' ||
                                 window.location.hostname === 'localhost' ||
                                 window.location.hostname === '127.0.0.1';

const MapPage: React.FC<MapPageProps> = ({ user }) => {
  const [locationError, setLocationError] = useState<string | null>(null);
  const [locationAccuracy, setLocationAccuracy] = useState<number | null>(null);
  const [latitude, setLatitude] = useState<number | null>(user.current_latitude ?? null);
  const [longitude, setLongitude] = useState<number | null>(user.current_longitude ?? null);
  const [currentMapView, setCurrentMapView] = useState<MapViewType>('normal');

  const mapRef = useRef<HTMLDivElement>(null);
  const platformInstanceRef = useRef<H.service.Platform | null>(null);
  const mapInstanceRef = useRef<H.Map | null>(null);
  const uiInstanceRef = useRef<H.ui.UI | null>(null);
  const defaultLayersInstanceRef = useRef<H.service.DefaultLayers | null>(null);
  
  const userMarkerRef = useRef<H.map.Marker | null>(null);
  const poiGroupRef = useRef<H.map.Group | null>(null);
  const mapTapListenerRef = useRef<((evt: H.mapevents.Event) => void) | null>(null);

  const [isMapInitialized, setIsMapInitialized] = useState<boolean>(false);

  const [isCameraVisible, setIsCameraVisible] = useState<boolean>(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  const [isUploadingMarker, setIsUploadingMarker] = useState<boolean>(false);
  const [uploadMarkerError, setUploadMarkerError] = useState<string | null>(null);
  const [uploadMarkerSuccess, setUploadMarkerSuccess] = useState<string | null>(null);
  
  const [showSecurityWarning, setShowSecurityWarning] = useState<boolean>(!IS_FRONTEND_SECURE_CONTEXT);
  const [debugPayload, setDebugPayload] = useState<string | null>(null);

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const updateUserLocationAPI = async (lat: number, lon: number) => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      console.error('No access token found for profile update.');
      setLocationError('Authentication error for profile update: Please log in again');
      return;
    }
    const payload = { current_latitude: lat, current_longitude: lon };
    try {
      await axios.patch(`${API_BASE_URL}/game/profile/`, payload, {
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      });
      console.log('User location updated successfully in DB via main API');
    } catch (error: any) {
      console.error('Error updating user location in DB via main API:', error);
      let msg = 'Failed to save location to main database: ';
      if (error.response) msg += `${error.response.status} ${error.response.data?.detail || error.message}`;
      else msg += `Network error: ${error.message}`;
      setLocationError(msg);
    }
  };
  
  const getLocation = () => {
    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported by your browser.');
      return;
    }
    let initialErrorMsg = null;
    if (!IS_FRONTEND_SECURE_CONTEXT) {
        initialErrorMsg = 'Warning: For reliable location access, this page should be served over HTTPS or from localhost.';
        console.warn(initialErrorMsg);
    }
    setLocationError(initialErrorMsg); 
    setLocationAccuracy(null);
    
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude: lat, longitude: lon, accuracy } = position.coords;
        setLocationError(null);
        setLatitude(lat); setLongitude(lon); setLocationAccuracy(accuracy);
        updateUserLocationAPI(lat, lon);
      },
      (error) => {
        let errorMessage = 'Unable to access device location: ';
        switch (error.code) {
          case error.PERMISSION_DENIED: errorMessage += 'Permission denied. Please enable location access for this site in your browser settings.'; break;
          case error.POSITION_UNAVAILABLE: errorMessage += 'Location information is unavailable. Ensure your device\'s location service is on.'; break;
          case error.TIMEOUT: errorMessage += 'Request timed out.'; break;
          default: errorMessage += `An unknown error occurred (Code: ${error.code}).`;
        }
        if (!IS_FRONTEND_SECURE_CONTEXT && error.code === error.PERMISSION_DENIED) {
            errorMessage += ' This is likely because the page is not served over HTTPS.';
        }
        setLocationError(errorMessage);
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 }
    );
  };

  useEffect(() => { getLocation(); }, []);

  // Map initialization
  useEffect(() => {
    if (!mapRef.current || !HERE_API_KEY) {
      if (!HERE_API_KEY) setLocationError("HERE API Key is missing. Map cannot be initialized.");
      return;
    }
    if (mapInstanceRef.current) return;
    
    console.log("MapPage: Starting map initialization...");
    setIsMapInitialized(false);

    const platform = new H.service.Platform({ apikey: HERE_API_KEY });
    platformInstanceRef.current = platform;

    const defaultLayers = platform.createDefaultLayers();
    defaultLayersInstanceRef.current = defaultLayers;

    const initialCenterLat = latitude ?? user.current_latitude ?? 51.5074;
    const initialCenterLng = longitude ?? user.current_longitude ?? -0.1278;
    const initialZoom = (latitude && longitude) || (user.current_latitude && user.current_longitude) ? 15 : 13;

    try {
      const map = new H.Map(
        mapRef.current,
        defaultLayers.vector.normal.map,
        {
          zoom: initialZoom,
          center: { lat: initialCenterLat, lng: initialCenterLng },
          pixelRatio: window.devicePixelRatio || 1,
        }
      );
      mapInstanceRef.current = map;
      new H.mapevents.Behavior(new H.mapevents.MapEvents(map));
      const ui = H.ui.UI.createDefault(map, defaultLayers);
      uiInstanceRef.current = ui;
      poiGroupRef.current = new H.map.Group();
      map.addObject(poiGroupRef.current);
      setIsMapInitialized(true);
      console.log("MapPage: HERE Map initialized successfully.");

      const resizeTimer = setTimeout(() => {
        if (mapInstanceRef.current) {
          mapInstanceRef.current.getViewPort().resize();
          console.log("MapPage: Initial map resize executed.");
        }
      }, 300);

      return () => {
        console.log("MapPage: Cleaning up map instance (useEffect cleanup).");
        clearTimeout(resizeTimer);
        if (mapTapListenerRef.current && mapInstanceRef.current) {
            mapInstanceRef.current.removeEventListener('tap', mapTapListenerRef.current);
            mapTapListenerRef.current = null;
        }
        if (uiInstanceRef.current) {
          uiInstanceRef.current.dispose();
          uiInstanceRef.current = null;
        }
        if (mapInstanceRef.current) {
          mapInstanceRef.current.dispose();
          mapInstanceRef.current = null;
        }
        platformInstanceRef.current = null;
        defaultLayersInstanceRef.current = null;
        poiGroupRef.current = null;
        userMarkerRef.current = null;
        setIsMapInitialized(false);
      };
    } catch (mapError) {
      console.error("MapPage: Critical error during HERE Map initialization:", mapError);
      setLocationError(`Map failed to initialize: ${mapError instanceof Error ? mapError.message : String(mapError)}. Check console for details.`);
      setIsMapInitialized(false);
    }
  }, [HERE_API_KEY]);

  // Map viewport resize listener
  useEffect(() => {
    const handleResize = () => {
      if (mapInstanceRef.current && isMapInitialized) {
        mapInstanceRef.current.getViewPort().resize();
      }
    };
    window.addEventListener('resize', handleResize);
    return () => { 
        window.removeEventListener('resize', handleResize); 
    };
  }, [isMapInitialized]);

  // Update markers, layers, and map center
  useEffect(() => {
    if (!isMapInitialized || !mapInstanceRef.current || !defaultLayersInstanceRef.current || !uiInstanceRef.current || !poiGroupRef.current) {
      return;
    }
    const map = mapInstanceRef.current;
    const layers = defaultLayersInstanceRef.current;
    const ui = uiInstanceRef.current;
    const currentPoiGroup = poiGroupRef.current;

    currentPoiGroup.removeAll();

    malls.forEach((mall: any) => {
      const svg = `<svg width="36" height="36" xmlns="http://www.w3.org/2000/svg">
        <rect x="5" y="10" width="26" height="18" rx="5" fill="#fbbf24" stroke="#b45309" strokeWidth="2"/>
        <path d="M10 18q2-8 8-8t8 8" stroke="#b45309" strokeWidth="2" fill="none"/>
        <circle cx="18" cy="26" r="2" fill="#b45309"/>
      </svg>`;
      try {
        const icon = new H.map.Icon(svg, { anchor: { x: 18, y: 30 } });
        const marker = new H.map.Marker({ lat: mall.lat, lng: mall.lng }, { icon });
        marker.setData(`<div class="text-yellow-900 font-semibold">Mall:<br/>${mall.name}</div>`);
        currentPoiGroup.addObject(marker);
      } catch (iconError) {
        console.error("Error creating mall icon/marker:", iconError, mall.name);
      }
    });

    hospitals.forEach((hospital: any) => {
      const svg = `<svg width="36" height="36" xmlns="http://www.w3.org/2000/svg">
        <rect x="6" y="10" width="24" height="18" rx="4" fill="#34d399" stroke="#065f46" strokeWidth="2"/>
        <rect x="16" y="14" width="4" height="10" fill="#065f46"/>
        <rect x="12" y="18" width="12" height="4" fill="#065f46"/>
      </svg>`;
       try {
        const icon = new H.map.Icon(svg, { anchor: { x: 18, y: 30 } });
        const marker = new H.map.Marker({ lat: hospital.lat, lng: hospital.lng }, { icon });
        marker.setData(`<div class="text-green-900 font-semibold">Hospital:<br/>${hospital.name}</div>`);
        currentPoiGroup.addObject(marker);
      } catch (iconError) {
        console.error("Error creating hospital icon/marker:", iconError, hospital.name);
      }
    });

    if (latitude !== null && longitude !== null) {
      const userPos = { lat: latitude, lng: longitude };
      if (userMarkerRef.current) {
        userMarkerRef.current.setGeometry(userPos);
      } else {
        const svg = `<svg width="38" height="38" xmlns="http://www.w3.org/2000/svg">
          <circle cx="19" cy="19" r="13" fill="#2563eb" stroke="#fff" strokeWidth="5"/>
          <circle cx="19" cy="19" r="6" fill="#60a5fa" stroke="#2563eb" strokeWidth="2"/>
        </svg>`;
        try {
            const icon = new H.map.Icon(svg, { anchor: { x: 19, y: 19 } });
            userMarkerRef.current = new H.map.Marker(userPos, { icon });
            userMarkerRef.current.setData(`<div class="text-blue-900 font-semibold">You (${user.wizardName})</div>`);
            map.addObject(userMarkerRef.current);
        } catch (iconError) {
            console.error("Error creating user marker icon:", iconError);
        }
      }
      map.setCenter(userPos, true);
    } else if (userMarkerRef.current) {
      map.removeObject(userMarkerRef.current);
      userMarkerRef.current = null;
    }

    if (!mapTapListenerRef.current) {
        const tapListener = (evt: H.mapevents.Event) => {
            const target = evt.target;
            if (target instanceof H.map.Marker && target.getData()) {
                ui.getBubbles().forEach(bubble => ui.removeBubble(bubble));
                const bubble = new H.ui.InfoBubble(target.getGeometry() as H.geo.Point, {
                content: target.getData()
                });
                ui.addBubble(bubble);
            }
        };
        map.addEventListener('tap', tapListener);
        mapTapListenerRef.current = tapListener;
    }

    let newLayer: H.map.layer.Layer | undefined;
    switch (currentMapView) {
      case 'satellite': newLayer = layers.raster.satellite.map; break;
      case 'terrain': newLayer = layers.raster.terrain.map; break;
      default: newLayer = layers.vector.normal.map; break;
    }
    if (newLayer && map.getBaseLayer() !== newLayer) {
        map.setBaseLayer(newLayer);
    }
  }, [isMapInitialized, latitude, longitude, currentMapView, user.wizardName]);

  const openCamera = async () => {
    setCapturedImage(null); setUploadMarkerError(null); setUploadMarkerSuccess(null);
    setIsCameraVisible(false); 
    setDebugPayload(null);
    if (!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia)) {
      setUploadMarkerError("Camera features (getUserMedia API) are not supported by this browser.");
      return;
    }
    if (!IS_FRONTEND_SECURE_CONTEXT) {
      setUploadMarkerError("Security Error: Camera access requires this page to be served over HTTPS or from localhost.");
      setShowSecurityWarning(true); 
      return; 
    }
    let stream = null;
    try {
      stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
    } catch (err: any) {
      if (["NotFoundError", "OverconstrainedError", "NotReadableError", "TypeError"].includes(err.name)) {
        console.warn("Environment camera failed, trying default camera:", err);
        try {
          stream = await navigator.mediaDevices.getUserMedia({ video: true }); 
        } catch (fallbackErr: any) {
          let msg = `Camera access error: ${fallbackErr.name}. `;
          if (fallbackErr.name === "NotFoundError") msg += "No camera found.";
          else if (fallbackErr.name === "NotAllowedError") msg += "Permission denied. Check browser settings.";
          else msg += fallbackErr.message;
          setUploadMarkerError(msg); return;
        }
      } else if (err.name === "NotAllowedError") {
         setUploadMarkerError("Permission to use camera was denied by you or browser settings."); return;
      } else {
        setUploadMarkerError(`Unexpected camera error: ${err.name} - ${err.message}.`); return;
      }
    }
    if (stream) {
        setCameraStream(stream); setIsCameraVisible(true); setUploadMarkerError(null); 
    } else { 
        setUploadMarkerError("Could not initialize camera stream. Ensure camera is available and not in use.");
    }
  };
  
  useEffect(() => { 
    if (isCameraVisible && cameraStream && videoRef.current) {
        videoRef.current.srcObject = cameraStream;
        videoRef.current.play().catch(e => {
            console.error("Error playing video stream:", e);
            setUploadMarkerError(`Error playing video stream: ${e.message}. Autoplay might be blocked or camera busy.`);
            closeCamera();
        });
    }
  }, [isCameraVisible, cameraStream]);

  const closeCamera = () => {
    if (cameraStream) cameraStream.getTracks().forEach(track => track.stop());
    setCameraStream(null); setIsCameraVisible(false);
    if (videoRef.current) videoRef.current.srcObject = null;
  };

  const takePicture = () => {
    if (videoRef.current && canvasRef.current && cameraStream) {
      const video = videoRef.current; const canvas = canvasRef.current;
      canvas.width = video.videoWidth; canvas.height = video.videoHeight;
      const context = canvas.getContext('2d');
      if (context) {
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        setCapturedImage(canvas.toDataURL('image/jpeg', 0.85));
        closeCamera();
      } else setUploadMarkerError("Failed to get canvas context for image capture.");
    } else setUploadMarkerError("Camera not ready or stream unavailable for capture.");
  };

  const handleRetake = () => { setCapturedImage(null); setDebugPayload(null); openCamera(); };
  const discardPicture = () => { setCapturedImage(null); setUploadMarkerError(null); setUploadMarkerSuccess(null); setDebugPayload(null);};

  const handleSubmitMarker = async () => {
    if (!latitude || !longitude) { 
      setUploadMarkerError("Current location not available. Please refresh location first."); return; 
    }
    if (!capturedImage) { 
      setUploadMarkerError("No image captured. Please take a photo first."); return; 
    }
    setIsUploadingMarker(true); 
    setUploadMarkerError(null); 
    setUploadMarkerSuccess(null);
    setDebugPayload(null);
    
    const parts = capturedImage.split(',');
    if (parts.length !== 2 || !parts[1]) {
        setUploadMarkerError("Invalid image data. Could not extract Base64 content.");
        setIsUploadingMarker(false); return;
    }
    const base64ImageOnly = parts[1]; 
    const payload = { 
        lat: parseFloat(latitude.toFixed(5)), 
        lon: parseFloat(longitude.toFixed(5)), 
        image: base64ImageOnly 
    };
    const payloadForDisplay = {
        lat: payload.lat,
        lon: payload.lon,
        image : payload.image.substring(0, 100) + (payload.image.length > 100 ? "..." : ""),
        image_length_chars: payload.image.length,
    };
    setDebugPayload(JSON.stringify(payloadForDisplay, null, 2));

    console.log('[handleSubmitMarker] Axios will attempt to POST to this URL:', MARKER_UPLOAD_URL);
    console.log("Payload (preview):", payloadForDisplay);

    if (!MARKER_UPLOAD_URL || typeof MARKER_UPLOAD_URL !== 'string' || !(MARKER_UPLOAD_URL.startsWith('http://') || MARKER_UPLOAD_URL.startsWith('https://'))) {
        const errorMsg = `Configuration Error: MARKER_UPLOAD_URL is malformed or missing. Current value: "${MARKER_UPLOAD_URL}"`;
        console.error(errorMsg);
        setUploadMarkerError(errorMsg);
        setIsUploadingMarker(false);
        return;
    }
    
    try {
      const response = await axios.post(MARKER_UPLOAD_URL, payload, { 
        headers: { 'Content-Type': 'application/json' },
        timeout: 60000,
      });
      console.log('Upload successful:', response.data);
      setUploadMarkerSuccess(`Landmark uploaded! Server response: ${JSON.stringify(response.data)}`);
      setCapturedImage(null);
    } catch (error: any) {
      console.error('Full error object during landmark upload:', error); 
      let msg = 'Failed to upload landmark: ';
      if (error.message && (error.message.toLowerCase().includes('invalid url') || error.message.toLowerCase().includes('failed to construct \'url\''))) {
          msg += `URL Construction Error. The URL "${MARKER_UPLOAD_URL}" is invalid. Please check its format. Details: ${error.message}`;
      } else if (error.code === 'ECONNABORTED') {
        msg += `Request timed out (${(error.config?.timeout || 0) / 1000}s). Check network or server.`;
      } else if (error.response) {
        msg += `Server error ${error.response.status}. Response: ${JSON.stringify(error.response.data) || error.message}`;
      } else if (error.request) {
        // This is where net::ERR_CERT_AUTHORITY_INVALID will often manifest if not handled by browser trust
        msg = `No response received from server at ${MARKER_UPLOAD_URL}. Possible causes:\n1. Backend server is down or not reachable.\n2. CORS misconfiguration on the backend.\n3. Network issue (firewall, DNS, proxy).\n4. SSL Certificate Untrusted: If using HTTPS with an IP and self-signed certificate, ensure your browser has been told to trust it (by visiting the URL directly and bypassing the security warning page). \nEnsure backend is running, accessible, and CORS allows requests from ${window.location.origin}.`;
      } else {
        msg += `Request setup error: ${error.message}`;
      }
      setUploadMarkerError(msg);
    } finally {
      setIsUploadingMarker(false);
    }
  };

  useEffect(() => { 
    return () => { if (cameraStream) cameraStream.getTracks().forEach(track => track.stop()); };
  }, [cameraStream]); 

  const handleManualUpdate = () => getLocation();

  if (!isValidHouse(user.house)) {
    return (
      <div className="min-h-screen flex items-center justify-center text-xl text-amber-200 bg-slate-900">
        No house assigned. Please complete the Sorting Hat quiz.
      </div>
    );
  }

  const currentHouseStyle = houseStyles[user.house] || houseStyles.Default;
  const mapButtonClass = (view: MapViewType) =>
    `px-3 py-1.5 rounded-md text-sm font-medium transition-colors flex items-center space-x-2 ${currentHouseStyle.text} ${currentMapView === view ? `${currentHouseStyle.accent} bg-opacity-20 ring-1 ${currentHouseStyle.border}` : `hover:bg-gray-700 bg-gray-800`}`;

  const actionButtonClass = (colorStyle: 'primary' | 'green' | 'yellow' | 'red' = 'primary', fullWidth: boolean = false) => {
    let colors = '';
    const houseAccentIsDark = user.house === 'Hufflepuff';
    switch (colorStyle) {
        case 'primary':
            colors = `${currentHouseStyle.accent.replace('text-','bg-')} ${houseAccentIsDark ? 'text-amber-50' : 'text-slate-900'} hover:opacity-90`;
            break;
        case 'green': colors = 'bg-green-600 hover:bg-green-500 text-white'; break;
        case 'yellow': colors = 'bg-yellow-500 hover:bg-yellow-400 text-slate-900'; break;
        case 'red': colors = 'bg-red-600 hover:bg-red-500 text-white'; break;
    }
    return `px-4 py-2 rounded-lg transition-colors flex items-center justify-center space-x-2 text-sm font-medium disabled:opacity-60 disabled:cursor-not-allowed ${fullWidth ? 'w-full' : ''} ${colors}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-gray-900 to-stone-950 text-amber-50 relative overflow-hidden">
      <div className="relative z-10 p-4 sm:p-6 lg:p-8">
        {showSecurityWarning && ( 
            <div className="mb-4 p-3 rounded-lg border-2 border-yellow-500 bg-yellow-700 bg-opacity-30 text-yellow-200 flex items-start">
                <AlertTriangle size={32} className="mr-3 mt-1 text-yellow-400 flex-shrink-0" />
                <div className="flex-grow">
                    <h3 className="font-semibold">Security Recommendation for Device Features</h3>
                    <p className="text-sm">
                        To use features like the camera and ensure reliable location access, this page (frontend)
                        should be served over a secure (HTTPS) connection or from localhost. You are currently on
                        an insecure connection: <strong>{window.location.protocol}//{window.location.host}</strong>.
                        Camera access will be disabled.
                    </p>
                </div>
                <button onClick={() => setShowSecurityWarning(false)} className="ml-2 p-1 text-yellow-300 hover:text-yellow-100">
                    <XCircle size={20}/>
                </button>
            </div>
        )}
        
        <header className="text-center mb-8 animate-in fade-in slide-in-from-top-8">
          <h1 className={`text-4xl sm:text-5xl font-bold ${currentHouseStyle.text} bg-clip-text drop-shadow-2xl mb-3`}>
            Explore the Map, {user.wizardName}
          </h1>
          <p className="text-lg sm:text-xl text-amber-200 italic">
            Discover magical locations around Hogwarts
          </p>
        </header>

        {locationError && (
          <div className={`mb-6 p-3 rounded-lg border-2 ${currentHouseStyle.border} bg-gradient-to-r ${currentHouseStyle.bg} ${currentHouseStyle.glow} animate-in`}>
            <p className={`${currentHouseStyle.text} text-center text-sm sm:text-base whitespace-pre-line`}>{locationError}</p>
          </div>
        )}

        <div className={`relative rounded-2xl p-4 sm:p-6 shadow-2xl border-2 ${currentHouseStyle.border} bg-gradient-to-r ${currentHouseStyle.bg} ${currentHouseStyle.glow} animate-in`}>
          <div className="mb-4 text-center">
            <div className="flex items-center justify-center mb-2">
              <MapIcon size={32} className={`${currentHouseStyle.accent} mr-2`} />
              <div>
                <p className={`${currentHouseStyle.text} text-base sm:text-lg`}>
                  Current Location: {latitude && longitude ? `(${latitude.toFixed(4)}, ${longitude.toFixed(4)})` : 'Acquiring / Not available'}
                </p>
                {locationAccuracy !== null && (<p className={`${currentHouseStyle.text} text-xs sm:text-sm`}>Accuracy: ~{locationAccuracy.toFixed(0)} meters</p>)}
                <p className={`${currentHouseStyle.text} text-xs italic opacity-70`}>DB: ({user.current_latitude?.toFixed(4) ?? 'N/A'}, {user.current_longitude?.toFixed(4) ?? 'N/A'})</p>
              </div>
            </div>
            <button onClick={handleManualUpdate} className={`mt-3 px-4 py-1.5 rounded-lg ${currentHouseStyle.accent} bg-gray-800 hover:bg-gray-700 transition-colors text-sm sm:text-base`}>Refresh Location</button>
          </div>

          <div className="mb-3 flex justify-center space-x-2 sm:space-x-3">
            <button onClick={() => setCurrentMapView('normal')} className={mapButtonClass('normal')}><Route size={18}/> <span>Normal</span></button>
            <button onClick={() => setCurrentMapView('satellite')} className={mapButtonClass('satellite')}><Satellite size={18}/> <span>Satellite</span></button>
            <button onClick={() => setCurrentMapView('terrain')} className={mapButtonClass('terrain')}><Mountain size={18}/> <span>Terrain</span></button>
          </div>

          <div ref={mapRef} className="relative w-full h-[350px] sm:h-[450px] md:h-[500px] rounded-lg overflow-hidden border border-gray-700 shadow-inner" aria-label="Interactive map">
             {!isMapInitialized && !locationError && (<div className="absolute inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75"><p className="text-amber-200 text-lg">Initializing map...</p></div>)}
             {isMapInitialized && (!latitude || !longitude) && !locationError && (<div className="absolute inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75"><p className="text-amber-200 text-lg">Map ready. Acquiring location...</p></div>)}
             {locationError && locationError.includes("Map failed to initialize") && (<div className="absolute inset-0 flex items-center justify-center bg-red-900 bg-opacity-60 p-4"><p className="text-red-200 text-center text-lg">{locationError}</p></div>)}
          </div>

          <div className="flex flex-wrap gap-x-4 gap-y-2 justify-center items-center mt-3 text-xs sm:text-sm text-amber-200">
            <span className="inline-flex items-center gap-1">
              <span className="w-5 h-5 inline-block align-middle">
                <svg width="22" height="22"><circle cx="11" cy="11" r="7" fill="#2563eb" stroke="#fff" strokeWidth="3"/><circle cx="11" cy="11" r="3" fill="#60a5fa" stroke="#2563eb" strokeWidth="1.5"/></svg>
              </span>
              You ({user.wizardName})
            </span>
            <span className="inline-flex items-center gap-1">
              <span className="w-5 h-5 inline-block align-middle">
                <svg width="22" height="22"><rect x="4" y="6" width="14" height="10" rx="2" fill="#fbbf24" stroke="#b45309" strokeWidth="1.6"/><path d="M7 12q2-5 4-5t4 5" stroke="#b45309" strokeWidth="1.2" fill="none"/><circle cx="11" cy="15" r="1.2" fill="#b45309"/></svg>
              </span>
              Mall
            </span>
            <span className="inline-flex items-center gap-1">
              <span className="w-5 h-5 inline-block align-middle">
                <svg width="22" height="22"><rect x="5" y="6" width="12" height="10" rx="2" fill="#34d399" stroke="#065f46" strokeWidth="1.6"/><rect x="10" y="9" width="2" height="7" fill="#065f46"/><rect x="7" y="12" width="8" height="2" fill="#065f46"/></svg>
              </span>
              Hospital
            </span>
          </div>
          
          <div className={`mt-8 pt-6 border-t-2 ${currentHouseStyle.border} border-opacity-30`}>
            <h2 className={`text-2xl font-semibold mb-4 text-center ${currentHouseStyle.text}`}>Add New Landmark</h2>
            <canvas ref={canvasRef} style={{ display: 'none' }}></canvas>

            {!isCameraVisible && !capturedImage && (
              <button 
                onClick={openCamera} 
                disabled={!latitude || !longitude || isUploadingMarker || !IS_FRONTEND_SECURE_CONTEXT || !isMapInitialized} 
                className={actionButtonClass('primary', true)}
                title={!isMapInitialized ? "Map not ready" : !IS_FRONTEND_SECURE_CONTEXT ? "Camera disabled: Requires HTTPS or localhost for frontend" : (!latitude || !longitude) ? "Waiting for location to enable camera" : "Open camera"}
              >
                <CameraIcon size={18}/>
                <span>
                  {!isMapInitialized ? 'Waiting for Map...' :
                   !IS_FRONTEND_SECURE_CONTEXT ? 'Camera Requires Secure Page (HTTPS)' : 
                   (!latitude || !longitude) ? 'Acquiring Location for Camera...' : 'Open Camera to Add Landmark'}
                </span>
              </button>
            )}
            
            {isCameraVisible && (
              <div className="space-y-3">
                <video ref={videoRef} autoPlay playsInline muted className="w-full h-auto max-h-[300px] sm:max-h-[400px] rounded-lg border border-gray-600 bg-black object-contain"></video>
                <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                  <button onClick={takePicture} className={actionButtonClass('green', true)}><CameraIcon size={18}/> Snap Photo</button>
                  <button onClick={closeCamera} className={actionButtonClass('red', true)}><XCircle size={18}/> Cancel</button>
                </div>
              </div>
            )}

            {capturedImage && !isCameraVisible && (
              <div className="space-y-3">
                <img src={capturedImage} alt="Captured preview" className="w-full h-auto max-h-[300px] sm:max-h-[400px] object-contain rounded-lg border border-gray-600 bg-gray-800"/>
                <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                  <button 
                    onClick={handleSubmitMarker} 
                    disabled={isUploadingMarker || !isMapInitialized} 
                    className={actionButtonClass('green', true)}
                    title={!isMapInitialized ? "Map not ready for upload" : (isUploadingMarker ? 'Uploading...' : 'Upload Landmark')}
                  >
                    <UploadCloud size={18}/> 
                    {isUploadingMarker ? 'Uploading...' : 'Upload Landmark'}
                  </button>
                  <button onClick={handleRetake} disabled={isUploadingMarker} className={actionButtonClass('yellow', true)}>
                    <RefreshCw size={18}/> Retake Photo
                  </button>
                </div>
                <button onClick={discardPicture} disabled={isUploadingMarker} className={actionButtonClass('red', true)}>
                   <XCircle size={18}/> Discard Photo
                </button>
              </div>
            )}

            {debugPayload && (
                <div className={`mt-4 p-3 rounded-lg border ${currentHouseStyle.border} bg-slate-800 shadow-md`}>
                    <h4 className={`text-sm font-semibold mb-2 ${currentHouseStyle.accent} flex items-center`}>
                        <FileJson size={16} className="mr-2" /> Debug: Payload to be Sent (Preview)
                    </h4>
                    <pre className="text-xs text-slate-300 bg-slate-700 p-2 rounded overflow-x-auto whitespace-pre-wrap break-all max-h-48">
                        {debugPayload}
                    </pre>
                </div>
            )}

            {uploadMarkerError && (
                <div className={`mt-3 p-3 rounded-lg border-2 border-red-600 bg-red-900 bg-opacity-40 text-red-200 text-sm whitespace-pre-line shadow-md flex items-start`}>
                    <AlertTriangle size={20} className="mr-2 mt-px text-red-400 flex-shrink-0"/>
                    <span>{uploadMarkerError}</span>
                </div>
            )}
            {uploadMarkerSuccess && (
                <div className={`mt-3 p-3 rounded-lg border-2 border-green-600 bg-green-900 bg-opacity-40 text-green-200 text-sm whitespace-pre-line shadow-md flex items-start`}>
                    <CheckCircle size={20} className="mr-2 mt-px text-green-400 flex-shrink-0"/>
                    <span>{uploadMarkerSuccess}</span>
                </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapPage;