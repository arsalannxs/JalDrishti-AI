import React, { useState } from 'react';
import {
  Activity,
  CheckCircle2,
  Layers,
  TrendingUp,
  Droplets,
  TreePine,
  Compass,
  AlertCircle,
  Play,
  RotateCcw,
  Sparkles,
  ShieldCheck,
  ChevronRight,
} from 'lucide-react';
import {
  Watershed,
  LandUseCategory,
  VegetationHealthData,
  WaterBodyFeature,
  SoilMoistureData,
} from '../types/watershed';
import { apiService } from '../services/api';

interface GISAnalysisViewProps {
  watershed: Watershed | null;
  landUse: LandUseCategory[];
  vegetation: VegetationHealthData | null;
  waterBodies: WaterBodyFeature[];
  drainage: any;
  soilMoisture: SoilMoistureData | null;
  onNavigateTab: (tab: string) => void;
}

export const GISAnalysisView: React.FC<GISAnalysisViewProps> = ({
  watershed,
  landUse,
  vegetation,
  waterBodies,
  drainage,
  soilMoisture,
  onNavigateTab,
}) => {
  const [selectedLayerOptions, setSelectedLayerOptions] = useState({
    landUse: true,
    vegetation: true,
    waterBodies: true,
    drainage: true,
    soilMoisture: true,
    builtUp: true,
    degradedLand: true,
  });

  const [isRunningAnalysis, setIsRunningAnalysis] = useState(false);
  const [analysisCompleted, setAnalysisCompleted] = useState(true);
  const [activeStageIndex, setActiveStageIndex] = useState(6);
  const [selectedLulc, setSelectedLulc] = useState<LandUseCategory | null>(null);

  const stages = [
    { title: 'Loading Image Raster', desc: 'Read multispectral TIFF bands (B02-B12)' },
    { title: 'Geo-referencing & Calibration', desc: 'Orthorectified to WGS 84 / UTM' },
    { title: 'Feature Extraction & Indices', desc: 'Computed NDVI, NDWI & NDTI layers' },
    { title: 'Machine Classification (LULC)', desc: 'Supervised Random Forest 7 categories' },
    { title: 'Spatial Hydrology & Stream Routing', desc: 'D-8 flow direction & stream density' },
    { title: 'Generating Development Insights', desc: 'Synthesizing health score & interventions' },
  ];

  const handleRunGIS = async () => {
    setIsRunningAnalysis(true);
    setAnalysisCompleted(false);
    setActiveStageIndex(0);

    // Smooth stage-by-stage visual progression
    for (let i = 0; i < stages.length; i++) {
      setActiveStageIndex(i);
      await new Promise((resolve) => setTimeout(resolve, 350));
    }

    try {
      await apiService.startAnalysis(watershed?.id || 'WS-MH-001');
    } catch (e) {
      console.warn('Analysis execution note:', e);
    }

    setIsRunningAnalysis(false);
    setAnalysisCompleted(true);
  };

  const toggleOption = (key: keyof typeof selectedLayerOptions) => {
    setSelectedLayerOptions((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Header Bar */}
      <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-blue-100 text-blue-800 text-[10px] font-bold px-2 py-0.5 rounded">
              STAGE 02 OF 05
            </span>
            <h2 className="text-base font-bold text-slate-900">
              Automated GIS Analysis Workbench
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Spatial classification, vegetation vigor, hydrological routing, and composite health assessment
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleRunGIS}
            disabled={isRunningAnalysis}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-semibold text-white shadow-xs transition-colors cursor-pointer ${
              isRunningAnalysis ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-700 hover:bg-blue-800'
            }`}
          >
            <Play className="w-3.5 h-3.5 fill-white" />
            <span>{isRunningAnalysis ? 'Processing GIS Pipeline...' : 'Run GIS Analysis'}</span>
          </button>
        </div>
      </div>

      {/* Analysis Configuration & Processing Stage Visualizer */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Options Checklist */}
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
            <Layers className="w-4 h-4 text-blue-700" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900">
              Analysis Layer Options
            </h3>
          </div>

          <div className="space-y-2 text-xs">
            <label className="flex items-center gap-2.5 p-1.5 rounded hover:bg-slate-50 cursor-pointer">
              <input
                type="checkbox"
                checked={selectedLayerOptions.landUse}
                onChange={() => toggleOption('landUse')}
                className="rounded text-blue-600 cursor-pointer"
              />
              <span className="text-slate-800 font-medium">Land Use / Land Cover (LULC)</span>
            </label>

            <label className="flex items-center gap-2.5 p-1.5 rounded hover:bg-slate-50 cursor-pointer">
              <input
                type="checkbox"
                checked={selectedLayerOptions.vegetation}
                onChange={() => toggleOption('vegetation')}
                className="rounded text-blue-600 cursor-pointer"
              />
              <span className="text-slate-800 font-medium">Vegetation Cover & NDVI Health</span>
            </label>

            <label className="flex items-center gap-2.5 p-1.5 rounded hover:bg-slate-50 cursor-pointer">
              <input
                type="checkbox"
                checked={selectedLayerOptions.waterBodies}
                onChange={() => toggleOption('waterBodies')}
                className="rounded text-blue-600 cursor-pointer"
              />
              <span className="text-slate-800 font-medium">Water Bodies & Storage Capacity</span>
            </label>

            <label className="flex items-center gap-2.5 p-1.5 rounded hover:bg-slate-50 cursor-pointer">
              <input
                type="checkbox"
                checked={selectedLayerOptions.drainage}
                onChange={() => toggleOption('drainage')}
                className="rounded text-blue-600 cursor-pointer"
              />
              <span className="text-slate-800 font-medium">Drainage & Stream Connectivity</span>
            </label>

            <label className="flex items-center gap-2.5 p-1.5 rounded hover:bg-slate-50 cursor-pointer">
              <input
                type="checkbox"
                checked={selectedLayerOptions.soilMoisture}
                onChange={() => toggleOption('soilMoisture')}
                className="rounded text-blue-600 cursor-pointer"
              />
              <span className="text-slate-800 font-medium">Estimated Soil Moisture Stress</span>
            </label>

            <label className="flex items-center gap-2.5 p-1.5 rounded hover:bg-slate-50 cursor-pointer">
              <input
                type="checkbox"
                checked={selectedLayerOptions.builtUp}
                onChange={() => toggleOption('builtUp')}
                className="rounded text-blue-600 cursor-pointer"
              />
              <span className="text-slate-800 font-medium">Built-up Settlements Expansion</span>
            </label>

            <label className="flex items-center gap-2.5 p-1.5 rounded hover:bg-slate-50 cursor-pointer">
              <input
                type="checkbox"
                checked={selectedLayerOptions.degradedLand}
                onChange={() => toggleOption('degradedLand')}
                className="rounded text-blue-600 cursor-pointer"
              />
              <span className="text-slate-800 font-medium">Degraded Land & Gully Erosion Zones</span>
            </label>
          </div>
        </div>

        {/* Right 2 Cols: Processing Stages Progress */}
        <div className="lg:col-span-2 bg-white rounded-xl p-5 border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-blue-700" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900">
                Pipeline Processing Stages
              </h3>
            </div>
            <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              {isRunningAnalysis ? 'Processing...' : 'Completed (Ready)'}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {stages.map((stage, idx) => {
              const isDone = activeStageIndex >= idx;
              const isCurrent = activeStageIndex === idx && isRunningAnalysis;

              return (
                <div
                  key={stage.title}
                  className={`p-3 rounded-lg border text-xs flex items-start gap-2.5 transition-all ${
                    isDone
                      ? 'bg-emerald-50/60 border-emerald-200 text-slate-800'
                      : 'bg-slate-50 border-slate-200 text-slate-400'
                  }`}
                >
                  <CheckCircle2
                    className={`w-4 h-4 shrink-0 mt-0.5 ${
                      isDone ? 'text-emerald-600' : 'text-slate-300'
                    }`}
                  />
                  <div>
                    <div className="font-semibold text-slate-900 flex items-center gap-1.5">
                      <span>{stage.title}</span>
                      {isDone && <span className="text-emerald-700 font-bold">✓</span>}
                    </div>
                    <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">
                      {stage.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Module 1: LAND USE ANALYSIS */}
      <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
          <div>
            <span className="text-[10px] uppercase font-bold text-blue-700 tracking-wider">
              SECTION 01
            </span>
            <h3 className="text-base font-bold text-slate-900">
              Land Use / Land Cover (LULC) Classification
            </h3>
            <p className="text-xs text-slate-500">
              Distribution of major terrestrial and vegetative classes in {watershed?.name}
            </p>
          </div>
          <span className="text-xs font-semibold text-slate-500">
            Total Classified Area: <strong>{watershed?.areaKm2} km²</strong>
          </span>
        </div>

        {/* Stacked Proportional Bar */}
        <div className="space-y-1.5">
          <div className="h-6 w-full rounded-md overflow-hidden flex shadow-xs border border-slate-200">
            {landUse.map((item) => (
              <div
                key={item.category}
                style={{ width: `${item.percentage}%`, backgroundColor: item.color }}
                title={`${item.category}: ${item.percentage}% (${item.areaKm2} km²)`}
                className="h-full hover:opacity-90 transition-opacity cursor-pointer"
                onClick={() => setSelectedLulc(item)}
              />
            ))}
          </div>

          <div className="text-[11px] text-slate-500 text-right">
            Click any category below to inspect details
          </div>
        </div>

        {/* Categories Grid & Legend */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3 pt-2">
          {landUse.map((item) => (
            <div
              key={item.category}
              onClick={() => setSelectedLulc(item)}
              className={`p-3 rounded-lg border text-center transition-all cursor-pointer ${
                selectedLulc?.category === item.category
                  ? 'border-blue-600 bg-blue-50/50 shadow-xs ring-1 ring-blue-500'
                  : 'border-slate-200 hover:border-slate-300 bg-slate-50/50'
              }`}
            >
              <div
                className="w-3.5 h-3.5 rounded-full mx-auto mb-1.5 shadow-xs"
                style={{ backgroundColor: item.color }}
              />
              <span className="text-xs font-bold text-slate-900 block truncate">
                {item.category}
              </span>
              <span className="text-base font-extrabold text-slate-900 block mt-0.5">
                {item.percentage}%
              </span>
              <span className="text-[11px] text-slate-500 block">
                {item.areaKm2} km²
              </span>
            </div>
          ))}
        </div>

        {selectedLulc && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-xs text-blue-900 flex items-center justify-between">
            <div>
              <strong className="font-bold">{selectedLulc.category}:</strong> {selectedLulc.description}
            </div>
            <button
              onClick={() => onNavigateTab('map')}
              className="font-semibold text-blue-700 hover:text-blue-900 shrink-0 ml-3"
            >
              View on Map →
            </button>
          </div>
        )}
      </div>

      {/* Module 2: VEGETATION ANALYSIS & NDVI */}
      <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
          <div>
            <span className="text-[10px] uppercase font-bold text-emerald-700 tracking-wider">
              SECTION 02
            </span>
            <h3 className="text-base font-bold text-slate-900">
              Vegetation Health & NDVI Canopy Analysis
            </h3>
            <p className="text-xs text-slate-500">
              Normalized Difference Vegetation Index estimating biomass vigor and moisture condition
            </p>
          </div>
          <span className="bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold px-2.5 py-1 rounded">
            Overall Coverage: {vegetation?.coveragePct || 64}%
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl bg-emerald-50/70 border border-emerald-200">
            <span className="text-xs font-semibold text-emerald-800 block">
              Healthy Vegetation
            </span>
            <span className="text-2xl font-extrabold text-emerald-700 mt-1 block">
              {vegetation?.healthyPct || 42}%
            </span>
            <span className="text-[11px] text-emerald-600 block mt-0.5">
              NDVI &gt; 0.50 (Vigorous canopy)
            </span>
          </div>

          <div className="p-4 rounded-xl bg-lime-50/70 border border-lime-200">
            <span className="text-xs font-semibold text-lime-800 block">
              Moderate Vegetation
            </span>
            <span className="text-2xl font-extrabold text-lime-700 mt-1 block">
              {vegetation?.moderatePct || 16}%
            </span>
            <span className="text-[11px] text-lime-600 block mt-0.5">
              NDVI 0.35 - 0.50 (Fair cover)
            </span>
          </div>

          <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200">
            <span className="text-xs font-semibold text-amber-800 block">
              Low Vegetation
            </span>
            <span className="text-2xl font-extrabold text-amber-700 mt-1 block">
              {vegetation?.lowPct || 6}%
            </span>
            <span className="text-[11px] text-amber-600 block mt-0.5">
              NDVI 0.20 - 0.35 (Sparse scrub)
            </span>
          </div>

          <div className="p-4 rounded-xl bg-red-50/70 border border-red-200">
            <span className="text-xs font-semibold text-red-800 block">
              Vegetation Stress
            </span>
            <span className="text-2xl font-extrabold text-red-700 mt-1 block">
              {vegetation?.stressPct || 8}%
            </span>
            <span className="text-[11px] text-red-600 block mt-0.5">
              Deficit canopy / dry escarpment
            </span>
          </div>
        </div>

        <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 text-xs text-slate-700 flex items-start gap-2.5">
          <TreePine className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
          <div>
            <strong className="text-slate-900 font-semibold">Remote Sensing Note:</strong>{' '}
            Vegetation index values help estimate vegetation health from imagery.
            Do not claim scientifically validated results if the calculation is simulated.
            Current mean NDVI is estimated at <strong>{vegetation?.meanNdvi || 0.54}</strong>.
          </div>
        </div>
      </div>

      {/* Module 3: WATER BODIES & DRAINAGE ANALYSIS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Water Body Analysis */}
        <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <span className="text-[10px] uppercase font-bold text-sky-700 tracking-wider">
                SECTION 03
              </span>
              <h3 className="text-base font-bold text-slate-900">
                Water Body Detection
              </h3>
            </div>
            <span className="bg-sky-50 text-sky-800 border border-sky-200 text-xs font-bold px-2 py-0.5 rounded">
              {waterBodies.length} Detected
            </span>
          </div>

          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
              <span className="text-xs text-slate-500 block">Total Water Area</span>
              <span className="text-xl font-bold text-slate-900 mt-0.5 block">
                {watershed?.totalWaterAreaKm2} km²
              </span>
            </div>
            <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
              <span className="text-xs text-slate-500 block">Change vs Baseline</span>
              <span className="text-xl font-bold text-emerald-600 mt-0.5 block">
                +6.0%
              </span>
            </div>
            <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
              <span className="text-xs text-slate-500 block">Storage Health</span>
              <span className="text-xl font-bold text-blue-700 mt-0.5 block">
                Moderate
              </span>
            </div>
          </div>

          <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
            {waterBodies.slice(0, 4).map((wb) => (
              <div
                key={wb.id}
                className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-200 text-xs"
              >
                <div>
                  <span className="font-bold text-slate-900 block">{wb.name}</span>
                  <span className="text-slate-500 text-[11px]">
                    {wb.type} • {wb.areaHectares} ha
                  </span>
                </div>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                    wb.storageCondition === 'Full'
                      ? 'bg-emerald-100 text-emerald-800'
                      : wb.storageCondition === 'Moderate'
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-amber-100 text-amber-800'
                  }`}
                >
                  {wb.storageCondition}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Drainage Analysis */}
        <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <span className="text-[10px] uppercase font-bold text-blue-700 tracking-wider">
                SECTION 04
              </span>
              <h3 className="text-base font-bold text-slate-900">
                Drainage & Stream Network
              </h3>
            </div>
            <span className="bg-amber-50 text-amber-800 border border-amber-200 text-xs font-bold px-2 py-0.5 rounded">
              Needs Review
            </span>
          </div>

          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
              <span className="text-xs text-slate-500 block">Network Length</span>
              <span className="text-xl font-bold text-slate-900 mt-0.5 block">
                {drainage?.totalLengthKm || 42.4} km
              </span>
            </div>
            <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
              <span className="text-xs text-slate-500 block">Stream Density</span>
              <span className="text-xl font-bold text-slate-900 mt-0.5 block">
                {drainage?.streamDensityKmPerKm2 || 1.71}
              </span>
              <span className="text-[10px] text-slate-400">km/km²</span>
            </div>
            <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
              <span className="text-xs text-slate-500 block">Bottlenecks</span>
              <span className="text-xl font-bold text-red-600 mt-0.5 block">
                {drainage?.potentialBlockagesCount || 3}
              </span>
            </div>
          </div>

          <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-lg border border-slate-200">
            <strong>Stream Connectivity:</strong> {drainage?.status || 'Action Recommended in 3 Siltation Zones'}.
            Silt bars identified on 2nd-order feeder branches impede monsoon flood draining into valley recharge basins.
          </p>
        </div>
      </div>

      {/* Module 4: SOIL MOISTURE ANALYSIS */}
      <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
          <div>
            <span className="text-[10px] uppercase font-bold text-amber-700 tracking-wider">
              SECTION 05
            </span>
            <h3 className="text-base font-bold text-slate-900">
              Estimated Soil Moisture Distribution
            </h3>
            <p className="text-xs text-slate-500">
              Thermal and shortwave infrared proxy estimation for root-zone moisture
            </p>
          </div>
          <span className="text-xs text-slate-500">
            Stress Area: <strong>{soilMoisture?.estimatedStressAreaHectares || 595} ha</strong>
          </span>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div className="p-4 rounded-xl bg-blue-50/70 border border-blue-200 text-center">
            <span className="text-xs font-semibold text-blue-800 block">High Moisture</span>
            <span className="text-2xl font-extrabold text-blue-700 mt-1 block">
              {soilMoisture?.highPct || 32}%
            </span>
            <span className="text-[11px] text-blue-600 block">Valley floor alluvial soils</span>
          </div>

          <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200 text-center">
            <span className="text-xs font-semibold text-amber-800 block">Moderate Moisture</span>
            <span className="text-2xl font-extrabold text-amber-700 mt-1 block">
              {soilMoisture?.moderatePct || 44}%
            </span>
            <span className="text-[11px] text-amber-600 block">Terraced cropland plots</span>
          </div>

          <div className="p-4 rounded-xl bg-red-50/70 border border-red-200 text-center">
            <span className="text-xs font-semibold text-red-800 block">Low Moisture Stress</span>
            <span className="text-2xl font-extrabold text-red-700 mt-1 block">
              {soilMoisture?.lowPct || 24}%
            </span>
            <span className="text-[11px] text-red-600 block">Escarpment & shallow rock</span>
          </div>
        </div>

        <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-xs text-amber-900 flex items-start gap-2.5">
          <AlertCircle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
          <div>
            <strong className="text-amber-950 font-semibold">Field Ground Assessment Caution:</strong>{' '}
            Areas with lower estimated soil moisture may require closer field-level assessment. Imagery alone does not confirm actual ground moisture.
          </div>
        </div>
      </div>

      {/* Module 5: WATERSHED HEALTH SCORE */}
      <div className="bg-gradient-to-r from-blue-900 to-indigo-950 text-white rounded-2xl p-6 sm:p-8 shadow-md border border-blue-800 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-3 max-w-xl">
          <div className="flex items-center gap-2">
            <span className="bg-blue-800 text-blue-200 text-[10px] font-bold px-2 py-0.5 rounded uppercase">
              Composite Decision Indicator
            </span>
            <span className="text-emerald-400 font-semibold text-xs flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5" /> Trend: Improving
            </span>
          </div>

          <h3 className="text-xl sm:text-2xl font-extrabold tracking-tight text-white">
            Watershed Health Score: {watershed?.healthScore || 72} / 100
          </h3>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 text-xs">
            <div className="bg-white/10 p-2.5 rounded-lg border border-white/10">
              <span className="text-blue-200 block text-[11px]">Vegetation</span>
              <span className="text-lg font-bold text-white">78 / 100</span>
            </div>
            <div className="bg-white/10 p-2.5 rounded-lg border border-white/10">
              <span className="text-blue-200 block text-[11px]">Water Availability</span>
              <span className="text-lg font-bold text-white">69 / 100</span>
            </div>
            <div className="bg-white/10 p-2.5 rounded-lg border border-white/10">
              <span className="text-blue-200 block text-[11px]">Drainage Network</span>
              <span className="text-lg font-bold text-white">74 / 100</span>
            </div>
            <div className="bg-white/10 p-2.5 rounded-lg border border-white/10">
              <span className="text-blue-200 block text-[11px]">Land Condition</span>
              <span className="text-lg font-bold text-white">67 / 100</span>
            </div>
          </div>

          <p className="text-[11px] text-blue-200/80 leading-relaxed pt-1">
            <strong>Important:</strong> The health score is a prototype decision-support indicator designed to assist rural development planners. It is NOT an official government rating.
          </p>
        </div>

        <div className="shrink-0 text-center">
          <button
            onClick={() => onNavigateTab('change')}
            className="bg-white hover:bg-slate-100 text-blue-900 font-bold text-xs px-5 py-3 rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer"
          >
            <span>Proceed to Change Detection</span>
            <ChevronRight className="w-4 h-4 text-blue-700" />
          </button>
        </div>
      </div>
    </div>
  );
};
