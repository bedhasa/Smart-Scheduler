
import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import { AppData, Task, Category } from '../types';

interface DashboardProps {
  data: AppData;
  onShowReflection: () => void;
}

const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#64748b'];

export const Dashboard: React.FC<DashboardProps> = ({ data, onShowReflection }) => {
  const tasksCompleted = data.tasks.filter(t => t.completed).length;
  const totalTasks = data.tasks.length;
  const progress = totalTasks > 0 ? Math.round((tasksCompleted / totalTasks) * 100) : 0;
  const isGoalMet = progress >= data.goal.targetPercentage;

  // Category Distribution Data
  const categoryData = Object.values(Category).map(cat => ({
    name: cat,
    value: data.tasks.filter(t => t.category === cat).length
  })).filter(d => d.value > 0);

  // Stats by category
  const barData = Object.values(Category).map(cat => {
    const catTasks = data.tasks.filter(t => t.category === cat);
    return {
      name: cat,
      completed: catTasks.filter(t => t.completed).length,
      total: catTasks.length
    };
  }).filter(d => d.total > 0);

  return (
    <div className="space-y-8 animate-fadeIn">
      <header className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Morning, Productivity Star!</h2>
          <p className="text-gray-500">Here is your discipline snapshot for today.</p>
        </div>
        <button 
          onClick={onShowReflection}
          className="bg-indigo-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-indigo-700 transition-all shadow-lg hover:shadow-indigo-200"
        >
          End of Day Reflection
        </button>
      </header>

      {/* Hero Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard 
          label="Today's Progress" 
          value={`${progress}%`} 
          subValue={`${tasksCompleted}/${totalTasks} Tasks`} 
          color="indigo" 
          icon={<svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>}
        />
        <StatCard 
          label="Target Goal" 
          value={`${data.goal.targetPercentage}%`} 
          subValue={isGoalMet ? "✅ Goal Reached!" : "Keep pushing!"} 
          color={isGoalMet ? "green" : "orange"}
          icon={<svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>}
        />
        <StatCard 
          label="Daily Reward" 
          value={data.goal.reward || "None Set"} 
          subValue="Earn this today" 
          color="pink"
          icon={<svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/></svg>}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Charts Section */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold mb-6">Task Distribution</h3>
          <div className="h-64">
            {categoryData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend verticalAlign="bottom" height={36}/>
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-gray-400 italic">Add some tasks to see charts</div>
            )}
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold mb-6">Progress by Category</h3>
          <div className="h-64">
            {barData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barData}>
                  <XAxis dataKey="name" />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="completed" fill="#6366f1" radius={[4, 4, 0, 0]} name="Completed" />
                  <Bar dataKey="total" fill="#e2e8f0" radius={[4, 4, 0, 0]} name="Total" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-gray-400 italic">No data yet</div>
            )}
          </div>
        </div>
      </div>

      {/* Punishment Area */}
      {!isGoalMet && totalTasks > 0 && (
        <div className="bg-red-50 border border-red-200 p-6 rounded-2xl flex items-center space-x-6">
          <div className="text-4xl">⚠️</div>
          <div>
            <h4 className="text-red-800 font-bold text-lg">Goal not met yet!</h4>
            <p className="text-red-700">Prepare for your punishment: <span className="font-bold underline">{data.goal.punishment || 'None set'}</span> if you finish under {data.goal.targetPercentage}%.</p>
          </div>
        </div>
      )}
    </div>
  );
};

const StatCard: React.FC<{ label: string; value: string; subValue: string; color: string; icon: React.ReactNode }> = ({ label, value, subValue, color, icon }) => {
  const colorClasses: Record<string, string> = {
    indigo: "bg-indigo-50 text-indigo-600",
    green: "bg-green-50 text-green-600",
    orange: "bg-orange-50 text-orange-600",
    pink: "bg-pink-50 text-pink-600",
    red: "bg-red-50 text-red-600",
  };
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
      <div>
        <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider">{label}</p>
        <p className="text-3xl font-black mt-1">{value}</p>
        <p className="text-xs text-gray-400 mt-1 font-medium">{subValue}</p>
      </div>
      <div className={`p-4 rounded-xl ${colorClasses[color]}`}>
        {icon}
      </div>
    </div>
  );
};
