import React, { useState } from 'react';
import {
  GitCompare,
  TrendingUp,
  TrendingDown,
  Droplets,
  Layers,
  ArrowRight,
  Sparkles,
  Info,
  Calendar,
  SplitSquareVertical,
} from 'lucide-react';
import { ChangeDetectionMetrics, Watershed } from '../types/watershed';

interface ChangeDetectionViewProps {
  watershed: Watershed | null;
  changeData: ChangeDetectionMetrics | null;
  onNavigateTab: (tab: string) => void;
}

export const ChangeDetectionView: React.FC<ChangeDetectionViewProps> = ({
  watershed,
  changeData,
  onNavigateTab,
}) => {
  const [sliderPosition, setSliderPosition] = useState<number>(50);
  const [viewMode, setViewMode] = useState<'swipe' | 'sideBySide'>('swipe');

  return (
    <div className="space-y-8 pb-12">
      {/* Header Bar */}
      <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-blue-100 text-blue-800 text-[10px] font-bold px-2 py-0.5 rounded">
              STAGE 03 OF 05
            </span>
            <h2 className="text-base font-bold text-slate-900">
              Multi-Temporal Change Detection
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Comparing {changeData?.previousPeriodLabel || 'Baseline (2024)'} vs{' '}
            {changeData?.currentPeriodLabel || 'Current (2026)'}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="bg-slate-100 p-1 rounded-lg text-xs font-medium flex items-center gap-1">
            <button
              onClick={() => setViewMode('swipe')}
              className={`px-3 py-1 rounded transition-colors cursor-pointer ${
                viewMode === 'swipe' ? 'bg-white text-blue-700 shadow-xs font-semibold' : 'text-slate-600'
              }`}
            >
              Swipe Slider
            </button>
            <button
              onClick={() => setViewMode('sideBySide')}
              className={`px-3 py-1 rounded transition-colors cursor-pointer ${
                viewMode === 'sideBySide' ? 'bg-white text-blue-700 shadow-xs font-semibold' : 'text-slate-600'
              }`}
            >
              Side-by-Side
            </button>
          </div>
        </div>
      </div>

      {/* 4 Quantitative Comparison Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Vegetation Delta */}
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span className="font-semibold uppercase tracking-wider">Vegetation Canopy</span>
            <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
              {changeData?.vegetationDeltaPct && changeData.vegetationDeltaPct >= 0 ? '+' : ''}
              {changeData?.vegetationDeltaPct || '+6.0'}%
            </span>
          </div>
          <div className="flex items-baseline justify-between pt-1">
            <div>
              <span className="text-[11px] text-slate-400 block">Baseline (2024)</span>
              <span className="text-lg font-bold text-slate-700">
                {changeData?.vegetationPreviousPct || 58}%
              </span>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-300" />
            <div className="text-right">
              <span className="text-[11px] text-slate-400 block">Current (2026)</span>
              <span className="text-xl font-extrabold text-emerald-700">
                {changeData?.vegetationCurrentPct || 64}%
              </span>
            </div>
          </div>
          <p className="text-[11px] text-slate-500">Net biomass increase post treatment</p>
        </div>

        {/* Water Area Delta */}
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span className="font-semibold uppercase tracking-wider">Surface Water Area</span>
            <span className="font-bold text-sky-700 bg-sky-50 px-2 py-0.5 rounded">
              {changeData?.waterAreaDeltaPct && changeData.waterAreaDeltaPct >= 0 ? '+' : ''}
              {changeData?.waterAreaDeltaPct || '+8.3'}%
            </span>
          </div>
          <div className="flex items-baseline justify-between pt-1">
            <div>
              <span className="text-[11px] text-slate-400 block">Baseline (2024)</span>
              <span className="text-lg font-bold text-slate-700">
                {changeData?.waterAreaPreviousKm2 || 1.68} km²
              </span>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-300" />
            <div className="text-right">
              <span className="text-[11px] text-slate-400 block">Current (2026)</span>
              <span className="text-xl font-extrabold text-sky-700">
                {changeData?.waterAreaCurrentKm2 || 1.82} km²
              </span>
            </div>
          </div>
          <p className="text-[11px] text-slate-500">New percolation check dams active</p>
        </div>

        {/* Built-up Expansion */}
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span className="font-semibold uppercase tracking-wider">Built-up Area</span>
            <span className="font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded">
              +{changeData?.builtUpDeltaPct || 0.8}%
            </span>
          </div>
          <div className="flex items-baseline justify-between pt-1">
            <div>
              <span className="text-[11px] text-slate-400 block">Baseline (2024)</span>
              <span className="text-lg font-bold text-slate-700">
                {changeData?.builtUpPreviousPct || 4.2}%
              </span>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-300" />
            <div className="text-right">
              <span className="text-[11px] text-slate-400 block">Current (2026)</span>
              <span className="text-xl font-extrabold text-slate-800">
                {changeData?.builtUpCurrentPct || 5.0}%
              </span>
            </div>
          </div>
          <p className="text-[11px] text-slate-500">Gradual rural settlement expansion</p>
        </div>

        {/* Barren Land Contraction */}
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span className="font-semibold uppercase tracking-wider">Barren / Degraded</span>
            <span className="font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded">
              {changeData?.barrenLandDeltaPct || -4.5}%
            </span>
          </div>
          <div className="flex items-baseline justify-between pt-1">
            <div>
              <span className="text-[11px] text-slate-400 block">Baseline (2024)</span>
              <span className="text-lg font-bold text-slate-700">
                {changeData?.barrenLandPreviousPct || 14.5}%
              </span>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-300" />
            <div className="text-right">
              <span className="text-[11px] text-slate-400 block">Current (2026)</span>
              <span className="text-xl font-extrabold text-amber-700">
                {changeData?.barrenLandCurrentPct || 10.0}%
              </span>
            </div>
          </div>
          <p className="text-[11px] text-slate-500">Converted via contour agroforestry</p>
        </div>
      </div>

      {/* Visual Before / After Comparison */}
      <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              Interactive Before / After Satellite Comparison
            </h3>
            <p className="text-xs text-slate-500">
              {viewMode === 'swipe' ? 'Drag the slider handle to inspect changes between 2024 and 2026' : 'Side-by-side synchronized comparison'}
            </p>
          </div>
          <span className="bg-slate-100 text-slate-700 text-xs font-mono px-2.5 py-1 rounded">
            SIMULATED MULTI-TEMPORAL IMAGERY
          </span>
        </div>

        {viewMode === 'swipe' ? (
          <div className="relative rounded-xl overflow-hidden select-none border border-slate-300 bg-slate-950 h-[420px]">
            {/* Background Image: Baseline 2024 */}
            <img
              src="https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=1200&q=80"
              alt="Baseline 2024 Satellite Image"
              className="absolute inset-0 w-full h-full object-cover filter brightness-90 saturate-80"
            />
            <div className="absolute top-4 left-4 z-10 bg-slate-900/80 backdrop-blur-xs text-white text-xs font-bold px-3 py-1.5 rounded-md border border-slate-700">
              Baseline: March 2024 (Pre-Intervention)
            </div>

            {/* Foreground Image: Current 2026 (Clipped by slider position) */}
            <div
              className="absolute inset-0 overflow-hidden"
              style={{ width: `${sliderPosition}%` }}
            >
              <img
                src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=80"
                alt="Current 2026 Satellite Image"
                className="absolute inset-0 w-full h-full object-cover filter brightness-105 saturate-125"
                style={{ width: '100%', maxWidth: 'none' }}
              />
              <div className="absolute top-4 left-4 z-10 bg-blue-900/90 backdrop-blur-xs text-white text-xs font-bold px-3 py-1.5 rounded-md border border-blue-600">
                Current: March 2026 (Post-Intervention)
              </div>
            </div>

            {/* Slider Divider Line */}
            <div
              className="absolute top-0 bottom-0 w-1 bg-white shadow-2xl cursor-ew-resize z-20"
              style={{ left: `${sliderPosition}%` }}
            >
              <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-blue-600 border-2 border-white shadow-lg flex items-center justify-center text-white text-xs font-bold">
                ⇄
              </div>
            </div>

            {/* Range input for slider movement */}
            <input
              type="range"
              min="0"
              max="100"
              value={sliderPosition}
              onChange={(e) => setSliderPosition(Number(e.target.value))}
              className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize z-30"
            />
          </div>
        ) : (
          /* Side-by-Side View */
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="rounded-xl overflow-hidden border border-slate-200 relative">
              <div className="bg-slate-900/80 text-white text-xs font-bold px-3 py-1.5 absolute top-3 left-3 z-10 rounded">
                Previous Period: March 2024
              </div>
              <img
                src="https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=1200&q=80"
                alt="Previous 2024"
                className="w-full h-80 object-cover filter brightness-90 saturate-80"
              />
            </div>
            <div className="rounded-xl overflow-hidden border border-slate-200 relative">
              <div className="bg-blue-900/90 text-white text-xs font-bold px-3 py-1.5 absolute top-3 left-3 z-10 rounded">
                Current Period: March 2026
              </div>
              <img
                src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=80"
                alt="Current 2026"
                className="w-full h-80 object-cover filter brightness-105 saturate-125"
              />
            </div>
          </div>
        )}

        {/* Change Indicators Legend */}
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs pt-2">
          <div className="flex flex-wrap items-center gap-3">
            <span className="flex items-center gap-1.5 text-emerald-700 font-medium">
              <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full inline-block" />
              Vegetation Increase (+6%)
            </span>
            <span className="flex items-center gap-1.5 text-sky-700 font-medium">
              <span className="w-2.5 h-2.5 bg-sky-500 rounded-full inline-block" />
              New Water Ponding (+14 ha)
            </span>
            <span className="flex items-center gap-1.5 text-amber-700 font-medium">
              <span className="w-2.5 h-2.5 bg-amber-500 rounded-full inline-block" />
              Contour Trenched Ridge
            </span>
            <span className="flex items-center gap-1.5 text-slate-700 font-medium">
              <span className="w-2.5 h-2.5 bg-slate-500 rounded-full inline-block" />
              New Habitation Built-up
            </span>
          </div>

          <button
            onClick={() => onNavigateTab('issues')}
            className="text-blue-700 hover:text-blue-900 font-semibold cursor-pointer"
          >
            Review Detected Watershed Issues →
          </button>
        </div>
      </div>

      {/* Narrative Synthesis */}
      <div className="bg-slate-50 rounded-xl p-5 border border-slate-200 space-y-2">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">
          Spatial Change Synthesis
        </h4>
        <p className="text-xs text-slate-700 leading-relaxed">
          {changeData?.summary ||
            'Net positive environmental trajectory: +6.0% vegetation biomass expansion and +8.3% surface water storage gain following watershed treatment structures. Barren land contracted by 4.5%.'}
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2">
          {changeData?.keyChanges?.map((ch, idx) => (
            <div
              key={idx}
              className="text-[11px] text-slate-700 bg-white p-2.5 rounded-lg border border-slate-200 flex items-start gap-2"
            >
              <span className="text-blue-600 font-bold">•</span>
              <span>{ch}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
