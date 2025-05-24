import React, { useState } from "react";
import hospitals from "../data/hospitals.json";
import { getCurrentPosition, isNearLocation } from "../utils/here";
import { Sparkles } from "lucide-react";

const HospitalXP: React.FC = () => {
  const [canExchange, setCanExchange] = useState<boolean | null>(null);
  const [error, setError] = useState<string | null>(null);

  const checkHospitalProximity = async () => {
    setError(null);
    try {
      const pos = await getCurrentPosition();
      const nearHospital = hospitals.some((hosp) =>
        isNearLocation(pos.coords.latitude, pos.coords.longitude, hosp.lat, hosp.lng)
      );
      setCanExchange(nearHospital);
      if (!nearHospital) setError("Not near a hospital. Visit Cooper Hospital to exchange coins for XP.");
    } catch (e: any) {
      setError(e.message || "Location error");
    }
  };

  React.useEffect(() => {
    checkHospitalProximity();
    // eslint-disable-next-line
  }, []);

  return (
    <div>
      <h2 className="text-3xl font-bold mb-4 flex items-center gap-2">
        <Sparkles className="text-yellow-400" /> Hospital XP Exchange
      </h2>
      {canExchange === false && error && <div className="text-red-600 mb-4">{error}</div>}
      {canExchange ? (
        <div className="p-4 bg-green-50 border-2 border-green-400 rounded-xl shadow">
          <p>You are near a hospital! Exchange 10 coins for 10 XP.</p>
          <button className="mt-2 px-3 py-1 bg-green-500 text-white rounded">Exchange</button>
        </div>
      ) : (
        <div className="italic text-stone-700">Checking your location...</div>
      )}
    </div>
  );
};

export default HospitalXP;