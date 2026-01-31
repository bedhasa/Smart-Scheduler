
import React, { useState, useEffect } from 'react';
import { Task } from '../types';

interface FocusModeProps {
  task?: Task;
  onFinish: (id: string) => void;
  onCancel: () => void;
}

export const FocusMode: React.FC<FocusModeProps> = ({ task, onFinish, onCancel }) => {
  if (!task) return null;

  const [timeLeft, setTimeLeft] = useState(task.duration * 60);
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    let interval: any = null;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(t => t - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsActive(false);
      // Optional: Sound an alarm
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  const progress = ((task.duration * 60 - timeLeft) / (task.duration * 60)) * 100;

  return (
    <div className="fixed inset-0 bg-gray-900 text-white z-50 flex flex-col items-center justify-center space-y-12 animate-fadeIn">
      <div className="text-center space-y-2">
        <h2 className="text-sm font-bold uppercase tracking-[0.3em] text-indigo-400">Current Task</h2>
        <h3 className="text-5xl font-black">{task.title}</h3>
        <span className="inline-block bg-white/10 px-3 py-1 rounded-full text-xs font-semibold mt-4">{task.category}</span>
      </div>

      <div className="relative w-80 h-80 flex items-center justify-center">
        <svg className="absolute inset-0 w-full h-full -rotate-90">
          <circle 
            cx="160" cy="160" r="140" fill="transparent" 
            stroke="#1f2937" strokeWidth="12" 
          />
          <circle 
            cx="160" cy="160" r="140" fill="transparent" 
            stroke="#6366f1" strokeWidth="12" 
            strokeDasharray={880}
            strokeDashoffset={880 - (880 * progress) / 100}
            strokeLinecap="round"
            className="transition-all duration-1000 linear"
          />
        </svg>
        <div className="text-center z-10">
          <span className="text-7xl font-mono font-bold">{formatTime(timeLeft)}</span>
          <p className="text-gray-500 text-sm mt-2">{isActive ? 'Focusing...' : 'Time is up!'}</p>
        </div>
      </div>

      <div className="flex space-x-6">
        <button 
          onClick={() => setIsActive(!isActive)}
          className={`px-10 py-4 rounded-2xl font-bold transition-all ${isActive ? 'bg-gray-800 text-white' : 'bg-green-600 text-white'}`}
        >
          {isActive ? 'Pause' : 'Resume'}
        </button>
        <button 
          onClick={() => onFinish(task.id)}
          className="px-10 py-4 bg-indigo-600 rounded-2xl font-bold hover:bg-indigo-700 shadow-xl shadow-indigo-900/50"
        >
          Finish Task
        </button>
        <button 
          onClick={onCancel}
          className="px-10 py-4 text-gray-400 font-bold hover:text-white transition-colors"
        >
          Cancel
        </button>
      </div>

      {task.checkpoints.length > 0 && (
        <div className="max-w-md w-full bg-white/5 border border-white/10 p-6 rounded-2xl">
          <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4">Checkpoints</h4>
          <div className="space-y-3">
            {task.checkpoints.map(cp => (
              <div key={cp.id} className="flex items-center space-x-3">
                <div className={`w-4 h-4 rounded border ${cp.completed ? 'bg-indigo-500 border-indigo-500' : 'border-white/20'}`} />
                <span className={cp.completed ? 'line-through text-gray-500' : ''}>{cp.title}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
