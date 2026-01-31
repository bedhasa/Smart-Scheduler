
import React, { useState } from 'react';
import { DailyGoal } from '../types';

interface SettingsProps {
  goal: DailyGoal;
  onSave: (goal: DailyGoal) => void;
}

export const Settings: React.FC<SettingsProps> = ({ goal, onSave }) => {
  const [formData, setFormData] = useState<DailyGoal>(goal);

  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-fadeIn">
      <header>
        <h2 className="text-3xl font-bold text-gray-900">Self-Discipline System</h2>
        <p className="text-gray-500">Define your stakes for better accountability.</p>
      </header>

      <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 space-y-8">
        <div>
          <label className="block text-lg font-bold text-gray-800 mb-2">Today's Target Progress (%)</label>
          <div className="flex items-center space-x-6">
            <input 
              type="range" 
              min="10" max="100" step="5"
              value={formData.targetPercentage}
              onChange={e => setFormData({ ...formData, targetPercentage: parseInt(e.target.value) })}
              className="flex-1 h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
            />
            <span className="text-2xl font-black text-indigo-600 w-16">{formData.targetPercentage}%</span>
          </div>
          <p className="text-sm text-gray-500 mt-2">The percentage of tasks you MUST complete to earn your reward.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <label className="block text-lg font-bold text-indigo-700 mb-2 flex items-center">
              <span className="mr-2">🎁</span> Reward
            </label>
            <textarea 
              value={formData.reward}
              onChange={e => setFormData({ ...formData, reward: e.target.value })}
              className="w-full h-32 px-4 py-3 border rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none resize-none"
              placeholder="e.g., 2 episodes of anime, Ordering pizza, 1 hour of gaming..."
            />
            <p className="text-xs text-gray-400 mt-1 italic">Positive reinforcement helps build habits.</p>
          </div>

          <div>
            <label className="block text-lg font-bold text-red-700 mb-2 flex items-center">
              <span className="mr-2">💪</span> Punishment
            </label>
            <textarea 
              value={formData.punishment}
              onChange={e => setFormData({ ...formData, punishment: e.target.value })}
              className="w-full h-32 px-4 py-3 border rounded-xl focus:ring-2 focus:ring-red-500 outline-none resize-none"
              placeholder="e.g., 50 pushups, No phone tonight, extra 30 mins study tomorrow..."
            />
            <p className="text-xs text-gray-400 mt-1 italic">Discipline is doing what needs to be done.</p>
          </div>
        </div>

        <button 
          onClick={() => onSave(formData)}
          className="w-full bg-indigo-900 text-white font-black py-4 rounded-2xl hover:bg-indigo-950 shadow-xl transition-all"
        >
          SAVE SYSTEM CONFIGURATION
        </button>
      </div>

      <div className="bg-orange-50 p-6 rounded-2xl border border-orange-200">
        <h4 className="text-orange-800 font-bold mb-2">Honesty Reminder</h4>
        <p className="text-orange-700 text-sm">
          This system works only if YOU are honest with YOURSELF. There are no computer police to watch you. 
          True discipline comes from within. If you fail your goal, take the punishment. It builds character.
        </p>
      </div>
    </div>
  );
};
