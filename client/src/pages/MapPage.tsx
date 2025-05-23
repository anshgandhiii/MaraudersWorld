import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import type { User, HogwartsHouse } from '../types'; // Assuming these types are defined
import { Map as MapIcon, Satellite, Mountain, Route, Camera as CameraIcon, UploadCloud, RefreshCw, XCircle } from 'lucide-react';

export const houseStyles = {
  Gryffindor: {
    bg: 'from-red-900 via-red-800 to-red-900',
    text: 'text-yellow-200',
    border: 'border-yellow-400',
    accent: 'text-yellow-400', // Used for primary action button text color
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
    text: 'text-black', // Hufflepuff text is dark
    border: 'border-yellow-900',
    accent: 'text-yellow-900', // Hufflepuff accent is dark
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
const HERE_API_KEY = 'fni7yJt1UNpagDbFd68KWE_0mOGAqlvsBWlQG6Kfyxg'; // Replace if this is a placeholder
const MARKER_UPLOAD_URL = 'http://172.26.193.59:3000/uploadMarker';

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

  // New state for camera and image upload
  const [isCameraVisible, setIsCameraVisible] = useState<boolean>(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  const [isUploadingMarker, setIsUploadingMarker] = useState<boolean>(false);
  const [uploadMarkerError, setUploadMarkerError] = useState<string | null>(null);
  const [uploadMarkerSuccess, setUploadMarkerSuccess] = useState<string | null>(null);

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

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
      return;
    }
    setLocationError(null); setLocationAccuracy(null);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude: lat, longitude: lon, accuracy } = position.coords;
        setLatitude(lat); setLongitude(lon); setLocationAccuracy(accuracy);
        updateUserLocationAPI(lat, lon);
      },
      (error) => {
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

  useEffect(() => { getLocation(); }, []);

  useEffect(() => {
    if (!HERE_API_KEY) {
      setLocationError('Configuration error: HERE API key is missing.'); return;
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
      if (isMapActiveRef.current && mapInstanceRef.current?.getViewPort()) {
        mapInstanceRef.current.getViewPort().resize();
      }
    }, 150);

    return () => {
      clearTimeout(resizeTimer);
      isMapActiveRef.current = false;
      uiRef.current?.dispose(); uiRef.current = null;
      mapInstanceRef.current?.dispose(); mapInstanceRef.current = null;
    };
  }, [HERE_API_KEY]); // Depends only on API_KEY for initial setup

  useEffect(() => {
    const handleResize = () => {
      if (isMapActiveRef.current && mapInstanceRef.current?.getViewPort()) {
        mapInstanceRef.current.getViewPort().resize();
      }
    };
    window.addEventListener('resize', handleResize);
    const initialResizeTimer = setTimeout(handleResize, 200);
    return () => { clearTimeout(initialResizeTimer); window.removeEventListener('resize', handleResize); };
  }, []);

  useEffect(() => {
    if (!isMapActiveRef.current || !mapInstanceRef.current || !defaultLayersRef.current) return;
    const map = mapInstanceRef.current;
    const layers = defaultLayersRef.current;

    if (latitude !== null && longitude !== null) {
      map.setCenter({ lat: latitude, lng: longitude });
      // map.setZoom(15); // Consider if zoom should be reset here
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

  // Camera and Upload Logic
  const openCamera = async () => {
    setCapturedImage(null); setUploadMarkerError(null); setUploadMarkerSuccess(null);
    setIsCameraVisible(false); // Ensure it's false to trigger useEffect for video assignment

    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
        setCameraStream(stream);
        setIsCameraVisible(true); // Show video element area
      } catch (err: any) {
        setUploadMarkerError(`Camera access error: ${err.name} - ${err.message}. Grant permissions and try again.`);
        setIsCameraVisible(false); setCameraStream(null);
      }
    } else {
      setUploadMarkerError("Camera features not supported by your browser.");
    }
  };
  
  useEffect(() => {
    if (isCameraVisible && cameraStream && videoRef.current) {
        videoRef.current.srcObject = cameraStream;
        videoRef.current.play().catch(e => console.error("Error playing video:", e));
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
        setCapturedImage(canvas.toDataURL('image/jpeg', 0.8));
        closeCamera();
      } else setUploadMarkerError("Failed to get canvas context.");
    } else setUploadMarkerError("Camera not ready for capture.");
  };

  const handleRetake = () => { setCapturedImage(null); openCamera(); };
  const discardPicture = () => { setCapturedImage(null); setUploadMarkerError(null); setUploadMarkerSuccess(null); };

  const handleSubmitMarker = async () => {
    if (!latitude || !longitude) { setUploadMarkerError("Location not available. Refresh location."); return; }
    if (!capturedImage) { setUploadMarkerError("No image captured. Take a photo."); return; }

    setIsUploadingMarker(true); setUploadMarkerError(null); setUploadMarkerSuccess(null);
    const base64Image = capturedImage.split(',')[1];
    const payload = { lat: latitude, lon: longitude, image: base64Image };

    try {
      const response = await axios.post(MARKER_UPLOAD_URL, payload, {
        headers: { 'Content-Type': 'application/json' },
        timeout: 30000,
      });
      setUploadMarkerSuccess('Landmark uploaded successfully!');
      setCapturedImage(null);
    } catch (error: any) {
      let msg = 'Failed to upload landmark: ';
      if (error.code === 'ECONNABORTED') msg += 'Request timed out.';
      else if (error.response) msg += `${error.response.status} - ${JSON.stringify(error.response.data) || error.message}`;
      else if (error.request) msg += `No response from server. Check network/server at ${MARKER_UPLOAD_URL}.`;
      else msg += `Error: ${error.message}`;
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
    const houseAccentIsDark = user.house === 'Hufflepuff'; // Example, adjust if other houses have dark accents

    switch (colorStyle) {
        case 'primary': // Use house accent color
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
            <p className={`${currentHouseStyle.text} text-center text-sm sm:text-base`}>{locationError}</p>
          </div>
        )}

        <div className={`relative rounded-2xl p-4 sm:p-6 shadow-2xl border-2 ${currentHouseStyle.border} bg-gradient-to-r ${currentHouseStyle.bg} ${currentHouseStyle.glow} animate-in`}>
          <div className="mb-4 text-center">
            <div className="flex items-center justify-center mb-2">
              <MapIcon size={32} className={`${currentHouseStyle.accent} mr-2`} />
              <div>
                <p className={`${currentHouseStyle.text} text-base sm:text-lg`}>
                  Current Location: {latitude && longitude ? `(${latitude.toFixed(4)}, ${longitude.toFixed(4)})` : 'Not retrieved'}
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
             {(!latitude || !longitude) && !locationError && !isMapActiveRef.current && (<div className="absolute inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50"><p className="text-amber-200 text-lg">Initializing map & acquiring location...</p></div>)}
             {(!latitude || !longitude) && !locationError && isMapActiveRef.current && (<div className="absolute inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50"><p className="text-amber-200 text-lg">Map ready. Acquiring location...</p></div>)}
          </div>

          {/* New Landmark Upload Section */}
          <div className={`mt-8 pt-6 border-t-2 ${currentHouseStyle.border} border-opacity-30`}>
            <h2 className={`text-2xl font-semibold mb-4 text-center ${currentHouseStyle.text}`}>Add New Landmark</h2>
            <canvas ref={canvasRef} style={{ display: 'none' }}></canvas>

            {!isCameraVisible && !capturedImage && (
              <button onClick={openCamera} disabled={!latitude || !longitude || isUploadingMarker} className={actionButtonClass('primary', true)}>
                <CameraIcon size={18}/><span>{(!latitude || !longitude) ? 'Waiting for Location...' : 'Open Camera to Add Landmark'}</span>
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
                  <button onClick={handleSubmitMarker} disabled={isUploadingMarker} className={actionButtonClass('green', true)}>
                    <UploadCloud size={18}/> {isUploadingMarker ? 'Uploading...' : 'Upload Landmark'}
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

            {uploadMarkerError && (<p className="mt-3 p-2 rounded bg-red-900/50 border border-red-700 text-red-300 text-center text-sm">{uploadMarkerError}</p>)}
            {uploadMarkerSuccess && (<p className="mt-3 p-2 rounded bg-green-900/50 border border-green-700 text-green-300 text-center text-sm">{uploadMarkerSuccess}</p>)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapPage;