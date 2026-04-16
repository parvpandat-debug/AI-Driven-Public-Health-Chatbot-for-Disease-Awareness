import { Stethoscope, ChevronRight } from 'lucide-react';

const quickSymptoms = [
  { label: 'Fever & Chills', prompt: 'I have fever and chills. What could it be and what should I do?' },
  { label: 'Chest Pain', prompt: 'I am experiencing chest pain. What are the possible causes and when should I seek help?' },
  { label: 'Shortness of Breath', prompt: 'I have shortness of breath. What could cause this?' },
  { label: 'Persistent Fatigue', prompt: 'I have been extremely tired for weeks. What conditions could cause persistent fatigue?' },
  { label: 'Headache', prompt: 'I have a severe headache. What are possible causes and when is it serious?' },
  { label: 'High Blood Sugar Signs', prompt: 'What are the symptoms of high blood sugar and diabetes?' },
];

interface Props {
  onSelect: (prompt: string) => void;
  onDismiss: () => void;
}

export default function SymptomCheckerGuide({ onSelect, onDismiss }: Props) {
  return (
    <div className="mx-4 my-3 bg-gradient-to-br from-teal-50 to-sky-50 border border-teal-100 rounded-2xl p-4">
      <div className="flex items-center gap-2 mb-3">
        <div className="w-8 h-8 bg-teal-600 rounded-lg flex items-center justify-center">
          <Stethoscope size={16} className="text-white" />
        </div>
        <div>
          <h3 className="text-sm font-semibold text-teal-900">Symptom Checker</h3>
          <p className="text-xs text-teal-600">Select a symptom or type your own question below</p>
        </div>
        <button
          onClick={onDismiss}
          className="ml-auto text-xs text-slate-400 hover:text-slate-600 transition-colors"
        >
          Dismiss
        </button>
      </div>

      <div className="grid grid-cols-2 gap-2">
        {quickSymptoms.map((item) => (
          <button
            key={item.label}
            onClick={() => { onSelect(item.prompt); onDismiss(); }}
            className="flex items-center justify-between gap-1 px-3 py-2 bg-white rounded-xl border border-teal-100 hover:border-teal-300 hover:bg-teal-50 transition-all text-left group"
          >
            <span className="text-xs font-medium text-slate-700 group-hover:text-teal-800">{item.label}</span>
            <ChevronRight size={12} className="text-slate-300 group-hover:text-teal-500 shrink-0" />
          </button>
        ))}
      </div>

      <p className="text-xs text-slate-400 mt-3 text-center">
        This checker provides general guidance only. Always see a doctor for diagnosis.
      </p>
    </div>
  );
}
