import React, { useEffect, useRef } from "react";
import { loadHereMapScript, getHereApiKey } from "../utils/here";
import quests from "../data/quests.json";

const MapView: React.FC = () => {
  const mapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let map: any;
    let platform: any;
    let userMarker: any;

    const showMap = async () => {
      await loadHereMapScript();
      // @ts-ignore
      platform = new window.H.service.Platform({ apikey: getHereApiKey() });
      // @ts-ignore
      const defaultLayers = platform.createDefaultLayers();
      // @ts-ignore
      map = new window.H.Map(
        mapRef.current,
        defaultLayers.vector.normal.map,
        {
          center: { lat: 19.12345, lng: 72.83628 },
          zoom: 16,
        }
      );
      // @ts-ignore
      const behavior = new window.H.mapevents.Behavior(new window.H.mapevents.MapEvents(map));
      // @ts-ignore
      new window.H.ui.UI.createDefault(map, defaultLayers);

      // Add quest markers
      quests.forEach((quest) => {
        quest.locations.forEach((loc) => {
          // @ts-ignore
          const marker = new window.H.map.Marker({ lat: loc.lat, lng: loc.lng });
          map.addObject(marker);
        });
      });

      // Show user position
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((pos) => {
          // @ts-ignore
          userMarker = new window.H.map.Marker({ lat: pos.coords.latitude, lng: pos.coords.longitude });
          map.addObject(userMarker);
          map.setCenter({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        });
      }
    };

    showMap();

    return () => {
      if (map) map.dispose();
    };
  }, []);

  return (
    <div>
      <h2 className="text-3xl font-bold mb-4 text-amber-900">Game Map</h2>
      <div ref={mapRef} className="w-full h-96 rounded-xl border-2 border-amber-300 shadow-lg" />
    </div>
  );
};

export default MapView;