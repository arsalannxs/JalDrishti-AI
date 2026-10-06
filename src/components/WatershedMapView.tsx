import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import {
  Layers,
  MapPin,
  Eye,
  Info,
  Maximize2,
  AlertTriangle,
  Droplets,
  TreePine,
  Compass,
} from 'lucide-react';
import { Watershed, WatershedIssue, WaterBodyFeature } from '../types/watershed';

interface WatershedMapViewProps {
  watershed: Watershed | null;
  issues: WatershedIssue[];
  waterBodies: WaterBodyFeature[];
}

export const WatershedMapView: React.FC<WatershedMapViewProps> = ({
  watershed,
  issues,
  waterBodies,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const layerGroupsRef = useRef<{ [key: string]: L.LayerGroup }>({});

  const [activeBasemap, setActiveBasemap] = useState<'satellite' | 'street' | 'topo'>('satellite');
  const [layersState, setLayersState] = useState({
    boundary: true,
    landUse: true,
    vegetation: true,
    waterBodies: true,
    drainage: true,
    priorityAreas: true,
    changeDetection: false,
  });

  const [selectedHotspot, setSelectedHotspot] = useState<WatershedIssue | null>(null);

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const centerLat = watershed?.coordinates.lat || 18.723;
      const centerLng = watershed?.coordinates.lng || 73.582;

      const map = L.map(mapContainerRef.current, {
        center: [centerLat, centerLng],
        zoom: 13,
        zoomControl: true,
      });

      mapInstanceRef.current = map;

      // Layer groups for toggling
      layerGroupsRef.current = {
        basemap: L.layerGroup().addTo(map),
        boundary: L.layerGroup().addTo(map),
        landUse: L.layerGroup().addTo(map),
        vegetation: L.layerGroup().addTo(map),
        waterBodies: L.layerGroup().addTo(map),
        drainage: L.layerGroup().addTo(map),
        priorityAreas: L.layerGroup().addTo(map),
        changeDetection: L.layerGroup().addTo(map),
      };
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Update Basemap Tiles
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !layerGroupsRef.current.basemap) return;

    layerGroupsRef.current.basemap.clearLayers();

    let tileUrl = '';
    let attribution = '';

    if (activeBasemap === 'satellite') {
      tileUrl = 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}';
      attribution = '&copy; Esri &mdash; Maxar, Earthstar Geographics';
    } else if (activeBasemap === 'topo') {
      tileUrl = 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png';
      attribution = '&copy; OpenTopoMap contributors';
    } else {
      tileUrl = 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png';
      attribution = '&copy; CARTO &copy; OpenStreetMap contributors';
    }

    const tileLayer = L.tileLayer(tileUrl, {
      maxZoom: 18,
      attribution,
    });
    layerGroupsRef.current.basemap.addLayer(tileLayer);
  }, [activeBasemap]);

  // Update GIS Layers when watershed or toggles change
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !watershed) return;

    const lat = watershed.coordinates.lat;
    const lng = watershed.coordinates.lng;

    map.setView([lat, lng], watershed.coordinates.zoom || 13);

    const lg = layerGroupsRef.current;

    // 1. Boundary Layer
    lg.boundary.clearLayers();
    if (layersState.boundary && (watershed as any).boundary) {
      const boundaryPolygon = L.polygon((watershed as any).boundary, {
        color: '#2563eb',
        weight: 3,
        dashArray: '6, 6',
        fillColor: '#3b82f6',
        fillOpacity: 0.08,
      }).bindTooltip(`Watershed Boundary: ${watershed.code}`, {
        permanent: false,
        direction: 'center',
      });
      lg.boundary.addLayer(boundaryPolygon);
    }

    // 2. Land Use Layer (Simulated realistic polygons)
    lg.landUse.clearLayers();
    if (layersState.landUse) {
      // Agriculture zone (valley)
      const agriPoly = L.polygon([
        [lat + 0.012, lng - 0.018],
        [lat + 0.018, lng + 0.015],
        [lat - 0.005, lng + 0.022],
        [lat - 0.012, lng - 0.008],
      ], {
        color: '#ca8a04',
        weight: 1,
        fillColor: '#eab308',
        fillOpacity: 0.25,
      }).bindPopup('<b>Land Use:</b> Intensive Rainfed Agriculture (42% area)');

      // Forest zone (ridge)
      const forestPoly = L.polygon([
        [lat + 0.022, lng - 0.028],
        [lat + 0.028, lng - 0.005],
        [lat + 0.018, lng - 0.010],
        [lat + 0.015, lng - 0.025],
      ], {
        color: '#16a34a',
        weight: 1,
        fillColor: '#15803d',
        fillOpacity: 0.35,
      }).bindPopup('<b>Land Use:</b> Ridge Deciduous Forest (22% area)');

      // Barren land zone
      const barrenPoly = L.polygon([
        [lat - 0.018, lng - 0.022],
        [lat - 0.012, lng - 0.012],
        [lat - 0.024, lng - 0.008],
        [lat - 0.028, lng - 0.019],
      ], {
        color: '#ea580c',
        weight: 1,
        fillColor: '#f97316',
        fillOpacity: 0.3,
      }).bindPopup('<b>Land Use:</b> Barren & Degraded Rocky Slopes (10% area)');

      lg.landUse.addLayer(agriPoly);
      lg.landUse.addLayer(forestPoly);
      lg.landUse.addLayer(barrenPoly);
    }

    // 3. Vegetation (NDVI heat gradient circles)
    lg.vegetation.clearLayers();
    if (layersState.vegetation) {
      const vegOffsets = [
        { latOff: 0.008, lngOff: 0.005, r: 400, color: '#16a34a', ndvi: 0.68, label: 'High Biomass (NDVI 0.68)' },
        { latOff: -0.006, lngOff: 0.012, r: 550, color: '#22c55e', ndvi: 0.52, label: 'Moderate Canopy (NDVI 0.52)' },
        { latOff: -0.015, lngOff: -0.014, r: 600, color: '#eab308', ndvi: 0.28, label: 'Vegetation Stress (NDVI 0.28)' },
      ];
      vegOffsets.forEach((v) => {
        const circle = L.circle([lat + v.latOff, lng + v.lngOff], {
          radius: v.r,
          color: v.color,
          weight: 1,
          fillColor: v.color,
          fillOpacity: 0.28,
        }).bindTooltip(v.label);
        lg.vegetation.addLayer(circle);
      });
    }

    // 4. Water Bodies
    lg.waterBodies.clearLayers();
    if (layersState.waterBodies && waterBodies.length > 0) {
      waterBodies.forEach((wb) => {
        const marker = L.circleMarker([wb.lat, wb.lng], {
          radius: Math.max(7, Math.min(14, wb.areaHectares / 2.5)),
          color: '#0284c7',
          weight: 2,
          fillColor: '#38bdf8',
          fillOpacity: 0.8,
        }).bindPopup(`
          <div class="text-xs p-1">
            <strong class="text-sky-900 block font-bold">${wb.name}</strong>
            <span class="text-slate-600 block mt-1">Type: <b>${wb.type}</b></span>
            <span class="text-slate-600 block">Area: <b>${wb.areaHectares} ha</b></span>
            <span class="text-slate-600 block">Storage: <b class="${wb.storageCondition === 'Full' ? 'text-emerald-700' : 'text-amber-700'}">${wb.storageCondition}</b></span>
            <span class="text-slate-500 block text-[10px] mt-1">Multi-temporal delta: ${wb.changePctFromPrevious >= 0 ? '+' : ''}${wb.changePctFromPrevious}%</span>
          </div>
        `);
        lg.waterBodies.addLayer(marker);
      });
    }

    // 5. Drainage Lines
    lg.drainage.clearLayers();
    if (layersState.drainage) {
      const drainageStreams = [
        [
          [lat + 0.025, lng - 0.022],
          [lat + 0.015, lng - 0.010],
          [lat + 0.002, lng + 0.005],
          [lat - 0.012, lng + 0.020],
          [lat - 0.022, lng + 0.035],
        ],
        [
          [lat + 0.018, lng + 0.012],
          [lat + 0.008, lng + 0.008],
          [lat + 0.002, lng + 0.005],
        ],
        [
          [lat - 0.018, lng - 0.018],
          [lat - 0.008, lng - 0.006],
          [lat + 0.002, lng + 0.005],
        ],
      ];

      drainageStreams.forEach((streamCoords, idx) => {
        const polyline = L.polyline(streamCoords as any, {
          color: idx === 0 ? '#1d4ed8' : '#0284c7',
          weight: idx === 0 ? 3.5 : 2.5,
          opacity: 0.85,
        }).bindTooltip(`Stream Order ${idx === 0 ? '3 (Main Channel)' : '2 (Tributary)'}`);
        lg.drainage.addLayer(polyline);
      });
    }

    // 6. Priority Areas & Issues (Interactive Red/Amber markers)
    lg.priorityAreas.clearLayers();
    if (layersState.priorityAreas && issues.length > 0) {
      issues.forEach((issue) => {
        const isHigh = issue.severity === 'High';
        const markerColor = isHigh ? '#dc2626' : '#d97706';

        const customIcon = L.divIcon({
          className: 'custom-priority-pin',
          html: `<div style="background-color: ${markerColor}; width: 20px; height: 20px; border-radius: 50%; border: 2px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.4); display: flex; align-items: center; justify-content: center; color: white; font-size: 10px; font-weight: bold;">!</div>`,
          iconSize: [20, 20],
          iconAnchor: [10, 10],
        });

        const marker = L.marker([issue.lat, issue.lng], { icon: customIcon });
        marker.on('click', () => {
          setSelectedHotspot(issue);
        });
        marker.bindTooltip(`<b>${issue.id}: ${issue.type}</b> (${issue.severity} Priority)`);

        lg.priorityAreas.addLayer(marker);
      });
    }

    // 7. Change Detection Overlay
    lg.changeDetection.clearLayers();
    if (layersState.changeDetection) {
      // New water expansion polygon
      const gainPoly = L.polygon([
        [lat + 0.005, lng + 0.002],
        [lat + 0.010, lng + 0.008],
        [lat + 0.004, lng + 0.012],
      ], {
        color: '#059669',
        weight: 2,
        fillColor: '#10b981',
        fillOpacity: 0.45,
      }).bindTooltip('Change: +14 ha Surface Water Gain Post-Checkdam');

      lg.changeDetection.addLayer(gainPoly);
    }
  }, [watershed, layersState, issues, waterBodies]);

  const toggleLayer = (layerKey: keyof typeof layersState) => {
    setLayersState((prev) => ({
      ...prev,
      [layerKey]: !prev[layerKey],
    }));
  };

  return (
    <div className="space-y-4">
      {/* Map Control Bar */}
      <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Compass className="w-5 h-5 text-blue-700 shrink-0" />
          <div>
            <h2 className="text-sm font-bold text-slate-900">
              Interactive GIS Map: {watershed?.name} ({watershed?.code})
            </h2>
            <p className="text-[11px] text-slate-500">
              {watershed?.coordinates.lat.toFixed(4)}°N, {watershed?.coordinates.lng.toFixed(4)}°E • Projected WGS 84
            </p>
          </div>
        </div>

        {/* Basemap Switcher */}
        <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-lg text-xs font-medium">
          <button
            onClick={() => setActiveBasemap('satellite')}
            className={`px-2.5 py-1 rounded transition-colors cursor-pointer ${
              activeBasemap === 'satellite'
                ? 'bg-white text-blue-700 shadow-xs font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Satellite
          </button>
          <button
            onClick={() => setActiveBasemap('topo')}
            className={`px-2.5 py-1 rounded transition-colors cursor-pointer ${
              activeBasemap === 'topo'
                ? 'bg-white text-blue-700 shadow-xs font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Topographic
          </button>
          <button
            onClick={() => setActiveBasemap('street')}
            className={`px-2.5 py-1 rounded transition-colors cursor-pointer ${
              activeBasemap === 'street'
                ? 'bg-white text-blue-700 shadow-xs font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Boundary Map
          </button>
        </div>
      </div>

      {/* Main Map with Layer Control overlay */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        {/* Leaflet Map Canvas */}
        <div className="lg:col-span-3 bg-slate-100 rounded-xl border border-slate-200 overflow-hidden relative min-h-[520px] shadow-inner">
          <div ref={mapContainerRef} className="w-full h-[520px] z-10" />

          {/* Map Overlay Badge */}
          <div className="absolute top-3 right-3 z-20 bg-slate-900/85 backdrop-blur-xs text-white text-[11px] px-2.5 py-1 rounded-md border border-slate-700 shadow-md flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>SIH DEMO GIS LAYERS</span>
          </div>

          {/* Quick Legend Bar */}
          <div className="absolute bottom-3 left-3 z-20 bg-white/95 backdrop-blur-xs text-slate-800 text-[10px] p-2.5 rounded-lg border border-slate-300 shadow-md max-w-xs hidden sm:block">
            <span className="font-bold text-slate-900 block mb-1">GIS Symbology Legend</span>
            <div className="grid grid-cols-2 gap-x-2 gap-y-1">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 bg-blue-600 rounded-xs inline-block" /> Watershed Boundary
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 bg-sky-500 rounded-full inline-block" /> Water Bodies
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 bg-emerald-600 rounded-xs inline-block" /> High NDVI (Vigor)
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 bg-blue-700 rounded-xs inline-block" /> Drainage Stream
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 bg-amber-500 rounded-xs inline-block" /> Low Moisture Zone
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 bg-red-600 rounded-full inline-block" /> Priority Issue Point
              </span>
            </div>
          </div>
        </div>

        {/* Layer Controls & Hotspot Inspector */}
        <div className="space-y-4">
          {/* Layer Switcher */}
          <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-xs space-y-3">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
              <Layers className="w-4 h-4 text-blue-700" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900">
                Layer Controls
              </h3>
            </div>

            <div className="space-y-2 text-xs">
              <label className="flex items-center justify-between p-1.5 rounded hover:bg-slate-50 cursor-pointer">
                <span className="flex items-center gap-2 text-slate-700 font-medium">
                  <span className="w-2 h-2 rounded-full bg-blue-600" />
                  Watershed Boundary
                </span>
                <input
                  type="checkbox"
                  checked={layersState.boundary}
                  onChange={() => toggleLayer('boundary')}
                  className="rounded text-blue-600 focus:ring-0 cursor-pointer"
                />
              </label>

              <label className="flex items-center justify-between p-1.5 rounded hover:bg-slate-50 cursor-pointer">
                <span className="flex items-center gap-2 text-slate-700 font-medium">
                  <span className="w-2 h-2 rounded-full bg-amber-500" />
                  Land Use Classification
                </span>
                <input
                  type="checkbox"
                  checked={layersState.landUse}
                  onChange={() => toggleLayer('landUse')}
                  className="rounded text-blue-600 focus:ring-0 cursor-pointer"
                />
              </label>

              <label className="flex items-center justify-between p-1.5 rounded hover:bg-slate-50 cursor-pointer">
                <span className="flex items-center gap-2 text-slate-700 font-medium">
                  <span className="w-2 h-2 rounded-full bg-emerald-600" />
                  Vegetation (NDVI)
                </span>
                <input
                  type="checkbox"
                  checked={layersState.vegetation}
                  onChange={() => toggleLayer('vegetation')}
                  className="rounded text-blue-600 focus:ring-0 cursor-pointer"
                />
              </label>

              <label className="flex items-center justify-between p-1.5 rounded hover:bg-slate-50 cursor-pointer">
                <span className="flex items-center gap-2 text-slate-700 font-medium">
                  <span className="w-2 h-2 rounded-full bg-sky-500" />
                  Water Bodies
                </span>
                <input
                  type="checkbox"
                  checked={layersState.waterBodies}
                  onChange={() => toggleLayer('waterBodies')}
                  className="rounded text-blue-600 focus:ring-0 cursor-pointer"
                />
              </label>

              <label className="flex items-center justify-between p-1.5 rounded hover:bg-slate-50 cursor-pointer">
                <span className="flex items-center gap-2 text-slate-700 font-medium">
                  <span className="w-2 h-2 rounded-full bg-blue-800" />
                  Drainage Network
                </span>
                <input
                  type="checkbox"
                  checked={layersState.drainage}
                  onChange={() => toggleLayer('drainage')}
                  className="rounded text-blue-600 focus:ring-0 cursor-pointer"
                />
              </label>

              <label className="flex items-center justify-between p-1.5 rounded hover:bg-slate-50 cursor-pointer">
                <span className="flex items-center gap-2 text-slate-700 font-medium">
                  <span className="w-2 h-2 rounded-full bg-red-600" />
                  Priority Areas (Issues)
                </span>
                <input
                  type="checkbox"
                  checked={layersState.priorityAreas}
                  onChange={() => toggleLayer('priorityAreas')}
                  className="rounded text-blue-600 focus:ring-0 cursor-pointer"
                />
              </label>

              <label className="flex items-center justify-between p-1.5 rounded hover:bg-slate-50 cursor-pointer">
                <span className="flex items-center gap-2 text-slate-700 font-medium">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  Change Detection (Delta)
                </span>
                <input
                  type="checkbox"
                  checked={layersState.changeDetection}
                  onChange={() => toggleLayer('changeDetection')}
                  className="rounded text-blue-600 focus:ring-0 cursor-pointer"
                />
              </label>
            </div>
          </div>

          {/* Hotspot Inspector Card */}
          {selectedHotspot ? (
            <div className="bg-white rounded-xl p-4 border border-red-200 shadow-xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-red-700 bg-red-100 px-1.5 py-0.5 rounded">
                  {selectedHotspot.id} • {selectedHotspot.severity} Priority
                </span>
                <button
                  onClick={() => setSelectedHotspot(null)}
                  className="text-slate-400 hover:text-slate-600 text-xs"
                >
                  ✕
                </button>
              </div>

              <h4 className="text-xs font-bold text-slate-900">
                {selectedHotspot.type}
              </h4>
              <p className="text-[11px] text-slate-600">
                {selectedHotspot.locationDesc}
              </p>
              <div className="text-[11px] bg-slate-50 p-2 rounded border border-slate-200 text-slate-700">
                <strong>Area:</strong> {selectedHotspot.areaHectares} ha • <strong>Confidence:</strong> {selectedHotspot.confidencePct}%
              </div>
              <div className="text-[11px] text-blue-900 bg-blue-50 p-2 rounded border border-blue-200">
                <strong>Recommended Action:</strong> {selectedHotspot.suggestedAction}
              </div>
            </div>
          ) : (
            <div className="bg-slate-50 rounded-xl p-4 border border-dashed border-slate-300 text-center">
              <MapPin className="w-6 h-6 text-slate-400 mx-auto mb-1.5" />
              <p className="text-xs font-semibold text-slate-700">
                Click any priority marker on the map
              </p>
              <p className="text-[11px] text-slate-500 mt-1">
                To inspect coordinates, severity rating, and suggested DoLR intervention.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
