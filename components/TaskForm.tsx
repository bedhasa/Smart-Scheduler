
import React, { useState } from 'react';
// Removed non-existent Priority import
import { Task, Category, Checkpoint } from '../types';

interface TaskFormProps {
  task?: Task;
  onClose: () => void;
  onSave: (task: Task) => void;
}

export const TaskForm: React.FC<TaskFormProps> = ({ task, onClose, onSave }) => {
  const [title, setTitle] = useState(task?.title || '');
  const [startTime, setStartTime] = useState(task?.startTime || '08:00');
  const [duration, setDuration] = useState(task?.duration || 30);
  const [category, setCategory] = useState<Category>(task?.category || Category.Study);
  const [priority, setPriority] = useState<'Low' | 'Medium' | 'High'>(task?.priority || 'Medium');
  const [overlapAllowed, setOverlapAllowed] = useState(task?.overlapAllowed || false);
  const [launchUrl, setLaunchUrl] = useState(task?.launchUrl || '');
  const [checkpoints, setCheckpoints] = useState<Checkpoint[]>(task?.checkpoints || []);
  const [newCheckpoint, setNewCheckpoint] = useState('');

  const handleAddCheckpoint = () => {
    if (!newCheckpoint.trim()) return;
    setCheckpoints([...checkpoints, { id: Date.now().toString(), title: newCheckpoint, completed: false }]);
    setNewCheckpoint('');
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      id: task?.id || Date.now().toString(),
      title,
      startTime,
      duration,
      category,
      priority,
      overlapAllowed,
      checkpoints,
      completed: task?.completed || false,
      launchUrl
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
          <h3 className="text-xl font-bold">{task ? 'Edit Task' : 'New Scheduled Task'}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/></svg>
          </button>
        </div>

        <form onSubmit={handleSave} className="p-6 overflow-y-auto space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Task Title</label>
                <input 
                  required
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                  placeholder="e.g., Mathematics Study"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Start Time</label>
                  <input 
                    type="time"
                    required
                    value={startTime}
                    onChange={e => setStartTime(e.target.value)}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Duration (min)</label>
                  <input 
                    type="number"
                    required
                    min="5"
                    value={duration}
                    onChange={e => setDuration(parseInt(e.target.value))}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Category</label>
                <select 
                  value={category}
                  onChange={e => setCategory(e.target.value as Category)}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                >
                  {Object.values(Category).map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Launch URL / Resource (Optional)</label>
                <input 
                  value={launchUrl}
                  onChange={e => setLaunchUrl(e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                  placeholder="e.g., https://youtube.com/lecture"
                />
                <p className="text-[10px] text-gray-400 mt-1 italic">This will open automatically when the alarm sounds.</p>
              </div>

              <div className="flex items-center space-x-3">
                <input 
                  type="checkbox"
                  id="overlap"
                  checked={overlapAllowed}
                  onChange={e => setOverlapAllowed(e.target.checked)}
                  className="w-4 h-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
                <label htmlFor="overlap" className="text-sm font-medium text-gray-700">Allow Overlap with other tasks</label>
              </div>
            </div>

            <div className="space-y-4">
              <label className="block text-sm font-semibold text-gray-700 mb-1">Study Checkpoints / Sub-tasks</label>
              <div className="flex space-x-2">
                <input 
                  value={newCheckpoint}
                  onChange={e => setNewCheckpoint(e.target.value)}
                  className="flex-1 px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Add a topic or step..."
                />
                <button 
                  type="button"
                  onClick={handleAddCheckpoint}
                  className="bg-gray-100 px-4 py-2 rounded-lg text-gray-700 hover:bg-gray-200 transition-colors"
                >
                  Add
                </button>
              </div>
              <div className="space-y-2 max-h-48 overflow-y-auto pr-2">
                {checkpoints.map((cp, idx) => (
                  <div key={cp.id} className="flex items-center justify-between bg-gray-50 p-2 rounded border border-gray-100">
                    <span className="text-sm truncate mr-2">{cp.title}</span>
                    <button 
                      type="button"
                      onClick={() => setCheckpoints(checkpoints.filter(c => c.id !== cp.id))}
                      className="text-red-400 hover:text-red-600"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/></svg>
                    </button>
                  </div>
                ))}
                {checkpoints.length === 0 && <p className="text-sm text-gray-400 italic text-center py-4">No checkpoints added.</p>}
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-gray-100 flex space-x-4">
            <button 
              type="submit"
              className="flex-1 bg-indigo-600 text-white font-bold py-3 rounded-xl hover:bg-indigo-700 shadow-lg shadow-indigo-100 transition-all"
            >
              {task ? 'Update Task' : 'Schedule Now'}
            </button>
            <button 
              type="button"
              onClick={onClose}
              className="px-6 py-3 border border-gray-200 rounded-xl font-bold text-gray-600 hover:bg-gray-50 transition-all"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
