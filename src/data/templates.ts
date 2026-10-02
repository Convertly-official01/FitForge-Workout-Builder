import { WorkoutPlan, PlannedExercise, DAYS_OF_WEEK } from '../types';

interface Template {
  id: string;
  name: string;
  description: string;
  emoji: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  goal: string;
  plan: WorkoutPlan;
}

const createPlanned = (exerciseId: string, sets: number, reps: string, rest: string, order: number): PlannedExercise => ({
  id: crypto.randomUUID(),
  exerciseId,
  sets,
  reps,
  rest,
  notes: '',
  order,
});

export const templates: Template[] = [
  {
    id: 'push-pull-legs',
    name: 'Push/Pull/Legs',
    description: 'Classic 6-day split targeting all muscle groups with push, pull, and leg days.',
    emoji: '🔥',
    level: 'intermediate',
    goal: 'hypertrophy',
    plan: {
      id: crypto.randomUUID(),
      name: 'Push/Pull/Legs Split',
      description: 'Classic PPL split for muscle growth',
      author: 'FitForge',
      createdAt: new Date().toISOString(),
      goal: 'hypertrophy',
      level: 'intermediate',
      days: [
        { day: 'monday', dayLabel: 'Monday', isRestDay: false, notes: 'Push Day', exercises: [
          createPlanned('bench-press', 4, '8-10', '90s', 0),
          createPlanned('incline-dumbbell-press', 3, '10-12', '75s', 1),
          createPlanned('overhead-press', 3, '8-10', '90s', 2),
          createPlanned('lateral-raise', 3, '12-15', '60s', 3),
          createPlanned('tricep-pushdown', 3, '12-15', '60s', 4),
        ]},
        { day: 'tuesday', dayLabel: 'Tuesday', isRestDay: false, notes: 'Pull Day', exercises: [
          createPlanned('deadlift', 4, '5-6', '120s', 0),
          createPlanned('pull-ups', 4, '8-12', '90s', 1),
          createPlanned('barbell-row', 3, '8-10', '90s', 2),
          createPlanned('face-pull', 3, '15-20', '60s', 3),
          createPlanned('barbell-curl', 3, '10-12', '60s', 4),
        ]},
        { day: 'wednesday', dayLabel: 'Wednesday', isRestDay: false, notes: 'Leg Day', exercises: [
          createPlanned('back-squat', 4, '6-8', '120s', 0),
          createPlanned('romanian-deadlift', 3, '10-12', '90s', 1),
          createPlanned('leg-press', 4, '10-12', '90s', 2),
          createPlanned('lunges', 3, '12 each', '75s', 3),
          createPlanned('plank', 3, '30-60s', '45s', 4),
        ]},
        { day: 'thursday', dayLabel: 'Thursday', isRestDay: true, notes: '', exercises: [] },
        { day: 'friday', dayLabel: 'Friday', isRestDay: false, notes: 'Push Day', exercises: [
          createPlanned('incline-dumbbell-press', 4, '8-10', '90s', 0),
          createPlanned('cable-fly', 3, '12-15', '60s', 1),
          createPlanned('overhead-press', 3, '10-12', '75s', 2),
          createPlanned('lateral-raise', 4, '12-15', '60s', 3),
          createPlanned('hammer-curl', 3, '10-12', '60s', 4),
        ]},
        { day: 'saturday', dayLabel: 'Saturday', isRestDay: false, notes: 'Pull + Legs', exercises: [
          createPlanned('pull-ups', 4, '8-12', '90s', 0),
          createPlanned('lat-pulldown', 3, '10-12', '75s', 1),
          createPlanned('back-squat', 3, '8-10', '120s', 2),
          createPlanned('leg-press', 3, '12-15', '90s', 3),
        ]},
        { day: 'sunday', dayLabel: 'Sunday', isRestDay: true, notes: 'Full rest', exercises: [] },
      ],
    },
  },
  {
    id: 'upper-lower',
    name: 'Upper/Lower Split',
    description: '4-day split perfect for intermediate lifters focusing on compound movements.',
    emoji: '💪',
    level: 'intermediate',
    goal: 'strength',
    plan: {
      id: crypto.randomUUID(),
      name: 'Upper/Lower Split',
      description: '4-day strength focused split',
      author: 'FitForge',
      createdAt: new Date().toISOString(),
      goal: 'strength',
      level: 'intermediate',
      days: [
        { day: 'monday', dayLabel: 'Monday', isRestDay: false, notes: 'Upper Body - Strength', exercises: [
          createPlanned('bench-press', 4, '5-6', '120s', 0),
          createPlanned('barbell-row', 4, '6-8', '120s', 1),
          createPlanned('overhead-press', 3, '8-10', '90s', 2),
          createPlanned('pull-ups', 3, '8-10', '90s', 3),
        ]},
        { day: 'tuesday', dayLabel: 'Tuesday', isRestDay: false, notes: 'Lower Body - Strength', exercises: [
          createPlanned('back-squat', 4, '5-6', '120s', 0),
          createPlanned('romanian-deadlift', 3, '8-10', '90s', 1),
          createPlanned('leg-press', 3, '10-12', '90s', 2),
          createPlanned('plank', 3, '45-60s', '45s', 3),
        ]},
        { day: 'wednesday', dayLabel: 'Wednesday', isRestDay: true, notes: 'Active recovery', exercises: [] },
        { day: 'thursday', dayLabel: 'Thursday', isRestDay: false, notes: 'Upper Body - Hypertrophy', exercises: [
          createPlanned('incline-dumbbell-press', 4, '10-12', '75s', 0),
          createPlanned('lat-pulldown', 3, '10-12', '75s', 1),
          createPlanned('lateral-raise', 3, '12-15', '60s', 2),
          createPlanned('barbell-curl', 3, '10-12', '60s', 3),
          createPlanned('tricep-pushdown', 3, '12-15', '60s', 4),
        ]},
        { day: 'friday', dayLabel: 'Friday', isRestDay: false, notes: 'Lower Body - Hypertrophy', exercises: [
          createPlanned('back-squat', 3, '8-10', '90s', 0),
          createPlanned('lunges', 3, '12 each', '75s', 1),
          createPlanned('leg-press', 3, '12-15', '75s', 2),
          createPlanned('hanging-leg-raise', 3, '10-15', '60s', 3),
        ]},
        { day: 'saturday', dayLabel: 'Saturday', isRestDay: true, notes: '', exercises: [] },
        { day: 'sunday', dayLabel: 'Sunday', isRestDay: true, notes: '', exercises: [] },
      ],
    },
  },
  {
    id: 'full-body-beginner',
    name: 'Full Body Beginner',
    description: '3-day full body program perfect for those starting their fitness journey.',
    emoji: '🌱',
    level: 'beginner',
    goal: 'general-fitness',
    plan: {
      id: crypto.randomUUID(),
      name: 'Full Body Beginner',
      description: '3-day full body for beginners',
      author: 'FitForge',
      createdAt: new Date().toISOString(),
      goal: 'general-fitness',
      level: 'beginner',
      days: [
        { day: 'monday', dayLabel: 'Monday', isRestDay: false, notes: 'Full Body A', exercises: [
          createPlanned('back-squat', 3, '8-10', '90s', 0),
          createPlanned('bench-press', 3, '8-10', '90s', 1),
          createPlanned('barbell-row', 3, '8-10', '90s', 2),
          createPlanned('plank', 3, '30s', '45s', 3),
        ]},
        { day: 'tuesday', dayLabel: 'Tuesday', isRestDay: true, notes: '', exercises: [] },
        { day: 'wednesday', dayLabel: 'Wednesday', isRestDay: false, notes: 'Full Body B', exercises: [
          createPlanned('deadlift', 3, '6-8', '120s', 0),
          createPlanned('overhead-press', 3, '8-10', '90s', 1),
          createPlanned('lat-pulldown', 3, '10-12', '75s', 2),
          createPlanned('lunges', 2, '10 each', '75s', 3),
        ]},
        { day: 'thursday', dayLabel: 'Thursday', isRestDay: true, notes: '', exercises: [] },
        { day: 'friday', dayLabel: 'Friday', isRestDay: false, notes: 'Full Body C', exercises: [
          createPlanned('leg-press', 3, '10-12', '90s', 0),
          createPlanned('push-ups', 3, '10-15', '60s', 1),
          createPlanned('pull-ups', 3, '5-8', '90s', 2),
          createPlanned('plank', 3, '30-45s', '45s', 3),
        ]},
        { day: 'saturday', dayLabel: 'Saturday', isRestDay: true, notes: 'Optional: light cardio', exercises: [] },
        { day: 'sunday', dayLabel: 'Sunday', isRestDay: true, notes: '', exercises: [] },
      ],
    },
  },
];
