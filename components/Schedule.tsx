
import React, { useState } from 'react';
import { Task, Category, Checkpoint } from '../types';
import { TaskForm } from './TaskForm';

interface ScheduleProps {
  tasks: Task[];
  onAdd: (task: Task) => void;
  onUpdate: (task: Task) => void;
  onDelete: (id: string) => void;
  onToggle: (id: string) => void;
  onReschedule: (id: string, mins: number) => void;
  onStartFocus: (id: string) => void;
}

export const Schedule: React.FC<ScheduleProps> = ({ tasks, onAdd, onUpdate, onDelete, onToggle, onReschedule, onStartFocus }) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const formatTime = (time: string, duration: number) => {
    const [h, m] = time.split(':').map(Number);
    const totalMinutes = h * 60 + m + duration;
    const endH = Math.floor(totalMinutes / 60) % 24;
    const endM = totalMinutes % 60;
    return `${time} - ${String(endH).padStart(2, '0')}:${String(endM).padStart(2, '0')}`;
  };

  return (
    <div className="space-y-6">
      <header className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Your Daily Timeline</h2>
          <p className="text-gray-500">Plan your day realistically.</p>
        </div>
        <button 
          onClick={() => setShowAddForm(true)}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-indigo-700 transition-all shadow-lg"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"/></svg>
          <span>Add Task</span>
        </button>
      </header>

      {showAddForm && (
        <TaskForm 
          onClose={() => setShowAddForm(false)} 
          onSave={(task) => { onAdd(task); setShowAddForm(false); }} 
        />
      )}

      {editingTask && (
        <TaskForm 
          task={editingTask}
          onClose={() => setEditingTask(null)} 
          onSave={(task) => { onUpdate(task); setEditingTask(null); }} 
        />
      )}

      <div className="space-y-4">
        {tasks.length === 0 ? (
          <div className="bg-white border-2 border-dashed border-gray-200 rounded-2xl p-12 text-center text-gray-400">
            <p>No tasks scheduled for today. Start by adding one!</p>
          </div>
        ) : (
          tasks.map((task, index) => {
            const hasConflict = index > 0 && !task.overlapAllowed && !tasks[index-1].overlapAllowed && 
              (() => {
                const [h, m] = tasks[index-1].startTime.split(':').map(Number);
                const prevEnd = h * 60 + m + tasks[index-1].duration;
                const [curH, curM] = task.startTime.split(':').map(Number);
                const curStart = curH * 60 + curM;
                return curStart < prevEnd;
              })();

            return (
              <div 
                key={task.id} 
                className={`group bg-white p-5 rounded-2xl shadow-sm border-l-8 transition-all hover:shadow-md ${task.completed ? 'border-gray-200 opacity-60' : 'border-indigo-600'} ${hasConflict ? 'ring-2 ring-red-300' : ''}`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4">
                    <button 
                      onClick={() => onToggle(task.id)}
                      className={`mt-1 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${task.completed ? 'bg-green-500 border-green-500 text-white' : 'border-gray-300 text-transparent hover:border-indigo-500'}`}
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/></svg>
                    </button>
                    <div>
                      <h4 className={`text-lg font-bold ${task.completed ? 'line-through text-gray-400' : 'text-gray-900'}`}>{task.title}</h4>
                      <div className="flex items-center space-x-4 mt-1">
                        <span className="text-sm font-semibold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded uppercase tracking-wider">{task.category}</span>
                        <span className="text-sm text-gray-500 flex items-center">
                          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                          {formatTime(task.startTime, task.duration)} ({task.duration}m)
                        </span>
                      </div>
                      
                      {hasConflict && (
                        <p className="text-xs text-red-500 font-semibold mt-2 flex items-center">
                          <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd"/></svg>
                          Warning: Conflict with previous task!
                        </p>
                      )}

                      {task.checkpoints.length > 0 && (
                        <div className="mt-4 bg-gray-50 p-3 rounded-lg border border-gray-100">
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-xs font-bold text-gray-400 uppercase">Checkpoints</span>
                            <span className="text-xs font-bold text-gray-600">{Math.round((task.checkpoints.filter(c => c.completed).length / task.checkpoints.length) * 100)}%</span>
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                            {task.checkpoints.map(cp => (
                              <div key={cp.id} className="flex items-center space-x-2">
                                <input 
                                  type="checkbox" 
                                  checked={cp.completed} 
                                  readOnly
                                  className="w-3 h-3 text-indigo-600 rounded" 
                                />
                                <span className={`text-xs ${cp.completed ? 'line-through text-gray-400' : 'text-gray-600'}`}>{cp.title}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    {!task.completed && (
                      <>
                        <button 
                          onClick={() => onStartFocus(task.id)}
                          title="Start Focus Mode"
                          className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-all"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                        </button>
                        <button 
                          onClick={() => onReschedule(task.id, 15)}
                          title="Add 15 mins (Smart Push)"
                          className="p-2 text-orange-600 hover:bg-orange-50 rounded-lg transition-all"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                        </button>
                      </>
                    )}
                    <button 
                      onClick={() => setEditingTask(task)}
                      className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"/></svg>
                    </button>
                    <button 
                      onClick={() => onDelete(task.id)}
                      className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
