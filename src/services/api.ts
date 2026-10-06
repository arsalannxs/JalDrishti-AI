import {
  Watershed,
  GeoImageMetadata,
  LandUseCategory,
  VegetationHealthData,
  WaterBodyFeature,
  DrainageFeature,
  SoilMoistureData,
  ChangeDetectionMetrics,
  WatershedIssue,
  AIInsightsResult,
  AssessmentReport,
} from '../types/watershed';

export const apiService = {
  async getWatersheds(): Promise<Watershed[]> {
    const res = await fetch('/api/watersheds');
    const json = await res.json();
    return json.data || [];
  },

  async getWatershedDetails(id: string): Promise<Watershed> {
    const res = await fetch(`/api/watersheds/${encodeURIComponent(id)}`);
    const json = await res.json();
    return json.data;
  },

  async getImageMetadata(watershedId: string): Promise<GeoImageMetadata> {
    const res = await fetch(`/api/images/${encodeURIComponent(watershedId)}`);
    const json = await res.json();
    return json.data;
  },

  async startAnalysis(watershedId: string, selectedLayers?: string[]) {
    const res = await fetch('/api/analysis/start', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ watershedId, selectedLayers }),
    });
    return res.json();
  },

  async getLandUse(watershedId: string): Promise<LandUseCategory[]> {
    const res = await fetch(`/api/land-use/${encodeURIComponent(watershedId)}`);
    const json = await res.json();
    return json.data || [];
  },

  async getVegetation(watershedId: string): Promise<VegetationHealthData> {
    const res = await fetch(`/api/vegetation/${encodeURIComponent(watershedId)}`);
    const json = await res.json();
    return json.data;
  },

  async getWaterBodies(watershedId: string): Promise<WaterBodyFeature[]> {
    const res = await fetch(`/api/water-bodies/${encodeURIComponent(watershedId)}`);
    const json = await res.json();
    return json.data || [];
  },

  async getDrainage(watershedId: string): Promise<any> {
    const res = await fetch(`/api/drainage/${encodeURIComponent(watershedId)}`);
    const json = await res.json();
    return json.data;
  },

  async getSoilMoisture(watershedId: string): Promise<SoilMoistureData> {
    const res = await fetch(`/api/soil-moisture/${encodeURIComponent(watershedId)}`);
    const json = await res.json();
    return json.data;
  },

  async getChanges(watershedId: string): Promise<ChangeDetectionMetrics> {
    const res = await fetch(`/api/changes/${encodeURIComponent(watershedId)}`);
    const json = await res.json();
    return json.data;
  },

  async getIssues(watershedId: string): Promise<WatershedIssue[]> {
    const res = await fetch(`/api/issues/${encodeURIComponent(watershedId)}`);
    const json = await res.json();
    return json.data || [];
  },

  async getAIInsights(watershedId: string, customQuery?: string): Promise<AIInsightsResult> {
    const res = await fetch('/api/ai/insights', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ watershedId, customQuery }),
    });
    const json = await res.json();
    return json.data;
  },

  async generateReport(watershedId: string): Promise<AssessmentReport> {
    const res = await fetch('/api/reports', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ watershedId }),
    });
    const json = await res.json();
    return json.data;
  },

  async uploadImage(fileData: { filename: string; mimeType: string; sizeBytes: number; watershedId: string }): Promise<any> {
    const res = await fetch('/api/images/upload', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(fileData),
    });
    return res.json();
  },
};
