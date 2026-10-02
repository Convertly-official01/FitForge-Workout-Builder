import React from 'react';
import { useDraggable } from '@dnd-kit/core';
import { Exercise } from '../types';
import { muscleGroupColors, muscleGroupEmojis, equipmentEmojis } from '../data/exercises';
import { Search, Filter, Plus, GripVertical } from 'lucide-react';

interface ExerciseLibraryProps {
  exercises: Exercise[];
  searchQuery: string;
  filterMuscleGroup: string;
  onSearchChange: (query: string) => void;
  onFilterChange: (group: string) => void;
  onAddExercise: (exercise: Exercise) => void;
}

function DraggableExerciseCard({ exercise, onAdd }: { exercise: Exercise; onAdd: (e: Exercise) => void }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: exercise.id,
    data: { exercise },
  });

  const style = transform ? {
    transform: `translate(${transform.x}px, ${transform.y}px)`,
  } : undefined;

  const color = muscleGroupColors[exercise.muscleGroup];

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`relative bg-white rounded-xl border border-gray-100 p-3 shadow-sm hover:shadow-md transition-all duration-200 group ${
        isDragging ? 'opacity-50 shadow-lg scale-105 z-50' : ''
      }`}
    >
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
            <h4 className="font-semibold text-gray-900 text-sm truncate">{exercise.name}</h4>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <span
              className="text-xs px-2 py-0.5 rounded-full font-medium"
              style={{ backgroundColor: `${color}15`, color }}
            >
              {exercise.muscleGroup}
            </span>
            <span className="text-xs text-gray-400">
              {equipmentEmojis[exercise.equipment]} {exercise.equipment}
            </span>
          </div>
          <div className="mt-1.5 text-xs text-gray-500">
            {exercise.defaultSets}× {exercise.defaultReps} · Rest {exercise.defaultRest}
          </div>
        </div>
        <button
          onClick={() => onAdd(exercise)}
          className="opacity-0 group-hover:opacity-100 transition-opacity bg-indigo-50 hover:bg-indigo-100 text-indigo-600 rounded-lg p-1.5 flex-shrink-0"
          title="Add to current day"
        >
          <Plus size={14} />
        </button>
      </div>
    </div>
  );
}

export default function ExerciseLibrary({
  exercises,
  searchQuery,
  filterMuscleGroup,
  onSearchChange,
  onFilterChange,
  onAddExercise,
}: ExerciseLibraryProps) {
  const muscleGroups = ['all', 'chest', 'back', 'legs', 'shoulders', 'arms', 'core', 'cardio', 'full-body'];

  const filtered = exercises.filter(ex => {
    const matchesSearch = ex.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ex.muscleGroup.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterMuscleGroup === 'all' || ex.muscleGroup === filterMuscleGroup;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b border-gray-100 bg-white/80 backdrop-blur-sm sticky top-0 z-10">
        <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
          <span className="text-xl">📚</span> Exercise Library
        </h3>
        <div className="relative mb-3">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
          <input
            type="text"
            placeholder="Search exercises..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 transition-all"
          />
        </div>
        <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-hide">
          <Filter size={14} className="text-gray-400 flex-shrink-0 mt-1.5" />
          {muscleGroups.map(group => (
            <button
              key={group}
              onClick={() => onFilterChange(group)}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                filterMuscleGroup === group
                  ? 'bg-indigo-500 text-white shadow-sm'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {group === 'all' ? '🏋️ All' : `${muscleGroupEmojis[group]} ${group}`}
            </button>
          ))}
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        {filtered.length === 0 ? (
          <div className="text-center py-8 text-gray-400">
            <p className="text-3xl mb-2">🔍</p>
            <p className="text-sm">No exercises found</p>
          </div>
        ) : (
          filtered.map(exercise => (
            <DraggableExerciseCard
              key={exercise.id}
              exercise={exercise}
              onAdd={onAddExercise}
            />
          ))
        )}
        <div className="text-center py-3 text-xs text-gray-400">
          Drag exercises to the planner →
        </div>
      </div>
    </div>
  );
}
