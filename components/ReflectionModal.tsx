
import React, { useState } from 'react';

interface ReflectionModalProps {
  onClose: () => void;
  onSubmit: (reflection: string) => void;
}

export const ReflectionModal: React.FC<ReflectionModalProps> = ({ onClose, onSubmit }) => {
  const [reflection, setReflection] = useState('');

  return (
    <div className="fixed inset-0 bg-indigo-950/80 backdrop-blur-md z-[100] flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl p-8 space-y-6">
        <div className="text-center">
          <div className="w-20 h-20 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4 text-4xl">
            🌙
          </div>
          <h3 className="text-2xl font-bold">End of Day Reflection</h3>
          <p className="text-gray-500">Take 30 seconds to analyze today.</p>
        </div>

        <div className="space-y-4 text-center">
          <p className="font-semibold text-gray-700 italic">"What went wrong today? What will you improve tomorrow?"</p>
          <textarea 
            autoFocus
            value={reflection}
            onChange={e => setReflection(e.target.value)}
            className="w-full h-40 px-6 py-4 border-2 border-gray-100 rounded-2xl focus:border-indigo-500 focus:ring-0 outline-none transition-all resize-none"
            placeholder="Write a short summary..."
          />
        </div>

        <div className="flex flex-col space-y-3">
          <button 
            disabled={!reflection.trim()}
            onClick={() => onSubmit(reflection)}
            className="w-full bg-indigo-600 text-white font-bold py-4 rounded-2xl hover:bg-indigo-700 transition-all disabled:opacity-50"
          >
            Submit Reflection & End Day
          </button>
          <button 
            onClick={onClose}
            className="w-full py-2 text-gray-400 font-medium hover:text-gray-600 transition-colors"
          >
            I'm not done yet
          </button>
        </div>
      </div>
    </div>
  );
};
