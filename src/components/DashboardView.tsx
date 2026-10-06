import React from 'react';
import {
  Compass,
  Layers,
  Activity,
  Droplets,
  AlertTriangle,
  ArrowRight,
  TrendingUp,
  MapPin,
  CheckCircle,
  Play,
  FileCheck2,
  Calendar,
  Mountain,
} from 'lucide-react';
import { Watershed } from '../types/watershed';

interface DashboardViewProps {
  watershed: Watershed | null;
  onNavigateTab: (tab: string) => void;
  onRunDemo: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  watershed,
  onNavigateTab,
  onRunDemo,
}) => {
  return (
    <div className="space-y-8 pb-12">
      {/* Hero Banner with Official Government Look */}
      <div className="bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 text-white rounded-2xl p-6 sm:p-8 shadow-md border border-slate-800 relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-blue-600/10 -skew-x-12 pointer-events-none" />
        
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="bg-blue-600/80 text-white font-mono text-[11px] font-semibold px-2.5 py-1 rounded border border-blue-400/40">
              SMART INDIA HACKATHON 2026 • SIH26015
            </span>
            <span className="bg-amber-400/20 text-amber-300 font-semibold text-[11px] px-2.5 py-1 rounded border border-amber-400/30">
              SIH DEMO DATA
            </span>
          </div>

          <div>
            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white">
              JalDrishti AI
            </h1>
            <p className="text-base sm:text-lg text-blue-200 font-medium mt-1">
              Geospatial Intelligence for Watershed Development
            </p>
          </div>

          <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-2xl">
            Analyze geo-coded satellite imagery to interpret land use, water storage, drainage networks, and vegetation health. Empower watershed committees, project implementing agencies (PIA), and DoLR field officers with automated decision support.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={() => onNavigateTab('gis')}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold px-5 py-2.5 rounded-lg shadow-sm transition-colors cursor-pointer"
            >
              <span>Start Watershed Analysis</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={onRunDemo}
              className="flex items-center gap-2 bg-slate-800/90 hover:bg-slate-700 text-slate-100 border border-slate-700 text-sm font-semibold px-4 py-2.5 rounded-lg transition-colors cursor-pointer"
            >
              <Play className="w-4 h-4 text-amber-400 fill-amber-400" />
              <span>Run Guided SIH Tour</span>
            </button>
            <button
              onClick={() => onNavigateTab('map')}
              className="text-xs font-medium text-slate-300 hover:text-white px-3 py-2 transition-colors cursor-pointer"
            >
              Explore GIS Map →
            </button>
          </div>
        </div>
      </div>

      {/* Top 4 Dashboard Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1 */}
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs hover:border-blue-300 transition-all">
          <div className="flex items-center justify-between text-slate-500 mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider">
              Watersheds Monitored
            </span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-700">
              <Compass className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900">12</span>
            <span className="text-xs font-medium text-slate-500">Pilot Basins</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-2">
            Coverage across 4 agro-climatic zones
          </p>
        </div>

        {/* Card 2 */}
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs hover:border-blue-300 transition-all">
          <div className="flex items-center justify-between text-slate-500 mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider">
              Water Bodies Detected
            </span>
            <div className="w-8 h-8 rounded-lg bg-sky-50 flex items-center justify-center text-sky-700">
              <Droplets className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900">38</span>
            <span className="text-xs font-medium text-emerald-600 font-semibold">+8% Seasonal Gain</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-2">
            Check dams, percolation tanks, and ponds
          </p>
        </div>

        {/* Card 3 */}
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs hover:border-blue-300 transition-all">
          <div className="flex items-center justify-between text-slate-500 mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider">
              Vegetation Coverage
            </span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-700">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900">
              {watershed?.averageVegetationPct || 64}%
            </span>
            <span className="text-xs font-medium text-emerald-600 font-semibold">Mean NDVI 0.54</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-2">
            Biomass recovery post watershed treatment
          </p>
        </div>

        {/* Card 4 */}
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs hover:border-blue-300 transition-all">
          <div className="flex items-center justify-between text-slate-500 mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider">
              Areas Requiring Attention
            </span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center text-amber-700">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-amber-700">7</span>
            <span className="text-xs font-medium text-amber-700 font-semibold">High Priority</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-2">
            Gully erosion, silt blockages & dry tanks
          </p>
        </div>
      </div>

      {/* Simple 5-Step Geospatial Workflow Pipeline */}
      <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-base font-bold text-slate-900">
              End-to-End Geospatial Intelligence Workflow
            </h2>
            <p className="text-xs text-slate-500">
              Standardized remote-sensing interpretation pipeline for watershed planning
            </p>
          </div>
          <span className="text-[11px] font-mono text-slate-400 hidden sm:inline">
            DoLR Standard Protocol
          </span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {/* Step 1 */}
          <div
            onClick={() => onNavigateTab('image')}
            className="p-3.5 rounded-lg border border-slate-200 hover:border-blue-400 bg-slate-50/70 hover:bg-blue-50/50 transition-all cursor-pointer group"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold text-blue-700 bg-blue-100 px-1.5 py-0.5 rounded">
                STAGE 01
              </span>
              <Layers className="w-4 h-4 text-slate-400 group-hover:text-blue-600" />
            </div>
            <div className="font-bold text-xs text-slate-900">GEO-CODED IMAGE</div>
            <p className="text-[11px] text-slate-500 mt-1">
              Multi-spectral ingestion & ortho-calibration
            </p>
          </div>

          {/* Step 2 */}
          <div
            onClick={() => onNavigateTab('gis')}
            className="p-3.5 rounded-lg border border-slate-200 hover:border-blue-400 bg-slate-50/70 hover:bg-blue-50/50 transition-all cursor-pointer group"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold text-blue-700 bg-blue-100 px-1.5 py-0.5 rounded">
                STAGE 02
              </span>
              <Activity className="w-4 h-4 text-slate-400 group-hover:text-blue-600" />
            </div>
            <div className="font-bold text-xs text-slate-900">GIS ANALYSIS</div>
            <p className="text-[11px] text-slate-500 mt-1">
              LULC, NDVI & drainage hydrological routing
            </p>
          </div>

          {/* Step 3 */}
          <div
            onClick={() => onNavigateTab('gis')}
            className="p-3.5 rounded-lg border border-slate-200 hover:border-blue-400 bg-slate-50/70 hover:bg-blue-50/50 transition-all cursor-pointer group"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold text-blue-700 bg-blue-100 px-1.5 py-0.5 rounded">
                STAGE 03
              </span>
              <CheckCircle className="w-4 h-4 text-slate-400 group-hover:text-blue-600" />
            </div>
            <div className="font-bold text-xs text-slate-900">HEALTH ASSESSMENT</div>
            <p className="text-[11px] text-slate-500 mt-1">
              Vegetation vigor & water storage index
            </p>
          </div>

          {/* Step 4 */}
          <div
            onClick={() => onNavigateTab('change')}
            className="p-3.5 rounded-lg border border-slate-200 hover:border-blue-400 bg-slate-50/70 hover:bg-blue-50/50 transition-all cursor-pointer group"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold text-blue-700 bg-blue-100 px-1.5 py-0.5 rounded">
                STAGE 04
              </span>
              <TrendingUp className="w-4 h-4 text-slate-400 group-hover:text-blue-600" />
            </div>
            <div className="font-bold text-xs text-slate-900">CHANGE DETECTION</div>
            <p className="text-[11px] text-slate-500 mt-1">
              Multi-temporal baseline vs current delta
            </p>
          </div>

          {/* Step 5 */}
          <div
            onClick={() => onNavigateTab('issues')}
            className="p-3.5 rounded-lg border border-slate-200 hover:border-blue-400 bg-slate-50/70 hover:bg-blue-50/50 transition-all cursor-pointer group col-span-2 md:col-span-1"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded">
                STAGE 05
              </span>
              <FileCheck2 className="w-4 h-4 text-slate-400 group-hover:text-emerald-600" />
            </div>
            <div className="font-bold text-xs text-slate-900">ACTION & INTERVENTION</div>
            <p className="text-[11px] text-slate-500 mt-1">
              Check dams, trenches & afforestation
            </p>
          </div>
        </div>
      </div>

      {/* Selected Watershed Overview Card */}
      {watershed && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="bg-slate-50 px-6 py-4 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <div className="flex items-center gap-2">
                <span className="bg-blue-700 text-white font-mono text-xs font-bold px-2 py-0.5 rounded">
                  {watershed.code}
                </span>
                <h3 className="text-base font-bold text-slate-900">
                  {watershed.name}
                </h3>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                <span>
                  Block: {watershed.block} • District: {watershed.district} • State: {watershed.state}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="text-right">
                <span className="text-[11px] uppercase tracking-wider text-slate-500 font-semibold block">
                  Watershed Health
                </span>
                <span className="text-sm font-bold text-blue-700">
                  {watershed.healthScore} / 100 ({watershed.healthCategory})
                </span>
              </div>
              <span className="bg-emerald-100 text-emerald-800 text-[11px] font-semibold px-2 py-1 rounded">
                Trend: {watershed.healthTrend}
              </span>
            </div>
          </div>

          <div className="p-6 grid grid-cols-2 sm:grid-cols-4 gap-6">
            <div>
              <span className="text-xs text-slate-500 block">Total Basin Area</span>
              <span className="text-xl font-bold text-slate-900 mt-0.5 block">
                {watershed.areaKm2} km²
              </span>
              <span className="text-[11px] text-slate-400">Micro-watershed unit</span>
            </div>

            <div>
              <span className="text-xs text-slate-500 block">Vegetation Biomass</span>
              <span className="text-xl font-bold text-emerald-700 mt-0.5 block">
                {watershed.averageVegetationPct}%
              </span>
              <span className="text-[11px] text-slate-400">Moderate canopy vigor</span>
            </div>

            <div>
              <span className="text-xs text-slate-500 block">Water Bodies</span>
              <span className="text-xl font-bold text-sky-700 mt-0.5 block">
                {watershed.waterBodiesCount} units
              </span>
              <span className="text-[11px] text-slate-400">{watershed.totalWaterAreaKm2} km² total area</span>
            </div>

            <div>
              <span className="text-xs text-slate-500 block">Drainage Length</span>
              <span className="text-xl font-bold text-slate-900 mt-0.5 block">
                {watershed.drainageLengthKm} km
              </span>
              <span className="text-[11px] text-slate-400">
                Density: {watershed.streamDensityKmPerKm2} km/km²
              </span>
            </div>
          </div>

          <div className="bg-slate-50/70 border-t border-slate-200 px-6 py-3 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-4 text-slate-600">
              <span><strong>Soil Type:</strong> {watershed.soilType}</span>
              <span><strong>Avg Rainfall:</strong> {watershed.rainfallAvgMm} mm/year</span>
              <span><strong>Elevation:</strong> {watershed.elevationRangeMeters.min}m - {watershed.elevationRangeMeters.max}m</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => onNavigateTab('gis')}
                className="text-blue-700 font-semibold hover:text-blue-800 transition-colors"
              >
                View Full GIS Breakdown →
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
