import React, { useState } from 'react';
import {
  Sparkles,
  Bot,
  Send,
  HelpCircle,
  FileCheck2,
  AlertCircle,
  CheckCircle2,
  RefreshCw,
  Layers,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';
import { AIInsightsResult, Watershed } from '../types/watershed';
import { apiService } from '../services/api';

interface AIInsightsViewProps {
  watershed: Watershed | null;
  insights: AIInsightsResult | null;
  onRefreshInsights: () => void;
  onNavigateTab: (tab: string) => void;
}

export const AIInsightsView: React.FC<AIInsightsViewProps> = ({
  watershed,
  insights,
  onRefreshInsights,
  onNavigateTab,
}) => {
  const [queryInput, setQueryInput] = useState('');
  const [loadingQuery, setLoadingQuery] = useState(false);
  const [currentInsights, setCurrentInsights] = useState<AIInsightsResult | null>(insights);

  const sampleQuestions = [
    'What ridge-to-valley interventions are best for the upper escarpment?',
    'Why is the Sadavali stream bottleneck causing siltation downstream?',
    'How will proposed check dam structures impact dry-season soil moisture?',
    'What indigenous species should be planted in the low-NDVI zone?',
  ];

  const handleAskAI = async (e?: React.FormEvent, customQ?: string) => {
    if (e) e.preventDefault();
    const query = customQ || queryInput;
    if (!query.trim()) return;

    setLoadingQuery(true);
    try {
      const result = await apiService.getAIInsights(watershed?.id || 'WS-MH-001', query);
      if (result) {
        setCurrentInsights(result);
      }
    } catch (err) {
      console.error('Error fetching AI insights:', err);
    } finally {
      setLoadingQuery(false);
      if (!customQ) setQueryInput('');
    }
  };

  const activeData = currentInsights || insights;

  return (
    <div className="space-y-8 pb-12">
      {/* Header Bar */}
      <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-indigo-100 text-indigo-800 text-[10px] font-bold px-2 py-0.5 rounded flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-indigo-600" />
              <span>AI DECISION SUPPORT</span>
            </span>
            <h2 className="text-base font-bold text-slate-900">
              AI Watershed Insights & Spatial Interpretation
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Synthesizing multispectral satellite metrics into actionable watershed planning intelligence
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[11px] font-mono text-slate-500 bg-slate-100 px-2 py-1 rounded border border-slate-200">
            Model: {activeData?.sourceModel || 'Gemini 3.8 Flash (Server-Side)'}
          </span>
          <button
            onClick={() => handleAskAI(undefined, 'Refresh comprehensive watershed spatial evaluation')}
            disabled={loadingQuery}
            className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg border border-slate-200 cursor-pointer"
            title="Re-run AI Analysis"
          >
            <RefreshCw className={`w-4 h-4 ${loadingQuery ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Main Insights Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: AI Insights Content */}
        <div className="lg:col-span-2 space-y-4">
          {/* Executive Summary Card */}
          <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-xs space-y-3">
            <div className="flex items-center gap-2 text-indigo-700">
              <Bot className="w-5 h-5" />
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                Executive Watershed Assessment
              </h3>
            </div>
            <p className="text-sm text-slate-800 leading-relaxed font-medium">
              {activeData?.summary ||
                `${watershed?.name} exhibits positive post-monsoon biomass in valley agricultural lands, but upper ridge escarpment zones suffer from accelerated sheetwash runoff and declining soil moisture.`}
            </p>
          </div>

          {/* Structured Analysis Sections */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* What Changed */}
            <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-blue-700 block">
                01 • What Changed
              </span>
              <h4 className="text-xs font-bold text-slate-900">
                Spatial Feature Shifts
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                {activeData?.whatChanged ||
                  'Vegetation coverage increased by +6.0%, and surface water storage expanded by +8.3%. Barren land shrank by 4.5% due to soil conservation treatments.'}
              </p>
            </div>

            {/* Where It Changed */}
            <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 block">
                02 • Where It Changed
              </span>
              <h4 className="text-xs font-bold text-slate-900">
                Geographic Vulnerability Zones
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                {activeData?.whereItChanged ||
                  'Primary gains occurred along the central stream corridor. Conversely, the southern ridge escarpment (slopes >18%) continues to record high vegetative stress.'}
              </p>
            </div>

            {/* Why It Matters */}
            <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs space-y-2 sm:col-span-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700 block">
                03 • Why It Matters
              </span>
              <h4 className="text-xs font-bold text-slate-900">
                Hydrological & Socio-Economic Impact
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                {activeData?.whyItMatters ||
                  'Ridge runoff velocity directly dictates downstream water body siltation. Arresting peak torrential discharge prevents reservoir silt chokes and replenishes village borewell aquifers for second-crop Rabi cultivation.'}
              </p>
            </div>
          </div>

          {/* Field Verification Checklist */}
          <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs space-y-3">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">
                Field Officer Ground Verification Checklist
              </h4>
            </div>
            <div className="space-y-2">
              {activeData?.fieldVerificationChecklist?.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-2.5 text-xs text-slate-700 bg-slate-50 p-2.5 rounded-lg border border-slate-200"
                >
                  <span className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Suggested Watershed Actions */}
          <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs space-y-3">
            <div className="flex items-center gap-2">
              <FileCheck2 className="w-4 h-4 text-blue-700" />
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">
                Suggested Ridge-to-Valley Development Interventions
              </h4>
            </div>
            <div className="space-y-2">
              {activeData?.suggestedWatershedActions?.map((action, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-2.5 text-xs text-slate-800 bg-blue-50/50 p-2.5 rounded-lg border border-blue-200"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-600 shrink-0 mt-1.5" />
                  <span className="font-medium">{action}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Col: Ask AI Assistant Panel */}
        <div className="space-y-4">
          <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
              <Sparkles className="w-4 h-4 text-indigo-600" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900">
                Ask JalDrishti AI
              </h3>
            </div>
            <p className="text-xs text-slate-500">
              Query the spatial reasoning model regarding drainage structures, afforestation, or soil moisture in {watershed?.name}.
            </p>

            <form onSubmit={handleAskAI} className="space-y-2">
              <textarea
                value={queryInput}
                onChange={(e) => setQueryInput(e.target.value)}
                placeholder="e.g. What specific check dam dimensions are recommended for the Sadavali branch stream?"
                rows={3}
                className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 resize-none"
              />
              <button
                type="submit"
                disabled={loadingQuery || !queryInput.trim()}
                className={`w-full flex items-center justify-center gap-1.5 text-xs font-semibold py-2 rounded-lg text-white transition-colors cursor-pointer ${
                  loadingQuery || !queryInput.trim()
                    ? 'bg-slate-300 cursor-not-allowed'
                    : 'bg-indigo-700 hover:bg-indigo-800 shadow-xs'
                }`}
              >
                <Send className="w-3.5 h-3.5" />
                <span>{loadingQuery ? 'Consulting Gemini...' : 'Analyze with AI'}</span>
              </button>
            </form>

            <div className="pt-2 border-t border-slate-100 space-y-2">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                Suggested Prompts:
              </span>
              <div className="space-y-1.5">
                {sampleQuestions.map((sq, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleAskAI(undefined, sq)}
                    disabled={loadingQuery}
                    className="w-full text-left text-[11px] text-slate-700 hover:text-blue-700 p-1.5 rounded hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-200 cursor-pointer"
                  >
                    "{sq}"
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* AI Decision Support Disclaimer */}
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-xs text-amber-900 space-y-2">
            <div className="flex items-center gap-1.5 font-bold">
              <ShieldCheck className="w-4 h-4 text-amber-700 shrink-0" />
              <span>Statutory Decision-Support Notice</span>
            </div>
            <p className="text-[11px] leading-relaxed text-amber-800">
              AI predictions and spatial interpretations are advisory decision-support aids for Project Implementing Agencies (PIA). They do not constitute certified statutory engineering clearances.
            </p>
          </div>

          <button
            onClick={() => onNavigateTab('report')}
            className="w-full bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold py-2.5 rounded-xl transition-colors shadow-xs flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>Compile Watershed Assessment Report</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
