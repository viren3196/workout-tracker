import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useExercises, toggleFavorite, addCustomExercise } from '../hooks/useExercises';
import type { MuscleGroup } from '../types';
import { MUSCLE_GROUP_LABELS } from '../types';
import { Header } from '../components/layout/Header';
import { Badge } from '../components/ui/Badge';
import { Modal } from '../components/ui/Modal';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { v4 as uuid } from 'uuid';

const categories: (MuscleGroup | 'all')[] = ['all', 'chest', 'back', 'shoulders', 'legs', 'biceps', 'triceps', 'abs', 'forearms', 'glutes', 'fullbody'];

export function ExercisesPage() {
  const exercises = useExercises();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState<MuscleGroup | 'all'>('all');
  const [showAddModal, setShowAddModal] = useState(false);

  const filtered = useMemo(() => {
    let list = exercises;
    if (search) {
      list = list.filter((e) => e.name.toLowerCase().includes(search.toLowerCase()));
    }
    if (category !== 'all') {
      list = list.filter((e) => e.category === category);
    }
    // Sort: favorites first, then alphabetical
    return list.sort((a, b) => {
      if (a.isFavorite && !b.isFavorite) return -1;
      if (!a.isFavorite && b.isFavorite) return 1;
      return a.name.localeCompare(b.name);
    });
  }, [exercises, search, category]);

  return (
    <div>
      <Header title="Exercises" right={
        <button onClick={() => setShowAddModal(true)} className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-slate-800 text-indigo-400">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
        </button>
      } />

      {/* Search */}
      <div className="px-4 py-3">
        <div className="relative">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search exercises..."
            className="w-full bg-slate-800/60 border border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>

      {/* Category filter */}
      <div className="flex gap-1.5 px-4 pb-3 overflow-x-auto no-scrollbar">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
              category === cat ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
            }`}
          >
            {cat === 'all' ? 'All' : MUSCLE_GROUP_LABELS[cat]}
          </button>
        ))}
      </div>

      {/* Count */}
      <div className="px-4 pb-2">
        <span className="text-xs text-slate-500">{filtered.length} exercises</span>
      </div>

      {/* List */}
      <div className="divide-y divide-slate-800/50">
        {filtered.map((exercise) => (
          <button
            key={exercise.id}
            onClick={() => navigate(`/exercises/${exercise.id}`)}
            className="w-full flex items-center justify-between px-4 py-3.5 hover:bg-slate-800/30 active:bg-slate-800/50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <button
                onClick={(e) => { e.stopPropagation(); toggleFavorite(exercise.id); }}
                className="w-8 h-8 flex items-center justify-center"
              >
                {exercise.isFavorite ? (
                  <svg className="w-5 h-5 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                  </svg>
                )}
              </button>
              <div className="text-left">
                <p className="text-sm font-medium text-slate-200">{exercise.name}</p>
                <div className="flex items-center gap-2 mt-0.5">
                  <Badge>{MUSCLE_GROUP_LABELS[exercise.category]}</Badge>
                  {exercise.isCustom && <Badge variant="primary">Custom</Badge>}
                </div>
              </div>
            </div>
            <svg className="w-4 h-4 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        ))}
      </div>

      <AddExerciseModal isOpen={showAddModal} onClose={() => setShowAddModal(false)} />
    </div>
  );
}

function AddExerciseModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [name, setName] = useState('');
  const [category, setCategory] = useState<MuscleGroup>('chest');

  const handleAdd = async () => {
    if (!name.trim()) return;
    await addCustomExercise({
      id: uuid(),
      name: name.trim(),
      category,
      equipmentType: 'BARBELL',
      weightMode: 'TOTAL_WEIGHT',
      isFavorite: false,
      isCustom: true,
    });
    setName('');
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add Custom Exercise" size="sm">
      <div className="space-y-4">
        <Input label="Exercise Name" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Landmine Press" />
        <div>
          <label className="text-xs font-medium text-slate-400 uppercase tracking-wider block mb-2">Muscle Group</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value as MuscleGroup)}
            className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2.5 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            {Object.entries(MUSCLE_GROUP_LABELS).map(([key, label]) => (
              <option key={key} value={key}>{label}</option>
            ))}
          </select>
        </div>
        <Button fullWidth onClick={handleAdd} disabled={!name.trim()}>Add Exercise</Button>
      </div>
    </Modal>
  );
}
