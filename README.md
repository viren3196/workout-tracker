# IronLog

Strength training workout tracker PWA. Log sets in seconds, track PRs, see progress over time.

All data stays on your device (IndexedDB). No backend, no accounts, no tracking.

## Setup

```bash
npm install
```

## Development

```bash
npm run dev
```

Open http://localhost:5173 in Chrome.

## Production Build

```bash
npm run build
```

Output goes to `dist/`. Preview with:

```bash
npm run preview
```

## Install as PWA on Android

1. Open the deployed URL in Chrome on Android
2. Tap the three-dot menu
3. Tap "Install app" or "Add to Home Screen"
4. The app will appear on your home screen and run in standalone mode

## Deploy

### Vercel

```bash
npm i -g vercel
vercel
```

### Netlify

Drop the `dist/` folder into Netlify, or connect the repo and set:
- Build command: `npm run build`
- Publish directory: `dist`

## Backup and Restore

Go to **Settings > Backup / Restore**:

- **Export**: Downloads a JSON file with all your data (exercises, workouts, PRs, templates, body weight logs, settings)
- **Import**: Upload a previously exported JSON file to restore your data

The backup format is versioned (currently v1). Keep backups in a safe place.

## Architecture

### Tech Stack

- React 18 + TypeScript
- Vite with PWA plugin (Workbox)
- Tailwind CSS v4
- Dexie.js (IndexedDB wrapper)
- Recharts for charts
- date-fns for date handling

### Data Storage

Everything is stored locally in IndexedDB via Dexie.js. Active workout state is additionally saved to localStorage for crash recovery.

### Future: Google Drive Sync

The backup system uses a `BackupProvider` interface (`src/backup/types.ts`). The current implementation is `LocalBackupProvider` (file export/import). A future `GoogleDriveBackupProvider` would implement the same interface to enable cloud sync without changing any UI code.

```typescript
interface BackupProvider {
  export(): Promise<BackupData>;
  import(data: BackupData): Promise<void>;
}
```
