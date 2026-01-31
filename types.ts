
export enum Category {
  Study = 'Study',
  Work = 'Work',
  Health = 'Health',
  Personal = 'Personal',
  Entertainment = 'Entertainment',
  Other = 'Other'
}

export interface Checkpoint {
  id: string;
  title: string;
  completed: boolean;
}

export interface Task {
  id: string;
  title: string;
  startTime: string; // HH:mm
  duration: number; // minutes
  category: Category;
  priority: 'Low' | 'Medium' | 'High';
  overlapAllowed: boolean;
  checkpoints: Checkpoint[];
  completed: boolean;
  launchUrl?: string;
}

export interface DailyGoal {
  targetPercentage: number;
  reward: string;
  punishment: string;
  reflection: string;
}

export interface AppData {
  tasks: Task[];
  goal: DailyGoal;
  streak: number;
  lastCompletedDate: string | null;
}
