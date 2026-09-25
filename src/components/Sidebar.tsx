import React, { useState, useRef, useEffect } from 'react';
import {
  RotateCw,
  SlidersHorizontal,
  ChevronDown,
  Mountain,
  Waves,
  Activity,
  MapPin,
  Building2,
  Search,
  Check,
  Copy,
  Download,
} from 'lucide-react';
import { Station, WaterQualityStatus } from '../types/onlimo';
import { INITIAL_METRICS, STATUS_SUMMARIES } from '../data/mockStations';
import { WeatherStationBadge } from './WeatherStationBadge';
import { formatStationLastUpdate } from '../utils/timezone';

interface SidebarProps {
  stations: Station[];
  selectedStation: Station | null;
  onSelectStation: (station: Station | null) => void;
  selectedStatusFilter: WaterQualityStatus | 'all';
  onSelectStatusFilter: (status: WaterQualityStatus | 'all') => void;
  selectedProvince: string;
  onSelectProvince: (prov: string) => void;
  selectedDas: string;
  onSelectDas: (das: string) => void;
  selectedCity: string;
  onSelectCity: (city: string) => void;
  provinces: string[];
  dases: string[];
  cities: string[];
  onRefreshData: () => void;
  isRefreshing: boolean;
  onOpenRegulationInfo: () => void;
  onResetFilters: () => void;
  isDarkMode: boolean;
}

// Weather Station badge icon matching the uploaded frames & existing green badge
export const WaterQualityStatusIcon: React.FC<{
  status: WaterQualityStatus | string;
  className?: string;
  size?: number;
}> = ({ status, className = '', size = 18 }) => {
  return <WeatherStationBadge status={status} size={size} className={className} />;
};

export const Sidebar: React.FC<SidebarProps> = ({
  stations,
  selectedStation,
  onSelectStation,
  selectedStatusFilter,
  onSelectStatusFilter,
  selectedProvince,
  onSelectProvince,
  selectedDas,
  onSelectDas,
  selectedCity,
  onSelectCity,
  provinces,
  dases,
  cities,
  onRefreshData,
  isRefreshing,
  onResetFilters,
  isDarkMode,
}) => {
  const [isStationDropdownOpen, setIsStationDropdownOpen] = useState(false);
  const [stationSearch, setStationSearch] = useState('');
  const [isFilterPanelOpen, setIsFilterPanelOpen] = useState(false);
  const [isRegulationExpanded, setIsRegulationExpanded] = useState(false); // Collapsed by default
  const [activeStationTab, setActiveStationTab] = useState<'grafik' | 'profil'>('grafik');
  const [copiedCode, setCopiedCode] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Active line filters for Chart 1
  const [activeLineParams, setActiveLineParams] = useState<Record<string, boolean>>({
    pH: true,
    AMMONIA: true,
    Nitrate: true,
    'ORP UAT': true,
    COD: true,
    TSS: true,
    BOD: true,
    TDS: true,
    DO: true,
  });

  // Active bar filters for Chart 2
  const [activeBarStatuses, setActiveBarStatuses] = useState<Record<string, boolean>>({
    'Baku Mutu': true,
    'Cemar Ringan': true,
    'Cemar Sedang': true,
    'Cemar Berat': true,
  });

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsStationDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredStationsForDropdown = stations.filter(
    (st) =>
      st.name.toLowerCase().includes(stationSearch.toLowerCase()) ||
      st.river.toLowerCase().includes(stationSearch.toLowerCase()) ||
      st.province.toLowerCase().includes(stationSearch.toLowerCase()) ||
      st.city.toLowerCase().includes(stationSearch.toLowerCase())
  );

  const handleApplyFilter = () => {
    setIsFilterPanelOpen(false);
  };

  const handleReset = () => {
    onResetFilters();
    setIsFilterPanelOpen(false);
  };

  const handleCopyCode = () => {
    if (selectedStation) {
      navigator.clipboard.writeText(selectedStation.code);
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    }
  };

  const handleDownloadData = (title: string) => {
    if (!selectedStation) return;
    const content = `Data ${title} - ${selectedStation.name} (${selectedStation.code})
Tanggal: ${formatStationLastUpdate(selectedStation)}
Status: ${selectedStation.status}
IP Score: ${selectedStation.ipScore}
Waktu Unduh: ${new Date().toISOString()}
`;
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${title.toLowerCase().replace(/\s+/g, '_')}_${selectedStation.code}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Status badge styling helper
  const getStatusBadge = (status: WaterQualityStatus) => {
    switch (status) {
      case 'baku_mutu':
      case 'memenuhi_baku_mutu':
        return {
          label: 'Memenuhi Baku Mutu',
          className:
            'bg-[#E8F8EE] dark:bg-emerald-950/60 text-[#16a34a] dark:text-emerald-300 border border-[#bbf7d0] dark:border-emerald-700',
        };
      case 'cemar_ringan':
        return {
          label: 'Cemar Ringan',
          className:
            'bg-[#EBF2FE] dark:bg-blue-950/60 text-[#2563eb] dark:text-blue-300 border border-[#bfdbfe] dark:border-blue-700',
        };
      case 'cemar_sedang':
        return {
          label: 'Cemar Sedang',
          className:
            'bg-[#FEF9E8] dark:bg-amber-950/60 text-[#d97706] dark:text-amber-300 border border-[#fde68a] dark:border-amber-700',
        };
      case 'cemar_berat':
        return {
          label: 'Cemar Berat',
          className:
            'bg-[#FEECEC] dark:bg-red-950/60 text-[#ef4444] dark:text-red-300 border border-[#fecaca] dark:border-red-700',
        };
      case 'tanpa_data':
      default:
        return {
          label: 'Tanpa Data',
          className:
            'bg-[#F1F3F5] dark:bg-slate-800 text-[#64748b] dark:text-slate-300 border border-gray-300 dark:border-slate-700',
        };
    }
  };

  // Curve parameters for Chart 1
  const lineSeries = [
    { name: 'pH', color: '#f97316', path: 'M 10 100 Q 55 75, 100 60 T 190 40 T 280 70' },
    { name: 'AMMONIA', color: '#22c55e', path: 'M 10 130 Q 55 135, 100 130 T 190 100 T 280 75' },
    { name: 'Nitrate', color: '#14b8a6', path: 'M 10 165 Q 55 155, 100 140 T 190 110 T 280 135' },
    { name: 'ORP UAT', color: '#0ea5e9', path: 'M 10 75 Q 55 60, 100 55 T 190 120 T 280 145' },
    { name: 'COD', color: '#3b82f6', path: 'M 10 85 Q 55 65, 100 70 T 190 90 T 280 135' },
    { name: 'TSS', color: '#a855f7', path: 'M 10 130 Q 55 110, 100 95 T 190 90 T 280 125' },
    { name: 'BOD', color: '#ec4899', path: 'M 10 140 Q 55 125, 100 110 T 190 95 T 280 115' },
    { name: 'TDS', color: '#eab308', path: 'M 10 135 Q 55 125, 100 115 T 190 100 T 280 105' },
    { name: 'DO', color: '#ef4444', path: 'M 10 90 Q 55 75, 100 65 T 190 60 T 280 90' },
  ];

  // Bar items for Chart 2
  const statusBars = [
    { time: '10:00', value: 7.2, status: 'Cemar Berat', color: '#ef4444' },
    { time: '11:00', value: 5.8, status: 'Cemar Berat', color: '#ef4444' },
    { time: '12:00', value: 2.3, status: 'Cemar Ringan', color: '#3b82f6' },
    { time: '13:00', value: 3.5, status: 'Cemar Sedang', color: '#eab308' },
    { time: '14:00', value: 4.7, status: 'Cemar Sedang', color: '#eab308' },
  ];

  // Parameters list for Section 3
  const parameterRows = [
    { name: 'pH', value: '81.82 mg/L', statusText: 'Cemar Berat', statusType: 'cemar_berat', ipScore: '12' },
    { name: 'AMMONIA', value: '81.82 mg/L', statusText: 'Cemar Sedang', statusType: 'cemar_sedang', ipScore: '7.3' },
    { name: 'COD', value: '81.82 mg/L', statusText: 'Cemar Ringan', statusType: 'cemar_ringan', ipScore: '3.0' },
    { name: 'TSS', value: '81.82 mg/L', statusText: 'Memenuhi Baku Mutu', statusType: 'baku_mutu', ipScore: '0.6' },
    { name: 'BOD', value: '81.82 mg/L', statusText: 'Cemar Ringan', statusType: 'cemar_ringan', ipScore: '3.0' },
    { name: 'TDS', value: '81.82 mg/L', statusText: 'Cemar Ringan', statusType: 'cemar_ringan', ipScore: '3.0' },
    { name: 'DO', value: '81.82 mg/L', statusText: 'Cemar Sedang', statusType: 'cemar_sedang', ipScore: '7.3' },
    { name: 'ORP UAT', value: '81.82 mg/L', statusText: 'Memenuhi Baku Mutu', statusType: 'baku_mutu', ipScore: '0.6' },
    { name: 'Nitrate', value: '81.82 mg/L', statusText: 'Memenuhi Baku Mutu', statusType: 'baku_mutu', ipScore: '0.6' },
  ];

  // 5 parameter bars for Chart 4
  const chart4Bars = [
    { name: 'Nitrate', value: 4.5, color: '#3b82f6' },
    { name: 'ORP UAT', value: 11.2, color: '#eab308' },
    { name: 'COD', value: 14.8, color: '#ef4444' },
    { name: 'TSS', value: 6.9, color: '#3b82f6' },
    { name: 'BOD', value: 5.2, color: '#3b82f6' },
  ];

  return (
    <aside
      className={`w-full md:w-[350px] lg:w-[380px] h-full ${
        isDarkMode
          ? 'bg-[#0f172a] text-slate-100 border-slate-800'
          : 'bg-[#f4f6f8] text-gray-900 border-[#E4E4E7]'
      } border-l flex flex-col justify-between overflow-hidden shrink-0 z-20 font-['Inter',sans-serif]`}
    >
      {/* ========================================================================= */}
      {/* BAGIAN 1: FILTER STASIUN (Warna abu-abu, Separator border-b #E4E4E7) */}
      {/* ========================================================================= */}
      <div
        className={`p-3.5 ${
          isDarkMode ? 'bg-[#0f172a]' : 'bg-[#f4f6f8]'
        } border-b border-[#E4E4E7] dark:border-slate-800 shrink-0 space-y-2.5`}
      >
        {/* Row 1: Select Stasiun + Grouped Buttons (Refresh & Filter) */}
        <div className="flex items-center gap-2">
          {/* Custom Select Station Dropdown */}
          <div className="relative flex-1" ref={dropdownRef}>
            <button
              type="button"
              onClick={() => setIsStationDropdownOpen(!isStationDropdownOpen)}
              className={`w-full min-h-[32px] h-9 flex items-center justify-between px-3 py-1.5 ${
                isDarkMode
                  ? 'bg-slate-800 border-slate-700 text-slate-100 hover:border-slate-600'
                  : 'bg-white border-gray-300 text-gray-800 hover:border-gray-400'
              } border rounded-lg text-[12px] font-medium transition-colors text-left shadow-2xs cursor-pointer`}
            >
              <span className="truncate">
                {selectedStation ? selectedStation.name : 'Pilih Stasiun'}
              </span>
              <ChevronDown
                className={`w-4 h-4 ${
                  isDarkMode ? 'text-slate-400' : 'text-gray-500'
                } transition-transform shrink-0 ml-1 ${
                  isStationDropdownOpen ? 'rotate-180' : ''
                }`}
              />
            </button>

            {/* Station Dropdown Menu */}
            {isStationDropdownOpen && (
              <div
                className={`absolute top-full left-0 right-0 mt-1.5 ${
                  isDarkMode
                    ? 'bg-slate-800 border-slate-700 text-slate-200 shadow-2xl'
                    : 'bg-white border-gray-200 text-gray-800 shadow-xl'
                } border rounded-xl z-50 overflow-hidden`}
              >
                <div
                  className={`p-2 border-b ${
                    isDarkMode ? 'border-slate-700' : 'border-gray-100'
                  }`}
                >
                  <div className="relative">
                    <Search className="w-4 h-4 text-gray-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="Cari stasiun, sungai, kota..."
                      value={stationSearch}
                      onChange={(e) => setStationSearch(e.target.value)}
                      className={`w-full min-h-[32px] pl-8 pr-3 py-1.5 text-[12px] ${
                        isDarkMode
                          ? 'bg-slate-900 border-slate-700 text-white'
                          : 'bg-gray-50 border-gray-200 text-gray-900'
                      } border rounded-md focus:outline-none focus:ring-1 focus:ring-[#ff6900]`}
                      autoFocus
                    />
                  </div>
                </div>

                <div className="max-h-56 overflow-y-auto py-1 text-[12px]">
                  <button
                    type="button"
                    onClick={() => {
                      onSelectStation(null);
                      setIsStationDropdownOpen(false);
                      setStationSearch('');
                    }}
                    className={`w-full min-h-[32px] text-left px-3 py-2 flex items-center justify-between transition-colors cursor-pointer ${
                      isDarkMode ? 'hover:bg-slate-700/60' : 'hover:bg-gray-50'
                    } ${
                      !selectedStation
                        ? 'font-semibold text-[#ff6900]'
                        : isDarkMode
                        ? 'text-slate-300'
                        : 'text-gray-700'
                    }`}
                  >
                    <span>Semua Stasiun (Ringkasan Monitoring)</span>
                    {!selectedStation && <Check className="w-4 h-4 text-[#ff6900]" />}
                  </button>

                  {filteredStationsForDropdown.length === 0 ? (
                    <div className="px-3 py-4 text-center text-gray-400 text-[12px]">
                      Stasiun tidak ditemukan
                    </div>
                  ) : (
                    filteredStationsForDropdown.map((st) => (
                      <button
                        key={st.id}
                        type="button"
                        onClick={() => {
                          onSelectStation(st);
                          setIsStationDropdownOpen(false);
                          setStationSearch('');
                        }}
                        className={`w-full min-h-[32px] text-left px-3 py-2 flex items-center justify-between transition-colors cursor-pointer ${
                          isDarkMode ? 'hover:bg-slate-700/60' : 'hover:bg-gray-50'
                        } ${
                          selectedStation?.id === st.id
                            ? isDarkMode
                              ? 'bg-orange-950/40 font-semibold text-[#ff6900]'
                              : 'bg-orange-50 font-semibold text-[#ff6900]'
                            : isDarkMode
                            ? 'text-slate-300'
                            : 'text-gray-700'
                        }`}
                      >
                        <div className="truncate pr-2">
                          <p className="truncate font-medium">{st.name}</p>
                          <p
                            className={`text-[12px] ${
                              isDarkMode ? 'text-slate-400' : 'text-gray-500'
                            } truncate`}
                          >
                            {st.river} &bull; {st.city}
                          </p>
                        </div>
                        {selectedStation?.id === st.id && (
                          <Check className="w-4 h-4 text-[#ff6900] shrink-0" />
                        )}
                      </button>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Grouped Button: Refresh + Filter button (min-h-[32px]) */}
          <div
            className={`flex items-center rounded-lg border ${
              isDarkMode ? 'border-slate-700' : 'border-gray-300'
            } overflow-hidden shadow-2xs shrink-0`}
          >
            {/* Refresh Button */}
            <button
              type="button"
              onClick={onRefreshData}
              disabled={isRefreshing}
              className={`min-h-[32px] min-w-[32px] h-9 w-9 flex items-center justify-center ${
                isDarkMode
                  ? 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700'
                  : 'bg-white hover:bg-gray-50 text-gray-700 border-gray-300'
              } transition-colors border-r cursor-pointer disabled:opacity-50`}
              title="Muat Ulang Data Sensor"
            >
              <RotateCw
                className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-[#ff6900]' : ''}`}
              />
            </button>

            {/* Filter Button */}
            <button
              type="button"
              onClick={() => setIsFilterPanelOpen(!isFilterPanelOpen)}
              className={`min-h-[32px] min-w-[32px] h-9 w-9 flex items-center justify-center transition-colors cursor-pointer ${
                isFilterPanelOpen
                  ? 'bg-[#ff6900] text-white hover:bg-[#e05d00]'
                  : isDarkMode
                  ? 'bg-slate-800 text-slate-200 hover:bg-slate-700'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
              title={isFilterPanelOpen ? 'Tutup Filter' : 'Buka Filter'}
            >
              <SlidersHorizontal className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Collapsible Filter Panel (DAS, Provinsi, Kab/Kota, Reset & Cari) */}
        {isFilterPanelOpen && (
          <div
            className={`p-3 ${
              isDarkMode
                ? 'bg-slate-800 border-slate-700'
                : 'bg-white border-gray-300'
            } border rounded-xl space-y-2.5 shadow-xs animate-in fade-in duration-150`}
          >
            {/* Select DAS */}
            <div className="relative">
              <select
                value={selectedDas}
                onChange={(e) => onSelectDas(e.target.value)}
                className={`w-full min-h-[32px] h-9 appearance-none px-3 py-1.5 ${
                  isDarkMode
                    ? 'bg-slate-900 border-slate-700 text-slate-200'
                    : 'bg-white border-gray-300 text-gray-800'
                } border rounded-lg text-[12px] font-medium focus:outline-none focus:border-[#ff6900] cursor-pointer`}
              >
                <option value="all">Pilih DAS</option>
                {dases.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

            {/* Select Provinsi */}
            <div className="relative">
              <select
                value={selectedProvince}
                onChange={(e) => {
                  onSelectProvince(e.target.value);
                  onSelectCity('all');
                }}
                className={`w-full min-h-[32px] h-9 appearance-none px-3 py-1.5 ${
                  isDarkMode
                    ? 'bg-slate-900 border-slate-700 text-slate-200'
                    : 'bg-white border-gray-300 text-gray-800'
                } border rounded-lg text-[12px] font-medium focus:outline-none focus:border-[#ff6900] cursor-pointer`}
              >
                <option value="all">Pilih Provinsi</option>
                {provinces.map((prov) => (
                  <option key={prov} value={prov}>
                    {prov}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

            {/* Select Kab/Kota */}
            <div className="relative">
              <select
                value={selectedCity}
                onChange={(e) => onSelectCity(e.target.value)}
                className={`w-full min-h-[32px] h-9 appearance-none px-3 py-1.5 ${
                  isDarkMode
                    ? 'bg-slate-900 border-slate-700 text-slate-200'
                    : 'bg-white border-gray-300 text-gray-800'
                } border rounded-lg text-[12px] font-medium focus:outline-none focus:border-[#ff6900] cursor-pointer`}
              >
                <option value="all">Pilih Kab/Kota</option>
                {cities.map((city) => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

            {/* Buttons: Reset (Left) & Cari (Right) */}
            <div className="flex items-center justify-between pt-1">
              <button
                type="button"
                onClick={handleReset}
                className={`min-h-[32px] h-8 px-4 ${
                  isDarkMode
                    ? 'bg-slate-800 border-slate-600 text-slate-200 hover:bg-slate-700'
                    : 'bg-white border-gray-300 text-gray-800 hover:bg-gray-50'
                } border rounded-lg text-[12px] font-semibold transition-colors shadow-2xs cursor-pointer flex items-center justify-center`}
              >
                Reset
              </button>

              <button
                type="button"
                onClick={handleApplyFilter}
                className="min-h-[32px] h-8 px-6 bg-[#ff6900] hover:bg-[#e05d00] active:bg-[#c75300] text-white rounded-lg text-[12px] font-semibold transition-colors shadow-xs cursor-pointer flex items-center justify-center"
              >
                Cari
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* BAGIAN 2: MONITORING / DETAIL STASIUN (Warna PUTIH, Separator border-b #E4E4E7) */}
      {/* ========================================================================= */}
      <div
        className={`flex-1 min-h-0 flex flex-col ${
          isDarkMode ? 'bg-slate-950 text-slate-100' : 'bg-white text-gray-900'
        } border-b border-[#E4E4E7] dark:border-slate-800 overflow-hidden`}
      >
        {selectedStation ? (
          /* ======================================================================= */
          /* TAMPILAN DETAIL STASIUN SPESIFIK (SESUAI GAMBAR 1 & GAMBAR 2) */
          /* ======================================================================= */
          <div className="flex-1 min-h-0 flex flex-col h-full overflow-hidden animate-in fade-in duration-200">
            {/* Header: Nama Stasiun hingga Tab Profil/Grafik -> FIXED / STAY (TIDAK IKUT SCROLL) */}
            <div className="p-4 pb-3 space-y-3 shrink-0 bg-white dark:bg-slate-950 border-b border-gray-100 dark:border-slate-800 z-10">
              {/* Header: Nama Stasiun */}
              <div>
                <h2 className="text-[20px] font-semibold text-gray-900 dark:text-white leading-tight">
                  {selectedStation.name}
                </h2>

                {/* Sub-row 1: Online status badge + Serial Code + Copy Icon */}
                <div className="flex items-center justify-between mt-2">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 text-[12px] font-medium text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-400 dark:border-emerald-600 rounded">
                      Online
                    </span>
                    <span className="text-[12px] font-mono text-gray-500 dark:text-gray-400">
                      {selectedStation.code}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={handleCopyCode}
                    title="Salin Kode Stasiun"
                    className="min-h-[32px] min-w-[32px] p-1.5 flex items-center justify-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                  >
                    {copiedCode ? (
                      <Check className="w-4 h-4 text-emerald-600" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>
                </div>

                {/* Sub-row 2: Status Kualitas Air (Rata Kanan) + Nilai IP + Tanggal & Jam */}
                <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-100 dark:border-slate-800 text-[12px]">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-gray-900 dark:text-white text-[14px]">
                      {selectedStation.ipScore.toFixed(2)}
                    </span>
                    <span className="text-[12px] text-gray-500 dark:text-gray-400">
                      &bull; {formatStationLastUpdate(selectedStation)}
                    </span>
                  </div>

                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full font-medium text-[12px] ${
                      getStatusBadge(selectedStation.status).className
                    }`}
                  >
                    {getStatusBadge(selectedStation.status).label}
                  </span>
                </div>
              </div>

              {/* Tabs: [ Grafik Stasiun ] [ Profil Stasiun ] -> FIXED */}
              <div
                className={`flex p-1 rounded-xl ${
                  isDarkMode ? 'bg-slate-800' : 'bg-gray-100'
                } gap-1`}
              >
                <button
                  type="button"
                  onClick={() => setActiveStationTab('grafik')}
                  className={`flex-1 min-h-[32px] py-1.5 rounded-lg text-[12px] font-semibold transition-all cursor-pointer flex items-center justify-center ${
                    activeStationTab === 'grafik'
                      ? isDarkMode
                        ? 'bg-slate-700 text-white shadow-xs'
                        : 'bg-white text-gray-900 shadow-xs'
                      : 'text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white font-medium'
                  }`}
                >
                  Grafik Stasiun
                </button>

                <button
                  type="button"
                  onClick={() => setActiveStationTab('profil')}
                  className={`flex-1 min-h-[32px] py-1.5 rounded-lg text-[12px] font-semibold transition-all cursor-pointer flex items-center justify-center ${
                    activeStationTab === 'profil'
                      ? isDarkMode
                        ? 'bg-slate-700 text-white shadow-xs'
                        : 'bg-white text-gray-900 shadow-xs'
                      : 'text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white font-medium'
                  }`}
                >
                  Profil Stasiun
                </button>
              </div>
            </div>

            {/* SCROLLABLE CONTENT BODY: Bagian ini yang scroll ke bawah */}
            <div className="flex-1 min-h-0 overflow-y-auto p-4 space-y-5">
              {/* TAB 1: GRAFIK STASIUN (4 BAGIAN SEPERTI PADA GAMBAR PERTAMA) */}
              {activeStationTab === 'grafik' && (
                <div className="space-y-6">
                  {/* ======================================================= */}
                  {/* 1. GRAFIK 1: Tren Parameter Kualitas Air Hari Ini (Line) */}
                  {/* ======================================================= */}
                  <div className="space-y-2">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-[14px] font-semibold text-gray-900 dark:text-white leading-snug">
                          Tren Parameter Kualitas Air Hari Ini
                        </h3>
                        <p className="text-[12px] text-gray-500 dark:text-gray-400 mt-0.5">
                          Pantau perubahan nilai setiap parameter hari ini.
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleDownloadData('Tren Parameter Kualitas Air')}
                        title="Unduh Data Tren"
                        className={`min-h-[32px] min-w-[32px] p-1.5 border rounded-lg ${
                          isDarkMode
                            ? 'border-slate-700 hover:bg-slate-800 text-slate-300'
                            : 'border-gray-200 hover:bg-gray-50 text-gray-600'
                        } transition-colors flex items-center justify-center shadow-2xs cursor-pointer shrink-0`}
                      >
                        <Download className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Line Chart Container with Right Y-Axis & X-Axis */}
                    <div
                      className={`p-2 rounded-xl border ${
                        isDarkMode
                          ? 'bg-slate-900/60 border-slate-800'
                          : 'bg-slate-50/40 border-gray-100'
                      }`}
                    >
                      <div className="relative h-48 flex">
                        {/* SVG Curves */}
                        <div className="flex-1 relative">
                          <svg viewBox="0 0 290 180" className="w-full h-full overflow-visible">
                            {/* Horizontal Gridlines (0, 10, 20, 30, 40, 50, 60, 70, 80) */}
                            {[20, 40, 60, 80, 100, 120, 140, 160].map((y) => (
                              <line
                                key={y}
                                x1="0"
                                y1={y}
                                x2="290"
                                y2={y}
                                stroke={isDarkMode ? '#334155' : '#f1f5f9'}
                                strokeWidth="1"
                              />
                            ))}

                            {/* Render Parameter Curve Lines */}
                            {lineSeries.map(
                              (s) =>
                                activeLineParams[s.name] && (
                                  <path
                                    key={s.name}
                                    d={s.path}
                                    fill="none"
                                    stroke={s.color}
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    className="transition-all duration-200"
                                  />
                                )
                            )}
                          </svg>

                          {/* X-Axis Labels */}
                          <div className="flex justify-between text-[12px] text-gray-400 dark:text-slate-500 pt-1 px-1">
                            <span>10:00</span>
                            <span>11:00</span>
                            <span>12:00</span>
                            <span>13:00</span>
                            <span>14:00</span>
                          </div>
                        </div>

                        {/* Right Y-Axis with numbers & vertical title */}
                        <div className="w-8 flex items-center justify-between pl-1 select-none">
                          <div className="flex flex-col justify-between h-full text-[12px] text-gray-400 dark:text-slate-500 text-right pr-0.5">
                            <span>80</span>
                            <span>70</span>
                            <span>60</span>
                            <span>50</span>
                            <span>40</span>
                            <span>30</span>
                            <span>20</span>
                            <span>10</span>
                            <span>0</span>
                          </div>
                          <span
                            className="text-[12px] text-gray-500 dark:text-gray-400 font-medium"
                            style={{
                              writingMode: 'vertical-rl',
                              transform: 'rotate(180deg)',
                            }}
                          >
                            Nilai Parameter
                          </span>
                        </div>
                      </div>

                      {/* Interactive Legend Checkboxes with Parameter-specific Colors matching Image 2 */}
                      <div className="flex flex-wrap gap-x-3 gap-y-1.5 pt-3 mt-1 border-t border-gray-100 dark:border-slate-800 text-[12px]">
                        {lineSeries.map((item) => (
                          <label
                            key={item.name}
                            className="inline-flex items-center gap-1.5 cursor-pointer select-none group"
                          >
                            <span
                              className="w-3.5 h-3.5 rounded flex items-center justify-center transition-all border shrink-0"
                              style={{
                                backgroundColor: activeLineParams[item.name]
                                  ? item.color
                                  : 'transparent',
                                borderColor: item.color,
                              }}
                            >
                              {activeLineParams[item.name] && (
                                <Check className="w-2.5 h-2.5 text-white stroke-[3]" />
                              )}
                            </span>
                            <input
                              type="checkbox"
                              checked={activeLineParams[item.name]}
                              onChange={() =>
                                setActiveLineParams((prev) => ({
                                  ...prev,
                                  [item.name]: !prev[item.name],
                                }))
                              }
                              className="sr-only"
                            />
                            <span
                              className="font-medium group-hover:opacity-85 transition-opacity"
                              style={{ color: isDarkMode ? '#cbd5e1' : '#4b5563' }}
                            >
                              {item.name}
                            </span>
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* ======================================================= */}
                  {/* 2. GRAFIK 2: Tren Status Mutu Air Hari Ini (Bar Chart) */}
                  {/* ======================================================= */}
                  <div className="space-y-2">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-[14px] font-semibold text-gray-900 dark:text-white leading-snug">
                          Tren Status Mutu Air Hari Ini
                        </h3>
                        <p className="text-[12px] text-gray-500 dark:text-gray-400 mt-0.5">
                          Indeks pencemar dan status mutu air hari ini
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleDownloadData('Tren Status Mutu Air')}
                        title="Unduh Data Status Mutu"
                        className={`min-h-[32px] min-w-[32px] p-1.5 border rounded-lg ${
                          isDarkMode
                            ? 'border-slate-700 hover:bg-slate-800 text-slate-300'
                            : 'border-gray-200 hover:bg-gray-50 text-gray-600'
                        } transition-colors flex items-center justify-center shadow-2xs cursor-pointer shrink-0`}
                      >
                        <Download className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Bar Chart Container */}
                    <div
                      className={`p-2 rounded-xl border ${
                        isDarkMode
                          ? 'bg-slate-900/60 border-slate-800'
                          : 'bg-slate-50/40 border-gray-100'
                      }`}
                    >
                      <div className="relative h-48 flex">
                        {/* Bars Area */}
                        <div className="flex-1 flex flex-col justify-end">
                          <div className="flex-1 flex items-end justify-around gap-2 px-3 border-b border-gray-200 dark:border-slate-700">
                            {statusBars.map((bar) => {
                              const heightPercent = (bar.value / 8) * 100;
                              const isVisible = activeBarStatuses[bar.status];
                              return (
                                <div
                                  key={bar.time}
                                  className="flex-1 flex flex-col items-center justify-end h-full"
                                >
                                  {isVisible ? (
                                    <div
                                      className="w-full max-w-[28px] rounded-t-sm transition-all duration-300 shadow-2xs"
                                      style={{
                                        height: `${heightPercent}%`,
                                        background: `linear-gradient(180deg, ${bar.color} 0%, ${bar.color}20 100%)`,
                                      }}
                                    />
                                  ) : (
                                    <div className="w-full max-w-[28px] h-0.5 bg-gray-200 dark:bg-slate-700" />
                                  )}
                                </div>
                              );
                            })}
                          </div>

                          {/* X-Axis Labels */}
                          <div className="flex justify-around text-[12px] text-gray-400 dark:text-slate-500 pt-1.5 px-3 text-center">
                            <span>0</span>
                            <span>10:00</span>
                            <span>11:00</span>
                            <span>12:00</span>
                            <span>13:00</span>
                            <span>14:00</span>
                          </div>
                        </div>

                        {/* Right Y-Axis */}
                        <div className="w-8 flex items-center justify-between pl-1 select-none">
                          <div className="flex flex-col justify-between h-full text-[12px] text-gray-400 dark:text-slate-500 text-right pr-0.5">
                            <span>8</span>
                            <span>7</span>
                            <span>6</span>
                            <span>5</span>
                            <span>4</span>
                            <span>3</span>
                            <span>2</span>
                            <span>1</span>
                            <span>0</span>
                          </div>
                          <span
                            className="text-[12px] text-gray-500 dark:text-gray-400 font-medium"
                            style={{
                              writingMode: 'vertical-rl',
                              transform: 'rotate(180deg)',
                            }}
                          >
                            Indeks Pencemaran
                          </span>
                        </div>
                      </div>

                      {/* Legend Checkboxes with Status Colors */}
                      <div className="flex flex-wrap gap-x-4 gap-y-1.5 pt-3 mt-1 border-t border-gray-100 dark:border-slate-800 text-[12px]">
                        {[
                          { name: 'Baku Mutu', color: '#10b981' },
                          { name: 'Cemar Ringan', color: '#3b82f6' },
                          { name: 'Cemar Sedang', color: '#eab308' },
                          { name: 'Cemar Berat', color: '#ef4444' },
                        ].map((item) => (
                          <label
                            key={item.name}
                            className="inline-flex items-center gap-1.5 cursor-pointer select-none group"
                          >
                            <span
                              className="w-3.5 h-3.5 rounded flex items-center justify-center transition-all border shrink-0"
                              style={{
                                backgroundColor: activeBarStatuses[item.name]
                                  ? item.color
                                  : 'transparent',
                                borderColor: item.color,
                              }}
                            >
                              {activeBarStatuses[item.name] && (
                                <Check className="w-2.5 h-2.5 text-white stroke-[3]" />
                              )}
                            </span>
                            <input
                              type="checkbox"
                              checked={activeBarStatuses[item.name]}
                              onChange={() =>
                                setActiveBarStatuses((prev) => ({
                                  ...prev,
                                  [item.name]: !prev[item.name],
                                }))
                              }
                              className="sr-only"
                            />
                            <span
                              className="font-medium group-hover:opacity-85 transition-opacity"
                              style={{ color: isDarkMode ? '#cbd5e1' : '#4b5563' }}
                            >
                              {item.name}
                            </span>
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* ======================================================= */}
                  {/* 3. SECTION 3: Status Parameter Terbaru (Table / List)   */}
                  {/* ======================================================= */}
                  <div className="space-y-2">
                    <div>
                      <h3 className="text-[14px] font-semibold text-gray-900 dark:text-white leading-snug">
                        Status Parameter Terbaru
                      </h3>
                      <p className="text-[12px] text-gray-500 dark:text-gray-400 mt-0.5">
                        Pantau nilai, indeks pencemar dan status setiap parameter kualitas air terbaru.
                      </p>
                    </div>

                    <div
                      className={`rounded-xl border ${
                        isDarkMode
                          ? 'bg-slate-900/60 border-slate-800'
                          : 'bg-white border-gray-100'
                      } divide-y divide-gray-100 dark:divide-slate-800 shadow-2xs overflow-hidden`}
                    >
                      {parameterRows.map((row) => (
                        <div
                          key={row.name}
                          className="flex items-center justify-between p-2.5 hover:bg-gray-50/50 dark:hover:bg-slate-800/40 transition-colors"
                        >
                          {/* Left: Name + Value with Unit */}
                          <div>
                            <span className="block text-[14px] font-medium text-gray-900 dark:text-white">
                              {row.name}
                            </span>
                            <span className="block text-[12px] text-gray-500 dark:text-gray-400">
                              {row.value}
                            </span>
                          </div>

                          {/* Right: Status Pill Badge (Rata Kanan) + IP Score */}
                          <div className="flex items-center justify-end gap-3 shrink-0">
                            <span
                              className={`px-2.5 py-0.5 rounded-full text-[12px] font-medium whitespace-nowrap text-right ${
                                getStatusBadge(row.statusType as WaterQualityStatus).className
                              }`}
                            >
                              {row.statusText}
                            </span>
                            <span className="w-8 text-right font-semibold text-[14px] text-gray-900 dark:text-white">
                              {row.ipScore}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* ======================================================= */}
                  {/* 4. GRAFIK 4: Tren Parameter Kualitas Air (Bar w/ Zones) */}
                  {/* ======================================================= */}
                  <div className="space-y-2">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-[14px] font-semibold text-gray-900 dark:text-white leading-snug">
                          Tren Parameter Kualitas Air Hari Ini
                        </h3>
                        <p className="text-[12px] text-gray-500 dark:text-gray-400 mt-0.5">
                          Pantau perubahan nilai setiap parameter hari ini.
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleDownloadData('Tren Parameter Baku Mutu')}
                        title="Unduh Data Rasio Parameter"
                        className={`min-h-[32px] min-w-[32px] p-1.5 border rounded-lg ${
                          isDarkMode
                            ? 'border-slate-700 hover:bg-slate-800 text-slate-300'
                            : 'border-gray-200 hover:bg-gray-50 text-gray-600'
                        } transition-colors flex items-center justify-center shadow-2xs cursor-pointer shrink-0`}
                      >
                        <Download className="w-4 h-4" />
                      </button>
                    </div>

                    <div
                      className={`p-2.5 rounded-xl border ${
                        isDarkMode
                          ? 'bg-slate-900/60 border-slate-800'
                          : 'bg-slate-50/50 border-gray-100'
                      }`}
                    >
                      {/* Height increased to h-[340px] for ample vertical space, equal height zones */}
                      <div className="flex h-[340px] pt-2">
                        {/* Left Axis: "Indeks Pencemaran" + 4 Color Bands */}
                        <div className="flex items-stretch gap-1.5 mr-2 shrink-0 select-none">
                          {/* Vertical Title: "Indeks Pencemaran" */}
                          <div className="flex items-center justify-center">
                            <span
                              className="text-[12px] text-gray-500 dark:text-gray-400 font-medium tracking-wide whitespace-nowrap"
                              style={{
                                writingMode: 'vertical-rl',
                                transform: 'rotate(180deg)',
                              }}
                            >
                              Indeks Pencemaran
                            </span>
                          </div>

                          {/* 4 Colored Bands (Cemar Berat, Cemar Sedang, Cemar Ringan, Baku Mutu) - Panjang Tingginya Sama */}
                          <div className="flex flex-col w-7 rounded-md overflow-hidden text-[11px] font-medium text-center leading-none shadow-2xs border border-gray-200/80 dark:border-slate-700">
                            <div
                              className="flex-1 bg-red-100 text-red-700 dark:bg-red-950/60 dark:text-red-300 flex items-center justify-center border-b border-white/60 dark:border-slate-800 p-1"
                              style={{
                                writingMode: 'vertical-rl',
                                transform: 'rotate(180deg)',
                              }}
                            >
                              Cemar Berat
                            </div>
                            <div
                              className="flex-1 bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 flex items-center justify-center border-b border-white/60 dark:border-slate-800 p-1"
                              style={{
                                writingMode: 'vertical-rl',
                                transform: 'rotate(180deg)',
                              }}
                            >
                              Cemar Sedang
                            </div>
                            <div
                              className="flex-1 bg-blue-100 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 flex items-center justify-center border-b border-white/60 dark:border-slate-800 p-1"
                              style={{
                                writingMode: 'vertical-rl',
                                transform: 'rotate(180deg)',
                              }}
                            >
                              Cemar Ringan
                            </div>
                            <div
                              className="flex-1 bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 flex items-center justify-center p-1"
                              style={{
                                writingMode: 'vertical-rl',
                                transform: 'rotate(180deg)',
                              }}
                            >
                              Baku Mutu
                            </div>
                          </div>
                        </div>

                        {/* Chart Bars Area */}
                        <div className="flex-1 flex flex-col justify-end relative">
                          {/* Background Gridlines dividing the 4 zones (equal 25% height each) */}
                          <div className="absolute inset-x-0 top-0 bottom-6 pointer-events-none flex flex-col">
                            <div className="flex-1 border-b border-dashed border-red-200/50 dark:border-red-900/30" />
                            <div className="flex-1 border-b border-dashed border-amber-200/50 dark:border-amber-900/30" />
                            <div className="flex-1 border-b border-dashed border-blue-200/50 dark:border-blue-900/30" />
                            <div className="flex-1" />
                          </div>

                          <div className="flex-1 flex items-end justify-around gap-2 px-1 border-b border-gray-200 dark:border-slate-700 relative z-10">
                            {chart4Bars.map((bar) => {
                              const heightPercent = Math.min(100, Math.max(14, (bar.value / 18) * 100));
                              return (
                                <div
                                  key={bar.name}
                                  className="flex-1 flex flex-col items-center justify-end h-full group"
                                >
                                  <span className="text-[12px] font-semibold text-gray-800 dark:text-slate-100 mb-1">
                                    {bar.value.toFixed(1)}
                                  </span>
                                  <div
                                    className="w-full max-w-[34px] rounded-t-lg transition-all duration-300 relative shadow-xs"
                                    style={{
                                      height: `${heightPercent}%`,
                                      background: `linear-gradient(180deg, ${bar.color} 0%, ${bar.color}20 100%)`,
                                    }}
                                  />
                                </div>
                              );
                            })}
                          </div>

                          {/* X-Axis Parameter Labels */}
                          <div className="flex justify-around gap-2 px-1 pt-1.5 text-center relative z-10">
                            {chart4Bars.map((bar) => (
                              <div
                                key={bar.name}
                                className="flex-1 text-[12px] font-medium text-gray-600 dark:text-slate-300 truncate"
                                title={bar.name}
                              >
                                {bar.name}
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Footnote below bars matching Image 1 */}
                      <div className="flex items-center gap-1.5 text-[12px] text-gray-500 dark:text-gray-400 pt-2.5 mt-1 border-t border-gray-100 dark:border-slate-800">
                        <div className="w-3.5 h-3.5 rounded-full border border-gray-400 flex items-center justify-center text-[12px] font-serif shrink-0">
                          i
                        </div>
                        <span>
                          Indeks pencemaran ditentukan dari nilai ratio per parameter
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: PROFIL STASIUN (SESUAI GAMBAR KEDUA - SEMUA FONT INTER 12PX) */}
              {activeStationTab === 'profil' && (
                <div className="space-y-3.5 text-[12px] font-sans">
                  <div className="flex justify-between items-center py-0.5">
                    <span className="text-gray-500 dark:text-gray-400 font-normal text-[12px]">DAS</span>
                    <span className="font-semibold text-gray-900 dark:text-white text-[12px]">
                      {selectedStation.das || 'Brantas'}
                    </span>
                  </div>

                  <div className="flex justify-between items-center py-0.5">
                    <span className="text-gray-500 dark:text-gray-400 font-normal text-[12px]">Last Update</span>
                    <span className="font-semibold text-gray-900 dark:text-white text-[12px]">
                      {formatStationLastUpdate(selectedStation)}
                    </span>
                  </div>

                  <div className="flex justify-between items-center py-0.5">
                    <span className="text-gray-500 dark:text-gray-400 font-normal text-[12px]">
                      Nilai Indeks Pencemaran
                    </span>
                    <span className="font-semibold text-gray-900 dark:text-white text-[12px]">
                      {selectedStation.ipScore.toFixed(2)}
                    </span>
                  </div>

                  <div className="flex justify-between items-center py-0.5">
                    <span className="text-gray-500 dark:text-gray-400 font-normal text-[12px]">
                      Status Mutu Terkini
                    </span>
                    <span
                      className={`px-3 py-0.5 rounded-full text-[12px] font-medium ${
                        getStatusBadge(selectedStation.status).className
                      }`}
                    >
                      {getStatusBadge(selectedStation.status).label}
                    </span>
                  </div>

                  <div className="flex justify-between items-center py-0.5">
                    <span className="text-gray-500 dark:text-gray-400 font-normal text-[12px]">Lattitude</span>
                    <span className="font-medium text-gray-900 dark:text-white font-mono text-[12px]">
                      {selectedStation.displayLat ?? `${selectedStation.lat.toFixed(14)}°`}
                    </span>
                  </div>

                  <div className="flex justify-between items-center py-0.5">
                    <span className="text-gray-500 dark:text-gray-400 font-normal text-[12px]">Longitude</span>
                    <span className="font-medium text-gray-900 dark:text-white font-mono text-[12px]">
                      {selectedStation.displayLng ?? `${selectedStation.lng.toFixed(13)}°`}
                    </span>
                  </div>

                  <div className="flex justify-between items-center py-0.5">
                    <span className="text-gray-500 dark:text-gray-400 font-normal text-[12px]">Provinsi</span>
                    <span className="font-semibold text-gray-900 dark:text-white text-[12px]">
                      {selectedStation.province || 'DI Yogyakarta'}
                    </span>
                  </div>

                  <div className="flex justify-between items-center py-0.5">
                    <span className="text-gray-500 dark:text-gray-400 font-normal text-[12px]">
                      Kabupaten/Kota
                    </span>
                    <span className="font-semibold text-gray-900 dark:text-white text-[12px]">
                      {selectedStation.city || 'Sleman'}
                    </span>
                  </div>

                  <div className="flex justify-between items-center py-0.5">
                    <span className="text-gray-500 dark:text-gray-400 font-normal text-[12px]">Kecamatan</span>
                    <span className="font-semibold text-gray-900 dark:text-white text-[12px]">
                      {selectedStation.district || 'Gamping'}
                    </span>
                  </div>

                  <div className="flex justify-between items-center py-0.5">
                    <span className="text-gray-500 dark:text-gray-400 font-normal text-[12px]">
                      Kelurahan/Desa
                    </span>
                    <span className="font-semibold text-gray-900 dark:text-white text-[12px]">
                      {selectedStation.subdistrict || 'Tlogoadi'}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          /* ======================================================================= */
          /* TAMPILAN DEFAULT MONITORING (KETIKA TIDAK ADA STASIUN YANG DIPILIH) */
          /* ======================================================================= */
          <div className="flex-1 min-h-0 overflow-y-auto p-4 space-y-4">
            {/* Heading Section: Monitoring */}
            <div>
              <h2
                className={`text-[12px] font-semibold ${
                  isDarkMode ? 'text-slate-200' : 'text-gray-800'
                } mb-2.5`}
              >
                Monitoring
              </h2>

              <div className="space-y-2">
                {/* Row 1: DAS & Sungai */}
                <div className="grid grid-cols-2 gap-2">
                  <div
                    className={`${
                      isDarkMode
                        ? 'bg-slate-900 border-slate-800'
                        : 'bg-white border-gray-200'
                    } border rounded-xl p-3 flex items-center justify-between shadow-2xs`}
                  >
                    <div>
                      <span
                        className={`text-[12px] font-medium ${
                          isDarkMode ? 'text-slate-400' : 'text-gray-500'
                        } block`}
                      >
                        DAS
                      </span>
                      <span
                        className={`text-[16px] font-semibold ${
                          isDarkMode ? 'text-white' : 'text-gray-900'
                        }`}
                      >
                        {INITIAL_METRICS.das}
                      </span>
                    </div>
                    <div
                      className={`w-8 h-8 rounded-lg ${
                        isDarkMode
                          ? 'bg-slate-800 text-slate-300'
                          : 'bg-gray-100 text-gray-500'
                      } flex items-center justify-center`}
                    >
                      <Mountain className="w-4 h-4" />
                    </div>
                  </div>

                  <div
                    className={`${
                      isDarkMode
                        ? 'bg-slate-900 border-slate-800'
                        : 'bg-white border-gray-200'
                    } border rounded-xl p-3 flex items-center justify-between shadow-2xs`}
                  >
                    <div>
                      <span
                        className={`text-[12px] font-medium ${
                          isDarkMode ? 'text-slate-400' : 'text-gray-500'
                        } block`}
                      >
                        Sungai
                      </span>
                      <span
                        className={`text-[16px] font-semibold ${
                          isDarkMode ? 'text-white' : 'text-gray-900'
                        }`}
                      >
                        {INITIAL_METRICS.sungai}
                      </span>
                    </div>
                    <div
                      className={`w-8 h-8 rounded-lg ${
                        isDarkMode
                          ? 'bg-slate-800 text-slate-300'
                          : 'bg-gray-100 text-gray-500'
                      } flex items-center justify-center`}
                    >
                      <Waves className="w-4 h-4" />
                    </div>
                  </div>
                </div>

                {/* Row 2: Stasiun & Provinsi */}
                <div className="grid grid-cols-2 gap-2">
                  <div
                    className={`${
                      isDarkMode
                        ? 'bg-slate-900 border-slate-800'
                        : 'bg-white border-gray-200'
                    } border rounded-xl p-3 flex items-center justify-between shadow-2xs`}
                  >
                    <div>
                      <span
                        className={`text-[12px] font-medium ${
                          isDarkMode ? 'text-slate-400' : 'text-gray-500'
                        } block`}
                      >
                        Stasiun
                      </span>
                      <span
                        className={`text-[16px] font-semibold ${
                          isDarkMode ? 'text-white' : 'text-gray-900'
                        }`}
                      >
                        {INITIAL_METRICS.stasiun}
                      </span>
                    </div>
                    <div
                      className={`w-8 h-8 rounded-lg ${
                        isDarkMode
                          ? 'bg-slate-800 text-slate-300'
                          : 'bg-gray-100 text-gray-500'
                      } flex items-center justify-center`}
                    >
                      <Activity className="w-4 h-4" />
                    </div>
                  </div>

                  <div
                    className={`${
                      isDarkMode
                        ? 'bg-slate-900 border-slate-800'
                        : 'bg-white border-gray-200'
                    } border rounded-xl p-3 flex items-center justify-between shadow-2xs`}
                  >
                    <div>
                      <span
                        className={`text-[12px] font-medium ${
                          isDarkMode ? 'text-slate-400' : 'text-gray-500'
                        } block`}
                      >
                        Provinsi
                      </span>
                      <span
                        className={`text-[16px] font-semibold ${
                          isDarkMode ? 'text-white' : 'text-gray-900'
                        }`}
                      >
                        {INITIAL_METRICS.provinsi}
                      </span>
                    </div>
                    <div
                      className={`w-8 h-8 rounded-lg ${
                        isDarkMode
                          ? 'bg-slate-800 text-slate-300'
                          : 'bg-gray-100 text-gray-500'
                      } flex items-center justify-center`}
                    >
                      <MapPin className="w-4 h-4" />
                    </div>
                  </div>
                </div>

                {/* Row 3: Kabupaten/Kota */}
                <div className="w-1/2 pr-1">
                  <div
                    className={`${
                      isDarkMode
                        ? 'bg-slate-900 border-slate-800'
                        : 'bg-white border-gray-200'
                    } border rounded-xl p-3 flex items-center justify-between shadow-2xs`}
                  >
                    <div>
                      <span
                        className={`text-[12px] font-medium ${
                          isDarkMode ? 'text-slate-400' : 'text-gray-500'
                        } block`}
                      >
                        Kabupaten/Kota
                      </span>
                      <span
                        className={`text-[16px] font-semibold ${
                          isDarkMode ? 'text-white' : 'text-gray-900'
                        }`}
                      >
                        {INITIAL_METRICS.kabupaten}
                      </span>
                    </div>
                    <div
                      className={`w-8 h-8 rounded-lg ${
                        isDarkMode
                          ? 'bg-slate-800 text-slate-300'
                          : 'bg-gray-100 text-gray-500'
                      } flex items-center justify-center`}
                    >
                      <Building2 className="w-4 h-4" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Section: Indeks Pencemaran tiap Stasiun with Image 4 Icons */}
            <div className="pt-1">
              <div className="flex items-center justify-between mb-2">
                <h2
                  className={`text-[12px] font-semibold ${
                    isDarkMode ? 'text-slate-200' : 'text-gray-800'
                  }`}
                >
                  Indeks Pencemaran tiap Stasiun
                </h2>
                {selectedStatusFilter !== 'all' && (
                  <button
                    type="button"
                    onClick={() => onSelectStatusFilter('all')}
                    className="min-h-[32px] text-[12px] text-[#ff6900] hover:underline cursor-pointer font-medium flex items-center"
                  >
                    Reset Filter
                  </button>
                )}
              </div>

              {/* List of Statuses using Image 4 custom icon style */}
              <div className="space-y-1.5">
                {STATUS_SUMMARIES.map((item) => {
                  const isSelected = selectedStatusFilter === item.status;
                  return (
                    <div
                      key={item.status}
                      onClick={() =>
                        onSelectStatusFilter(isSelected ? 'all' : item.status)
                      }
                      className={`flex items-center justify-between p-2 rounded-xl transition-all cursor-pointer border ${
                        isSelected
                          ? `${item.bgColor} ${item.borderColor} ring-1 ring-[#ff6900]`
                          : isDarkMode
                          ? 'bg-slate-900/80 border-slate-800 hover:border-slate-700'
                          : 'bg-white border-gray-200/80 hover:border-gray-300'
                      }`}
                      title={`Klik untuk filter status ${item.label}`}
                    >
                      <div className="flex items-center gap-2.5">
                        {/* Circular Weather Badge matching User's Uploaded Frames */}
                        <WeatherStationBadge status={item.status} size={28} />

                        <span
                          className={`text-[14px] font-medium ${
                            isDarkMode ? 'text-slate-200' : 'text-gray-800'
                          }`}
                        >
                          {item.label}
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <span
                          className={`text-[14px] font-semibold ${
                            isDarkMode ? 'text-white' : 'text-gray-900'
                          }`}
                        >
                          {item.count}
                        </span>
                        <span
                          className={`text-[12px] ${
                            isDarkMode ? 'text-slate-400' : 'text-gray-400'
                          }`}
                        >
                          Stasiun
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* BAGIAN 3: PERATURAN INDEKS PENCEMARAN (SESUAI GAMBAR KETIGA - UKURAN 12PX) */}
      {/* ========================================================================= */}
      <div
        className={`p-3.5 ${
          isDarkMode ? 'bg-[#0f172a]' : 'bg-[#f4f6f8]'
        } border-t border-[#E4E4E7] dark:border-slate-800 shrink-0 font-sans`}
      >
        {!isRegulationExpanded ? (
          /* Collapsed State (Sesuai Gambar 3: Judul & Lihat Detail 12px) */
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full border border-blue-500 flex items-center justify-center text-blue-500 font-serif font-semibold text-[12px] shrink-0">
                i
              </div>
              <span
                className={`text-[12px] font-semibold ${
                  isDarkMode ? 'text-slate-100' : 'text-gray-900'
                }`}
              >
                Peraturan Indeks Pencemaran
              </span>
            </div>
            <button
              type="button"
              onClick={() => setIsRegulationExpanded(true)}
              className="min-h-[32px] text-[12px] font-semibold text-[#ff6900] hover:text-[#e05d00] cursor-pointer flex items-center"
            >
              Lihat Detail
            </button>
          </div>
        ) : (
          /* Expanded State matching Image 3 (flat text directly in gray background - 12px) */
          <div className="space-y-1.5 animate-in fade-in duration-150">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full border border-blue-500 flex items-center justify-center text-blue-500 font-serif font-semibold text-[12px] shrink-0">
                  i
                </div>
                <span
                  className={`text-[12px] font-semibold ${
                    isDarkMode ? 'text-slate-100' : 'text-gray-900'
                  }`}
                >
                  Peraturan Indeks Pencemaran
                </span>
              </div>
              <button
                type="button"
                onClick={() => setIsRegulationExpanded(false)}
                className="min-h-[32px] text-[12px] font-semibold text-[#ff6900] hover:text-[#e05d00] cursor-pointer flex items-center"
              >
                Tutup
              </button>
            </div>

            {/* Description text matching Image 3 (12px) */}
            <p
              className={`text-[12px] leading-relaxed pl-6 ${
                isDarkMode ? 'text-slate-300' : 'text-gray-600'
              }`}
            >
              Indeks adalah rasio konsentrasi parameter terhadap baku mutu air sungai kelas II Lampiran VI Peraturan Pemerintah Nomor 22 Tahun 2021
            </p>
          </div>
        )}
      </div>
    </aside>
  );
};
