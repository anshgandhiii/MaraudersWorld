import React, { useState } from "react";
import items from "../data/items.json";
import malls from "../data/malls.json";
import { getCurrentPosition, isNearLocation } from "../utils/here";
import { Package } from "lucide-react";

const ItemShop: React.FC = () => {
  const [canShop, setCanShop] = useState<boolean | null>(null);
  const [error, setError] = useState<string | null>(null);

  const checkMallProximity = async () => {
    setError(null);
    try {
      const pos = await getCurrentPosition();
      const nearMall = malls.some((mall) =>
        isNearLocation(pos.coords.latitude, pos.coords.longitude, mall.lat, mall.lng)
      );
      setCanShop(nearMall);
      if (!nearMall) setError("Not near a mall. Visit Infinity Mall, Andheri to shop.");
    } catch (e: any) {
      setError(e.message || "Location error");
    }
  };

  React.useEffect(() => {
    checkMallProximity();
    // eslint-disable-next-line
  }, []);

  return (
    <div>
      <h2 className="text-3xl font-bold mb-4 flex items-center gap-2">
        <Package className="text-yellow-400" /> Item Shop
      </h2>
      {canShop === false && error && <div className="text-red-600 mb-4">{error}</div>}
      {canShop ? (
        <ul className="space-y-4">
          {items.map((item) => (
            <li key={item.id} className="bg-gradient-to-br from-amber-50 to-yellow-100 border-2 border-amber-300 rounded-xl p-4 shadow">
              <h3 className="font-bold">{item.name}</h3>
              <p>{item.description}</p>
              <p className="text-stone-700">Cost: {item.cost} coins</p>
              <button className="mt-2 px-3 py-1 bg-amber-500 text-white rounded">Buy</button>
            </li>
          ))}
        </ul>
      ) : (
        <div className="italic text-stone-700">Checking your location...</div>
      )}
    </div>
  );
};

export default ItemShop;