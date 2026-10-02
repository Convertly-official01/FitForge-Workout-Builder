import React from 'react';
import { WorkoutPlan } from '../types';
import { exercises as allExercises, muscleGroupColors, muscleGroupEmojis } from '../data/exercises';
import { ArrowLeft, Calendar, Dumbbell, Target } from 'lucide-react';

interface SharedViewProps {
  plan: WorkoutPlan;
  onBack: () => void;
}

export default function SharedView({ plan, onBack }: SharedViewProps) {
  const activeDays = plan.days.filter(d => !d.isRestDay && d.exercises.length > 0);
  const totalExercises = plan.days.reduce((acc, d) => acc + d.exercises.length, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 text-white">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-white/80 hover:text-white mb-4 text-sm transition-colors"
          >
            <ArrowLeft size={16} /> Back to Editor
          </button>
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">{plan.name}</h1>
              {plan.description && (
                <p className="text-white/80 text-sm mb-3">{plan.description}</p>
              )}
              <div className="flex flex-wrap gap-3 text-sm">
                {plan.author && (
                  <span className="bg-white/20 px-3 py-1 rounded-full">
                    👤 {plan.author}
                  </span>
                )}
                <span className="bg-white/20 px-3 py-1 rounded-full">
                  📊 {plan.level}
                </span>
                <span className="bg-white/20 px-3 py-1 rounded-full">
                  🎯 {plan.goal}
                </span>
                <span className="bg-white/20 px-3 py-1 rounded-full">
                  📅 {activeDays.length} days/week
                </span>
                <span className="bg-white/20 px-3 py-1 rounded-full">
                  🏋️ {totalExercises} exercises
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
        {plan.days.map(day => {
          if (day.isRestDay) {
            return (
              <div key={day.day} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center">
                    <span className="text-lg">😴</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">{day.dayLabel}</h3>
                    <p className="text-sm text-purple-600">Rest & Recovery Day</p>
                  </div>
                </div>
                {day.notes && (
                  <p className="mt-3 text-sm text-gray-500 bg-gray-50 rounded-lg p-3">{day.notes}</p>
                )}
              </div>
            );
          }

          if (day.exercises.length === 0) return null;

          return (
            <div key={day.day} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-5 border-b border-gray-100 bg-gray-50/50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-indigo-100 flex items-center justify-center">
                      <Calendar size={18} className="text-indigo-600" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900">{day.dayLabel}</h3>
                      <p className="text-xs text-gray-500">{day.exercises.length} exercises</p>
                    </div>
                  </div>
                </div>
                {day.notes && (
                  <p className="mt-3 text-sm text-gray-500 bg-white rounded-lg p-3 border border-gray-100">
                    📝 {day.notes}
                  </p>
                )}
              </div>
              <div className="p-5">
                <table className="w-full">
                  <thead>
                    <tr className="text-xs text-gray-500 uppercase tracking-wider">
                      <th className="text-left pb-3 font-medium">Exercise</th>
                      <th className="text-center pb-3 font-medium">Sets</th>
                      <th className="text-center pb-3 font-medium">Reps</th>
                      <th className="text-center pb-3 font-medium">Rest</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {day.exercises.map((planned, idx) => {
                      const exercise = allExercises.find(e => e.id === planned.exerciseId);
                      if (!exercise) return null;
                      const color = muscleGroupColors[exercise.muscleGroup];
                      return (
                        <tr key={planned.id} className="group">
                          <td className="py-3">
                            <div className="flex items-center gap-2">
                              <span className="text-xs text-gray-400 w-5">{idx + 1}.</span>
                              <span>{muscleGroupEmojis[exercise.muscleGroup]}</span>
                              <div>
                                <p className="font-medium text-sm text-gray-900">{exercise.name}</p>
                                {planned.notes && (
                                  <p className="text-xs text-gray-400">{planned.notes}</p>
                                )}
                              </div>
                            </div>
                          </td>
                          <td className="text-center py-3">
                            <span className="font-mono text-sm bg-gray-100 px-2 py-0.5 rounded-md">
                              {planned.sets}
                            </span>
                          </td>
                          <td className="text-center py-3">
                            <span className="font-mono text-sm bg-gray-100 px-2 py-0.5 rounded-md">
                              {planned.reps}
                            </span>
                          </td>
                          <td className="text-center py-3">
                            <span className="text-sm text-gray-500">{planned.rest}</span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          );
        })}

        {/* Footer */}
        <div className="text-center py-8 text-sm text-gray-400">
          <p>Built with FitForge ⚡</p>
          <p className="mt-1">Create and share your own programs at fitforge.app</p>
        </div>
      </div>
    </div>
  );
}
