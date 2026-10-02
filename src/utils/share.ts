import { WorkoutPlan } from '../types';

export function encodePlan(plan: WorkoutPlan): string {
  const json = JSON.stringify(plan);
  return btoa(encodeURIComponent(json));
}

export function decodePlan(encoded: string): WorkoutPlan | null {
  try {
    const json = decodeURIComponent(atob(encoded));
    return JSON.parse(json) as WorkoutPlan;
  } catch {
    return null;
  }
}

export function generateShareUrl(plan: WorkoutPlan): string {
  const encoded = encodePlan(plan);
  const base = window.location.origin + window.location.pathname;
  return `${base}#plan=${encoded}`;
}

export function loadPlanFromUrl(): WorkoutPlan | null {
  const hash = window.location.hash;
  if (!hash) return null;
  const match = hash.match(/plan=(.+)/);
  if (!match) return null;
  return decodePlan(match[1]);
}
