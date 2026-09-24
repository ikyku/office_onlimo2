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
  Droplets,
  AlertTriangle,
  HelpCircle,
  Search,
  Check,
  Copy,
  Download,
  Info,
  ChevronRight,
} from 'lucide-react';
import { Station, WaterQualityStatus } from '../types/onlimo';
import { INITIAL_METRICS, STATUS_SUMMARIES } from '../data/mockStations';

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
  onOpenRegulationInfo,
  onResetFilters,
  isDarkMode,
}) => {
  const [isStationDropdownOpen, setIsStationDropdownOpen] = useState(false);
  const [stationSearch, setStationSearch] = useState('');
  const [isFilterPanelOpen, setIsFilterPanelOpen] = useState(false);
  const [isRegulationExpanded, setIsRegulationExpanded] = useState(false); // Collapsed by default
  const [activeStationTab, setActiveStationTab] = useState<'grafik' | 'profil'>('grafik');
  const [copiedCode, setCopiedCode] = useState(false);
  const [isSecondaryTrendOpen, setIsSecondaryTrendOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

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

  const handleDownloadChart = () => {
    if (!selectedStation) return;
    const chartData = `Stasiun: ${selectedStation.name} (${selectedStation.code})
Tanggal: ${selectedStation.lastUpdate}
Status: ${selectedStation.status}
IP Score: ${selectedStation.ipScore}
Parameter:
- Nitrate Ratio: 4.5
- ORP UAT Ratio: 11.2
- COD Ratio: 14.8
- TSS Ratio: 6.9
- BOD Ratio: 5.2
- pH: ${selectedStation.parameters.ph}
- DO: ${selectedStation.parameters.do} mg/L
- Suhu: ${selectedStation.parameters.temp} °C
`;
    const blob = new Blob([chartData], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `tren_kualitas_air_${selectedStation.code}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Get status badge styling
  const getStatusBadge = (status: WaterQualityStatus) => {
    switch (status) {
      case 'baku_mutu':
        return {
          label: 'Memenuhi Baku Mutu',
          className: 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700',
        };
      case 'cemar_ringan':
        return {
          label: 'Cemar Ringan',
          className: 'bg-blue-100 dark:bg-blue-950/60 text-blue-800 dark:text-blue-300 border border-blue-300 dark:border-blue-700',
        };
      case 'cemar_sedang':
        return {
          label: 'Cemar Sedang',
          className: 'bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-700',
        };
      case 'cemar_berat':
        return {
          label: 'Cemar Berat',
          className: 'bg-red-100 dark:bg-red-950/60 text-red-800 dark:text-red-300 border border-red-300 dark:border-red-700',
        };
      case 'tanpa_data':
      default:
        return {
          label: 'Tanpa Data',
          className: 'bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-slate-300 border border-gray-300 dark:border-slate-700',
        };
    }
  };

  // 5 parameter bars for the chart matching image.png
  const chartBars = [
    { name: 'Nitrate', value: 4.5, color: '#3b82f6', bgGradient: 'from-blue-500/80 to-blue-500/10' },
    { name: 'ORP UAT', value: 11.2, color: '#eab308', bgGradient: 'from-amber-400/85 to-amber-300/15' },
    { name: 'COD', value: 14.8, color: '#ef4444', bgGradient: 'from-red-500/85 to-red-500/10' },
    { name: 'TSS', value: 6.9, color: '#3b82f6', bgGradient: 'from-blue-500/80 to-blue-500/10' },
    { name: 'BOD', value: 5.2, color: '#3b82f6', bgGradient: 'from-blue-500/80 to-blue-500/10' },
  ];

  const maxChartValue = 18;

  return (
    <aside
      className={`w-full md:w-[350px] lg:w-[380px] h-full ${
        isDarkMode
          ? 'bg-[#0f172a] text-slate-100 border-slate-800'
          : 'bg-[#f4f6f8] text-gray-900 border-[#E4E4E7]'
      } border-l flex flex-col justify-between overflow-hidden shrink-0 z-20`}
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
              } border rounded-lg text-xs font-medium transition-colors text-left shadow-2xs cursor-pointer`}
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
                      className={`w-full min-h-[32px] pl-8 pr-3 py-1.5 text-xs ${
                        isDarkMode
                          ? 'bg-slate-900 border-slate-700 text-white'
                          : 'bg-gray-50 border-gray-200 text-gray-900'
                      } border rounded-md focus:outline-none focus:ring-1 focus:ring-[#ff6900]`}
                      autoFocus
                    />
                  </div>
                </div>

                <div className="max-h-56 overflow-y-auto py-1 text-xs">
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
                        ? 'font-bold text-[#ff6900]'
                        : isDarkMode
                        ? 'text-slate-300'
                        : 'text-gray-700'
                    }`}
                  >
                    <span>Semua Stasiun (Ringkasan Monitoring)</span>
                    {!selectedStation && <Check className="w-4 h-4 text-[#ff6900]" />}
                  </button>

                  {filteredStationsForDropdown.length === 0 ? (
                    <div className="px-3 py-4 text-center text-gray-400 text-xs">
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
                              ? 'bg-orange-950/40 font-bold text-[#ff6900]'
                              : 'bg-orange-50 font-bold text-[#ff6900]'
                            : isDarkMode
                            ? 'text-slate-300'
                            : 'text-gray-700'
                        }`}
                      >
                        <div className="truncate pr-2">
                          <p className="truncate font-medium">{st.name}</p>
                          <p
                            className={`text-xs ${
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
                } border rounded-lg text-xs font-medium focus:outline-none focus:border-[#ff6900] cursor-pointer`}
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
                } border rounded-lg text-xs font-medium focus:outline-none focus:border-[#ff6900] cursor-pointer`}
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
                } border rounded-lg text-xs font-medium focus:outline-none focus:border-[#ff6900] cursor-pointer`}
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
                } border rounded-lg text-xs font-semibold transition-colors shadow-2xs cursor-pointer flex items-center justify-center`}
              >
                Reset
              </button>

              <button
                type="button"
                onClick={handleApplyFilter}
                className="min-h-[32px] h-8 px-6 bg-[#ff6900] hover:bg-[#e05d00] active:bg-[#c75300] text-white rounded-lg text-xs font-bold transition-colors shadow-xs cursor-pointer flex items-center justify-center"
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
        className={`flex-1 overflow-y-auto p-4 ${
          isDarkMode ? 'bg-slate-950 text-slate-100' : 'bg-white text-gray-900'
        } border-b border-[#E4E4E7] dark:border-slate-800`}
      >
        {selectedStation ? (
          /* ======================================================================= */
          /* TAMPILAN DETAIL STASIUN SPESIFIK (PERSIS SEPERTI GAMBAR PERTAMA) */
          /* ======================================================================= */
          <div className="space-y-3.5 animate-in fade-in duration-200">
            {/* Header: Nama Stasiun */}
            <div>
              <h2 className="text-base font-bold text-gray-900 dark:text-white leading-tight">
                {selectedStation.name}
              </h2>

              {/* Sub-row 1: Online status badge + Serial Code + Copy Icon */}
              <div className="flex items-center justify-between mt-1.5">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 text-xs font-semibold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-400 dark:border-emerald-600 rounded">
                    Online
                  </span>
                  <span className="text-xs font-mono text-gray-500 dark:text-gray-400">
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

              {/* Sub-row 2: Status Kualitas Air + Nilai IP + Tanggal & Jam */}
              <div className="flex items-center justify-between mt-2 pt-1 border-t border-gray-100 dark:border-slate-800 text-xs">
                <div className="flex items-center gap-2">
                  <span
                    className={`px-2.5 py-0.5 rounded-full font-semibold ${
                      getStatusBadge(selectedStation.status).className
                    }`}
                  >
                    {getStatusBadge(selectedStation.status).label}
                  </span>
                  <span className="font-bold text-gray-900 dark:text-white text-xs">
                    {selectedStation.ipScore.toFixed(2)}
                  </span>
                </div>

                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {selectedStation.lastUpdate}
                </span>
              </div>
            </div>

            {/* Tabs: [ Grafik Stasiun ] [ Profil Stasiun ] */}
            <div
              className={`flex p-1 rounded-xl ${
                isDarkMode ? 'bg-slate-800' : 'bg-gray-100'
              } gap-1`}
            >
              <button
                type="button"
                onClick={() => setActiveStationTab('grafik')}
                className={`flex-1 min-h-[32px] py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center justify-center ${
                  activeStationTab === 'grafik'
                    ? isDarkMode
                      ? 'bg-slate-700 text-white shadow-xs'
                      : 'bg-white text-gray-900 shadow-xs'
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white'
                }`}
              >
                Grafik Stasiun
              </button>

              <button
                type="button"
                onClick={() => setActiveStationTab('profil')}
                className={`flex-1 min-h-[32px] py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center justify-center ${
                  activeStationTab === 'profil'
                    ? isDarkMode
                      ? 'bg-slate-700 text-white shadow-xs'
                      : 'bg-white text-gray-900 shadow-xs'
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white'
                }`}
              >
                Profil Stasiun
              </button>
            </div>

            {/* TAB 1: Grafik Stasiun (Matching image.png) */}
            {activeStationTab === 'grafik' && (
              <div className="space-y-3">
                {/* Header Section: Tren Parameter Kualitas Air Hari Ini + Download Icon */}
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-xs font-bold text-gray-900 dark:text-white">
                      Tren Parameter Kualitas Air Hari Ini
                    </h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                      Pantau perubahan nilai setiap parameter hari ini.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={handleDownloadChart}
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

                {/* THE BAR CHART (Matching image.png exactly) */}
                <div
                  className={`p-2.5 rounded-xl border ${
                    isDarkMode
                      ? 'bg-slate-900/60 border-slate-800'
                      : 'bg-slate-50/50 border-gray-100'
                  }`}
                >
                  <div className="flex h-56 pt-2">
                    {/* Left Axis: "Indeks Pencemaran" + 4 Color Bands */}
                    <div className="flex items-stretch gap-1 mr-2 shrink-0 select-none">
                      {/* Vertical Title: "Indeks Pencemaran" */}
                      <div className="flex items-center justify-center">
                        <span
                          className="text-xs text-gray-500 dark:text-gray-400 font-semibold tracking-wide"
                          style={{
                            writingMode: 'vertical-rl',
                            transform: 'rotate(180deg)',
                          }}
                        >
                          Indeks Pencemaran
                        </span>
                      </div>

                      {/* 4 Colored Bands (Berat, Sedang, Ringan, Baku Mutu) */}
                      <div className="flex flex-col w-6 rounded-md overflow-hidden text-xs font-bold text-center leading-none shadow-2xs">
                        {/* Zone 4: Berat (Top, Red/Pink) */}
                        <div
                          className="flex-1 bg-red-100 text-red-700 flex items-center justify-center border-b border-white/60"
                          style={{
                            writingMode: 'vertical-rl',
                            transform: 'rotate(180deg)',
                          }}
                        >
                          Berat
                        </div>
                        {/* Zone 3: Sedang (Yellow/Amber) */}
                        <div
                          className="flex-1 bg-amber-100 text-amber-700 flex items-center justify-center border-b border-white/60"
                          style={{
                            writingMode: 'vertical-rl',
                            transform: 'rotate(180deg)',
                          }}
                        >
                          Sedang
                        </div>
                        {/* Zone 2: Ringan (Blue) */}
                        <div
                          className="flex-1 bg-blue-100 text-blue-700 flex items-center justify-center border-b border-white/60"
                          style={{
                            writingMode: 'vertical-rl',
                            transform: 'rotate(180deg)',
                          }}
                        >
                          Ringan
                        </div>
                        {/* Zone 1: Baku Mutu (Bottom, Green) */}
                        <div
                          className="flex-1 bg-emerald-100 text-emerald-800 flex items-center justify-center"
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
                    <div className="flex-1 flex flex-col justify-end">
                      {/* Bars Container */}
                      <div className="flex-1 flex items-end justify-around gap-2 px-1 border-b border-gray-200 dark:border-slate-700">
                        {chartBars.map((bar) => {
                          const heightPercent = Math.min(
                            100,
                            Math.max(12, (bar.value / maxChartValue) * 100)
                          );
                          return (
                            <div
                              key={bar.name}
                              className="flex-1 flex flex-col items-center justify-end h-full group"
                            >
                              {/* Top Value Label */}
                              <span className="text-xs font-bold text-gray-800 dark:text-slate-100 mb-1">
                                {bar.value.toFixed(1)}
                              </span>

                              {/* Vertical Gradient Bar */}
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
                      <div className="flex justify-around gap-2 px-1 pt-1.5 text-center">
                        {chartBars.map((bar) => (
                          <div
                            key={bar.name}
                            className="flex-1 text-xs font-semibold text-gray-600 dark:text-slate-300 truncate"
                            title={bar.name}
                          >
                            {bar.name}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Footnote below bars matching image.png */}
                  <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400 pt-2.5 mt-1 border-t border-gray-100 dark:border-slate-800">
                    <div className="w-3.5 h-3.5 rounded-full border border-gray-400 flex items-center justify-center text-xs font-serif shrink-0">
                      i
                    </div>
                    <span>
                      Indeks pencemaran ditentukan dari nilai ratio per parameter
                    </span>
                  </div>
                </div>

                {/* Secondary Collapsible Section matching image.png */}
                <div
                  className={`border rounded-xl overflow-hidden ${
                    isDarkMode ? 'border-slate-800' : 'border-gray-200'
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => setIsSecondaryTrendOpen(!isSecondaryTrendOpen)}
                    className={`w-full min-h-[32px] p-2.5 flex items-center justify-between text-xs font-bold ${
                      isDarkMode ? 'bg-slate-800/80 hover:bg-slate-800' : 'bg-gray-50 hover:bg-gray-100'
                    } transition-colors cursor-pointer text-left`}
                  >
                    <span>Tren Parameter Kualitas Air Hari Ini</span>
                    <ChevronRight
                      className={`w-4 h-4 text-gray-400 transition-transform ${
                        isSecondaryTrendOpen ? 'rotate-90' : ''
                      }`}
                    />
                  </button>

                  {isSecondaryTrendOpen && (
                    <div className="p-3 space-y-2 text-xs">
                      <div className="grid grid-cols-2 gap-2">
                        <div className="p-2 bg-gray-50 dark:bg-slate-900 rounded-lg">
                          <span className="text-gray-500 block">pH Sensor</span>
                          <span className="font-bold text-gray-900 dark:text-white">
                            {selectedStation.parameters.ph.toFixed(2)}
                          </span>
                        </div>
                        <div className="p-2 bg-gray-50 dark:bg-slate-900 rounded-lg">
                          <span className="text-gray-500 block">Dissolved Oxygen</span>
                          <span className="font-bold text-gray-900 dark:text-white">
                            {selectedStation.parameters.do.toFixed(2)} mg/L
                          </span>
                        </div>
                        <div className="p-2 bg-gray-50 dark:bg-slate-900 rounded-lg">
                          <span className="text-gray-500 block">BOD</span>
                          <span className="font-bold text-gray-900 dark:text-white">
                            {selectedStation.parameters.bod.toFixed(2)} mg/L
                          </span>
                        </div>
                        <div className="p-2 bg-gray-50 dark:bg-slate-900 rounded-lg">
                          <span className="text-gray-500 block">COD</span>
                          <span className="font-bold text-gray-900 dark:text-white">
                            {selectedStation.parameters.cod.toFixed(2)} mg/L
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* TAB 2: Profil Stasiun */}
            {activeStationTab === 'profil' && (
              <div className="space-y-3 text-xs">
                <div
                  className={`p-3 rounded-xl border ${
                    isDarkMode
                      ? 'bg-slate-900 border-slate-800'
                      : 'bg-gray-50 border-gray-200'
                  } space-y-2`}
                >
                  <div className="flex justify-between py-1 border-b border-gray-200 dark:border-slate-800">
                    <span className="text-gray-500 dark:text-gray-400">Sungai</span>
                    <span className="font-semibold text-gray-900 dark:text-white">
                      {selectedStation.river}
                    </span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-gray-200 dark:border-slate-800">
                    <span className="text-gray-500 dark:text-gray-400">DAS</span>
                    <span className="font-semibold text-gray-900 dark:text-white">
                      {selectedStation.das}
                    </span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-gray-200 dark:border-slate-800">
                    <span className="text-gray-500 dark:text-gray-400">Kabupaten/Kota</span>
                    <span className="font-semibold text-gray-900 dark:text-white">
                      {selectedStation.city}
                    </span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-gray-200 dark:border-slate-800">
                    <span className="text-gray-500 dark:text-gray-400">Provinsi</span>
                    <span className="font-semibold text-gray-900 dark:text-white">
                      {selectedStation.province}
                    </span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-gray-200 dark:border-slate-800">
                    <span className="text-gray-500 dark:text-gray-400">Koordinat</span>
                    <span className="font-mono text-gray-900 dark:text-white">
                      {selectedStation.lat.toFixed(4)}, {selectedStation.lng.toFixed(4)}
                    </span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-gray-500 dark:text-gray-400">Tipe Sensor</span>
                    <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                      Telemetri Multi-Sensor Kontinyu
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => onSelectStation(null)}
                  className="w-full min-h-[32px] h-8 px-4 border border-gray-300 dark:border-slate-700 rounded-lg text-xs font-semibold text-gray-700 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <span>Kembali ke Ringkasan Monitoring</span>
                </button>
              </div>
            )}
          </div>
        ) : (
          /* ======================================================================= */
          /* TAMPILAN DEFAULT MONITORING (KETIKA TIDAK ADA STASIUN YANG DIPILIH) */
          /* ======================================================================= */
          <div className="space-y-4">
            {/* Heading Section: Monitoring */}
            <div>
              <h2
                className={`text-xs font-bold ${
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
                        className={`text-xs font-semibold ${
                          isDarkMode ? 'text-slate-400' : 'text-gray-500'
                        } block`}
                      >
                        DAS
                      </span>
                      <span
                        className={`text-sm font-bold ${
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
                        className={`text-xs font-semibold ${
                          isDarkMode ? 'text-slate-400' : 'text-gray-500'
                        } block`}
                      >
                        Sungai
                      </span>
                      <span
                        className={`text-sm font-bold ${
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
                        className={`text-xs font-semibold ${
                          isDarkMode ? 'text-slate-400' : 'text-gray-500'
                        } block`}
                      >
                        Stasiun
                      </span>
                      <span
                        className={`text-sm font-bold ${
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
                        className={`text-xs font-semibold ${
                          isDarkMode ? 'text-slate-400' : 'text-gray-500'
                        } block`}
                      >
                        Provinsi
                      </span>
                      <span
                        className={`text-sm font-bold ${
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
                        className={`text-xs font-semibold ${
                          isDarkMode ? 'text-slate-400' : 'text-gray-500'
                        } block`}
                      >
                        Kabupaten/Kota
                      </span>
                      <span
                        className={`text-sm font-bold ${
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

            {/* Section: Indeks Pencemaran tiap Stasiun */}
            <div className="pt-1">
              <div className="flex items-center justify-between mb-2">
                <h2
                  className={`text-xs font-bold ${
                    isDarkMode ? 'text-slate-200' : 'text-gray-800'
                  }`}
                >
                  Indeks Pencemaran tiap Stasiun
                </h2>
                {selectedStatusFilter !== 'all' && (
                  <button
                    type="button"
                    onClick={() => onSelectStatusFilter('all')}
                    className="min-h-[32px] text-xs text-[#ff6900] hover:underline cursor-pointer font-medium flex items-center"
                  >
                    Reset Filter
                  </button>
                )}
              </div>

              {/* List of Statuses */}
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
                          : 'bg-gray-50/70 border-gray-200/80 hover:border-gray-300'
                      }`}
                      title={`Klik untuk filter status ${item.label}`}
                    >
                      <div className="flex items-center gap-2.5">
                        {/* Badge Icon */}
                        <div
                          className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
                          style={{
                            backgroundColor: `${item.color}15`,
                            color: item.color,
                          }}
                        >
                          {item.status === 'baku_mutu' && <Droplets className="w-4 h-4" />}
                          {item.status === 'cemar_ringan' && <Droplets className="w-4 h-4" />}
                          {item.status === 'cemar_sedang' && <Droplets className="w-4 h-4" />}
                          {item.status === 'cemar_berat' && <AlertTriangle className="w-4 h-4" />}
                          {item.status === 'tanpa_data' && <HelpCircle className="w-4 h-4" />}
                        </div>

                        <span
                          className={`text-xs font-medium ${
                            isDarkMode ? 'text-slate-200' : 'text-gray-800'
                          }`}
                        >
                          {item.label}
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <span
                          className={`text-xs font-bold ${
                            isDarkMode ? 'text-white' : 'text-gray-900'
                          }`}
                        >
                          {item.count}
                        </span>
                        <span
                          className={`text-xs ${
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
      {/* BAGIAN 3: PERATURAN INDEKS PENCEMARAN (Warna abu-abu seperti Bagian 1, Separator border-t #E4E4E7) */}
      {/* ========================================================================= */}
      <div
        className={`p-3.5 ${
          isDarkMode ? 'bg-[#0f172a]' : 'bg-[#f4f6f8]'
        } border-t border-[#E4E4E7] dark:border-slate-800 shrink-0`}
      >
        {!isRegulationExpanded ? (
          /* Collapsed State: exact design as in Image 1 & Image 2 */
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full border border-blue-500 flex items-center justify-center text-blue-500 font-serif font-bold text-xs">
                i
              </div>
              <span
                className={`text-xs font-semibold ${
                  isDarkMode ? 'text-slate-100' : 'text-gray-800'
                }`}
              >
                Peraturan Indeks Pencemaran
              </span>
            </div>
            <button
              type="button"
              onClick={() => setIsRegulationExpanded(true)}
              className="min-h-[32px] text-xs font-semibold text-[#ff6900] hover:text-[#e05d00] cursor-pointer flex items-center"
            >
              Lihat Detail
            </button>
          </div>
        ) : (
          /* Expanded State: with description and "Tutup" button */
          <div
            className={`p-3 rounded-xl border ${
              isDarkMode
                ? 'bg-slate-800/90 border-slate-700'
                : 'bg-white border-blue-200'
            } shadow-2xs space-y-1.5`}
          >
            <div className="flex items-start justify-between gap-1">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full border border-blue-500 flex items-center justify-center text-blue-500 font-serif font-bold text-xs">
                  i
                </div>
                <button
                  type="button"
                  onClick={onOpenRegulationInfo}
                  className={`min-h-[32px] text-xs font-bold ${
                    isDarkMode ? 'text-slate-100' : 'text-gray-900'
                  } hover:underline text-left cursor-pointer flex items-center`}
                >
                  Peraturan Indeks Pencemaran
                </button>
              </div>
              <button
                type="button"
                onClick={() => setIsRegulationExpanded(false)}
                className="min-h-[32px] text-xs font-semibold text-[#ff6900] hover:text-[#e05d00] hover:underline cursor-pointer flex items-center"
              >
                Tutup
              </button>
            </div>
            <p
              className={`text-xs leading-relaxed ${
                isDarkMode ? 'text-slate-300' : 'text-gray-700'
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
