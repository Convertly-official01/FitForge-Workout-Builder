import { create } from 'zustand';
import { WorkoutPlan, DayPlan, PlannedExercise, DAYS_OF_WEEK } from '../types';

interface WorkoutStore {
  plan: WorkoutPlan;
  activeDay: string;
  searchQuery: string;
  filterMuscleGroup: string;
  setPlan: (plan: WorkoutPlan) => void;
  setActiveDay: (day: string) => void;
  setSearchQuery: (query: string) => void;
  setFilterMuscleGroup: (group: string) => void;
  updatePlanName: (name: string) => void;
  updatePlanDescription: (description: string) => void;
  updatePlanAuthor: (author: string) => void;
  updatePlanGoal: (goal: string) => void;
  updatePlanLevel: (level: 'beginner' | 'intermediate' | 'advanced') => void;
  addExerciseToDay: (day: string, exercise: PlannedExercise) => void;
  removeExerciseFromDay: (day: string, exerciseId: string) => void;
  updateExerciseInDay: (day: string, exercise: PlannedExercise) => void;
  reorderExercisesInDay: (day: string, exercises: PlannedExercise[]) => void;
  toggleRestDay: (day: string) => void;
  updateDayNotes: (day: string, notes: string) => void;
  resetPlan: () => void;
}

const createEmptyDayPlan = (key: string, label: string): DayPlan => ({
  day: key,
  dayLabel: label,
  exercises: [],
  isRestDay: false,
  notes: '',
});

const createDefaultPlan = (): WorkoutPlan => ({
  id: crypto.randomUUID(),
  name: 'My Training Program',
  description: '',
  author: '',
  createdAt: new Date().toISOString(),
  goal: 'strength',
  level: 'intermediate',
  days: DAYS_OF_WEEK.map(d => createEmptyDayPlan(d.key, d.label)),
});

export const useWorkoutStore = create<WorkoutStore>((set) => ({
  plan: createDefaultPlan(),
  activeDay: 'monday',
  searchQuery: '',
  filterMuscleGroup: 'all',
  
  setPlan: (plan) => set({ plan }),
  setActiveDay: (day) => set({ activeDay: day }),
  setSearchQuery: (query) => set({ searchQuery: query }),
  setFilterMuscleGroup: (group) => set({ filterMuscleGroup: group }),
  
  updatePlanName: (name) => set((state) => ({
    plan: { ...state.plan, name }
  })),
  
  updatePlanDescription: (description) => set((state) => ({
    plan: { ...state.plan, description }
  })),
  
  updatePlanAuthor: (author) => set((state) => ({
    plan: { ...state.plan, author }
  })),
  
  updatePlanGoal: (goal) => set((state) => ({
    plan: { ...state.plan, goal }
  })),
  
  updatePlanLevel: (level) => set((state) => ({
    plan: { ...state.plan, level }
  })),
  
  addExerciseToDay: (day, exercise) => set((state) => ({
    plan: {
      ...state.plan,
      days: state.plan.days.map(d => 
        d.day === day 
          ? { ...d, exercises: [...d.exercises, exercise] }
          : d
      )
    }
  })),
  
  removeExerciseFromDay: (day, exerciseId) => set((state) => ({
    plan: {
      ...state.plan,
      days: state.plan.days.map(d => 
        d.day === day 
          ? { ...d, exercises: d.exercises.filter(e => e.id !== exerciseId) }
          : d
      )
    }
  })),
  
  updateExerciseInDay: (day, updatedExercise) => set((state) => ({
    plan: {
      ...state.plan,
      days: state.plan.days.map(d => 
        d.day === day 
          ? { ...d, exercises: d.exercises.map(e => e.id === updatedExercise.id ? updatedExercise : e) }
          : d
      )
    }
  })),
  
  reorderExercisesInDay: (day, exercises) => set((state) => ({
    plan: {
      ...state.plan,
      days: state.plan.days.map(d => 
        d.day === day ? { ...d, exercises } : d
      )
    }
  })),
  
  toggleRestDay: (day) => set((state) => ({
    plan: {
      ...state.plan,
      days: state.plan.days.map(d => 
        d.day === day ? { ...d, isRestDay: !d.isRestDay } : d
      )
    }
  })),
  
  updateDayNotes: (day, notes) => set((state) => ({
    plan: {
      ...state.plan,
      days: state.plan.days.map(d => 
        d.day === day ? { ...d, notes } : d
      )
    }
  })),
  
  resetPlan: () => set({ plan: createDefaultPlan() }),
}));
