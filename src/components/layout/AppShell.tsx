import { Outlet } from 'react-router-dom';
import { BottomNav } from './BottomNav';
import { RestTimerFloat } from '../workout/RestTimerFloat';

export function AppShell() {
  return (
    <div className="min-h-screen bg-[#0a0a0f] text-slate-100">
      <main className="max-w-lg mx-auto pb-20">
        <Outlet />
      </main>
      <RestTimerFloat />
      <BottomNav />
    </div>
  );
}
