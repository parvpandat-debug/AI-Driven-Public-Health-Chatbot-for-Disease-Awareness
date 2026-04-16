import { ShieldPlus, Activity } from 'lucide-react';

export default function Header() {
  return (
    <header className="bg-teal-700 text-white px-6 py-3 flex items-center justify-between shrink-0 shadow-sm">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
          <ShieldPlus size={18} className="text-white" />
        </div>
        <div>
          <h1 className="text-base font-bold leading-tight tracking-tight">Public Health Shield</h1>
          <p className="text-xs text-teal-200">AI-Powered Health Information Assistant</p>
        </div>
      </div>
      <div className="flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-full">
        <Activity size={13} className="text-emerald-300" />
        <span className="text-xs font-medium text-teal-100">AI Active</span>
        <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
      </div>
    </header>
  );
}
