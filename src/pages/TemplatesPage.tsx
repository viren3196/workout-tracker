import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTemplates, deleteTemplate, updateTemplateLastUsed } from '../hooks/useTemplates';
import { useExercise } from '../hooks/useExercises';
import { useWorkoutContext } from '../context/WorkoutContext';
import { Header } from '../components/layout/Header';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { EmptyState } from '../components/ui/EmptyState';
import { ConfirmDialog } from '../components/ui/ConfirmDialog';

export function TemplatesPage() {
  const templates = useTemplates();
  const navigate = useNavigate();
  const { startWorkout, addExercise } = useWorkoutContext();
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const handleUseTemplate = async (templateId: string) => {
    const template = templates.find((t) => t.id === templateId);
    if (!template) return;

    startWorkout(template.name);
    for (const te of template.exercises) {
      addExercise(te.exerciseId, 'BARBELL', 'TOTAL_WEIGHT');
    }
    await updateTemplateLastUsed(templateId);
    navigate('/workout');
  };

  return (
    <div>
      <Header title="Templates" showBack />

      <div className="px-4 py-4 space-y-3">
        {templates.length === 0 ? (
          <EmptyState
            icon={
              <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
              </svg>
            }
            title="No Templates Yet"
            description="Save a workout as a template to quickly repeat it in the future."
          />
        ) : (
          templates.map((template) => (
            <Card key={template.id} className="p-4">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-medium text-slate-200">{template.name}</h3>
                  <p className="text-xs text-slate-500">{template.exercises.length} exercises</p>
                </div>
                <button
                  onClick={() => setDeleteId(template.id)}
                  className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-red-900/30 text-slate-500 hover:text-red-400"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
              <div className="flex gap-1.5 flex-wrap mb-3">
                {template.exercises.map((te) => (
                  <TemplateExBadge key={te.exerciseId} exerciseId={te.exerciseId} />
                ))}
              </div>
              <Button size="sm" fullWidth onClick={() => handleUseTemplate(template.id)}>
                Start from Template
              </Button>
            </Card>
          ))
        )}
      </div>

      <ConfirmDialog
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={() => { if (deleteId) deleteTemplate(deleteId); setDeleteId(null); }}
        title="Delete Template?"
        message="This template will be permanently deleted."
        confirmLabel="Delete"
      />
    </div>
  );
}

function TemplateExBadge({ exerciseId }: { exerciseId: string }) {
  const exercise = useExercise(exerciseId);
  return (
    <span className="px-2 py-0.5 rounded-md bg-slate-800 text-xs text-slate-400">
      {exercise?.name ?? 'Unknown'}
    </span>
  );
}
