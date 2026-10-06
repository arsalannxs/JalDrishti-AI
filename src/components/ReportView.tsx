import React, { useState } from 'react';
import {
  FileText,
  Printer,
  Download,
  Calendar,
  MapPin,
  CheckCircle,
  AlertTriangle,
  Sparkles,
  Layers,
  Activity,
  Droplets,
  TreePine,
  Compass,
  Building,
} from 'lucide-react';
import { AssessmentReport, Watershed } from '../types/watershed';
import { apiService } from '../services/api';

interface ReportViewProps {
  watershed: Watershed | null;
  report: AssessmentReport | null;
  onRefreshReport: () => void;
}

export const ReportView: React.FC<ReportViewProps> = ({
  watershed,
  report,
  onRefreshReport,
}) => {
  const [generating, setGenerating] = useState(false);

  const handlePrint = () => {
    window.print();
  };

  const handleRegenerate = async () => {
    setGenerating(true);
    await onRefreshReport();
    setGenerating(false);
  };

  const currentWs = report?.watershed || watershed;

  return (
    <div className="space-y-6 pb-12">
      {/* Top Action Bar (hidden in print) */}
      <div className="print:hidden bg-white rounded-xl p-5 border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-blue-100 text-blue-800 text-[10px] font-bold px-2 py-0.5 rounded">
              STAGE 05 OF 05
            </span>
            <h2 className="text-base font-bold text-slate-900">
              Watershed Assessment Report (DoLR Standard Format)
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Comprehensive GIS interpretation summary for Project Implementing Agency (PIA) and Gram Panchayat
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleRegenerate}
            disabled={generating}
            className="flex items-center gap-1.5 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold px-3 py-2 rounded-lg border border-slate-300 transition-colors cursor-pointer"
          >
            <FileText className="w-3.5 h-3.5 text-blue-700" />
            <span>{generating ? 'Recompiling...' : 'Re-Generate Report'}</span>
          </button>
          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 bg-blue-700 hover:bg-blue-800 text-white text-xs font-semibold px-4 py-2 rounded-lg shadow-xs transition-colors cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Download PDF / Print</span>
          </button>
        </div>
      </div>

      {/* Printable Report Document Container */}
      <div className="bg-white rounded-xl border border-slate-300 shadow-md p-8 sm:p-12 max-w-4xl mx-auto space-y-8 print:border-none print:shadow-none print:p-0">
        {/* Official Header */}
        <div className="border-b-2 border-slate-900 pb-6 text-center space-y-2">
          <div className="flex items-center justify-center gap-2 text-xs font-bold text-slate-700 uppercase tracking-widest">
            <span>GOVERNMENT OF INDIA</span>
            <span>•</span>
            <span>MINISTRY OF RURAL DEVELOPMENT</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-950 uppercase tracking-tight">
            DEPARTMENT OF LAND RESOURCES (DoLR)
          </h1>
          <p className="text-xs text-slate-600 font-medium">
            Watershed Development Component of Pradhan Mantri Krishi Sinchayee Yojana (WDC-PMKSY 2.0)
          </p>

          <div className="inline-block bg-slate-100 text-slate-800 text-xs font-bold px-3 py-1 rounded border border-slate-300 mt-2">
            WATERSHED ASSESSMENT & GEO-INTELLIGENCE REPORT
          </div>
        </div>

        {/* Report Metadata Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 bg-slate-50 rounded-lg border border-slate-200 text-xs">
          <div>
            <span className="text-slate-500 text-[10px] block uppercase font-bold">Report ID</span>
            <span className="font-mono font-bold text-slate-900">
              {report?.reportId || `WAR-DoLR-2026-${currentWs?.code}`}
            </span>
          </div>
          <div>
            <span className="text-slate-500 text-[10px] block uppercase font-bold">Date of Assessment</span>
            <span className="font-semibold text-slate-900">
              {report?.generatedDate || new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
            </span>
          </div>
          <div>
            <span className="text-slate-500 text-[10px] block uppercase font-bold">Watershed Code</span>
            <span className="font-bold text-blue-800 font-mono">
              {currentWs?.code || 'WS-MH-001'}
            </span>
          </div>
          <div>
            <span className="text-slate-500 text-[10px] block uppercase font-bold">Health Score</span>
            <span className="font-bold text-emerald-700">
              {report?.healthScore || currentWs?.healthScore || 72} / 100 ({currentWs?.healthCategory || 'Moderate'})
            </span>
          </div>
        </div>

        {/* 1. Watershed & Image Information */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-1 flex items-center gap-1.5">
            <Compass className="w-3.5 h-3.5 text-blue-700" />
            <span>1. Watershed Geomorphology & Satellite Raster Metadata</span>
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-y-2 gap-x-4 text-xs">
            <div><strong>Watershed Name:</strong> {currentWs?.name}</div>
            <div><strong>Location:</strong> {currentWs?.block}, {currentWs?.district}, {currentWs?.state}</div>
            <div><strong>Total Area:</strong> {currentWs?.areaKm2} km² ({((currentWs?.areaKm2 || 0) * 100).toFixed(0)} hectares)</div>
            <div><strong>Soil Type:</strong> {currentWs?.soilType}</div>
            <div><strong>Elevation Range:</strong> {currentWs?.elevationRangeMeters.min}m to {currentWs?.elevationRangeMeters.max}m MSL</div>
            <div><strong>Average Rainfall:</strong> {currentWs?.rainfallAvgMm} mm/year</div>
            <div><strong>Raster Platform:</strong> {report?.imageMeta?.sensor || 'Sentinel-2B MSI Multi-Spectral'}</div>
            <div><strong>Spatial Resolution:</strong> {report?.imageMeta?.spatialResolution || '10 m GSD'}</div>
            <div><strong>Capture Date:</strong> {report?.imageMeta?.captureDate || '2026-03-12'}</div>
          </div>
        </div>

        {/* 2. Land Use / Land Cover Distribution */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-1 flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-blue-700" />
            <span>2. Land Use / Land Cover Classification (LULC)</span>
          </h3>
          <table className="w-full text-xs border border-slate-200">
            <thead className="bg-slate-100 text-slate-700">
              <tr>
                <th className="p-2 text-left border-b border-slate-200">Category</th>
                <th className="p-2 text-center border-b border-slate-200">Percentage</th>
                <th className="p-2 text-center border-b border-slate-200">Area (km²)</th>
                <th className="p-2 text-left border-b border-slate-200">Description</th>
              </tr>
            </thead>
            <tbody>
              {report?.landUse?.map((item) => (
                <tr key={item.category} className="border-b border-slate-100">
                  <td className="p-2 font-medium flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full inline-block" style={{ backgroundColor: item.color }} />
                    {item.category}
                  </td>
                  <td className="p-2 text-center font-bold">{item.percentage}%</td>
                  <td className="p-2 text-center">{item.areaKm2} km²</td>
                  <td className="p-2 text-slate-600">{item.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* 3. Vegetation & Hydrology Findings */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-1 flex items-center gap-1.5">
              <TreePine className="w-3.5 h-3.5 text-emerald-700" />
              <span>3. Vegetation & NDVI Condition</span>
            </h3>
            <ul className="text-xs space-y-1.5 text-slate-700">
              <li>• Overall Vegetation Cover: <strong>{report?.vegetation?.coveragePct || 64}%</strong></li>
              <li>• Healthy Canopy (NDVI &gt; 0.50): <strong>{report?.vegetation?.healthyPct || 42}%</strong></li>
              <li>• Moderate Cover: <strong>{report?.vegetation?.moderatePct || 16}%</strong></li>
              <li>• Canopy Stress: <strong>{report?.vegetation?.stressPct || 8}%</strong></li>
              <li>• Estimated Mean NDVI: <strong>{report?.vegetation?.meanNdvi || 0.54}</strong></li>
            </ul>
          </div>

          <div className="space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-1 flex items-center gap-1.5">
              <Droplets className="w-3.5 h-3.5 text-sky-700" />
              <span>4. Surface Water & Drainage Network</span>
            </h3>
            <ul className="text-xs space-y-1.5 text-slate-700">
              <li>• Water Bodies Identified: <strong>{report?.waterBodies?.length || 8} structures</strong></li>
              <li>• Surface Water Area: <strong>{currentWs?.totalWaterAreaKm2 || 1.82} km²</strong></li>
              <li>• Total Drainage Length: <strong>{report?.drainage?.totalLengthKm || 42.4} km</strong></li>
              <li>• Drainage Density: <strong>{report?.drainage?.densityKmPerKm2 || 1.71} km/km²</strong></li>
              <li>• Siltation Bottlenecks Flagged: <strong>{report?.drainage?.blockagesCount || 3} locations</strong></li>
            </ul>
          </div>
        </div>

        {/* 4. Multi-Temporal Change Detection Delta */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-1">
            5. Multi-Temporal Change Detection Analysis (2024 vs 2026)
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="bg-slate-50 p-2.5 rounded border border-slate-200">
              <span className="text-slate-500 block text-[10px]">Vegetation Shift</span>
              <span className="font-bold text-emerald-700 text-sm block">
                {report?.changeDetection?.vegetationDeltaPct && report.changeDetection.vegetationDeltaPct >= 0 ? '+' : ''}
                {report?.changeDetection?.vegetationDeltaPct || '+6.0'}%
              </span>
            </div>
            <div className="bg-slate-50 p-2.5 rounded border border-slate-200">
              <span className="text-slate-500 block text-[10px]">Water Storage Gain</span>
              <span className="font-bold text-sky-700 text-sm block">
                {report?.changeDetection?.waterAreaDeltaPct && report.changeDetection.waterAreaDeltaPct >= 0 ? '+' : ''}
                {report?.changeDetection?.waterAreaDeltaPct || '+8.3'}%
              </span>
            </div>
            <div className="bg-slate-50 p-2.5 rounded border border-slate-200">
              <span className="text-slate-500 block text-[10px]">Built-up Expansion</span>
              <span className="font-bold text-slate-800 text-sm block">
                +{report?.changeDetection?.builtUpDeltaPct || 0.8}%
              </span>
            </div>
            <div className="bg-slate-50 p-2.5 rounded border border-slate-200">
              <span className="text-slate-500 block text-[10px]">Barren Land Contraction</span>
              <span className="font-bold text-amber-700 text-sm block">
                {report?.changeDetection?.barrenLandDeltaPct || -4.5}%
              </span>
            </div>
          </div>
          <p className="text-xs text-slate-600 bg-slate-50 p-2.5 rounded border border-slate-200">
            {report?.changeDetection?.summary}
          </p>
        </div>

        {/* 5. Detected Issues & Suggested Actions */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-1 flex items-center gap-1.5">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
            <span>6. Priority Issues & Suggested Ridge-to-Valley Interventions</span>
          </h3>
          <div className="space-y-2">
            {report?.issues?.map((issue) => (
              <div
                key={issue.id}
                className="p-2.5 rounded border border-slate-200 bg-slate-50 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-slate-800">{issue.id}</span>
                    <strong className="text-slate-900">{issue.type}</strong>
                    <span className="text-[10px] bg-white border border-slate-300 px-1.5 rounded">
                      {issue.areaHectares} ha • {issue.severity} Priority
                    </span>
                  </div>
                  <p className="text-slate-600 text-[11px] mt-0.5">
                    <strong>Location:</strong> {issue.locationDesc}
                  </p>
                </div>
                <div className="text-right text-[11px] text-blue-900 font-medium sm:max-w-xs">
                  {issue.suggestedAction}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 6. AI Decision Support Synthesis */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-1 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-indigo-700" />
            <span>7. AI Watershed Insights & Ground Verification Protocol</span>
          </h3>
          <div className="bg-indigo-50/50 border border-indigo-100 p-4 rounded-lg text-xs space-y-2 text-slate-800">
            <p className="font-medium text-indigo-950">
              {report?.aiInsights?.summary}
            </p>
            <div className="space-y-1 pt-1">
              <span className="font-bold text-slate-900 text-[11px] uppercase block">
                Field Verification Protocol for Gram Panchayat Committee:
              </span>
              {report?.aiInsights?.fieldVerificationChecklist?.map((chk, i) => (
                <div key={i} className="text-[11px] text-slate-700 flex items-start gap-1.5">
                  <span className="text-indigo-600 font-bold">•</span>
                  <span>{chk}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Statutory Sign-off & Disclaimer Block */}
        <div className="border-t-2 border-slate-900 pt-6 space-y-4 text-xs">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 pt-4 text-center">
            <div className="space-y-8">
              <span className="text-slate-400 block text-[10px]">__________________________</span>
              <span className="font-bold text-slate-900 block">GIS Remote Sensing Analyst</span>
            </div>
            <div className="space-y-8">
              <span className="text-slate-400 block text-[10px]">__________________________</span>
              <span className="font-bold text-slate-900 block">Watershed Development Officer</span>
            </div>
            <div className="space-y-8 col-span-2 sm:col-span-1">
              <span className="text-slate-400 block text-[10px]">__________________________</span>
              <span className="font-bold text-slate-900 block">Project Implementing Agency</span>
            </div>
          </div>

          <div className="text-[10px] text-slate-500 bg-slate-100 p-3 rounded border border-slate-200 leading-normal">
            <strong>Prototype Compliance Note (SIH 2026):</strong> JalDrishti AI is developed for Smart India Hackathon Problem Statement SIH26015 (Ministry of Rural Development, Department of Land Resources). All remote-sensing parameters and health indicators are simulated decision-support aids and do not replace mandatory statutory physical surveys under DoLR Common Guidelines.
          </div>
        </div>
      </div>
    </div>
  );
};
