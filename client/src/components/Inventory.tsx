import React from "react";
import { Package } from "lucide-react";

// For demo, hardcoded inventory; in real app, fetch from backend.
const inventory = [
  { name: "Chocolate Frog", count: 2 },
  { name: "Broomstick", count: 1 },
];

const Inventory: React.FC = () => (
  <div>
    <h2 className="text-3xl font-bold mb-4 flex items-center gap-2">
      <Package className="text-yellow-400" /> Inventory
    </h2>
    <ul className="space-y-4">
      {inventory.map((item, i) => (
        <li key={i} className="bg-gradient-to-br from-amber-50 to-yellow-100 border-2 border-amber-300 rounded-xl p-4 shadow">
          <span className="font-bold">{item.name}</span>: {item.count}
        </li>
      ))}
    </ul>
  </div>
);

export default Inventory;