import React, { useState } from 'react';
import {
  Layers,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Upload,
  Calendar,
  Compass,
  FileCheck2,
  Info,
  CheckCircle,
  Eye,
  Sliders,
} from 'lucide-react';
import { GeoImageMetadata, Watershed } from '../types/watershed';
import { apiService } from '../services/api';

interface ImageAnalysisViewProps {
  watershed: Watershed | null;
  imageMeta: GeoImageMetadata | null;
  onNavigateTab: (tab: string) => void;
}

export const ImageAnalysisView: React.FC<ImageAnalysisViewProps> = ({
  watershed,
  imageMeta,
  onNavigateTab,
}) => {
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [bandView, setBandView] = useState<'rgb' | 'cir' | 'ndvi'>('rgb');
  const [uploadLoading, setUploadLoading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const handleZoomIn = () => setZoomLevel((prev) => Math.min(prev + 0.25, 2.5));
  const handleZoomOut = () => setZoomLevel((prev) => Math.max(prev - 0.25, 0.75));
  const handleResetZoom = () => setZoomLevel(1);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadLoading(true);
    setUploadError(null);
    setUploadSuccess(null);

    // Validate size (<10MB)
    if (file.size > 10 * 1024 * 1024) {
      setUploadError('File exceeds maximum allowable size of 10 MB.');
      setUploadLoading(false);
      return;
    }

    try {
      const result = await apiService.uploadImage({
        filename: file.name,
        mimeType: file.type || 'image/tiff',
        sizeBytes: file.size,
        watershedId: watershed?.id || 'WS-MH-001',
      });

      if (result.success) {
        setUploadSuccess(`Uploaded "${file.name}" successfully! Georeferencing verified.`);
      } else {
        setUploadError(result.error || 'Upload validation failed.');
      }
    } catch (err) {
      setUploadError('Network error while transmitting file.');
    } finally {
      setUploadLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header bar */}
      <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-blue-100 text-blue-800 text-[10px] font-bold px-2 py-0.5 rounded">
              STAGE 01 OF 05
            </span>
            <h2 className="text-base font-bold text-slate-900">
              Geo-Coded Satellite Imagery Inspector
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Orthorectified multispectral raster data for {watershed?.name || 'Selected Watershed'}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <label className="flex items-center gap-1.5 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold px-3 py-2 rounded-lg border border-slate-300 shadow-xs transition-colors cursor-pointer">
            <Upload className="w-3.5 h-3.5 text-blue-600" />
            <span>Upload GeoTIFF Raster</span>
            <input
              type="file"
              accept=".tif,.tiff,.jpg,.jpeg,.png"
              onChange={handleFileUpload}
              className="hidden"
            />
          </label>

          <button
            onClick={() => onNavigateTab('gis')}
            className="flex items-center gap-1.5 bg-blue-700 hover:bg-blue-800 text-white text-xs font-semibold px-4 py-2 rounded-lg shadow-xs transition-colors cursor-pointer"
          >
            <span>Proceed to GIS Analysis →</span>
          </button>
        </div>
      </div>

      {uploadSuccess && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs p-3 rounded-lg flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{uploadSuccess}</span>
        </div>
      )}

      {uploadError && (
        <div className="bg-red-50 border border-red-200 text-red-800 text-xs p-3 rounded-lg flex items-center gap-2">
          <Info className="w-4 h-4 text-red-600 shrink-0" />
          <span>{uploadError}</span>
        </div>
      )}

      {/* Main Image View & Metadata Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Image Canvas */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden flex flex-col">
          {/* Controls toolbar */}
          <div className="bg-slate-50 border-b border-slate-200 px-4 py-2.5 flex flex-wrap items-center justify-between gap-3 text-xs">
            {/* Spectral band toggle */}
            <div className="flex items-center gap-1 bg-white p-1 rounded-md border border-slate-200">
              <span className="text-[11px] font-semibold text-slate-500 px-1.5">Composite:</span>
              <button
                onClick={() => setBandView('rgb')}
                className={`px-2 py-0.5 rounded font-medium cursor-pointer ${
                  bandView === 'rgb' ? 'bg-blue-700 text-white font-semibold' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Natural Color (RGB)
              </button>
              <button
                onClick={() => setBandView('cir')}
                className={`px-2 py-0.5 rounded font-medium cursor-pointer ${
                  bandView === 'cir' ? 'bg-blue-700 text-white font-semibold' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                False Color / NIR (CIR)
              </button>
              <button
                onClick={() => setBandView('ndvi')}
                className={`px-2 py-0.5 rounded font-medium cursor-pointer ${
                  bandView === 'ndvi' ? 'bg-blue-700 text-white font-semibold' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                NDVI Index Map
              </button>
            </div>

            {/* Zoom controls */}
            <div className="flex items-center gap-1">
              <button
                onClick={handleZoomIn}
                className="p-1.5 bg-white border border-slate-200 rounded hover:bg-slate-100 text-slate-700"
                title="Zoom In"
              >
                <ZoomIn className="w-3.5 h-3.5" />
              </button>
              <span className="px-1 text-[11px] font-mono text-slate-600">
                {Math.round(zoomLevel * 100)}%
              </span>
              <button
                onClick={handleZoomOut}
                className="p-1.5 bg-white border border-slate-200 rounded hover:bg-slate-100 text-slate-700"
                title="Zoom Out"
              >
                <ZoomOut className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={handleResetZoom}
                className="p-1.5 bg-white border border-slate-200 rounded hover:bg-slate-100 text-slate-700"
                title="Reset Zoom"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Image Container with Zoom & Filter Transform */}
          <div className="relative bg-slate-950 min-h-[460px] flex items-center justify-center overflow-hidden p-2">
            {/* Watermark / Badge */}
            <div className="absolute top-3 left-3 z-10 bg-slate-900/80 backdrop-blur-xs text-white text-[10px] font-mono px-2 py-1 rounded border border-slate-700 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              <span>SIMULATED GEO-CODED IMAGE</span>
            </div>

            <div className="absolute bottom-3 right-3 z-10 bg-slate-900/80 backdrop-blur-xs text-white text-[10px] font-mono px-2 py-1 rounded border border-slate-700">
              GSD: 10 m • EPSG:4326
            </div>

            <div
              className="transition-transform duration-200 ease-out origin-center cursor-grab active:cursor-grabbing max-w-full"
              style={{ transform: `scale(${zoomLevel})` }}
            >
              <img
                src={
                  bandView === 'cir'
                    ? imageMeta?.cirUrl || imageMeta?.url
                    : imageMeta?.url || 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=80'
                }
                alt="Geo-coded watershed satellite scene"
                className={`max-h-[440px] w-auto rounded object-cover shadow-2xl transition-all ${
                  bandView === 'ndvi' ? 'hue-rotate-90 saturate-200 contrast-125' : ''
                }`}
              />
            </div>
          </div>

          {/* Band description footer */}
          <div className="bg-slate-50 border-t border-slate-200 px-4 py-2.5 text-xs text-slate-600 flex items-center justify-between">
            <div>
              {bandView === 'rgb' && (
                <span><strong>Natural Color (B4, B3, B2):</strong> True visual representation of terrain and village settlements.</span>
              )}
              {bandView === 'cir' && (
                <span><strong>Color Infrared / CIR (B8, B4, B3):</strong> Near-infrared reflects healthy chlorophyll in shades of red/pink.</span>
              )}
              {bandView === 'ndvi' && (
                <span><strong>Normalized Difference Vegetation Index:</strong> Calculated via (NIR - Red) / (NIR + Red) to isolate vegetative stress.</span>
              )}
            </div>
            <span className="text-[11px] font-mono text-slate-400 shrink-0">WGS84 Ellipsoid</span>
          </div>
        </div>

        {/* Right Col: Geo-Coded Metadata Card */}
        <div className="space-y-4">
          <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
              <FileCheck2 className="w-4 h-4 text-blue-700" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900">
                Raster Image Metadata
              </h3>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between border-b border-slate-100 pb-2">
                <span className="text-slate-500">Image Name:</span>
                <span className="font-mono font-semibold text-slate-800 text-right truncate max-w-[180px]">
                  {imageMeta?.filename || 'watershed_ortho_10m.tif'}
                </span>
              </div>

              <div className="flex justify-between border-b border-slate-100 pb-2">
                <span className="text-slate-500">Capture Date:</span>
                <span className="font-semibold text-slate-800">
                  {imageMeta?.captureDate || '2026-03-12'}
                </span>
              </div>

              <div className="flex justify-between border-b border-slate-100 pb-2">
                <span className="text-slate-500">Sensor / Platform:</span>
                <span className="font-semibold text-slate-800 text-right">
                  {imageMeta?.sensor || 'Sentinel-2B MSI (Level-2A)'}
                </span>
              </div>

              <div className="flex justify-between border-b border-slate-100 pb-2">
                <span className="text-slate-500">Spatial Resolution:</span>
                <span className="font-semibold text-blue-700">
                  {imageMeta?.spatialResolution || '10 m GSD'}
                </span>
              </div>

              <div className="flex justify-between border-b border-slate-100 pb-2">
                <span className="text-slate-500">Coordinates (Center):</span>
                <span className="font-mono font-semibold text-slate-800">
                  {imageMeta?.center?.[0] || '18.7230'}°N, {imageMeta?.center?.[1] || '73.5820'}°E
                </span>
              </div>

              <div className="flex justify-between border-b border-slate-100 pb-2">
                <span className="text-slate-500">Projection System:</span>
                <span className="font-mono text-slate-700 text-[11px]">
                  {imageMeta?.projection || 'EPSG:4326 (WGS 84)'}
                </span>
              </div>

              <div className="flex justify-between border-b border-slate-100 pb-2">
                <span className="text-slate-500">Cloud Cover:</span>
                <span className="font-semibold text-emerald-700">
                  {imageMeta?.cloudCoverPct || 1.2}% (Clear Quality)
                </span>
              </div>

              <div className="flex justify-between items-center pt-1">
                <span className="text-slate-500">Processing Status:</span>
                <span className="bg-emerald-100 text-emerald-800 font-semibold px-2 py-0.5 rounded text-[11px]">
                  Ready for Analysis
                </span>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={() => onNavigateTab('gis')}
                className="w-full bg-blue-700 hover:bg-blue-800 text-white text-xs font-semibold py-2.5 rounded-lg shadow-xs transition-colors text-center"
              >
                Proceed to GIS Feature Extraction
              </button>
            </div>
          </div>

          {/* Information box */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-xs text-blue-900 space-y-1.5">
            <div className="flex items-center gap-1.5 font-bold">
              <Info className="w-3.5 h-3.5 text-blue-700" />
              <span>Remote Sensing Protocol</span>
            </div>
            <p className="text-[11px] leading-relaxed text-blue-800">
              Imagery is geocoded to sub-pixel accuracy against Survey of India topographic benchmarks. Automated radiometric normalization ensures seamless multi-temporal comparisons across baseline and current periods.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
