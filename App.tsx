
import React, { useState, useEffect, useCallback } from 'react';
import { Layout } from './components/Layout';
import { Dashboard } from './components/Dashboard';
import { Schedule } from './components/Schedule';
import { FocusMode } from './components/FocusMode';
import { Settings } from './components/Settings';
import { AlarmNotification } from './components/AlarmNotification';
import { ReflectionModal } from './components/ReflectionModal';
import { Task, Category, AppData, DailyGoal } from './types';

const STORAGE_KEY = 'smart_scheduler_data';

const App: React.FC = () => {
  const [view, setView] = useState<'dashboard' | 'schedule' | 'focus' | 'settings'>('dashboard');
  const [data, setData] = useState<AppData>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : {
      tasks: [],
      goal: { targetPercentage: 70, reward: '', punishment: '', reflection: '' },
      streak: 0,
      lastCompletedDate: null
    };
  });

  const [activeTaskId, setActiveTaskId] = useState<string | null>(null);
  const [showReflection, setShowReflection] = useState(false);
  const [triggeredAlarms, setTriggeredAlarms] = useState<Set<string>>(new Set());

  // Persistence
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }, [data]);

  // Alarm Check Logic
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const currentHHmm = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
      
      data.tasks.forEach(task => {
        if (task.startTime === currentHHmm && !triggeredAlarms.has(task.id)) {
          setTriggeredAlarms(prev => new Set(prev).add(task.id));
        }
      });
    }, 10000); // Check every 10 seconds

    return () => clearInterval(interval);
  }, [data.tasks, triggeredAlarms]);

  const addTask = (task: Task) => {
    setData(prev => ({ ...prev, tasks: [...prev.tasks, task].sort((a, b) => a.startTime.localeCompare(b.startTime)) }));
  };

  const updateTask = (updatedTask: Task) => {
    setData(prev => ({
      ...prev,
      tasks: prev.tasks.map(t => t.id === updatedTask.id ? updatedTask : t)
    }));
  };

  const deleteTask = (id: string) => {
    setData(prev => ({ ...prev, tasks: prev.tasks.filter(t => t.id !== id) }));
  };

  const toggleTaskCompletion = (id: string) => {
    setData(prev => ({
      ...prev,
      tasks: prev.tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t)
    }));
  };

  const handleReschedule = (taskId: string, extraMinutes: number) => {
    setData(prev => {
      const taskIndex = prev.tasks.findIndex(t => t.id === taskId);
      if (taskIndex === -1) return prev;

      const newTasks = [...prev.tasks];
      newTasks[taskIndex] = { ...newTasks[taskIndex], duration: newTasks[taskIndex].duration + extraMinutes };

      // Push forward subsequent tasks
      for (let i = taskIndex + 1; i < newTasks.length; i++) {
        const prevTask = newTasks[i - 1];
        const currentTask = newTasks[i];
        
        // Calculate new start time based on previous task's end time
        const [prevH, prevM] = prevTask.startTime.split(':').map(Number);
        const totalMinutes = prevH * 60 + prevM + prevTask.duration;
        const nextH = Math.floor(totalMinutes / 60) % 24;
        const nextM = totalMinutes % 60;
        const newStartTime = `${String(nextH).padStart(2, '0')}:${String(nextM).padStart(2, '0')}`;
        
        newTasks[i] = { ...currentTask, startTime: newStartTime };
      }

      return { ...prev, tasks: newTasks };
    });
  };

  const saveGoal = (goal: DailyGoal) => {
    setData(prev => ({ ...prev, goal }));
  };

  const completeDay = (reflection: string) => {
    const today = new Date().toDateString();
    setData(prev => {
      const isMet = (calculateProgress(prev.tasks) >= prev.goal.targetPercentage);
      let newStreak = prev.streak;
      if (isMet) {
        if (prev.lastCompletedDate === new Date(Date.now() - 86400000).toDateString()) {
          newStreak += 1;
        } else if (prev.lastCompletedDate !== today) {
          newStreak = 1;
        }
      }
      return {
        ...prev,
        goal: { ...prev.goal, reflection },
        streak: newStreak,
        lastCompletedDate: today
      };
    });
    setShowReflection(false);
    setView('dashboard');
  };

  const calculateProgress = (tasks: Task[]) => {
    if (tasks.length === 0) return 0;
    const completed = tasks.filter(t => t.completed).length;
    return Math.round((completed / tasks.length) * 100);
  };

  const activeTask = data.tasks.find(t => t.id === activeTaskId);

  return (
    <Layout currentView={view} setView={setView} streak={data.streak}>
      {view === 'dashboard' && (
        <Dashboard 
          data={data} 
          onShowReflection={() => setShowReflection(true)} 
        />
      )}
      {view === 'schedule' && (
        <Schedule 
          tasks={data.tasks} 
          onAdd={addTask} 
          onUpdate={updateTask} 
          onDelete={deleteTask}
          onToggle={toggleTaskCompletion}
          onReschedule={handleReschedule}
          onStartFocus={(id) => { setActiveTaskId(id); setView('focus'); }}
        />
      )}
      {view === 'focus' && (
        <FocusMode 
          task={activeTask} 
          onFinish={(id) => { toggleTaskCompletion(id); setView('schedule'); setActiveTaskId(null); }}
          onCancel={() => { setView('schedule'); setActiveTaskId(null); }}
        />
      )}
      {view === 'settings' && (
        <Settings goal={data.goal} onSave={saveGoal} />
      )}

      {/* Overlays */}
      {triggeredAlarms.size > 0 && Array.from(triggeredAlarms).map(id => {
        const t = data.tasks.find(tk => tk.id === id);
        if (!t) return null;
        return (
          <AlarmNotification 
            key={id} 
            task={t} 
            onDismiss={() => setTriggeredAlarms(prev => {
              const next = new Set(prev);
              next.delete(id);
              return next;
            })}
            onGoTo={() => {
              if (t.launchUrl) window.open(t.launchUrl, '_blank');
              setActiveTaskId(t.id);
              setView('focus');
              setTriggeredAlarms(prev => {
                const next = new Set(prev);
                next.delete(id);
                return next;
              });
            }}
          />
        );
      })}

      {showReflection && (
        <ReflectionModal 
          onClose={() => setShowReflection(false)} 
          onSubmit={completeDay} 
        />
      )}
    </Layout>
  );
};

export default App;
