import React from "react";
import quests from "../data/quests.json";
import { Link } from "react-router-dom";
import { Compass } from "lucide-react";

const QuestList: React.FC = () => (
  <div>
    <h2 className="text-3xl font-bold mb-4 flex items-center gap-2">
      <Compass className="text-yellow-400" /> Quests
    </h2>
    <ul className="space-y-6">
      {quests.map((quest) => (
        <li key={quest.id} className="bg-gradient-to-br from-amber-50 to-yellow-100 border-2 border-amber-300 rounded-xl p-6 shadow-lg hover:shadow-2xl">
          <h3 className="text-xl font-bold text-amber-900">{quest.name}</h3>
          <p className="text-stone-700">{quest.description}</p>
          <Link to={`/quests/${quest.id}`} className="inline-block mt-4 px-4 py-2 bg-amber-500 text-white rounded hover:bg-amber-600 transition">Start Quest</Link>
        </li>
      ))}
    </ul>
  </div>
);

export default QuestList;