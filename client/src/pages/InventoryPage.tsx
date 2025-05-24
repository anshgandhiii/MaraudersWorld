import React, { useEffect, useState } from "react";
import items from "../data/items.json";
import malls from "../data/malls.json";
import { MapPin, Package, Camera, Route, CheckCircle2 } from "lucide-react";
import { getCurrentPosition, isNearLocation, loadHereMapScript, getHereApiKey } from "../utils/here";

type InventoryItem = {
  itemId: number;
  obtainedAt: string; // ISO string
  locationName: string;
  photoUrl?: string;
};

const getInventory = (): InventoryItem[] => {
  try {
    return JSON.parse(localStorage.getItem("inventory") || "[]");
  } catch {
    return [];
  }
};

const saveInventory = (inv: InventoryItem[]) => {
  localStorage.setItem("inventory", JSON.stringify(inv));
};

const mallForItem = (itemId: number) => malls[0]; // For demo, always first mall. Extend as needed.

const Inventory: React.FC = () => {
  const [inventory, setInventory] = useState<InventoryItem[]>(getInventory());
  const [obtainingItem, setObtainingItem] = useState<number | null>(null);
  const [step, setStep] = useState<"idle"|"routing"|"photo"|"done">("idle");
  const [routeMapVisible, setRouteMapVisible] = useState(false);
  const [error, setError] = useState<string|null>(null);
  const [uploading, setUploading] = useState(false);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);

  // Map/route logic
  const [userPos, setUserPos] = useState<{lat:number,lng:number}|null>(null);
  const [mapReady, setMapReady] = useState(false);

  const startObtain = async (itemId: number) => {
    setObtainingItem(itemId);
    setError(null);
    setStep("routing");
    setRouteMapVisible(true);
    // Get user location
    try {
      const pos = await getCurrentPosition();
      setUserPos({lat: pos.coords.latitude, lng: pos.coords.longitude});
      await loadHereMapScript();
      setMapReady(true);
    } catch (e: any) {
      setError("Failed to get location or load map.");
      setObtainingItem(null);
      setStep("idle");
    }
  };

  const handleArrivedAndPhoto = () => {
    setStep("photo");
    setRouteMapVisible(false);
  };

  const handlePhotoUpload = async (file: File) => {
    setUploading(true);
    setError(null);
    // Re-check location on upload
    try {
      const pos = await getCurrentPosition();
      const mall = mallForItem(obtainingItem!);
      if (!isNearLocation(pos.coords.latitude, pos.coords.longitude, mall.lat, mall.lng, 120)) {
        setError("You are not close enough to the mall. Please go to the correct location!");
        setUploading(false);
        return;
      }
      // Accept photo (simulate upload)
      const url = URL.createObjectURL(file);
      setPhotoPreview(url);

      // Save to inventory
      const newInv: InventoryItem = {
        itemId: obtainingItem!,
        obtainedAt: new Date().toISOString(),
        locationName: mall.name,
        photoUrl: url
      };
      const nextInv = [...inventory, newInv];
      setInventory(nextInv);
      saveInventory(nextInv);
      setStep("done");
    } catch (e: any) {
      setError("Photo upload failed: " + (e.message || "Unknown error"));
    }
    setUploading(false);
  };

  // For HERE routing map
  useEffect(()=>{
    if (!routeMapVisible || !userPos || !obtainingItem || !mapReady) return;
    // @ts-ignore
    const H = window.H;
    const mall = mallForItem(obtainingItem);
    // Clean up any previous map
    const old = document.getElementById("here-route-map");
    if (old) old.innerHTML = "";
    // @ts-ignore
    const platform = new H.service.Platform({apikey:getHereApiKey()});
    // @ts-ignore
    const defaultLayers = platform.createDefaultLayers();
    // @ts-ignore
    const map = new H.Map(
      document.getElementById("here-route-map"),
      defaultLayers.vector.normal.map,
      {center:userPos,zoom:14}
    );
    // @ts-ignore
    new H.mapevents.Behavior(new H.mapevents.MapEvents(map));
    // @ts-ignore
    H.ui.UI.createDefault(map, defaultLayers);
    // Add markers & route
    // @ts-ignore
    const userMarker = new H.map.Marker(userPos);
    // @ts-ignore
    const mallMarker = new H.map.Marker({lat:mall.lat, lng:mall.lng});
    map.addObject(userMarker);
    map.addObject(mallMarker);

    // Routing
    // @ts-ignore
    const router = platform.getRoutingService(null, 8);
    const routingParameters = {
      routingMode: 'fast',
      transportMode: 'pedestrian',
      origin: `${userPos.lat},${userPos.lng}`,
      destination: `${mall.lat},${mall.lng}`,
      return: 'polyline,summary'
    };
    router.calculateRoute(routingParameters, (result:any)=>{
      if (result.routes && result.routes.length) {
        // @ts-ignore
        const route = result.routes[0];
        // @ts-ignore
        route.sections.forEach((section:any) => {
          let linestring = new H.geo.LineString();
          section.polyline.split(';').forEach((pointStr:string)=>{
            const [lat, lng] = pointStr.split(',').map(Number);
            linestring.pushLatLngAlt(lat, lng, 0);
          });
          // @ts-ignore
          const routeLine = new H.map.Polyline(linestring, {
            style: {strokeColor: 'rgba(251,191,36,0.9)', lineWidth: 6}
          });
          map.addObject(routeLine);
        });
      }
    }, (error:any)=>{});
  }, [routeMapVisible, userPos, obtainingItem, mapReady]);

  const mallColor = "text-amber-700";
  const cardBase = "bg-gradient-to-br from-yellow-50 via-amber-100 to-yellow-50 border-2 border-amber-300 rounded-2xl shadow-lg";

  return (
    <div>
      <h2 className="text-3xl font-bold mb-4 flex items-center gap-2">
        <Package className="text-yellow-400" /> Inventory
      </h2>
      <ul className="space-y-6">
        {items.map(item => {
          const owned = inventory.some(i => i.itemId === item.id);
          const mall = mallForItem(item.id);
          const obtained = inventory.find(i => i.itemId === item.id);
          return (
            <li key={item.id} className={`${cardBase} p-6 flex flex-col md:flex-row md:items-center md:justify-between`}>
              <div className="flex items-center gap-4">
                <Package className="text-amber-400" size={36} />
                <div>
                  <h3 className="text-xl font-bold text-amber-900">{item.name}</h3>
                  <p className="text-stone-700">{item.description}</p>
                  <p className={`mt-2 flex items-center gap-2 ${mallColor}`}>
                    <MapPin /> Obtain at <span className="font-semibold">{mall.name}</span>
                  </p>
                </div>
              </div>
              <div className="mt-4 md:mt-0 md:ml-6 flex flex-col items-start">
                {owned && obtained ? (
                  <span className="flex items-center gap-2 px-3 py-1 bg-green-100 border border-green-400 rounded text-green-800 font-semibold">
                    <CheckCircle2 className="text-green-500" /> Obtained
                  </span>
                ) : obtainingItem === item.id && step !== "idle" ? (
                  <span className="flex items-center gap-2 px-3 py-1 bg-amber-100 border border-amber-400 rounded text-amber-800 font-semibold">
                    <Route className="animate-bounce" /> Journey in Progress...
                  </span>
                ) : (
                  <button
                    className="flex items-center gap-2 px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded font-bold shadow transition"
                    onClick={() => startObtain(item.id)}
                  >
                    <Route /> Obtain
                  </button>
                )}
                {owned && obtained?.photoUrl && (
                  <img src={obtained.photoUrl} alt="Proof" className="w-20 h-20 object-cover rounded mt-2 border-2 border-amber-400 shadow" />
                )}
              </div>
            </li>
          );
        })}
      </ul>

      {/* Routing Map Modal */}
      {routeMapVisible && obtainingItem !== null && step === "routing" && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center">
          <div className="bg-white rounded-2xl shadow-2xl border-4 border-amber-400 max-w-lg w-full p-6 relative">
            <button
              className="absolute top-2 right-3 text-amber-700 text-xl"
              onClick={() => { setObtainingItem(null); setRouteMapVisible(false); setStep("idle"); }}>
              ×
            </button>
            <h3 className="text-xl font-bold text-amber-900 mb-2 flex items-center gap-2">
              <Route /> Route to {mallForItem(obtainingItem!).name}
            </h3>
            <div id="here-route-map" className="w-full h-72 rounded border-amber-200 border mb-4"></div>
            <button
              className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded font-bold shadow"
              onClick={handleArrivedAndPhoto}
            >I have arrived!</button>
            <p className="text-xs text-amber-600 mt-2">Walk to the mall. Once there, click “I have arrived!” to verify and upload photo.</p>
          </div>
        </div>
      )}

      {/* Photo Upload Modal */}
      {step === "photo" && obtainingItem !== null && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center">
          <div className="bg-white rounded-2xl shadow-2xl border-4 border-amber-400 max-w-md w-full p-8 relative">
            <button
              className="absolute top-2 right-4 text-amber-700 text-xl"
              onClick={() => { setObtainingItem(null); setStep("idle"); setPhotoPreview(null); }}>
              ×
            </button>
            <h3 className="text-xl font-bold text-amber-900 mb-4 flex items-center gap-2">
              <Camera /> Upload Photo Proof
            </h3>
            <input
              type="file"
              accept="image/*"
              capture="environment"
              disabled={uploading}
              onChange={e => e.target.files?.[0] && handlePhotoUpload(e.target.files[0])}
              className="block w-full text-sm"
            />
            {photoPreview && (
              <img src={photoPreview} alt="Preview" className="w-32 h-32 mt-4 object-cover rounded border-2 border-amber-400 shadow" />
            )}
            <p className="text-xs text-stone-500 mt-2">Take a clear photo at the mall as your proof.</p>
            {error && <div className="text-red-600 mt-3">{error}</div>}
          </div>
        </div>
      )}

      {/* Done Modal */}
      {step === "done" && obtainingItem !== null && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center">
          <div className="bg-white rounded-2xl shadow-2xl border-4 border-green-400 max-w-sm w-full p-8 text-center">
            <CheckCircle2 className="text-green-500 mx-auto mb-2" size={48} />
            <h3 className="text-2xl font-bold text-green-900 mb-2">Item Obtained!</h3>
            <p className="text-green-700">You have successfully added the item to your inventory. Well done, wizard!</p>
            <button
              className="mt-6 px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded font-bold shadow"
              onClick={() => { setObtainingItem(null); setStep("idle"); setPhotoPreview(null); }}
            >Close</button>
          </div>
        </div>
      )}

      {error && !routeMapVisible && step === "idle" && (
        <div className="mt-6 text-red-600 font-semibold">{error}</div>
      )}
    </div>
  );
};

export default Inventory;