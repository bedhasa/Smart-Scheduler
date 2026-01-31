
import React from 'react';
import { Task } from '../types';

interface AlarmNotificationProps {
  task: Task;
  onDismiss: () => void;
  onGoTo: () => void;
}

export const AlarmNotification: React.FC<AlarmNotificationProps> = ({ task, onDismiss, onGoTo }) => {
  return (
    <div className="fixed top-6 right-6 z-[100] w-96 bg-white rounded-2xl shadow-2xl border-l-8 border-indigo-600 p-5 animate-slideInRight">
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center space-x-2">
          <span className="text-2xl">⏰</span>
          <h4 className="font-bold text-indigo-900">Task Start Alarm</h4>
        </div>
        <button onClick={onDismiss} className="text-gray-400 hover:text-gray-600">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/></svg>
        </button>
      </div>

      <p className="text-gray-700 font-medium text-lg">{task.title}</p>
      <p className="text-gray-500 text-sm mb-4">It's {task.startTime}! Time to start your {task.category} session.</p>

      <div className="flex space-x-3">
        <button 
          onClick={onGoTo}
          className="flex-1 bg-indigo-600 text-white font-bold py-2 rounded-lg hover:bg-indigo-700 transition-all shadow-md shadow-indigo-100"
        >
          Go To Task {task.launchUrl ? '🚀' : '🔥'}
        </button>
        <button 
          onClick={onDismiss}
          className="px-4 py-2 border border-gray-200 text-gray-600 rounded-lg hover:bg-gray-50 transition-all"
        >
          Later
        </button>
      </div>
    </div>
  );
};
