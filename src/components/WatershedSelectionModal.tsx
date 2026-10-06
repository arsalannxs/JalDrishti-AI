import React, { useState } from 'react';
import { X, MapPin, Check, ArrowRight } from 'lucide-react';
import { Watershed } from '../types/watershed';

interface WatershedSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  watersheds: Watershed[];
  selectedWatershed: Watershed | null;
  onSelectWatershed: (ws: Watershed) => void;
}

export const WatershedSelectionModal: React.FC<WatershedSelectionModalProps> = ({
  isOpen,
  onClose,
  watersheds,
  selectedWatershed,
  onSelectWatershed,
}) => {
  if (!isOpen) return null;

  const states = Array.from(new Set(watersheds.map((w) => w.state)));
  const [selectedState, setSelectedState] = useState<string>(selectedWatershed?.state || states[0] || '');

  const filteredByState = watersheds.filter((w) => w.state === selectedState);
  const districts = Array.from(new Set(filteredByState.map((w) => w.district)));
  const [selectedDistrict, setSelectedDistrict] = useState<string>(selectedWatershed?.district || districts[0] || '');

  const filteredByDistrict = filteredByState.filter((w) => w.district === selectedDistrict);
  const blocks = Array.from(new Set(filteredByDistrict.map((w) => w.block)));
  const [selectedBlock, setSelectedBlock] = useState<string>(selectedWatershed?.block || blocks[0] || '');

  const finalWatersheds = filteredByDistrict.filter((w) => w.block === selectedBlock);
  const [chosenWsId, setChosenWsId] = useState<string>(selectedWatershed?.id || finalWatersheds[0]?.id || '');

  const handleOpenWatershed = () => {
    const ws = watersheds.find((w) => w.id === chosenWsId) || finalWatersheds[0];
    if (ws) {
      onSelectWatershed(ws);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="bg-slate-900 text-white p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-blue-400" />
            <h3 className="font-bold text-sm">Select Watershed Unit (DoLR Hierarchy)</h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-1">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <p className="text-xs text-slate-500">
            Select an administrative location to load satellite rasters, GIS hydrological streams, and multi-temporal change indicators.
          </p>

          <div className="space-y-3 text-xs">
            {/* State */}
            <div>
              <label className="block font-semibold text-slate-700 mb-1">State:</label>
              <select
                value={selectedState}
                onChange={(e) => {
                  setSelectedState(e.target.value);
                  const matching = watersheds.filter((w) => w.state === e.target.value);
                  setSelectedDistrict(matching[0]?.district || '');
                  setSelectedBlock(matching[0]?.block || '');
                  setChosenWsId(matching[0]?.id || '');
                }}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 font-medium text-slate-800"
              >
                {states.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>

            {/* District */}
            <div>
              <label className="block font-semibold text-slate-700 mb-1">District:</label>
              <select
                value={selectedDistrict}
                onChange={(e) => {
                  setSelectedDistrict(e.target.value);
                  const matching = filteredByState.filter((w) => w.district === e.target.value);
                  setSelectedBlock(matching[0]?.block || '');
                  setChosenWsId(matching[0]?.id || '');
                }}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 font-medium text-slate-800"
              >
                {districts.map((d) => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>

            {/* Block */}
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Block / Taluka:</label>
              <select
                value={selectedBlock}
                onChange={(e) => {
                  setSelectedBlock(e.target.value);
                  const matching = filteredByDistrict.filter((w) => w.block === e.target.value);
                  setChosenWsId(matching[0]?.id || '');
                }}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 font-medium text-slate-800"
              >
                {blocks.map((b) => (
                  <option key={b} value={b}>{b}</option>
                ))}
              </select>
            </div>

            {/* Watershed */}
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Watershed ID:</label>
              <select
                value={chosenWsId}
                onChange={(e) => setChosenWsId(e.target.value)}
                className="w-full bg-blue-50 border border-blue-300 rounded-lg p-2 font-bold text-blue-900"
              >
                {finalWatersheds.map((w) => (
                  <option key={w.id} value={w.id}>
                    {w.code} - {w.name} ({w.areaKm2} km²)
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-lg p-2.5 text-[11px] text-amber-900">
            <strong>Sample Locations Available:</strong> Maharashtra (Pune), Rajasthan (Udaipur), Madhya Pradesh (Dhar), Karnataka (Kolar).
          </div>
        </div>

        {/* Footer */}
        <div className="bg-slate-50 border-t border-slate-200 px-6 py-3 flex items-center justify-end gap-2">
          <button
            onClick={onClose}
            className="text-xs font-semibold text-slate-600 hover:text-slate-800 px-3 py-2 rounded-lg"
          >
            Cancel
          </button>
          <button
            onClick={handleOpenWatershed}
            className="flex items-center gap-1.5 bg-blue-700 hover:bg-blue-800 text-white text-xs font-semibold px-4 py-2 rounded-lg shadow-xs transition-colors cursor-pointer"
          >
            <span>Open Watershed</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
