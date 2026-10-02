import React, { useEffect, useState, useCallback } from 'react';
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
  closestCenter,
} from '@dnd-kit/core';
import {
  Share2,
  Settings,
  RotateCcw,
  Dumbbell,
  Sparkles,
  LayoutTemplate,
  X,
} from 'lucide-react';
import { useWorkoutStore } from './store/workoutStore';
import { exercises as allExercises } from './data/exercises';
import { templates } from './data/templates';
import { Exercise, PlannedExercise, DAYS_OF_WEEK } from './types';
import ExerciseLibrary from './components/ExerciseLibrary';
import DayPlanner from './components/DayPlanner';
import ShareModal from './components/ShareModal';
import SharedView from './components/SharedView';
import { loadPlanFromUrl } from './utils/share';

function TemplateModal({ onClose, onSelect }: { onClose: () => void; onSelect: (id: string) => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <button onClick={onClose} className="absolute top-4 right-4 p-1.5 rounded-lg hover:bg-gray-100">
            <X size={18} className="text-gray-500" />
          </button>
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <LayoutTemplate size={22} className="text-indigo-500" />
            Start from a Template
          </h2>
          <p className="text-sm text-gray-500 mt-1">Choose a pre-built program to get started quickly</p>
        </div>
        <div className="p-4 space-y-3 max-h-96 overflow-y-auto">
          {templates.map(template => (
            <button
              key={template.id}
              onClick={() => onSelect(template.id)}
              className="w-full text-left p-4 rounded-xl border border-gray-200 hover:border-indigo-300 hover:bg-indigo-50/30 transition-all group"
            >
              <div className="flex items-start gap-3">
                <span className="text-2xl">{template.emoji}</span>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 group-hover:text-indigo-700">{template.name}</h3>
                  <p className="text-sm text-gray-500 mt-0.5">{template.description}</p>
                  <div className="flex gap-2 mt-2">
                    <span className="text-xs bg-gray-100 px-2 py-0.5 rounded-full text-gray-600">{template.level}</span>
                    <span className="text-xs bg-gray-100 px-2 py-0.5 rounded-full text-gray-600">{template.goal}</span>
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>
        <div className="p-4 border-t border-gray-100 bg-gray-50">
          <button
            onClick={onClose}
            className="w-full py-2.5 text-sm text-gray-500 hover:text-gray-700 font-medium"
          >
            Start from scratch instead
          </button>
        </div>
      </div>
    </div>
  );
}

function App() {
  const [showShare, setShowShare] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showTemplates, setShowTemplates] = useState(false);
  const [activeTab, setActiveTab] = useState<'library' | 'planner'>('planner');
  const [sharedPlan, setSharedPlan] = useState<any>(null);
  const [activeId, setActiveId] = useState<string | null>(null);

  const store = useWorkoutStore();

  // Check for shared plan in URL on mount
  useEffect(() => {
    const planFromUrl = loadPlanFromUrl();
    if (planFromUrl) {
      setSharedPlan(planFromUrl);
    }
  }, []);

  // If viewing a shared plan
  if (sharedPlan) {
    return <SharedView plan={sharedPlan} onBack={() => {
      setSharedPlan(null);
      window.history.replaceState({}, '', window.location.pathname);
    }} />;
  }

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const currentDay = store.plan.days.find(d => d.day === store.activeDay);

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveId(null);
    const { active, over } = event;

    if (!over) return;

    // Dragging from library to day
    const exercise = active.data.current?.exercise as Exercise | undefined;
    const overDay = over.data.current?.day as string | undefined;

    if (exercise && overDay) {
      const plannedExercise: PlannedExercise = {
        id: crypto.randomUUID(),
        exerciseId: exercise.id,
        sets: exercise.defaultSets,
        reps: exercise.defaultReps,
        rest: exercise.defaultRest,
        notes: '',
        order: (currentDay?.exercises.length || 0),
      };
      store.addExerciseToDay(overDay, plannedExercise);
      return;
    }

    // Reordering within day
    if (active.data.current?.plannedExercise && over.data.current?.plannedExercise) {
      const activePlanned = active.data.current.plannedExercise as PlannedExercise;
      const overPlanned = over.data.current.plannedExercise as PlannedExercise;
      
      if (activePlanned.id !== overPlanned.id && currentDay) {
        const items = [...currentDay.exercises];
        const oldIndex = items.findIndex(i => i.id === activePlanned.id);
        const newIndex = items.findIndex(i => i.id === overPlanned.id);
        
        if (oldIndex !== -1 && newIndex !== -1) {
          const [moved] = items.splice(oldIndex, 1);
          items.splice(newIndex, 0, moved);
          store.reorderExercisesInDay(store.activeDay, items);
        }
      }
    }
  };

  const handleAddExercise = useCallback((exercise: Exercise) => {
    const plannedExercise: PlannedExercise = {
      id: crypto.randomUUID(),
      exerciseId: exercise.id,
      sets: exercise.defaultSets,
      reps: exercise.defaultReps,
      rest: exercise.defaultRest,
      notes: '',
      order: (currentDay?.exercises.length || 0),
    };
    store.addExerciseToDay(store.activeDay, plannedExercise);
  }, [currentDay, store]);

  const handleSelectTemplate = (templateId: string) => {
    const template = templates.find(t => t.id === templateId);
    if (template) {
      store.setPlan({ ...template.plan, id: crypto.randomUUID(), createdAt: new Date().toISOString() });
    }
    setShowTemplates(false);
  };

  const totalExercises = store.plan.days.reduce((acc, d) => acc + d.exercises.length, 0);
  const isEmpty = totalExercises === 0;

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="h-screen flex flex-col bg-gray-50 overflow-hidden">
        {/* Top Navigation */}
        <header className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between flex-shrink-0 z-20">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <Dumbbell size={18} className="text-white" />
            </div>
            <div>
              <h1 className="font-bold text-gray-900 text-sm leading-tight">FitForge</h1>
              <p className="text-xs text-gray-400">Workout Builder</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {totalExercises > 0 && (
              <span className="hidden sm:inline-flex items-center gap-1 text-xs bg-indigo-50 text-indigo-600 px-2.5 py-1 rounded-full font-medium">
                <Sparkles size={12} />
                {totalExercises} exercises
              </span>
            )}
            {isEmpty && (
              <button
                onClick={() => setShowTemplates(true)}
                className="flex items-center gap-1.5 px-3 py-2 bg-amber-50 hover:bg-amber-100 text-amber-700 rounded-xl text-xs font-medium transition-colors border border-amber-200"
              >
                <LayoutTemplate size={14} />
                <span className="hidden sm:inline">Templates</span>
              </button>
            )}
            <button
              onClick={() => setShowSettings(!showSettings)}
              className="p-2 rounded-xl text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-colors"
              title="Program Settings"
            >
              <Settings size={18} />
            </button>
            <button
              onClick={() => setShowShare(true)}
              disabled={totalExercises === 0}
              className="flex items-center gap-1.5 px-3 py-2 bg-indigo-500 hover:bg-indigo-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-xl text-sm font-medium transition-colors shadow-sm shadow-indigo-500/20"
            >
              <Share2 size={16} />
              <span className="hidden sm:inline">Share</span>
            </button>
          </div>
        </header>

        {/* Settings Panel */}
        {showSettings && (
          <div className="bg-white border-b border-gray-200 px-4 py-4 flex-shrink-0 z-10 animate-in slide-in-from-top">
            <div className="max-w-4xl mx-auto">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-gray-900 text-sm">Program Details</h3>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setShowTemplates(true)}
                    className="flex items-center gap-1 text-xs text-indigo-500 hover:text-indigo-600"
                  >
                    <LayoutTemplate size={12} /> Templates
                  </button>
                  <button
                    onClick={() => {
                      if (confirm('Reset entire program? This cannot be undone.')) {
                        store.resetPlan();
                      }
                    }}
                    className="flex items-center gap-1 text-xs text-red-500 hover:text-red-600"
                  >
                    <RotateCcw size={12} /> Reset
                  </button>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">Program Name</label>
                  <input
                    type="text"
                    value={store.plan.name}
                    onChange={(e) => store.updatePlanName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">Author</label>
                  <input
                    type="text"
                    value={store.plan.author}
                    onChange={(e) => store.updatePlanAuthor(e.target.value)}
                    placeholder="Your name"
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">Goal</label>
                  <select
                    value={store.plan.goal}
                    onChange={(e) => store.updatePlanGoal(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 bg-white"
                  >
                    <option value="strength">Strength</option>
                    <option value="hypertrophy">Hypertrophy</option>
                    <option value="endurance">Endurance</option>
                    <option value="fat-loss">Fat Loss</option>
                    <option value="general-fitness">General Fitness</option>
                    <option value="powerlifting">Powerlifting</option>
                    <option value="athletic">Athletic Performance</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">Level</label>
                  <select
                    value={store.plan.level}
                    onChange={(e) => store.updatePlanLevel(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 bg-white"
                  >
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                  </select>
                </div>
              </div>
              <div className="mt-3">
                <label className="text-xs text-gray-500 mb-1 block">Description</label>
                <input
                  type="text"
                  value={store.plan.description}
                  onChange={(e) => store.updatePlanDescription(e.target.value)}
                  placeholder="Brief description of your program..."
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400"
                />
              </div>
            </div>
          </div>
        )}

        {/* Mobile Tab Switcher */}
        <div className="lg:hidden flex border-b border-gray-200 bg-white flex-shrink-0">
          <button
            onClick={() => setActiveTab('planner')}
            className={`flex-1 py-3 text-sm font-medium transition-colors ${
              activeTab === 'planner'
                ? 'text-indigo-600 border-b-2 border-indigo-500'
                : 'text-gray-500'
            }`}
          >
            📅 Planner
          </button>
          <button
            onClick={() => setActiveTab('library')}
            className={`flex-1 py-3 text-sm font-medium transition-colors ${
              activeTab === 'library'
                ? 'text-indigo-600 border-b-2 border-indigo-500'
                : 'text-gray-500'
            }`}
          >
            📚 Library
          </button>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex overflow-hidden">
          {/* Exercise Library - Left Panel */}
          <div className={`${
            activeTab === 'library' ? 'flex' : 'hidden'
          } lg:flex flex-col w-full lg:w-80 xl:w-96 border-r border-gray-200 bg-gray-50 flex-shrink-0 overflow-hidden`}>
            <ExerciseLibrary
              exercises={allExercises}
              searchQuery={store.searchQuery}
              filterMuscleGroup={store.filterMuscleGroup}
              onSearchChange={store.setSearchQuery}
              onFilterChange={store.setFilterMuscleGroup}
              onAddExercise={handleAddExercise}
            />
          </div>

          {/* Weekly Planner - Right Panel */}
          <div className={`${
            activeTab === 'planner' ? 'flex' : 'hidden'
          } lg:flex flex-col flex-1 overflow-hidden`}>
            {/* Day Tabs */}
            <div className="bg-white border-b border-gray-200 px-4 flex-shrink-0">
              <div className="flex gap-1 overflow-x-auto py-2 scrollbar-hide">
                {DAYS_OF_WEEK.map(day => {
                  const dayPlan = store.plan.days.find(d => d.day === day.key);
                  const hasExercises = dayPlan && dayPlan.exercises.length > 0;
                  const isRest = dayPlan?.isRestDay;
                  return (
                    <button
                      key={day.key}
                      onClick={() => store.setActiveDay(day.key)}
                      className={`relative px-3 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-all ${
                        store.activeDay === day.key
                          ? 'bg-indigo-500 text-white shadow-sm'
                          : isRest
                            ? 'bg-purple-50 text-purple-600 hover:bg-purple-100'
                            : hasExercises
                              ? 'bg-green-50 text-green-700 hover:bg-green-100'
                              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      {day.label.slice(0, 3)}
                      {hasExercises && store.activeDay !== day.key && (
                        <span className="absolute -top-1 -right-1 w-2 h-2 bg-green-400 rounded-full" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Day Content */}
            <div className="flex-1 overflow-y-auto p-4">
              {isEmpty && !currentDay?.exercises.length ? (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center max-w-sm">
                    <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center">
                      <Dumbbell size={32} className="text-indigo-500" />
                    </div>
                    <h3 className="font-bold text-gray-900 text-lg mb-2">Build Your Program</h3>
                    <p className="text-sm text-gray-500 mb-6">
                      Drag exercises from the library to build your weekly training plan, or start with a template.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-2 justify-center">
                      <button
                        onClick={() => setShowTemplates(true)}
                        className="flex items-center justify-center gap-2 px-4 py-2.5 bg-indigo-500 hover:bg-indigo-600 text-white rounded-xl text-sm font-medium transition-colors shadow-sm"
                      >
                        <LayoutTemplate size={16} />
                        Use a Template
                      </button>
                      <button
                        onClick={() => setActiveTab('library')}
                        className="flex items-center justify-center gap-2 px-4 py-2.5 bg-white hover:bg-gray-50 text-gray-700 rounded-xl text-sm font-medium transition-colors border border-gray-200 lg:hidden"
                      >
                        📚 Browse Exercises
                      </button>
                    </div>
                  </div>
                </div>
              ) : currentDay ? (
                <DayPlanner
                  dayKey={currentDay.day}
                  dayLabel={currentDay.dayLabel}
                  exercises={currentDay.exercises}
                  isRestDay={currentDay.isRestDay}
                  notes={currentDay.notes}
                  onToggleRestDay={() => store.toggleRestDay(currentDay.day)}
                  onUpdateNotes={(notes) => store.updateDayNotes(currentDay.day, notes)}
                  onRemoveExercise={(id) => store.removeExerciseFromDay(currentDay.day, id)}
                  onUpdateExercise={(exercise) => store.updateExerciseInDay(currentDay.day, exercise)}
                  onReorderExercises={(exercises) => store.reorderExercisesInDay(currentDay.day, exercises)}
                />
              ) : null}
            </div>
          </div>
        </div>
      </div>

      {/* Drag Overlay */}
      <DragOverlay>
        {activeId && (() => {
          const exercise = allExercises.find(e => e.id === activeId);
          if (exercise) {
            return (
              <div className="bg-white rounded-xl shadow-2xl p-3 border-2 border-indigo-300 w-64 rotate-2">
                <div className="flex items-center gap-2">
                  <span>🏋️</span>
                  <span className="font-semibold text-sm">{exercise.name}</span>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {exercise.defaultSets}× {exercise.defaultReps}
                </p>
              </div>
            );
          }
          return null;
        })()}
      </DragOverlay>

      {/* Share Modal */}
      {showShare && (
        <ShareModal plan={store.plan} onClose={() => setShowShare(false)} />
      )}

      {/* Template Modal */}
      {showTemplates && (
        <TemplateModal
          onClose={() => setShowTemplates(false)}
          onSelect={handleSelectTemplate}
        />
      )}
    </DndContext>
  );
}

export default App;
