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

type BasemapType = 'positron' | 'dark' | 'satellite' | 'streets';

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

  const [activeBasemap, setActiveBasemap] = useState<BasemapType>('positron');
  const [showLayerMenu, setShowLayerMenu] = useState(false);
  const [showGridOverlay, setShowGridOverlay] = useState(false);
  const [splitViewActive, setSplitViewActive] = useState(false);

  // Basemap URLs
  const basemapUrls: Record<BasemapType, { url: string; subdomains?: string; attribution: string }> = {
    positron: {
      url: 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png',
      subdomains: 'abcd',
      attribution: '&copy; CartoDB &copy; OpenStreetMap contributors',
    },
    dark: {
      url: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
      subdomains: 'abcd',
      attribution: '&copy; CartoDB &copy; OpenStreetMap contributors',
    },
    satellite: {
      url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
      attribution: '&copy; Esri &copy; DigitalGlobe',
    },
    streets: {
      url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      attribution: '&copy; OpenStreetMap contributors',
    },
  };

  // Sync basemap with dark mode if user hasn't explicitly chosen satellite
  useEffect(() => {
    if (activeBasemap === 'positron' && isDarkMode) {
      setActiveBasemap('dark');
    } else if (activeBasemap === 'dark' && !isDarkMode) {
      setActiveBasemap('positron');
    }
  }, [isDarkMode]);

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
      <div ref={mapElementRef} className="w-full h-full z-0" />

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
      <div className="absolute top-4 left-4 z-20 flex flex-col bg-white dark:bg-slate-800 rounded-xl shadow-md border border-gray-200/80 dark:border-slate-700 p-1 gap-1">
        {/* Layer Selector */}
        <div className="relative">
          <button
            onClick={() => setShowLayerMenu(!showLayerMenu)}
            className={`p-2 rounded-lg transition-colors cursor-pointer ${
              showLayerMenu
                ? 'bg-blue-50 dark:bg-slate-700 text-blue-600 dark:text-blue-400'
                : 'text-gray-600 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-700/60'
            }`}
            title="Pilih Lapisan Peta (Basemap)"
          >
            <Layers className="w-4 h-4" />
          </button>

          {/* Layer Flyout Menu */}
          {showLayerMenu && (
            <div className="absolute left-full top-0 ml-2 w-44 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl shadow-xl p-1.5 z-30 text-xs">
              <span className="block px-2.5 py-1 text-xs font-bold uppercase text-gray-400 dark:text-slate-400">
                Pilih Tipe Peta
              </span>
              <button
                onClick={() => {
                  setActiveBasemap('positron');
                  setShowLayerMenu(false);
                }}
                className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700 text-gray-700 dark:text-slate-200"
              >
                <span>Positron (Terang)</span>
                {activeBasemap === 'positron' && <Check className="w-3.5 h-3.5 text-blue-600" />}
              </button>
              <button
                onClick={() => {
                  setActiveBasemap('dark');
                  setShowLayerMenu(false);
                }}
                className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700 text-gray-700 dark:text-slate-200"
              >
                <span>Dark Matter (Gelap)</span>
                {activeBasemap === 'dark' && <Check className="w-3.5 h-3.5 text-blue-600" />}
              </button>
              <button
                onClick={() => {
                  setActiveBasemap('satellite');
                  setShowLayerMenu(false);
                }}
                className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700 text-gray-700 dark:text-slate-200"
              >
                <span>Satelit Esri</span>
                {activeBasemap === 'satellite' && <Check className="w-3.5 h-3.5 text-blue-600" />}
              </button>
              <button
                onClick={() => {
                  setActiveBasemap('streets');
                  setShowLayerMenu(false);
                }}
                className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700 text-gray-700 dark:text-slate-200"
              >
                <span>OpenStreetMap</span>
                {activeBasemap === 'streets' && <Check className="w-3.5 h-3.5 text-blue-600" />}
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
