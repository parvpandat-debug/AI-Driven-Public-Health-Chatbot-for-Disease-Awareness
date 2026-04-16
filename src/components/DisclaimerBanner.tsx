import { AlertTriangle, X } from 'lucide-react';
import { useState } from 'react';

export default function DisclaimerBanner() {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  return (
    <div className="bg-amber-50 border-b border-amber-200 px-4 py-2.5">
      <div className="max-w-6xl mx-auto flex items-start gap-3">
        <AlertTriangle className="text-amber-600 mt-0.5 shrink-0" size={16} />
        <p className="text-amber-800 text-xs leading-relaxed flex-1">
          <span className="font-semibold">Medical Disclaimer:</span> Health Shield AI provides general health information for educational purposes only. This is NOT a substitute for professional medical advice, diagnosis, or treatment. Always consult a qualified healthcare provider for personal health concerns. In emergencies, call 911 or your local emergency number immediately.
        </p>
        <button
          onClick={() => setDismissed(true)}
          className="text-amber-500 hover:text-amber-700 transition-colors shrink-0 mt-0.5"
          aria-label="Dismiss disclaimer"
        >
          <X size={14} />
        </button>
      </div>
    </div>
  );
}
