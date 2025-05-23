import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import type { User, HogwartsHouse } from '../types'; // Assuming these types are defined
import { Map as MapIcon, Satellite, Mountain, Route, Camera as CameraIcon, UploadCloud, RefreshCw, XCircle, AlertTriangle, FileJson, CheckCircle } from 'lucide-react';

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

// --- CORRECTED AND FINALIZED MARKER_UPLOAD_URL ---
// Ensure this URL is exactly what your backend server is listening on for HTTPS.
const MARKER_UPLOAD_URL = 'https://10.10.114.250:3000/uploadMarker';
// Double-check for any typos or hidden characters in the line above.

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
  const platformRef = useRef<H.service.Platform | null>(null);
  const mapInstanceRef = useRef<H.Map | null>(null);
  const markerRef = useRef<H.map.Marker | null>(null);
  const defaultLayersRef = useRef<H.service.DefaultLayers | null>(null);
  const uiRef = useRef<H.ui.UI | null>(null);
  const isMapActiveRef = useRef<boolean>(false);

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

  useEffect(() => { 
    if (!HERE_API_KEY || !HERE_API_KEY.startsWith('fni7yJt1UNpagDbFd68KWE')) { 
      setLocationError((prev) => (prev ? prev + "\n" : "") + 'Configuration error: HERE API key seems incorrect or missing.'); 
      return;
    }
    if (!mapRef.current || mapInstanceRef.current) return;

    const platform = new H.service.Platform({ apikey: HERE_API_KEY });
    platformRef.current = platform;
    const layers = platform.createDefaultLayers();
    defaultLayersRef.current = layers;
    const initialCenterLat = latitude ?? user.current_latitude ?? 51.5074;
    const initialCenterLng = longitude ?? user.current_longitude ?? -0.1278;
    const map = new H.Map(
      mapRef.current, layers.vector.normal.map,
      {
        zoom: (latitude && longitude) ? 15 : 13,
        center: { lat: initialCenterLat, lng: initialCenterLng },
        pixelRatio: window.devicePixelRatio || 1,
      }
    );
    mapInstanceRef.current = map;
    new H.mapevents.Behavior(new H.mapevents.MapEvents(map));
    const ui = H.ui.UI.createDefault(map, layers);
    uiRef.current = ui;
    isMapActiveRef.current = true;
    const resizeTimer = setTimeout(() => {
      if (isMapActiveRef.current && mapInstanceRef.current?.getViewPort()?.resize) {
        mapInstanceRef.current.getViewPort().resize();
      }
    }, 200);
    return () => {
      clearTimeout(resizeTimer);
      isMapActiveRef.current = false;
      uiRef.current?.dispose(); uiRef.current = null;
      mapInstanceRef.current?.dispose(); mapInstanceRef.current = null;
    };
  }, [HERE_API_KEY, user.current_latitude, user.current_longitude]); 

  useEffect(() => { 
    const handleResize = () => {
      if (isMapActiveRef.current && mapInstanceRef.current?.getViewPort()?.resize) {
        mapInstanceRef.current.getViewPort().resize();
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => { 
    if (!isMapActiveRef.current || !mapInstanceRef.current || !defaultLayersRef.current) return;
    const map = mapInstanceRef.current;
    const layers = defaultLayersRef.current;
    if (latitude !== null && longitude !== null) {
      map.setCenter({ lat: latitude, lng: longitude });
      if (markerRef.current) {
        markerRef.current.setGeometry({ lat: latitude, lng: longitude });
      } else {
        markerRef.current = new H.map.Marker({ lat: latitude, lng: longitude });
        map.addObject(markerRef.current);
      }
    } else if (markerRef.current) {
      map.removeObject(markerRef.current);
      markerRef.current = null;
    }
    let newLayer: H.map.layer.Layer | undefined;
    switch (currentMapView) {
      case 'satellite': newLayer = layers.raster.satellite.map; break;
      case 'terrain': newLayer = layers.raster.terrain.map; break;
      default: newLayer = layers.vector.normal.map; break;
    }
    if (newLayer && map.getBaseLayer() !== newLayer) map.setBaseLayer(newLayer);
  }, [latitude, longitude, currentMapView]);

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
            setUploadMarkerError(`Error playing video stream: ${e.message}. Autoplay might be blocked.`);
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
        image : payload.image.substring(0, 150) + (payload.image.length > 150 ? "..." : ""),
        image_length_chars: payload.image.length,
    };
    setDebugPayload(JSON.stringify(payloadForDisplay, null, 2));

    // Log the URL that will be used by Axios
    console.log('[handleSubmitMarker] Axios will attempt to POST to this URL:', MARKER_UPLOAD_URL);
    console.log("Payload (preview):", payloadForDisplay);

    // Pre-flight check of the URL string before Axios uses it
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
      setUploadMarkerSuccess(`Landmark uploaded! Server: ${JSON.stringify(response.data)}`);
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
        msg = `No response received from server at ${MARKER_UPLOAD_URL}. Possible causes:
        1. Backend server is down or not reachable at this exact URL.
        2. CORS misconfiguration on the backend (check backend logs & browser Network tab for OPTIONS request failures).
        3. Network issue (firewall, DNS, proxy).
        4. Incorrect backend URL (protocol HTTP/HTTPS, domain, port, path).
        Ensure backend is running, accessible, and CORS allows requests from ${window.location.origin}.`;
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
        case 'primary': colors = `${currentHouseStyle.accent.replace('text-','bg-')} ${houseAccentIsDark ? 'text-amber-50' : 'text-slate-900'} hover:opacity-90`; break;
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
        {!MARKER_UPLOAD_URL.startsWith('https://') && IS_FRONTEND_SECURE_CONTEXT && ( 
             <div className="mb-4 p-3 rounded-lg border-2 border-orange-500 bg-orange-700 bg-opacity-30 text-orange-200 flex items-start">
                <AlertTriangle size={32} className="mr-3 mt-1 text-orange-400 flex-shrink-0" />
                <div className="flex-grow">
                    <h3 className="font-semibold">Configuration Notice: Landmark Upload URL</h3>
                    <p className="text-sm">
                        The landmark upload URL (<code>{MARKER_UPLOAD_URL}</code>) is configured to use HTTP, 
                        but this frontend page is served over HTTPS. Browsers may block these requests ("mixed content").
                        Please ensure your <code>MARKER_UPLOAD_URL</code> uses HTTPS.
                    </p>
                </div>
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

          <div ref={mapRef} className="relative w-full h-[300px] sm:h-[400px] md:h-[450px] rounded-lg overflow-hidden border border-gray-700 shadow-inner" aria-label="Interactive map">
             {(!latitude || !longitude) && !locationError && !isMapActiveRef.current && (<div className="absolute inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75"><p className="text-amber-200 text-lg">Initializing map & acquiring location...</p></div>)}
             {(!latitude || !longitude) && !locationError && isMapActiveRef.current && (<div className="absolute inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75"><p className="text-amber-200 text-lg">Map ready. Acquiring location...</p></div>)}
             {locationError && !latitude && !longitude && (<div className="absolute inset-0 flex items-center justify-center bg-red-900 bg-opacity-50 p-4"><p className="text-red-200 text-center text-lg">Could not acquire location to initialize map. Please check permissions.</p></div>)}
          </div>

          <div className={`mt-8 pt-6 border-t-2 ${currentHouseStyle.border} border-opacity-30`}>
            <h2 className={`text-2xl font-semibold mb-4 text-center ${currentHouseStyle.text}`}>Add New Landmark</h2>
            <canvas ref={canvasRef} style={{ display: 'none' }}></canvas>

            {!isCameraVisible && !capturedImage && (
              <button 
                onClick={openCamera} 
                disabled={!latitude || !longitude || isUploadingMarker || !IS_FRONTEND_SECURE_CONTEXT} 
                className={actionButtonClass('primary', true)}
                title={!IS_FRONTEND_SECURE_CONTEXT ? "Camera disabled: Requires HTTPS or localhost" : (!latitude || !longitude) ? "Waiting for location to enable camera" : "Open camera"}
              >
                <CameraIcon size={18}/>
                <span>
                  {!IS_FRONTEND_SECURE_CONTEXT ? 'Camera Requires HTTPS (Frontend)' : 
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
                    disabled={isUploadingMarker || !MARKER_UPLOAD_URL.startsWith('https://')} 
                    className={actionButtonClass('green', true)}
                    title={!MARKER_UPLOAD_URL.startsWith('https://') ? "Upload disabled: Backend URL is not HTTPS" : (isUploadingMarker ? 'Uploading...' : 'Upload Landmark')}
                  >
                    <UploadCloud size={18}/> 
                    {!MARKER_UPLOAD_URL.startsWith('https://') ? 'Backend URL Not HTTPS' : (isUploadingMarker ? 'Uploading...' : 'Upload Landmark')}
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