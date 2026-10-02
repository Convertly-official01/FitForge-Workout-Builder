import React, { useState } from 'react';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { PlannedExercise, Exercise } from '../types';
import { exercises as allExercises, muscleGroupColors, muscleGroupEmojis } from '../data/exercises';
import { Trash2, Edit3, Check, X, GripVertical, Moon } from 'lucide-react';

interface SortableExerciseItemProps {
  plannedExercise: PlannedExercise;
  onRemove: () => void;
  onUpdate: (updated: PlannedExercise) => void;
}

function SortableExerciseItem({ plannedExercise, onRemove, onUpdate }: SortableExerciseItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editSets, setEditSets] = useState(plannedExercise.sets.toString());
  const [editReps, setEditReps] = useState(plannedExercise.reps);
  const [editRest, setEditRest] = useState(plannedExercise.rest);
  const [editNotes, setEditNotes] = useState(plannedExercise.notes);

  const exercise = allExercises.find(e => e.id === plannedExercise.exerciseId);
  if (!exercise) return null;

  const color = muscleGroupColors[exercise.muscleGroup];

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: plannedExercise.id,
    data: { plannedExercise },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const handleSave = () => {
    onUpdate({
      ...plannedExercise,
      sets: parseInt(editSets) || 3,
      reps: editReps,
      rest: editRest,
      notes: editNotes,
    });
    setIsEditing(false);
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`bg-white rounded-xl border border-gray-100 p-3 shadow-sm hover:shadow-md transition-all ${
        isDragging ? 'opacity-50 shadow-lg z-50' : ''
      }`}
    >
      {isEditing ? (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <span>{muscleGroupEmojis[exercise.muscleGroup]}</span>
            <span className="font-semibold text-sm text-gray-900">{exercise.name}</span>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <div>
              <label className="text-xs text-gray-500 mb-0.5 block">Sets</label>
              <input
                type="number"
                value={editSets}
                onChange={(e) => setEditSets(e.target.value)}
                className="w-full px-2 py-1.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              />
            </div>
            <div>
              <label className="text-xs text-gray-500 mb-0.5 block">Reps</label>
              <input
                type="text"
                value={editReps}
                onChange={(e) => setEditReps(e.target.value)}
                className="w-full px-2 py-1.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              />
            </div>
            <div>
              <label className="text-xs text-gray-500 mb-0.5 block">Rest</label>
              <input
                type="text"
                value={editRest}
                onChange={(e) => setEditRest(e.target.value)}
                className="w-full px-2 py-1.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              />
            </div>
          </div>
          <div>
            <label className="text-xs text-gray-500 mb-0.5 block">Notes</label>
            <input
              type="text"
              value={editNotes}
              onChange={(e) => setEditNotes(e.target.value)}
              placeholder="e.g., tempo, RPE, cues..."
              className="w-full px-2 py-1.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            />
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleSave}
              className="flex items-center gap-1 px-3 py-1.5 bg-green-500 text-white rounded-lg text-xs font-medium hover:bg-green-600"
            >
              <Check size={12} /> Save
            </button>
            <button
              onClick={() => setIsEditing(false)}
              className="flex items-center gap-1 px-3 py-1.5 bg-gray-100 text-gray-600 rounded-lg text-xs font-medium hover:bg-gray-200"
            >
              <X size={12} /> Cancel
            </button>
          </div>
        </div>
      ) : (
        <div className="flex items-start gap-2">
          <div
            {...attributes}
            {...listeners}
            className="cursor-grab active:cursor-grabbing text-gray-300 hover:text-gray-500 mt-1 flex-shrink-0"
          >
            <GripVertical size={16} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-sm">{muscleGroupEmojis[exercise.muscleGroup]}</span>
              <span className="font-semibold text-sm text-gray-900 truncate">{exercise.name}</span>
            </div>
            <div className="flex items-center gap-3 text-xs">
              <span className="font-mono bg-gray-100 px-2 py-0.5 rounded-md text-gray-700">
                {plannedExercise.sets}× {plannedExercise.reps}
              </span>
              <span className="text-gray-400">Rest: {plannedExercise.rest}</span>
              {plannedExercise.notes && (
                <span className="text-gray-400 truncate max-w-[120px]" title={plannedExercise.notes}>
                  📝 {plannedExercise.notes}
                </span>
              )}
            </div>
          </div>
          <div className="flex gap-1 flex-shrink-0">
            <button
              onClick={() => setIsEditing(true)}
              className="p-1.5 text-gray-400 hover:text-indigo-500 hover:bg-indigo-50 rounded-lg transition-colors"
            >
              <Edit3 size={14} />
            </button>
            <button
              onClick={onRemove}
              className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
            >
              <Trash2 size={14} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

interface DayPlannerProps {
  dayKey: string;
  dayLabel: string;
  exercises: PlannedExercise[];
  isRestDay: boolean;
  notes: string;
  onToggleRestDay: () => void;
  onUpdateNotes: (notes: string) => void;
  onRemoveExercise: (exerciseId: string) => void;
  onUpdateExercise: (exercise: PlannedExercise) => void;
  onReorderExercises: (exercises: PlannedExercise[]) => void;
}

function DayPlanner({
  dayKey,
  dayLabel,
  exercises,
  isRestDay,
  notes,
  onToggleRestDay,
  onUpdateNotes,
  onRemoveExercise,
  onUpdateExercise,
  onReorderExercises,
}: DayPlannerProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: `day-${dayKey}`,
    data: { day: dayKey },
  });

  const [showNotes, setShowNotes] = useState(false);

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <h3 className="font-bold text-gray-900">{dayLabel}</h3>
          {exercises.length > 0 && (
            <span className="text-xs bg-indigo-100 text-indigo-600 px-2 py-0.5 rounded-full font-medium">
              {exercises.length} exercises
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowNotes(!showNotes)}
            className={`p-1.5 rounded-lg text-xs transition-colors ${
              notes ? 'text-indigo-500 bg-indigo-50' : 'text-gray-400 hover:text-gray-600'
            }`}
            title="Day notes"
          >
            📝
          </button>
          <button
            onClick={onToggleRestDay}
            className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
              isRestDay
                ? 'bg-purple-100 text-purple-700'
                : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
            }`}
          >
            <Moon size={12} />
            {isRestDay ? 'Rest Day' : 'Mark Rest'}
          </button>
        </div>
      </div>

      {showNotes && (
        <div className="mb-3">
          <textarea
            value={notes}
            onChange={(e) => onUpdateNotes(e.target.value)}
            placeholder="Day notes (e.g., focus on form, warm-up protocol...)"
            className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 resize-none"
            rows={2}
          />
        </div>
      )}

      {isRestDay ? (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center py-12">
            <p className="text-4xl mb-3">😴</p>
            <p className="text-gray-500 font-medium">Rest & Recovery</p>
            <p className="text-xs text-gray-400 mt-1">Active recovery, stretching, or complete rest</p>
          </div>
        </div>
      ) : (
        <div
          ref={setNodeRef}
          className={`flex-1 space-y-2 overflow-y-auto rounded-xl p-2 transition-colors ${
            isOver ? 'bg-indigo-50/50 ring-2 ring-indigo-200 ring-dashed' : ''
          }`}
        >
          {exercises.length === 0 ? (
            <div className="flex items-center justify-center h-32 border-2 border-dashed border-gray-200 rounded-xl">
              <div className="text-center">
                <p className="text-2xl mb-1">🎯</p>
                <p className="text-xs text-gray-400">Drag exercises here</p>
              </div>
            </div>
          ) : (
            <SortableContext
              items={exercises.map(e => e.id)}
              strategy={verticalListSortingStrategy}
            >
              {exercises.map(plannedExercise => (
                <SortableExerciseItem
                  key={plannedExercise.id}
                  plannedExercise={plannedExercise}
                  onRemove={() => onRemoveExercise(plannedExercise.id)}
                  onUpdate={onUpdateExercise}
                />
              ))}
            </SortableContext>
          )}
        </div>
      )}
    </div>
  );
}

export default DayPlanner;
