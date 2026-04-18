import { useState, useRef } from 'react';
import { useSettings, updateSettings } from '../hooks/useSettings';
import { Header } from '../components/layout/Header';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { LocalBackupProvider, downloadBackup, readBackupFile } from '../backup/localBackup';

export function SettingsPage() {
  const settings = useSettings();
  const [importing, setImporting] = useState(false);
  const [importResult, setImportResult] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const backup = new LocalBackupProvider();

  const handleExport = async () => {
    const data = await backup.export();
    downloadBackup(data);
  };

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImporting(true);
    setImportResult(null);
    try {
      const data = await readBackupFile(file);
      await backup.import(data);
      setImportResult('Data imported successfully. Refresh the page to see changes.');
    } catch (err: any) {
      setImportResult(`Error: ${err.message}`);
    }
    setImporting(false);
    if (fileRef.current) fileRef.current.value = '';
  };

  return (
    <div>
      <Header title="Settings" />
      <div className="px-4 py-4 space-y-4">
        {/* Rest timer */}
        <Card className="p-4">
          <h3 className="text-sm font-medium text-slate-300 mb-3">Default Rest Timer</h3>
          <div className="flex gap-2">
            {[60, 90, 120, 180].map((s) => (
              <button
                key={s}
                onClick={() => updateSettings({ defaultRestTimer: s })}
                className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${
                  settings.defaultRestTimer === s
                    ? 'bg-indigo-600 text-white'
                    : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                }`}
              >
                {s}s
              </button>
            ))}
          </div>
        </Card>

        {/* Weight unit */}
        <Card className="p-4">
          <h3 className="text-sm font-medium text-slate-300 mb-3">Weight Unit</h3>
          <div className="flex gap-2">
            {(['kg', 'lb'] as const).map((unit) => (
              <button
                key={unit}
                onClick={() => updateSettings({ weightUnit: unit })}
                className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${
                  settings.weightUnit === unit
                    ? 'bg-indigo-600 text-white'
                    : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                }`}
              >
                {unit.toUpperCase()}
              </button>
            ))}
          </div>
        </Card>

        {/* Body weight */}
        <Card className="p-4">
          <h3 className="text-sm font-medium text-slate-300 mb-3">Body Weight</h3>
          <div className="flex items-center gap-3">
            <input
              type="text"
              inputMode="decimal"
              value={settings.bodyWeight || ''}
              placeholder="0"
              onChange={(e) => {
                const v = parseFloat(e.target.value);
                updateSettings({ bodyWeight: isNaN(v) ? undefined : v });
              }}
              className="flex-1 bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <span className="text-sm text-slate-500">{settings.weightUnit}</span>
          </div>
        </Card>

        {/* Backup */}
        <Card className="p-4 space-y-3">
          <h3 className="text-sm font-medium text-slate-300">Backup / Restore</h3>
          <p className="text-xs text-slate-500">
            Export your data as a JSON file or restore from a previous backup.
          </p>
          <div className="flex gap-3">
            <Button variant="secondary" fullWidth onClick={handleExport}>
              Export Data
            </Button>
            <Button
              variant="secondary"
              fullWidth
              onClick={() => fileRef.current?.click()}
              disabled={importing}
            >
              {importing ? 'Importing...' : 'Import Data'}
            </Button>
          </div>
          <input
            ref={fileRef}
            type="file"
            accept=".json"
            onChange={handleImport}
            className="hidden"
          />
          {importResult && (
            <p className={`text-xs ${importResult.startsWith('Error') ? 'text-red-400' : 'text-emerald-400'}`}>
              {importResult}
            </p>
          )}
        </Card>

        {/* App info */}
        <Card className="p-4">
          <h3 className="text-sm font-medium text-slate-300 mb-2">About</h3>
          <p className="text-xs text-slate-500">IronLog v1.0</p>
          <p className="text-xs text-slate-500">Strength training tracker PWA</p>
          <p className="text-xs text-slate-500 mt-2">All data is stored locally on your device. Nothing is sent to any server.</p>
        </Card>
      </div>
    </div>
  );
}
