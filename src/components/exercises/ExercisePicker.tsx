import { useState, useMemo } from 'react';
import { useExercises, useRecentExercises } from '../../hooks/useExercises';
import { useWorkoutContext } from '../../context/WorkoutContext';
import type { Exercise, MuscleGroup } from '../../types';
import { MUSCLE_GROUP_LABELS } from '../../types';
import { BottomSheet } from '../ui/Modal';

interface ExercisePickerProps {
  isOpen: boolean;
  onClose: () => void;
}

const categories: MuscleGroup[] = ['chest', 'back', 'shoulders', 'legs', 'biceps', 'triceps', 'abs', 'forearms', 'glutes', 'fullbody'];

export function ExercisePicker({ isOpen, onClose }: ExercisePickerProps) {
  const exercises = useExercises();
  const recentExercises = useRecentExercises(8);
  const { addExercise } = useWorkoutContext();
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<MuscleGroup | 'recent' | 'favorites'>('recent');

  const filteredExercises = useMemo(() => {
    let list: Exercise[] = [];

    if (search) {
      list = exercises.filter((e) =>
        e.name.toLowerCase().includes(search.toLowerCase())
      );
    } else if (selectedCategory === 'recent') {
      list = recentExercises.filter((e) => e.lastUsed);
    } else if (selectedCategory === 'favorites') {
      list = exercises.filter((e) => e.isFavorite);
    } else {
      list = exercises.filter((e) => e.category === selectedCategory);
    }

    return list;
  }, [exercises, recentExercises, search, selectedCategory]);

  const handleSelect = (exercise: Exercise) => {
    addExercise(exercise.id, exercise.equipmentType, exercise.weightMode);
    onClose();
    setSearch('');
  };

  return (
    <BottomSheet isOpen={isOpen} onClose={onClose} title="Add Exercise">
      {/* Search */}
      <div className="px-4 pb-3">
        <div className="relative">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search exercises..."
            autoFocus
            className="w-full bg-slate-800/60 border border-slate-700 rounded-xl pl-10 pr-4 py-3 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>

      {/* Category tabs */}
      {!search && (
        <div className="flex gap-1.5 px-4 pb-3 overflow-x-auto no-scrollbar">
          <CategoryTab label="Recent" active={selectedCategory === 'recent'} onClick={() => setSelectedCategory('recent')} />
          <CategoryTab label="Favs" active={selectedCategory === 'favorites'} onClick={() => setSelectedCategory('favorites')} />
          {categories.map((cat) => (
            <CategoryTab
              key={cat}
              label={MUSCLE_GROUP_LABELS[cat]}
              active={selectedCategory === cat}
              onClick={() => setSelectedCategory(cat)}
            />
          ))}
        </div>
      )}

      {/* Exercise list */}
      <div className="divide-y divide-slate-800/50 max-h-[50vh] overflow-y-auto">
        {filteredExercises.length === 0 ? (
          <div className="py-12 text-center text-slate-500 text-sm">
            {search ? 'No exercises found' : selectedCategory === 'recent' ? 'No recent exercises yet' : 'No favorites yet'}
          </div>
        ) : (
          filteredExercises.map((exercise) => (
            <button
              key={exercise.id}
              onClick={() => handleSelect(exercise)}
              className="w-full flex items-center justify-between px-5 py-3.5 hover:bg-slate-800/40 active:bg-slate-800/60 transition-colors"
            >
              <div className="text-left">
                <div className="text-sm font-medium text-slate-200">{exercise.name}</div>
                <div className="text-xs text-slate-500 capitalize">{exercise.category} / {exercise.equipmentType.toLowerCase()}</div>
              </div>
              {exercise.isFavorite && (
                <svg className="w-4 h-4 text-amber-400 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              )}
            </button>
          ))
        )}
      </div>
    </BottomSheet>
  );
}

function CategoryTab({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`
        flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-colors
        ${active ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'}
      `}
    >
      {label}
    </button>
  );
}
