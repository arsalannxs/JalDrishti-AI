import React, { useState } from 'react';
import {
  AlertTriangle,
  CheckCircle2,
  MapPin,
  ShieldAlert,
  ArrowRight,
  Filter,
  Sparkles,
  Layers,
  FileCheck2,
  TreePine,
  Droplets,
  Hammer,
} from 'lucide-react';
import { Watershed, WatershedIssue } from '../types/watershed';

interface IssuesAndRecommendationsViewProps {
  watershed: Watershed | null;
  issues: WatershedIssue[];
  onNavigateTab: (tab: string) => void;
}

export const IssuesAndRecommendationsView: React.FC<IssuesAndRecommendationsViewProps> = ({
  watershed,
  issues,
  onNavigateTab,
}) => {
  const [filterSeverity, setFilterSeverity] = useState<'All' | 'High' | 'Medium' | 'Low'>('All');
  const [selectedIssue, setSelectedIssue] = useState<WatershedIssue | null>(issues[0] || null);

  const filteredIssues = issues.filter((i) => {
    if (filterSeverity === 'All') return true;
    return i.severity === filterSeverity;
  });

  const highCount = issues.filter((i) => i.severity === 'High').length;
  const medCount = issues.filter((i) => i.severity === 'Medium').length;
  const lowCount = issues.filter((i) => i.severity === 'Low').length;

  return (
    <div className="space-y-8 pb-12">
      {/* Header Bar */}
      <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-2 py-0.5 rounded">
              STAGE 04 OF 05
            </span>
            <h2 className="text-base font-bold text-slate-900">
              Watershed Issues & Development Recommendations
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Spatial hazard detection, priority zonings, and suggested ridge-to-valley interventions
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onNavigateTab('ai')}
            className="flex items-center gap-1.5 bg-blue-700 hover:bg-blue-800 text-white text-xs font-semibold px-4 py-2 rounded-lg shadow-xs transition-colors cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Generate AI Insights →</span>
          </button>
        </div>
      </div>

      {/* Priority Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div
          onClick={() => setFilterSeverity('High')}
          className={`p-5 rounded-xl border transition-all cursor-pointer ${
            filterSeverity === 'High'
              ? 'bg-red-50/80 border-red-300 ring-2 ring-red-400'
              : 'bg-white border-slate-200 hover:border-red-200 shadow-xs'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-red-700">
              High Priority Zones
            </span>
            <span className="w-2.5 h-2.5 rounded-full bg-red-600 animate-pulse" />
          </div>
          <div className="text-3xl font-extrabold text-red-700">{highCount} Areas</div>
          <p className="text-[11px] text-slate-500 mt-1">
            Urgent: active gully erosion & severe drainage siltation
          </p>
        </div>

        <div
          onClick={() => setFilterSeverity('Medium')}
          className={`p-5 rounded-xl border transition-all cursor-pointer ${
            filterSeverity === 'Medium'
              ? 'bg-amber-50/80 border-amber-300 ring-2 ring-amber-400'
              : 'bg-white border-slate-200 hover:border-amber-200 shadow-xs'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-700">
              Medium Priority Zones
            </span>
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
          </div>
          <div className="text-3xl font-extrabold text-amber-700">{medCount} Areas</div>
          <p className="text-[11px] text-slate-500 mt-1">
            Low vegetation cover & community pond seepage
          </p>
        </div>

        <div
          onClick={() => setFilterSeverity('Low')}
          className={`p-5 rounded-xl border transition-all cursor-pointer ${
            filterSeverity === 'Low'
              ? 'bg-blue-50/80 border-blue-300 ring-2 ring-blue-400'
              : 'bg-white border-slate-200 hover:border-blue-200 shadow-xs'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-700">
              Low Priority Zones
            </span>
            <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
          </div>
          <div className="text-3xl font-extrabold text-blue-700">{lowCount} Areas</div>
          <p className="text-[11px] text-slate-500 mt-1">
            Routine in-situ moisture bunding & stover mulching
          </p>
        </div>
      </div>

      {/* Main Issue Cards & Inspector Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Issues Table/Cards */}
        <div className="lg:col-span-2 bg-white rounded-xl p-5 border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900">
                Detected Watershed Issues
              </h3>
            </div>

            {/* Filter buttons */}
            <div className="flex items-center gap-1 text-xs">
              <span className="text-slate-400 text-[11px] mr-1">Filter:</span>
              {(['All', 'High', 'Medium', 'Low'] as const).map((lvl) => (
                <button
                  key={lvl}
                  onClick={() => setFilterSeverity(lvl)}
                  className={`px-2.5 py-0.5 rounded cursor-pointer ${
                    filterSeverity === lvl
                      ? 'bg-slate-900 text-white font-semibold'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {lvl}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            {filteredIssues.map((issue) => {
              const isSelected = selectedIssue?.id === issue.id;
              const isHigh = issue.severity === 'High';
              const isMed = issue.severity === 'Medium';

              return (
                <div
                  key={issue.id}
                  onClick={() => setSelectedIssue(issue)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'border-blue-600 bg-blue-50/40 shadow-xs ring-1 ring-blue-500'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-slate-700 bg-slate-100 px-1.5 py-0.5 rounded">
                          {issue.id}
                        </span>
                        <h4 className="text-sm font-bold text-slate-900">
                          {issue.type}
                        </h4>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                            isHigh
                              ? 'bg-red-100 text-red-800'
                              : isMed
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-blue-100 text-blue-800'
                          }`}
                        >
                          {issue.severity} Severity
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 mt-1">
                        {issue.locationDesc}
                      </p>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="text-xs font-bold text-slate-900 block">
                        {issue.areaHectares} ha
                      </span>
                      <span className="text-[10px] text-slate-500 block">
                        {issue.confidencePct}% Confidence
                      </span>
                    </div>
                  </div>

                  <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                    <span className="text-slate-600 text-[11px]">
                      <strong>Suggested Action:</strong> {issue.suggestedAction}
                    </span>
                    <span className="text-blue-700 font-semibold shrink-0 ml-2">
                      Inspect →
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Col: Selected Issue Deep Dive & Intervention Planner */}
        <div className="space-y-4">
          {selectedIssue ? (
            <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  Intervention Action Card
                </span>
                <span className="bg-blue-100 text-blue-800 font-mono text-[11px] font-bold px-2 py-0.5 rounded">
                  {selectedIssue.id}
                </span>
              </div>

              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  {selectedIssue.type}
                </h3>
                <p className="text-xs text-slate-600 mt-0.5">
                  {selectedIssue.locationDesc}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                  <span className="text-slate-500 text-[10px] block">Estimated Impact</span>
                  <span className="font-bold text-slate-900 text-sm block">
                    {selectedIssue.areaHectares} hectares
                  </span>
                </div>
                <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                  <span className="text-slate-500 text-[10px] block">Classification Confidence</span>
                  <span className="font-bold text-emerald-700 text-sm block">
                    {selectedIssue.confidencePct}%
                  </span>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 space-y-1.5 text-xs">
                <span className="font-bold text-blue-900 block flex items-center gap-1.5">
                  <Hammer className="w-3.5 h-3.5 text-blue-700" />
                  Suggested Watershed Intervention:
                </span>
                <p className="text-blue-900 leading-relaxed text-[11px]">
                  {selectedIssue.suggestedAction}
                </p>
              </div>

              <div className="text-[11px] text-slate-500 bg-amber-50 p-2.5 rounded-lg border border-amber-200">
                <strong>Important Policy Guidance:</strong> Recommendations are presented as
                <span className="font-semibold text-amber-900"> "Suggested Action"</span>, not a final government decision. Ground verification is required by the Gram Panchayat Watershed Committee.
              </div>

              <button
                onClick={() => onNavigateTab('map')}
                className="w-full bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold py-2 rounded-lg transition-colors text-center"
              >
                Locate Hotspot on GIS Map
              </button>
            </div>
          ) : (
            <div className="bg-white rounded-xl p-5 border border-slate-200 text-center text-xs text-slate-500">
              Select an issue from the list to view detailed engineering intervention recommendations.
            </div>
          )}

          {/* Standard Ridge-to-Valley Interventions Palette */}
          <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 space-y-2 text-xs">
            <h4 className="font-bold text-slate-900 uppercase text-[10px] tracking-wider">
              DoLR Ridge-to-Valley Framework
            </h4>
            <div className="space-y-1.5 text-[11px] text-slate-600">
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-600" />
                <strong>Ridge:</strong> Continuous Contour Trenches (CCT) & Afforestation
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                <strong>Middle Slope:</strong> Loose Boulder Gully Plugs & Terracing
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-sky-600" />
                <strong>Valley:</strong> Masonry Check Dams & Percolation Tanks
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
