import React, { useState, useEffect } from 'react';
import { DisclaimersBanner } from './components/DisclaimersBanner';
import { Navbar } from './components/Navbar';
import { DashboardView } from './components/DashboardView';
import { WatershedMapView } from './components/WatershedMapView';
import { ImageAnalysisView } from './components/ImageAnalysisView';
import { GISAnalysisView } from './components/GISAnalysisView';
import { ChangeDetectionView } from './components/ChangeDetectionView';
import { IssuesAndRecommendationsView } from './components/IssuesAndRecommendationsView';
import { AIInsightsView } from './components/AIInsightsView';
import { ReportView } from './components/ReportView';
import { DemoWalkthroughModal } from './components/DemoWalkthroughModal';
import { WatershedSelectionModal } from './components/WatershedSelectionModal';
import { apiService } from './services/api';
import {
  Watershed,
  GeoImageMetadata,
  LandUseCategory,
  VegetationHealthData,
  WaterBodyFeature,
  SoilMoistureData,
  ChangeDetectionMetrics,
  WatershedIssue,
  AIInsightsResult,
  AssessmentReport,
} from './types/watershed';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [watersheds, setWatersheds] = useState<Watershed[]>([]);
  const [selectedWatershed, setSelectedWatershed] = useState<Watershed | null>(null);

  // Data states
  const [imageMeta, setImageMeta] = useState<GeoImageMetadata | null>(null);
  const [landUse, setLandUse] = useState<LandUseCategory[]>([]);
  const [vegetation, setVegetation] = useState<VegetationHealthData | null>(null);
  const [waterBodies, setWaterBodies] = useState<WaterBodyFeature[]>([]);
  const [drainage, setDrainage] = useState<any>(null);
  const [soilMoisture, setSoilMoisture] = useState<SoilMoistureData | null>(null);
  const [changeData, setChangeData] = useState<ChangeDetectionMetrics | null>(null);
  const [issues, setIssues] = useState<WatershedIssue[]>([]);
  const [aiInsights, setAiInsights] = useState<AIInsightsResult | null>(null);
  const [report, setReport] = useState<AssessmentReport | null>(null);

  const [loading, setLoading] = useState<boolean>(true);
  const [demoModalOpen, setDemoModalOpen] = useState<boolean>(false);
  const [selectionModalOpen, setSelectionModalOpen] = useState<boolean>(false);

  // Load watersheds on mount
  useEffect(() => {
    async function init() {
      try {
        const list = await apiService.getWatersheds();
        setWatersheds(list);
        if (list.length > 0) {
          const first = list[0];
          await loadWatershedData(first);
        }
      } catch (err) {
        console.error('Failed to load initial watersheds:', err);
      } finally {
        setLoading(false);
      }
    }
    init();
  }, []);

  // Load all geospatial sub-datasets for chosen watershed
  const loadWatershedData = async (ws: Watershed) => {
    setSelectedWatershed(ws);
    try {
      const [
        details,
        img,
        lu,
        veg,
        wb,
        dr,
        sm,
        ch,
        iss,
        ai,
        rep,
      ] = await Promise.all([
        apiService.getWatershedDetails(ws.id),
        apiService.getImageMetadata(ws.id),
        apiService.getLandUse(ws.id),
        apiService.getVegetation(ws.id),
        apiService.getWaterBodies(ws.id),
        apiService.getDrainage(ws.id),
        apiService.getSoilMoisture(ws.id),
        apiService.getChanges(ws.id),
        apiService.getIssues(ws.id),
        apiService.getAIInsights(ws.id),
        apiService.generateReport(ws.id),
      ]);

      setSelectedWatershed(details || ws);
      setImageMeta(img);
      setLandUse(lu);
      setVegetation(veg);
      setWaterBodies(wb);
      setDrainage(dr);
      setSoilMoisture(sm);
      setChangeData(ch);
      setIssues(iss);
      setAiInsights(ai);
      setReport(rep);
    } catch (error) {
      console.error('Error fetching watershed sub-datasets:', error);
    }
  };

  const handleSelectWatershed = async (ws: Watershed) => {
    await loadWatershedData(ws);
  };

  const refreshAiInsights = async () => {
    if (!selectedWatershed) return;
    const ai = await apiService.getAIInsights(selectedWatershed.id);
    setAiInsights(ai);
  };

  const refreshReport = async () => {
    if (!selectedWatershed) return;
    const rep = await apiService.generateReport(selectedWatershed.id);
    setReport(rep);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4" />
        <h2 className="text-base font-bold text-slate-800">
          Initializing JalDrishti AI Platform...
        </h2>
        <p className="text-xs text-slate-500 mt-1">
          Loading MoRD / DoLR Watershed Geospatial Datasets (SIH26015)
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col">
      {/* Disclaimer Banner */}
      <DisclaimersBanner />

      {/* Official Gov Header & Nav */}
      <Navbar
        currentTab={activeTab}
        onTabChange={setActiveTab}
        watersheds={watersheds}
        selectedWatershed={selectedWatershed}
        onSelectWatershed={handleSelectWatershed}
        onRunDemo={() => setDemoModalOpen(true)}
      />

      {/* Main Content Viewport */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 pt-6">
        {activeTab === 'dashboard' && (
          <DashboardView
            watershed={selectedWatershed}
            onNavigateTab={setActiveTab}
            onRunDemo={() => setDemoModalOpen(true)}
          />
        )}

        {activeTab === 'map' && (
          <WatershedMapView
            watershed={selectedWatershed}
            issues={issues}
            waterBodies={waterBodies}
          />
        )}

        {activeTab === 'image' && (
          <ImageAnalysisView
            watershed={selectedWatershed}
            imageMeta={imageMeta}
            onNavigateTab={setActiveTab}
          />
        )}

        {activeTab === 'gis' && (
          <GISAnalysisView
            watershed={selectedWatershed}
            landUse={landUse}
            vegetation={vegetation}
            waterBodies={waterBodies}
            drainage={drainage}
            soilMoisture={soilMoisture}
            onNavigateTab={setActiveTab}
          />
        )}

        {activeTab === 'change' && (
          <ChangeDetectionView
            watershed={selectedWatershed}
            changeData={changeData}
            onNavigateTab={setActiveTab}
          />
        )}

        {activeTab === 'issues' && (
          <IssuesAndRecommendationsView
            watershed={selectedWatershed}
            issues={issues}
            onNavigateTab={setActiveTab}
          />
        )}

        {activeTab === 'ai' && (
          <AIInsightsView
            watershed={selectedWatershed}
            insights={aiInsights}
            onRefreshInsights={refreshAiInsights}
            onNavigateTab={setActiveTab}
          />
        )}

        {activeTab === 'report' && (
          <ReportView
            watershed={selectedWatershed}
            report={report}
            onRefreshReport={refreshReport}
          />
        )}
      </main>

      {/* 13-Step Automated SIH Tour Modal */}
      <DemoWalkthroughModal
        isOpen={demoModalOpen}
        onClose={() => setDemoModalOpen(false)}
        watershed={selectedWatershed}
        onNavigateTab={setActiveTab}
      />

      {/* Watershed Selection Modal */}
      <WatershedSelectionModal
        isOpen={selectionModalOpen}
        onClose={() => setSelectionModalOpen(false)}
        watersheds={watersheds}
        selectedWatershed={selectedWatershed}
        onSelectWatershed={handleSelectWatershed}
      />

      {/* Official Footer */}
      <footer className="print:hidden bg-slate-900 text-slate-400 text-xs py-8 border-t border-slate-800 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-slate-800 pb-6">
            <div>
              <span className="text-white font-bold text-sm block">
                JalDrishti AI • SIH 2026 Prototype
              </span>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Application of Geospatial Techniques for Visualization and Analysis of Geo-Coded Images
              </p>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-slate-400 text-[11px]">Department of Land Resources (DoLR)</span>
              <span className="text-slate-600">•</span>
              <span className="text-slate-400 text-[11px]">Ministry of Rural Development</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-slate-500">
            <p>
              Smart India Hackathon 2026 • Problem Statement ID: <strong>SIH26015</strong>
            </p>
            <p>
              All remote-sensing raster and index data are simulated for decision-support prototyping.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
