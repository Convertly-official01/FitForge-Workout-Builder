export type MuscleGroup = 
  | 'chest' 
  | 'back' 
  | 'legs' 
  | 'shoulders' 
  | 'arms' 
  | 'core' 
  | 'cardio' 
  | 'full-body';

export type Equipment = 
  | 'barbell' 
  | 'dumbbell' 
  | 'machine' 
  | 'cable' 
  | 'bodyweight' 
  | 'kettlebell' 
  | 'band' 
  | 'none';

export interface Exercise {
  id: string;
  name: string;
  muscleGroup: MuscleGroup;
  equipment: Equipment;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  description: string;
  defaultSets: number;
  defaultReps: string;
  defaultRest: string;
}

export interface PlannedExercise {
  id: string;
  exerciseId: string;
  sets: number;
  reps: string;
  rest: string;
  notes: string;
  order: number;
}

export interface DayPlan {
  day: string;
  dayLabel: string;
  exercises: PlannedExercise[];
  isRestDay: boolean;
  notes: string;
}

export interface WorkoutPlan {
  id: string;
  name: string;
  description: string;
  author: string;
  createdAt: string;
  days: DayPlan[];
  goal: string;
  level: 'beginner' | 'intermediate' | 'advanced';
}

export const DAYS_OF_WEEK = [
  { key: 'monday', label: 'Monday' },
  { key: 'tuesday', label: 'Tuesday' },
  { key: 'wednesday', label: 'Wednesday' },
  { key: 'thursday', label: 'Thursday' },
  { key: 'friday', label: 'Friday' },
  { key: 'saturday', label: 'Saturday' },
  { key: 'sunday', label: 'Sunday' },
];
