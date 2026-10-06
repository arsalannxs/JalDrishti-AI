export interface Watershed {
  id: string;
  name: string;
  code: string;
  state: string;
  district: string;
  block: string;
  areaKm2: number;
  coordinates: {
    lat: number;
    lng: number;
    zoom: number;
  };
  boundaryGeoJson: GeoJSON.FeatureCollection | GeoJSON.Feature;
  elevationRangeMeters: { min: number; max: number };
  averageVegetationPct: number;
  waterBodiesCount: number;
  totalWaterAreaKm2: number;
  drainageLengthKm: number;
  streamDensityKmPerKm2: number;
  healthScore: number;
  healthCategory: 'Critical' | 'Moderate' | 'Good' | 'Optimal';
  healthTrend: 'Improving' | 'Stable' | 'Declining';
  soilType: string;
  rainfallAvgMm: number;
}

export interface GeoImageMetadata {
  id: string;
  watershedId: string;
  filename: string;
  captureDate: string;
  sensor: string;
  spatialResolution: string; // e.g. "10 m"
  spectralBands: string[];
  bounds: [[number, number], [number, number]]; // [SW, NE]
  center: [number, number];
  projection: string;
  fileSizeMb: number;
  status: 'Ready' | 'Processing' | 'Analyzed';
  cloudCoverPct: number;
  url: string;
  thumbnailUrl?: string;
  cirUrl?: string; // Color Infrared / NIR
}

export interface LandUseCategory {
  category: 'Agriculture' | 'Forest' | 'Water' | 'Built-up' | 'Barren Land' | 'Grassland' | 'Other';
  percentage: number;
  areaKm2: number;
  color: string;
  description: string;
}

export interface VegetationHealthData {
  coveragePct: number;
  healthyPct: number;
  moderatePct: number;
  lowPct: number;
  stressPct: number;
  meanNdvi: number;
  interpretation: string;
}

export interface WaterBodyFeature {
  id: string;
  name: string;
  type: 'Lake' | 'Pond' | 'Reservoir' | 'Stream' | 'Percolation Tank';
  areaHectares: number;
  storageCondition: 'Full' | 'Moderate' | 'Low' | 'Dry';
  lat: number;
  lng: number;
  changePctFromPrevious: number;
}

export interface DrainageFeature {
  id: string;
  streamOrder: 1 | 2 | 3 | 4;
  lengthKm: number;
  connectivityStatus: 'Good' | 'Impeded' | 'Silted' | 'Review Needed';
  potentialBlockagesCount: number;
  coordinates: [number, number][];
}

export interface SoilMoistureData {
  highPct: number;
  moderatePct: number;
  lowPct: number;
  estimatedStressAreaHectares: number;
  assessmentNote: string;
}

export interface ChangeDetectionMetrics {
  previousPeriodLabel: string;
  currentPeriodLabel: string;
  vegetationPreviousPct: number;
  vegetationCurrentPct: number;
  vegetationDeltaPct: number;
  waterAreaPreviousKm2: number;
  waterAreaCurrentKm2: number;
  waterAreaDeltaPct: number;
  builtUpPreviousPct: number;
  builtUpCurrentPct: number;
  builtUpDeltaPct: number;
  barrenLandPreviousPct: number;
  barrenLandCurrentPct: number;
  barrenLandDeltaPct: number;
  summary: string;
  keyChanges: string[];
}

export interface WatershedIssue {
  id: string;
  watershedId: string;
  type: 'Low Vegetation' | 'Water Loss' | 'Soil Moisture Stress' | 'Land Degradation' | 'Drainage Blockage' | 'Gully Erosion' | 'Encroachment';
  locationDesc: string;
  areaHectares: number;
  severity: 'High' | 'Medium' | 'Low';
  confidencePct: number;
  lat: number;
  lng: number;
  suggestedAction: string;
  interventionType: 'Afforestation' | 'Check Dam' | 'Percolation Tank' | 'Gully Plug' | 'Desiltation' | 'Contour Bunding';
}

export interface AIInsightsResult {
  summary: string;
  whatChanged: string;
  whereItChanged: string;
  whyItMatters: string;
  fieldVerificationChecklist: string[];
  suggestedWatershedActions: string[];
  sourceModel: string;
  generatedAt: string;
  disclaimer: string;
}

export interface AssessmentReport {
  reportId: string;
  watershed: Watershed;
  imageMeta: GeoImageMetadata;
  healthScore: number;
  landUse: LandUseCategory[];
  vegetation: VegetationHealthData;
  waterBodies: WaterBodyFeature[];
  drainage: {
    totalLengthKm: number;
    densityKmPerKm2: number;
    blockagesCount: number;
    status: string;
  };
  soilMoisture: SoilMoistureData;
  changeDetection: ChangeDetectionMetrics;
  issues: WatershedIssue[];
  aiInsights: AIInsightsResult;
  generatedDate: string;
  generatedBy: string;
}
