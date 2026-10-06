import React from 'react';
import { AlertCircle, ShieldCheck } from 'lucide-react';

export const DisclaimersBanner: React.FC = () => {
  return (
    <div className="bg-amber-50 border-b border-amber-200 px-4 py-2 text-xs text-amber-900">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-amber-700 shrink-0" />
          <span>
            <strong className="font-semibold">Smart India Hackathon 2026 (SIH26015) Prototype:</strong>{' '}
            Department of Land Resources (DoLR), Ministry of Rural Development. All remote-sensing datasets, satellite indices, and health scores are{' '}
            <span className="font-semibold underline decoration-amber-400">simulated demo data</span> for decision-support evaluation.
          </span>
        </div>
        <div className="flex items-center gap-2 text-amber-800 shrink-0 font-medium">
          <ShieldCheck className="w-3.5 h-3.5 text-amber-700" />
          <span>Advisory planning only • Ground-truth survey required</span>
        </div>
      </div>
    </div>
  );
};
