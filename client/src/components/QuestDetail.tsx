import React, { useState, useRef, useEffect } from "react";
import quests from "../data/quests.json";
import { useParams } from "react-router-dom";
import { getCurrentPosition, isNearLocation, loadHereMapScript, getHereApiKey } from "../utils/here";
import { Sparkles, Camera, Route, MapPin, CheckCircle2 } from "lucide-react";

// Improved color palette
const cardBase = "bg-gradient-to-br from-white via-yellow-50 to-amber-100 border-2 border-amber-400 rounded-2xl shadow-lg";
const titleColor = "text-yellow-800";
const subtitleColor = "text-amber-700";
const bodyText = "text-gray-800";
const completedBg = "bg-green-100 border-green-400";
const completedText = "text-green-900";
const warningText = "text-rose-600";
const buttonPrimary = "bg-amber-500 hover:bg-yellow-400 text-white";
const buttonSecondary = "bg-green-600 hover:bg-green-700 text-white";

const QuestDetail: React.FC = () => {
  const { questId = "1" } = useParams<{ questId: string }>();
  const quest = quests.find((q) => q.id === Number(questId));
  const [completed, setCompleted] = useState<boolean[]>(Array(quest?.locations.length || 0).fill(false));
  const [photoUrls, setPhotoUrls] = useState<(string | null)[]>(Array(quest?.locations.length || 0).fill(null));
  const [currentStep, setCurrentStep] = useState<number | null>(null); // index of current location being attempted
  const [userPos, setUserPos] = useState<{ lat: number; lng: number } | null>(null);
  const [mapReady, setMapReady] = useState(false);
  const [showMap, setShowMap] = useState(false);
  const [arrived, setArrived] = useState(false);
  const [showPhotoModal, setShowPhotoModal] = useState(false);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Reset state on quest change
  useEffect(() => {
    setCompleted(Array(quest?.locations.length || 0).fill(false));
    setPhotoUrls(Array(quest?.locations.length || 0).fill(null));
    setCurrentStep(null);
    setUserPos(null);
    setArrived(false);
    setPhotoPreview(null);
    setShowPhotoModal(false);
    setShowMap(false);
    setMapReady(false);
    setError(null);
  }, [questId]);

  // Show HERE map for routing
  useEffect(() => {
    if (!showMap || currentStep === null || !userPos || !mapReady || !quest) return;
    const H = (window as any).H;
    const loc = quest.locations[currentStep];

    // Clean up previous map
    const old = document.getElementById("here-quest-map");
    if (old) old.innerHTML = "";

    // @ts-ignore
    const platform = new H.service.Platform({ apikey: getHereApiKey() });
    // @ts-ignore
    const defaultLayers = platform.createDefaultLayers();
    // @ts-ignore
    const map = new H.Map(
      document.getElementById("here-quest-map"),
      defaultLayers.vector.normal.map,
      { center: userPos, zoom: 16 }
    );
    // @ts-ignore
    new H.mapevents.Behavior(new H.mapevents.MapEvents(map));
    // @ts-ignore
    H.ui.UI.createDefault(map, defaultLayers);

    // Markers
    // @ts-ignore
    const userMarker = new H.map.Marker(userPos);
    // @ts-ignore
    const locMarker = new H.map.Marker({ lat: loc.lat, lng: loc.lng });
    map.addObject(userMarker);
    map.addObject(locMarker);

    // Routing
    // @ts-ignore
    const router = platform.getRoutingService(null, 8);
    const routingParameters = {
      routingMode: "fast",
      transportMode: "pedestrian",
      origin: `${userPos.lat},${userPos.lng}`,
      destination: `${loc.lat},${loc.lng}`,
      return: "polyline,summary",
    };
    router.calculateRoute(
      routingParameters,
      (result: any) => {
        if (result.routes && result.routes.length) {
          // @ts-ignore
          const route = result.routes[0];
          // @ts-ignore
          route.sections.forEach((section: any) => {
            let linestring = new H.geo.LineString();
            section.polyline.split(";").forEach((pointStr: string) => {
              const [lat, lng] = pointStr.split(",").map(Number);
              linestring.pushLatLngAlt(lat, lng, 0);
            });
            // @ts-ignore
            const routeLine = new H.map.Polyline(linestring, {
              style: { strokeColor: "#fbbf24", lineWidth: 6 }
            });
            map.addObject(routeLine);
          });
        }
      },
      (error: any) => {}
    );
  }, [showMap, userPos, currentStep, mapReady, quest]);

  // Start quest location: fetch user location & show map
  const handleStartLocation = async (idx: number) => {
    setCurrentStep(idx);
    setError(null);
    setArrived(false);
    setPhotoPreview(null);
    setShowPhotoModal(false);
    setShowMap(true);
    try {
      const pos = await getCurrentPosition();
      setUserPos({ lat: pos.coords.latitude, lng: pos.coords.longitude });
      await loadHereMapScript();
      setMapReady(true);
    } catch {
      setError("Could not get your location or load the map.");
      setShowMap(false);
      setCurrentStep(null);
    }
  };

  // Check arrival
  const handleArrived = async () => {
    if (currentStep === null || !quest) return;
    setError(null);
    try {
      const pos = await getCurrentPosition();
      const loc = quest.locations[currentStep];
      if (
        !isNearLocation(pos.coords.latitude, pos.coords.longitude, loc.lat, loc.lng, 80)
      ) {
        setError("You are not close enough to the location yet!");
        return;
      }
      setArrived(true);
      setShowMap(false);
      setShowPhotoModal(true);
    } catch {
      setError("Could not get your current location.");
    }
  };

  // Handle photo upload
  const handlePhotoUpload = async (file: File) => {
    if (currentStep === null || !quest) return;
    setError(null);
    try {
      const pos = await getCurrentPosition();
      const loc = quest.locations[currentStep];
      if (
        !isNearLocation(pos.coords.latitude, pos.coords.longitude, loc.lat, loc.lng, 80)
      ) {
        setError("You are not at the correct location for this task.");
        return;
      }
      const url = URL.createObjectURL(file);
      const newCompleted = [...completed];
      const newPhotoUrls = [...photoUrls];
      newCompleted[currentStep] = true;
      newPhotoUrls[currentStep] = url;
      setCompleted(newCompleted);
      setPhotoUrls(newPhotoUrls);
      setShowPhotoModal(false);
      setPhotoPreview(null);
      setArrived(false);
      setCurrentStep(null);
    } catch {
      setError("Photo upload failed: could not verify your location.");
    }
  };

  if (!quest) return <div className="text-red-600 font-bold text-lg p-6">Quest not found.</div>;

  const allDone = completed.every(Boolean);

  return (
    <div>
      <h2 className={`text-3xl font-extrabold mb-2 ${titleColor}`}>
        {quest.name}
      </h2>
      <p className={`mb-6 text-lg font-medium ${subtitleColor}`}>{quest.description}</p>
      <ul className="space-y-6">
        {quest.locations.map((loc, i) => (
          <li
            key={i}
            className={`${cardBase} p-6 flex flex-col md:flex-row md:items-center md:justify-between`}
          >
            <div className="flex items-center gap-4 mb-2 md:mb-0">
              <Sparkles className="text-yellow-500 drop-shadow" size={28} />
              <div>
                <span className={`font-bold text-lg ${titleColor}`}>{loc.name}</span>
                <p className={`font-medium ${bodyText}`}>{loc.task}</p>
              </div>
            </div>
            <div className="mt-4 md:mt-0 md:ml-6 flex flex-col items-start">
              {completed[i] && photoUrls[i] ? (
                <span className="flex flex-col items-start">
                  <span className={`flex items-center gap-2 px-3 py-1 ${completedBg} rounded ${completedText} font-semibold mb-2`}>
                    <CheckCircle2 className="text-green-500" /> Completed
                  </span>
                  <img
                    src={photoUrls[i]!}
                    alt="Uploaded evidence"
                    className="w-24 h-24 rounded object-cover border-2 border-green-400 shadow-lg"
                  />
                </span>
              ) : currentStep === i && showMap ? (
                <span>
                  <span className="flex items-center gap-2 px-3 py-1 bg-amber-100 border border-amber-400 rounded text-amber-900 font-semibold mb-2">
                    <Route className="animate-bounce" /> Routing to location...
                  </span>
                  <div id="here-quest-map" className="w-72 h-60 rounded border-2 border-amber-200 mb-4 shadow-lg" />
                  <button
                    className={`px-4 py-2 rounded font-bold shadow transition ${buttonSecondary}`}
                    onClick={handleArrived}
                  >
                    <MapPin /> I have arrived!
                  </button>
                  <p className="text-xs mt-2 text-yellow-900 font-semibold">Walk to the location. When you arrive, click <span className="font-bold">“I have arrived!”</span>.</p>
                </span>
              ) : (
                <button
                  className={`flex items-center gap-2 px-4 py-2 rounded font-bold shadow transition ${buttonPrimary}`}
                  onClick={() => handleStartLocation(i)}
                  disabled={completed[i]}
                >
                  <Route /> Start
                </button>
              )}
            </div>
          </li>
        ))}
      </ul>

      {/* Photo Upload Modal (very clear and visible) */}
      {showPhotoModal && currentStep !== null && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center">
          <div className="bg-white rounded-2xl shadow-2xl border-4 border-amber-400 max-w-md w-full p-8 relative text-center">
            <button
              className="absolute top-2 right-4 text-yellow-700 text-2xl"
              onClick={() => {
                setShowPhotoModal(false);
                setPhotoPreview(null);
                setArrived(false);
                setCurrentStep(null);
              }}
              aria-label="Close"
            >
              ×
            </button>
            <h3 className="text-2xl font-bold text-amber-700 mb-4 flex items-center gap-2 justify-center">
              <Camera size={32} /> Upload Photo Proof
            </h3>
            <label className="block text-lg mb-2 font-medium text-yellow-900">
              Take a photo at this location
            </label>
            <input
              type="file"
              accept="image/*"
              capture="environment"
              onChange={e =>
                e.target.files?.[0] && handlePhotoUpload(e.target.files[0])
              }
              className="block w-full text-lg file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-amber-500 file:text-white hover:file:bg-amber-600 transition mb-4"
              style={{ fontSize: "1.1em" }}
            />
            {photoPreview && (
              <img
                src={photoPreview}
                alt="Preview"
                className="w-32 h-32 mt-4 object-cover rounded border-2 border-amber-400 shadow mx-auto"
              />
            )}
            <p className="text-sm text-stone-700 mt-2 font-semibold">
              Clear photos help prove you visited the spot!
            </p>
            {error && <div className={`mt-3 font-bold ${warningText}`}>{error}</div>}
          </div>
        </div>
      )}

      {allDone && (
        <div className="mt-8 bg-gradient-to-r from-green-200 via-green-100 to-green-200 border border-green-400 rounded-lg p-6 text-center font-bold text-green-800 text-xl shadow-lg">
          🎉 Quest Complete! <span className="text-amber-700">{quest.reward_points} points</span> earned.
        </div>
      )}

      {error && !showPhotoModal && (
        <div className={`mt-6 font-bold ${warningText}`}>{error}</div>
      )}
    </div>
  );
};

export default QuestDetail;