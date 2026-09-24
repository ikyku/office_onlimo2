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
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { Station, WaterQualityStatus } from '../types/onlimo';
import {
  renderWeatherIconHtml,
  getStatusVisualConfig,
  WeatherStationBadge,
} from './WeatherStationBadge';

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
  const [showLegend, setShowLegend] = useState(true);

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

  // Update Markers with Proximity Clustering (Image 1 for station points & Image 2 for clusters)
  useEffect(() => {
    const map = mapInstanceRef.current;
    const markersGroup = markersLayerRef.current;
    if (!map || !markersGroup) return;

    // Helper to generate Image 2: Cluster Speech Bubble Pin with dynamic count & highest severity color
    const renderClusterBubbleHtml = (
      count: number,
      color: string,
      containsSelected: boolean
    ) => {
      return `
        <div class="cluster-bubble-marker ${containsSelected ? 'contains-selected' : ''}">
          <div class="cluster-pill-body" style="background-color: ${color};">
            <span>${count}</span>
          </div>
          <div class="cluster-beak-triangle" style="border-top-color: ${color};"></div>
        </div>
      `;
    };

    // Calculate highest severity status in a group: cemar_berat > cemar_sedang > cemar_ringan > baku_mutu > tanpa_data
    const getHighestSeverityInfo = (stations: Station[]) => {
      if (stations.some((s) => s.status === 'cemar_berat')) {
        return {
          status: 'cemar_berat',
          label: 'Cemar Berat',
          color: '#ef4444',
          badgeBg: 'bg-red-100 text-red-800',
        };
      }
      if (stations.some((s) => s.status === 'cemar_sedang')) {
        return {
          status: 'cemar_sedang',
          label: 'Cemar Sedang',
          color: '#eab308',
          badgeBg: 'bg-amber-100 text-amber-800',
        };
      }
      if (stations.some((s) => s.status === 'cemar_ringan')) {
        return {
          status: 'cemar_ringan',
          label: 'Cemar Ringan',
          color: '#3b82f6',
          badgeBg: 'bg-blue-100 text-blue-800',
        };
      }
      if (
        stations.some(
          (s) => s.status === 'baku_mutu' || s.status === 'memenuhi_baku_mutu'
        )
      ) {
        return {
          status: 'baku_mutu',
          label: 'Memenuhi Baku Mutu',
          color: '#22c55e',
          badgeBg: 'bg-emerald-100 text-emerald-800',
        };
      }
      return {
        status: 'tanpa_data',
        label: 'Tanpa Data',
        color: '#64748b',
        badgeBg: 'bg-slate-100 text-slate-800',
      };
    };

    const renderMarkers = () => {
      markersGroup.clearLayers();
      const currentZoom = map.getZoom();

      // Proximity clustering calculation based on screen distance (pixels)
      // At zoom 13+, clusters unfold so stations are individually visible
      const clusterThresholdDistance = currentZoom >= 13 ? 24 : (currentZoom >= 10 ? 46 : 58);

      interface ClusterNode {
        stations: Station[];
        centerLat: number;
        centerLng: number;
      }

      const clusters: ClusterNode[] = [];
      const assigned = new Set<string>();

      filteredStations.forEach((station) => {
        if (assigned.has(station.id)) return;

        const currentGroup: Station[] = [station];
        assigned.add(station.id);

        const p1 = map.latLngToContainerPoint([station.lat, station.lng]);

        filteredStations.forEach((other) => {
          if (assigned.has(other.id)) return;
          const p2 = map.latLngToContainerPoint([other.lat, other.lng]);
          const dist = Math.hypot(p1.x - p2.x, p1.y - p2.y);
          if (dist <= clusterThresholdDistance) {
            currentGroup.push(other);
            assigned.add(other.id);
          }
        });

        const avgLat = currentGroup.reduce((acc, s) => acc + s.lat, 0) / currentGroup.length;
        const avgLng = currentGroup.reduce((acc, s) => acc + s.lng, 0) / currentGroup.length;

        clusters.push({
          stations: currentGroup,
          centerLat: avgLat,
          centerLng: avgLng,
        });
      });

      // Render each cluster or single station marker
      clusters.forEach((cluster) => {
        const hasMultiple = cluster.stations.length > 1;

        if (hasMultiple) {
          // IMAGE 2: Clustered stations wrapped in speech bubble pin with actual count & highest severity color
          const containsSelected = cluster.stations.some((s) => s.id === selectedStation?.id);
          const count = cluster.stations.length;
          const severityInfo = getHighestSeverityInfo(cluster.stations);

          const clusterIcon = L.divIcon({
            className: 'cluster-marker-div',
            html: renderClusterBubbleHtml(count, severityInfo.color, containsSelected),
            iconSize: [48, 36],
            iconAnchor: [24, 36],
            popupAnchor: [0, -38],
          });

          const marker = L.marker([cluster.centerLat, cluster.centerLng], { icon: clusterIcon });

          const stationRows = cluster.stations
            .slice(0, 5)
            .map(
              (s) =>
                `<div class="flex items-center justify-between gap-3 text-xs py-0.5">
                  <span class="font-medium text-gray-800">${s.name}</span>
                  <span class="text-gray-500 font-mono text-[11px]">${s.ipScore.toFixed(2)}</span>
                </div>`
            )
            .join('');

          marker.bindTooltip(
            `<div class="p-2 max-w-xs font-sans">
              <div class="flex items-center justify-between gap-2 pb-1 mb-1 border-b border-gray-100">
                <span class="font-bold text-xs text-gray-900">Kluster (${cluster.stations.length} Stasiun)</span>
                <span class="text-[10px] ${severityInfo.badgeBg} font-semibold px-1.5 py-0.5 rounded">
                  ${severityInfo.label}
                </span>
              </div>
              <div class="space-y-0.5 mb-1.5">${stationRows}${
                cluster.stations.length > 5
                  ? `<p class="text-[10px] text-gray-400">+${cluster.stations.length - 5} lainnya</p>`
                  : ''
              }</div>
              <p class="text-[10px] text-gray-500 font-medium">Klik untuk memperbesar kluster</p>
            </div>`,
            { direction: 'top', offset: [0, -36], className: 'shadow-lg rounded-xl border border-gray-200' }
          );

          marker.on('click', () => {
            // Smoothly fly and zoom into this cluster to unfold into individual stations
            const bounds = L.latLngBounds(cluster.stations.map((s) => [s.lat, s.lng]));
            if (map.getZoom() < 14) {
              map.fitBounds(bounds, { padding: [60, 60], maxZoom: 14 });
            } else {
              onSelectStation(cluster.stations[0]);
            }
          });

          markersGroup.addLayer(marker);
        } else {
          // Individual station point with circular sun & cloud icon in matching status color:
          // Hijau = Memenuhi Baku Mutu, Biru = Cemar Ringan, Kuning = Cemar Sedang, Merah = Cemar Berat, Abu-abu = Tanpa Data / Invalid
          const station = cluster.stations[0];
          const isSelected = selectedStation?.id === station.id;
          const statusVisual = getStatusVisualConfig(station.status);

          const individualIcon = L.divIcon({
            className: 'weather-station-div',
            html: renderWeatherIconHtml(isSelected, station.id, station.status),
            iconSize: [40, 40],
            iconAnchor: [20, 20],
            popupAnchor: [0, -22],
          });

          const marker = L.marker([station.lat, station.lng], { icon: individualIcon });

          marker.bindTooltip(
            `<div class="p-1.5 font-sans min-w-[190px]">
              <div class="flex items-center gap-1.5">
                <span class="w-2.5 h-2.5 rounded-full shrink-0" style="background-color: ${
                  statusVisual.hexColor
                };"></span>
                <p class="font-bold text-xs text-gray-900">${station.name}</p>
              </div>
              <p class="text-[11px] text-gray-500 mt-0.5">${station.river} &bull; ${station.city}</p>
              <div class="mt-1 flex items-center justify-between gap-2 text-[11px] pt-1 border-t border-gray-100">
                <span class="text-gray-600">Nilai IP: <strong class="text-gray-900">${station.ipScore.toFixed(
                  2
                )}</strong></span>
                <span class="text-[10px] font-bold px-1.5 py-0.5 rounded" style="color: ${
                  statusVisual.hexColor
                }; background-color: ${statusVisual.hexColor}1a;">
                  ${statusVisual.label}
                </span>
              </div>
              ${
                isSelected
                  ? '<div class="mt-1 text-[10px] font-bold text-[#ff6900] bg-orange-50 px-1.5 py-0.5 rounded text-center">Stasiun Terpilih</div>'
                  : ''
              }
            </div>`,
            { direction: 'top', offset: [0, -22], className: 'shadow-md rounded-lg border border-gray-100' }
          );

          marker.on('click', () => {
            onSelectStation(station);
          });

          markersGroup.addLayer(marker);
        }
      });
    };

    // Render initially
    renderMarkers();

    // Re-cluster dynamically on map zoom or pan
    map.on('zoomend moveend', renderMarkers);

    return () => {
      map.off('zoomend moveend', renderMarkers);
    };
  }, [filteredStations, selectedStation, onSelectStation]);

  // Fly to selected station
  useEffect(() => {
    if (selectedStation && mapInstanceRef.current) {
      mapInstanceRef.current.flyTo([selectedStation.lat, selectedStation.lng], 13, {
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

      {/* Floating Status Legend: Bottom Left (Displaying 5 Weather Station Badges) */}
      <div className="absolute bottom-6 left-4 z-20 flex flex-col items-start gap-1.5 pointer-events-auto select-none max-w-[280px]">
        <div
          className={`rounded-2xl shadow-xl border backdrop-blur-md transition-all duration-200 overflow-hidden ${
            isDarkMode
              ? 'bg-slate-900/95 border-slate-700 text-slate-100'
              : 'bg-white/95 border-gray-200 text-gray-800'
          }`}
        >
          {/* Legend Header / Toggle Button */}
          <button
            type="button"
            onClick={() => setShowLegend(!showLegend)}
            className="flex items-center justify-between gap-3 px-3 py-2 text-xs font-bold w-full hover:opacity-85 transition-opacity cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <div className="flex -space-x-1">
                <WeatherStationBadge status="baku_mutu" size={16} />
                <WeatherStationBadge status="cemar_ringan" size={16} />
                <WeatherStationBadge status="cemar_sedang" size={16} />
                <WeatherStationBadge status="cemar_berat" size={16} />
                <WeatherStationBadge status="tanpa_data" size={16} />
              </div>
              <span className="text-[11px] uppercase tracking-wider font-bold">
                Legenda Indeks
              </span>
            </div>
            {showLegend ? (
              <ChevronDown className="w-3.5 h-3.5 opacity-60" />
            ) : (
              <ChevronUp className="w-3.5 h-3.5 opacity-60" />
            )}
          </button>

          {/* Legend Items List */}
          {showLegend && (
            <div className="px-3 pb-2.5 pt-1 space-y-1.5 border-t border-gray-100 dark:border-slate-800 text-[11px]">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <WeatherStationBadge status="baku_mutu" size={20} />
                  <span className="font-semibold text-emerald-700 dark:text-emerald-300">
                    Memenuhi Baku Mutu
                  </span>
                </div>
                <span className="text-[10px] text-gray-500 dark:text-slate-400 font-mono font-medium">
                  IP &le; 1.0
                </span>
              </div>

              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <WeatherStationBadge status="cemar_ringan" size={20} />
                  <span className="font-semibold text-blue-700 dark:text-blue-300">
                    Cemar Ringan
                  </span>
                </div>
                <span className="text-[10px] text-gray-500 dark:text-slate-400 font-mono font-medium">
                  1.0 &lt; IP &le; 5.0
                </span>
              </div>

              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <WeatherStationBadge status="cemar_sedang" size={20} />
                  <span className="font-semibold text-amber-700 dark:text-amber-300">
                    Cemar Sedang
                  </span>
                </div>
                <span className="text-[10px] text-gray-500 dark:text-slate-400 font-mono font-medium">
                  5.0 &lt; IP &le; 10.0
                </span>
              </div>

              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <WeatherStationBadge status="cemar_berat" size={20} />
                  <span className="font-semibold text-red-700 dark:text-red-300">
                    Cemar Berat
                  </span>
                </div>
                <span className="text-[10px] text-gray-500 dark:text-slate-400 font-mono font-medium">
                  IP &gt; 10.0
                </span>
              </div>

              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <WeatherStationBadge status="tanpa_data" size={20} />
                  <span className="font-semibold text-slate-700 dark:text-slate-300">
                    Invalid / Tanpa Data
                  </span>
                </div>
                <span className="text-[10px] text-gray-500 dark:text-slate-400 font-mono font-medium">
                  N/A
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
