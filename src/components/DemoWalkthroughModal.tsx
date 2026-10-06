import React, { useState } from 'react';
import {
  X,
  ChevronRight,
  ChevronLeft,
  CheckCircle2,
  Sparkles,
  Layers,
  Activity,
  Droplets,
  AlertTriangle,
  FileText,
  RotateCcw,
  Compass,
} from 'lucide-react';
import { Watershed } from '../types/watershed';

interface DemoWalkthroughModalProps {
  isOpen: boolean;
  onClose: () => void;
  watershed: Watershed | null;
  onNavigateTab: (tab: string) => void;
}

export const DemoWalkthroughModal: React.FC<DemoWalkthroughModalProps> = ({
  isOpen,
  onClose,
  watershed,
  onNavigateTab,
}) => {
  const [currentStep, setCurrentStep] = useState(0);

  if (!isOpen) return null;

  const steps = [
    {
      step: 1,
      title: '1. Select Watershed',
      tab: 'dashboard',
      description: `Loaded demo watershed: ${watershed?.code || 'WS-MH-001'} - ${watershed?.name || 'Indrayani Catchment'}, ${watershed?.district}, ${watershed?.state}. Total area: ${watershed?.areaKm2} km².`,
      actionLabel: 'Go to Dashboard',
      icon: Compass,
      metric: `${watershed?.areaKm2} km² Basin Area`,
    },
    {
      step: 2,
      title: '2. Load Geo-Coded Image',
      tab: 'image',
      description: 'Ingested multi-spectral 10m Sentinel-2B ortho-rectified GeoTIFF image with georeferencing in WGS 84 / UTM Zone 43N.',
      actionLabel: 'Inspect Geo-Coded Image',
      icon: Layers,
      metric: '10m GSD Multi-Spectral',
    },
    {
      step: 3,
      title: '3. Run GIS Analysis Pipeline',
      tab: 'gis',
      description: 'Automated 7-stage spatial processing pipeline: Radiometric calibration, NDVI/NDWI indexing, LULC supervised classification, D-8 flow routing.',
      actionLabel: 'Run GIS Analysis',
      icon: Activity,
      metric: '7 Processing Stages',
    },
    {
      step: 4,
      title: '4. Land Use & Land Cover Classification',
      tab: 'gis',
      description: 'Quantified 7 major land classes: Agriculture (42%), Forest (22%), Grassland (11%), Barren (10%), Water (8%), Built-up (5%), Other (2%).',
      actionLabel: 'View LULC Classification',
      icon: Layers,
      metric: '42% Agriculture | 22% Forest',
    },
    {
      step: 5,
      title: '5. Vegetation Health & NDVI Index',
      tab: 'gis',
      description: 'Estimated vegetation coverage at 64% with mean NDVI of 0.54. Identified 8% canopy stress on upper ridge escarpment requiring conservation.',
      actionLabel: 'View Vegetation Index',
      icon: Sparkles,
      metric: '64% Coverage | 0.54 Mean NDVI',
    },
    {
      step: 6,
      title: '6. Water Body Inventory & Detection',
      tab: 'gis',
      description: 'Identified 8 water bodies totaling 1.82 km² storage area. Detected +6% retention increase compared to previous non-treated baseline.',
      actionLabel: 'View Water Bodies',
      icon: Droplets,
      metric: '8 Water Bodies | 1.82 km²',
    },
    {
      step: 7,
      title: '7. Drainage Network & Stream Order',
      tab: 'gis',
      description: 'Mapped 42.4 km total stream length with 1.71 km/km² drainage density. Flagged 3 stream bottlenecks with bedload silt accumulation.',
      actionLabel: 'View Drainage Lines',
      icon: Compass,
      metric: '42.4 km Length | 3 Bottlenecks',
    },
    {
      step: 8,
      title: '8. Soil Moisture Stress Estimation',
      tab: 'gis',
      description: 'Classified 32% high moisture (valley), 44% moderate, and 24% low moisture (rocky upper reaches). Ground field verification recommended.',
      actionLabel: 'View Soil Moisture',
      icon: Activity,
      metric: '24% Low Moisture Stress',
    },
    {
      step: 9,
      title: '9. Watershed Health Score (Prototype)',
      tab: 'gis',
      description: 'Calculated composite score of 72 / 100 with an "Improving" trend. Breakdown: Vegetation (78), Water (69), Drainage (74), Land (67).',
      actionLabel: 'View Health Score',
      icon: Activity,
      metric: '72 / 100 Health Score',
    },
    {
      step: 10,
      title: '10. Multi-Temporal Change Detection',
      tab: 'change',
      description: 'Compared Baseline (March 2024) vs Current (March 2026): +6.0% vegetation expansion, +8.3% water surface gain, -4.5% barren land contraction.',
      actionLabel: 'Compare Before / After',
      icon: Layers,
      metric: '+6.0% Vegetation | +8.3% Water',
    },
    {
      step: 11,
      title: '11. Issue & Risk Identification',
      tab: 'issues',
      description: 'Prioritized 5 actionable issues: Low vegetation on southern ridge, drainage siltation on Sadavali Nala, and gully erosion near Takve Khurd.',
      actionLabel: 'Review Watershed Issues',
      icon: AlertTriangle,
      metric: '5 Actionable Issues Flagged',
    },
    {
      step: 12,
      title: '12. AI Watershed Insights (Google Gemini)',
      tab: 'ai',
      description: 'Server-side Gemini 3.8 Flash model synthesizes hydrological changes, risk hotspots, field checklists, and ridge-to-valley action proposals.',
      actionLabel: 'Read AI Insights',
      icon: Sparkles,
      metric: 'Gemini 3.8 Flash AI Model',
    },
    {
      step: 13,
      title: '13. Generate Watershed Assessment Report',
      tab: 'report',
      description: 'Compiled comprehensive official DoLR format assessment report complete with GIS indices, change tables, and print-ready summary.',
      actionLabel: 'Open Assessment Report',
      icon: FileText,
      metric: 'Official Report Ready',
    },
  ];

  const currentStepData = steps[currentStep];
  const StepIcon = currentStepData.icon;

  const handleGoToSection = () => {
    onNavigateTab(currentStepData.tab);
    onClose();
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full border border-slate-200 overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-800 to-indigo-900 text-white p-4 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="bg-amber-400 text-amber-950 font-bold text-[10px] px-2 py-0.5 rounded uppercase tracking-wider">
                SIH 2026 Showcase
              </span>
              <span className="text-blue-200 text-xs font-mono">
                Step {currentStep + 1} of {steps.length}
              </span>
            </div>
            <h2 className="text-lg font-bold text-white mt-1">
              JalDrishti AI Solution Walkthrough
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-slate-100 h-1.5">
          <div
            className="bg-blue-600 h-1.5 transition-all duration-300"
            style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
          />
        </div>

        {/* Body Content */}
        <div className="p-6 space-y-4">
          <div className="flex items-start gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-700 shrink-0 shadow-xs">
              <StepIcon className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-slate-900">
                  {currentStepData.title}
                </h3>
                <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-[11px] font-semibold px-2 py-0.5 rounded">
                  {currentStepData.metric}
                </span>
              </div>
              <p className="text-slate-600 text-sm mt-1.5 leading-relaxed">
                {currentStepData.description}
              </p>
            </div>
          </div>

          {/* Quick step pills */}
          <div className="bg-slate-50 border border-slate-200 rounded-lg p-3">
            <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-2">
              Solution Flow Stage:
            </div>
            <div className="flex flex-wrap gap-1.5">
              {steps.map((s, idx) => (
                <button
                  key={s.step}
                  onClick={() => setCurrentStep(idx)}
                  className={`text-[11px] px-2 py-1 rounded font-medium transition-colors cursor-pointer ${
                    currentStep === idx
                      ? 'bg-blue-700 text-white shadow-xs font-semibold'
                      : idx < currentStep
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {s.step}. {s.title.split('.')[1]?.trim().split(' ')[0]}
                </button>
              ))}
            </div>
          </div>

          <div className="text-[11px] text-slate-500 bg-amber-50/60 border border-amber-200/60 rounded-md p-2">
            <strong className="text-amber-800 font-semibold">SIH Demo Notice:</strong> Simulated remote-sensing indices and GeoTIFF parameters reflect real-world DoLR guidelines for demonstration.
          </div>
        </div>

        {/* Footer controls */}
        <div className="bg-slate-50 border-t border-slate-200 px-6 py-3.5 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrev}
              disabled={currentStep === 0}
              className={`flex items-center gap-1 text-xs font-semibold px-3 py-2 rounded-lg border transition-colors ${
                currentStep === 0
                  ? 'border-slate-200 text-slate-300 cursor-not-allowed'
                  : 'border-slate-300 text-slate-700 hover:bg-white'
              }`}
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Previous</span>
            </button>
            <button
              onClick={() => setCurrentStep(0)}
              className="text-xs text-slate-500 hover:text-slate-800 p-2"
              title="Reset to step 1"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleGoToSection}
              className="text-xs font-semibold text-blue-700 hover:text-blue-800 hover:bg-blue-50 px-3 py-2 rounded-lg border border-blue-200 transition-colors"
            >
              {currentStepData.actionLabel}
            </button>

            {currentStep < steps.length - 1 ? (
              <button
                onClick={handleNext}
                className="flex items-center gap-1 bg-blue-700 hover:bg-blue-800 text-white text-xs font-semibold px-4 py-2 rounded-lg shadow-xs transition-colors"
              >
                <span>Next Step</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={handleGoToSection}
                className="flex items-center gap-1 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold px-4 py-2 rounded-lg shadow-xs transition-colors"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Finish & View Report</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
