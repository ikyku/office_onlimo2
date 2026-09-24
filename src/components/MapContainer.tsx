import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import {
  Layers,
  Columns,
  Sliders,
  Grid,
  Info,
  LocateFixed,
  Plus,
  Minus,
  Check,
} from 'lucide-react';
import { Station, WaterQualityStatus } from '../types/onlimo';

interface MapContainerProps {
  stations: Station[];
  filteredStations: Station[];
  selectedStation: Station | null;
  onSelectStation: (station: Station | null) => void;
  isDarkMode: boolean;
  onOpenRegulationInfo: () => void;
}

type BasemapType = 'streets' | 'satellite' | 'topo' | 'canvas';

export const MapContainer: React.FC<MapContainerProps> = ({
  filteredStations,
  selectedStation,
  onSelectStation,
  isDarkMode,
  onOpenRegulationInfo,
}) => {
  const mapElementRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const tileLayerRef = useRef<L.TileLayer | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);

  // OpenStreetMap is default as requested to avoid "API KEY REQUIRED" watermark
  const [activeBasemap, setActiveBasemap] = useState<BasemapType>('streets');
  const [showLayerMenu, setShowLayerMenu] = useState(false);
  const [showGridOverlay, setShowGridOverlay] = useState(false);
  const [splitViewActive, setSplitViewActive] = useState(false);

  // Basemap URLs (Public, fast, free, NO API key required)
  const basemapUrls: Record<BasemapType, { url: string; subdomains?: string; attribution: string }> = {
    streets: {
      url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      attribution: '&copy; OpenStreetMap contributors',
    },
    satellite: {
      url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
      attribution: '&copy; Esri &copy; DigitalGlobe',
    },
    topo: {
      url: 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png',
      attribution: '&copy; OpenTopoMap contributors',
    },
    canvas: {
      url: 'https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}',
      attribution: '&copy; Esri World Light Gray',
    },
  };

  // Initialize Map
  useEffect(() => {
    if (!mapElementRef.current || mapInstanceRef.current) return;

    // Indonesia center: lat -2.5, lng 118
    const map = L.map(mapElementRef.current, {
      center: [-2.5489, 118.0149],
      zoom: 5,
      minZoom: 4,
      maxZoom: 18,
      zoomControl: false,
      attributionControl: true,
    });

    const currentLayerConfig = basemapUrls[activeBasemap];
    const tileLayer = L.tileLayer(currentLayerConfig.url, {
      subdomains: currentLayerConfig.subdomains || 'abc',
      attribution: currentLayerConfig.attribution,
      maxZoom: 19,
    }).addTo(map);

    tileLayerRef.current = tileLayer;

    const markersGroup = L.layerGroup().addTo(map);
    markersLayerRef.current = markersGroup;

    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Update Basemap Layer when activeBasemap changes
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    if (tileLayerRef.current) {
      map.removeLayer(tileLayerRef.current);
    }

    const currentLayerConfig = basemapUrls[activeBasemap];
    const newTileLayer = L.tileLayer(currentLayerConfig.url, {
      subdomains: currentLayerConfig.subdomains || 'abc',
      attribution: currentLayerConfig.attribution,
      maxZoom: 19,
    }).addTo(map);

    tileLayerRef.current = newTileLayer;
  }, [activeBasemap]);

  // Update Markers
  useEffect(() => {
    const markersGroup = markersLayerRef.current;
    if (!markersGroup) return;

    markersGroup.clearLayers();

    const getStatusClass = (status: WaterQualityStatus | string) => {
      switch (status) {
        case 'memenuhi_baku_mutu':
        case 'baku_mutu':
          return 'marker-baku-mutu';
        case 'cemar_ringan':
          return 'marker-cemar-ringan';
        case 'cemar_sedang':
          return 'marker-cemar-sedang';
        case 'cemar_berat':
          return 'marker-cemar-berat';
        case 'tanpa_data':
        default:
          return 'marker-tanpa-data';
      }
    };

    filteredStations.forEach((station) => {
      const isSelected = selectedStation?.id === station.id;
      const markerClass = getStatusClass(station.status);

      const customIcon = L.divIcon({
        className: 'custom-div-icon',
        html: `
          <div class="onlimo-marker ${markerClass} ${
          isSelected ? 'ring-3 ring-white ring-offset-2 ring-offset-blue-600 scale-125 z-50 animate-bounce' : ''
        }">
            <span>${station.badgeNumber}</span>
          </div>
        `,
        iconSize: [36, 24],
        iconAnchor: [18, 24],
        popupAnchor: [0, -26],
      });

      const marker = L.marker([station.lat, station.lng], { icon: customIcon });

      // Clean tooltip on hover
      marker.bindTooltip(
        `<div class="p-1">
          <p class="font-bold text-xs">${station.name}</p>
          <p class="text-xs text-gray-500">${station.river} &bull; ${station.city}</p>
        </div>`,
        { direction: 'top', offset: [0, -20], className: 'shadow-md rounded-md' }
      );

      marker.on('click', () => {
        onSelectStation(station);
      });

      markersGroup.addLayer(marker);
    });
  }, [filteredStations, selectedStation]);

  // Fly to selected station
  useEffect(() => {
    if (selectedStation && mapInstanceRef.current) {
      mapInstanceRef.current.flyTo([selectedStation.lat, selectedStation.lng], 9, {
        animate: true,
        duration: 1.2,
      });
    }
  }, [selectedStation]);

  // Controls Handlers
  const handleZoomIn = () => {
    mapInstanceRef.current?.zoomIn();
  };

  const handleZoomOut = () => {
    mapInstanceRef.current?.zoomOut();
  };

  const handleCenterIndonesia = () => {
    mapInstanceRef.current?.flyTo([-2.5489, 118.0149], 5, {
      duration: 1,
    });
    onSelectStation(null);
  };

  return (
    <div className="relative w-full h-full overflow-hidden flex-1 select-none">
      {/* Map DOM node */}
      <div
        ref={mapElementRef}
        className={`w-full h-full z-0 ${isDarkMode && activeBasemap === 'streets' ? 'dark-map-tiles' : ''}`}
      />

      {/* Grid overlay visualization when enabled */}
      {showGridOverlay && (
        <div
          className="absolute inset-0 pointer-events-none z-10 opacity-20"
          style={{
            backgroundImage:
              'linear-gradient(to right, #0284c7 1px, transparent 1px), linear-gradient(to bottom, #0284c7 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }}
        />
      )}

      {/* Split view comparison indicator if active */}
      {splitViewActive && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20 bg-black/70 backdrop-blur-md text-white text-xs px-3 py-1.5 rounded-full flex items-center gap-2 shadow-lg">
          <Columns className="w-3.5 h-3.5 text-amber-400" />
          <span>Mode Komparasi Aktif (Baku Mutu vs Sensor)</span>
          <button
            onClick={() => setSplitViewActive(false)}
            className="ml-1 text-gray-300 hover:text-white font-bold"
          >
            &times;
          </button>
        </div>
      )}

      {/* Floating Toolbar: Left Vertical Control Bar */}
      <div
        className={`absolute top-4 left-4 z-20 flex flex-col ${
          isDarkMode
            ? 'bg-slate-800/95 border-slate-700 text-slate-200'
            : 'bg-white/95 border-gray-200/80 text-gray-700'
        } rounded-xl shadow-md border p-1 gap-1 backdrop-blur-xs`}
      >
        {/* Layer Selector */}
        <div className="relative">
          <button
            onClick={() => setShowLayerMenu(!showLayerMenu)}
            className={`p-2 rounded-lg transition-colors cursor-pointer ${
              showLayerMenu
                ? 'bg-orange-50 text-[#ff6900]'
                : isDarkMode
                ? 'text-slate-300 hover:bg-slate-700/60'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
            title="Pilih Lapisan Peta (Basemap)"
          >
            <Layers className="w-4 h-4" />
          </button>

          {/* Layer Flyout Menu */}
          {showLayerMenu && (
            <div
              className={`absolute left-full top-0 ml-2 w-44 ${
                isDarkMode
                  ? 'bg-slate-800 border-slate-700 text-slate-200 shadow-2xl'
                  : 'bg-white border-gray-200 text-gray-700 shadow-xl'
              } border rounded-xl p-1.5 z-30 text-xs`}
            >
              <span className="block px-2.5 py-1 text-xs font-bold uppercase text-gray-400">
                Pilih Tipe Peta
              </span>
              <button
                onClick={() => {
                  setActiveBasemap('streets');
                  setShowLayerMenu(false);
                }}
                className={`w-full min-h-[32px] flex items-center justify-between px-2.5 py-1.5 rounded-lg ${
                  isDarkMode ? 'hover:bg-slate-700' : 'hover:bg-gray-100'
                }`}
              >
                <span>OpenStreetMap (Default)</span>
                {activeBasemap === 'streets' && <Check className="w-3.5 h-3.5 text-[#ff6900]" />}
              </button>
              <button
                onClick={() => {
                  setActiveBasemap('satellite');
                  setShowLayerMenu(false);
                }}
                className={`w-full min-h-[32px] flex items-center justify-between px-2.5 py-1.5 rounded-lg ${
                  isDarkMode ? 'hover:bg-slate-700' : 'hover:bg-gray-100'
                }`}
              >
                <span>Satelit Esri</span>
                {activeBasemap === 'satellite' && <Check className="w-3.5 h-3.5 text-[#ff6900]" />}
              </button>
              <button
                onClick={() => {
                  setActiveBasemap('topo');
                  setShowLayerMenu(false);
                }}
                className={`w-full min-h-[32px] flex items-center justify-between px-2.5 py-1.5 rounded-lg ${
                  isDarkMode ? 'hover:bg-slate-700' : 'hover:bg-gray-100'
                }`}
              >
                <span>OpenTopoMap</span>
                {activeBasemap === 'topo' && <Check className="w-3.5 h-3.5 text-[#ff6900]" />}
              </button>
              <button
                onClick={() => {
                  setActiveBasemap('canvas');
                  setShowLayerMenu(false);
                }}
                className={`w-full min-h-[32px] flex items-center justify-between px-2.5 py-1.5 rounded-lg ${
                  isDarkMode ? 'hover:bg-slate-700' : 'hover:bg-gray-100'
                }`}
              >
                <span>Esri Light Canvas</span>
                {activeBasemap === 'canvas' && <Check className="w-3.5 h-3.5 text-[#ff6900]" />}
              </button>
            </div>
          )}
        </div>

        {/* Split/Compare Mode Toggle */}
        <button
          onClick={() => setSplitViewActive(!splitViewActive)}
          className={`p-2 rounded-lg transition-colors cursor-pointer ${
            splitViewActive
              ? 'bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400'
              : 'text-gray-600 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-700/60'
          }`}
          title="Mode Komparasi / Split Layout"
        >
          <Columns className="w-4 h-4" />
        </button>

        {/* Sliders / Quick Threshold Filter */}
        <button
          onClick={handleCenterIndonesia}
          className="p-2 rounded-lg text-gray-600 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-700/60 transition-colors cursor-pointer"
          title="Tampilkan Seluruh Indonesia"
        >
          <Sliders className="w-4 h-4" />
        </button>

        {/* Grid Overlay Toggle */}
        <button
          onClick={() => setShowGridOverlay(!showGridOverlay)}
          className={`p-2 rounded-lg transition-colors cursor-pointer ${
            showGridOverlay
              ? 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400'
              : 'text-gray-600 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-700/60'
          }`}
          title="Tampilkan / Sembunyikan Grid Koordinat"
        >
          <Grid className="w-4 h-4" />
        </button>
      </div>

      {/* Floating Toolbar: Top Right Map Buttons */}
      <div className="absolute top-4 right-4 z-20 flex flex-col gap-2">
        <button
          onClick={() => setSplitViewActive(!splitViewActive)}
          className="w-9 h-9 flex items-center justify-center bg-white dark:bg-slate-800 rounded-xl shadow-md border border-gray-200/80 dark:border-slate-700 text-amber-500 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors cursor-pointer"
          title="Tampilan Kolom / Komparasi"
        >
          <Columns className="w-4 h-4" />
        </button>

        <button
          onClick={onOpenRegulationInfo}
          className="w-9 h-9 flex items-center justify-center bg-white dark:bg-slate-800 rounded-xl shadow-md border border-gray-200/80 dark:border-slate-700 text-blue-500 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors cursor-pointer"
          title="Informasi Baku Mutu & Peraturan"
        >
          <Info className="w-4 h-4" />
        </button>
      </div>

      {/* Floating Toolbar: Bottom Right (Location, Zoom In, Zoom Out) */}
      <div className="absolute bottom-6 right-4 z-20 flex flex-col gap-2">
        {/* GPS Re-center to Indonesia */}
        <button
          onClick={handleCenterIndonesia}
          className="w-8 h-8 flex items-center justify-center bg-white dark:bg-slate-800 rounded-lg shadow-md border border-gray-200/80 dark:border-slate-700 text-gray-700 dark:text-slate-200 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors cursor-pointer"
          title="Pusatkan Peta ke Indonesia"
        >
          <LocateFixed className="w-4 h-4" />
        </button>

        {/* Zoom In & Out Stack */}
        <div className="flex flex-col bg-white dark:bg-slate-800 rounded-lg shadow-md border border-gray-200/80 dark:border-slate-700 overflow-hidden">
          <button
            onClick={handleZoomIn}
            className="w-8 h-8 flex items-center justify-center text-gray-700 dark:text-slate-200 hover:bg-gray-50 dark:hover:bg-slate-700 border-b border-gray-100 dark:border-slate-700 transition-colors cursor-pointer"
            title="Perbesar Peta"
          >
            <Plus className="w-4 h-4" />
          </button>
          <button
            onClick={handleZoomOut}
            className="w-8 h-8 flex items-center justify-center text-gray-700 dark:text-slate-200 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors cursor-pointer"
            title="Perkecil Peta"
          >
            <Minus className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
