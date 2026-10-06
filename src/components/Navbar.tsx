import React, { useState } from 'react';
import {
  Compass,
  Play,
  Layers,
  BarChart3,
  GitCompare,
  AlertTriangle,
  Sparkles,
  FileText,
  MapPin,
  Menu,
  X,
  Droplets,
} from 'lucide-react';
import { Watershed } from '../types/watershed';

interface NavbarProps {
  currentTab: string;
  onTabChange: (tab: string) => void;
  watersheds: Watershed[];
  selectedWatershed: Watershed | null;
  onSelectWatershed: (ws: Watershed) => void;
  onRunDemo: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onTabChange,
  watersheds,
  selectedWatershed,
  onSelectWatershed,
  onRunDemo,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'map', label: 'Watershed Map', icon: Compass },
    { id: 'image', label: 'Geo-Coded Image', icon: Layers },
    { id: 'gis', label: 'GIS Analysis', icon: BarChart3 },
    { id: 'change', label: 'Change Detection', icon: GitCompare },
    { id: 'issues', label: 'Watershed Issues', icon: AlertTriangle },
    { id: 'ai', label: 'AI Insights', icon: Sparkles },
    { id: 'report', label: 'Assessment Report', icon: FileText },
  ];

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs">
      {/* Top Gov Header */}
      <div className="bg-slate-900 text-slate-300 text-[11px] px-4 py-1 border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="font-semibold text-white tracking-wide">
              DEPARTMENT OF LAND RESOURCES (DoLR)
            </span>
            <span className="hidden sm:inline text-slate-500">•</span>
            <span className="hidden sm:inline text-slate-400">
              Ministry of Rural Development, Government of India
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="bg-blue-900/60 text-blue-300 px-2 py-0.5 rounded text-[10px] font-mono border border-blue-700/50">
              SIH26015
            </span>
            <span className="text-slate-400">Prototype v1.0</span>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Logo & Tagline */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="w-10 h-10 rounded-lg bg-blue-700 flex items-center justify-center text-white shadow-sm ring-2 ring-blue-600/20">
              <Droplets className="w-5 h-5 text-sky-200" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-bold tracking-tight text-slate-900">
                  JalDrishti <span className="text-blue-700 font-extrabold">AI</span>
                </span>
                <span className="bg-blue-100 text-blue-800 text-[10px] font-semibold px-1.5 py-0.5 rounded border border-blue-200">
                  GIS & ML
                </span>
              </div>
              <p className="text-[11px] text-slate-500 hidden md:block">
                See the Watershed. Understand the Change. Plan Better.
              </p>
            </div>
          </div>

          {/* Quick Watershed Selector */}
          <div className="hidden lg:flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs">
            <MapPin className="w-4 h-4 text-blue-600 shrink-0" />
            <span className="text-slate-500 font-medium">Watershed:</span>
            <select
              value={selectedWatershed?.id || ''}
              onChange={(e) => {
                const target = watersheds.find((w) => w.id === e.target.value);
                if (target) onSelectWatershed(target);
              }}
              className="bg-transparent font-semibold text-slate-800 focus:outline-none cursor-pointer"
            >
              {watersheds.map((w) => (
                <option key={w.id} value={w.id}>
                  {w.code} - {w.name} ({w.district}, {w.state})
                </option>
              ))}
            </select>
          </div>

          {/* CTA & Run Demo */}
          <div className="flex items-center gap-2">
            <button
              onClick={onRunDemo}
              className="flex items-center gap-1.5 bg-gradient-to-r from-blue-700 to-indigo-700 hover:from-blue-800 hover:to-indigo-800 text-white text-xs font-semibold px-3 py-2 rounded-lg shadow-sm transition-all focus:ring-2 focus:ring-blue-500/20 active:scale-98 cursor-pointer"
              title="Run 1-Click Interactive SIH Hackathon Demo Walkthrough"
            >
              <Play className="w-3.5 h-3.5 fill-white" />
              <span>RUN SIH DEMO</span>
            </button>

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center space-x-1 border-t border-slate-100 py-1.5 overflow-x-auto scrollbar-none">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap cursor-pointer ${
                  isActive
                    ? 'bg-blue-50 text-blue-700 border border-blue-200/80 font-semibold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-blue-700' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-slate-200 px-4 py-3 space-y-3">
          <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200">
            <label className="block text-[11px] font-semibold text-slate-600 mb-1">
              Select Watershed
            </label>
            <select
              value={selectedWatershed?.id || ''}
              onChange={(e) => {
                const target = watersheds.find((w) => w.id === e.target.value);
                if (target) {
                  onSelectWatershed(target);
                  setMobileMenuOpen(false);
                }
              }}
              className="w-full text-xs bg-white border border-slate-300 rounded p-1.5 font-medium text-slate-800"
            >
              {watersheds.map((w) => (
                <option key={w.id} value={w.id}>
                  {w.code} - {w.name} ({w.district}, {w.state})
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onTabChange(item.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`flex items-center gap-2 px-3 py-2 text-xs rounded-md font-medium text-left ${
                    isActive
                      ? 'bg-blue-50 text-blue-700 border border-blue-200'
                      : 'text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </header>
  );
};
