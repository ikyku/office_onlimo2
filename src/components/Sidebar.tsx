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
  const [isRegulationExpanded, setIsRegulationExpanded] = useState(false); // Collapsed by default matching user image 1
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

  return (
    <aside
      className={`w-full md:w-[350px] lg:w-[370px] h-full ${
        isDarkMode
          ? 'bg-[#0f172a] border-slate-800 text-slate-100'
          : 'bg-[#f4f6f8] border-gray-200 text-gray-900'
      } border-l flex flex-col justify-between overflow-y-auto shrink-0 transition-colors duration-200 z-20`}
    >
      <div className="p-4 space-y-4">
        {/* Top Filter Container matching Image 2 */}
        <div className="space-y-2">
          {/* Row 1: Select Stasiun + Grouped Buttons (Refresh & Filter) */}
          <div className="flex items-center gap-2">
            {/* Custom Select Station Dropdown */}
            <div className="relative flex-1" ref={dropdownRef}>
              <button
                type="button"
                onClick={() => setIsStationDropdownOpen(!isStationDropdownOpen)}
                className={`w-full flex items-center justify-between px-3 py-2 ${
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
                  } transition-transform ${isStationDropdownOpen ? 'rotate-180' : ''}`}
                />
              </button>

              {/* Station Dropdown Menu */}
              {isStationDropdownOpen && (
                <div
                  className={`absolute top-full left-0 right-0 mt-1 ${
                    isDarkMode
                      ? 'bg-slate-800 border-slate-700 text-slate-200 shadow-2xl'
                      : 'bg-white border-gray-200 text-gray-800 shadow-xl'
                  } border rounded-lg z-50 overflow-hidden`}
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
                        className={`w-full pl-8 pr-3 py-1.5 text-xs ${
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
                      className={`w-full text-left px-3 py-2 flex items-center justify-between transition-colors cursor-pointer ${
                        isDarkMode
                          ? 'hover:bg-slate-700/60'
                          : 'hover:bg-gray-50'
                      } ${
                        !selectedStation
                          ? 'font-bold text-[#ff6900]'
                          : isDarkMode
                          ? 'text-slate-300'
                          : 'text-gray-700'
                      }`}
                    >
                      <span>Semua Stasiun (Reset)</span>
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
                          className={`w-full text-left px-3 py-2 flex items-center justify-between transition-colors cursor-pointer ${
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

            {/* Grouped Button: Refresh + Filter button matching Image 2 */}
            <div
              className={`flex items-center rounded-lg border ${
                isDarkMode ? 'border-slate-700' : 'border-gray-300'
              } overflow-hidden shadow-2xs`}
            >
              {/* Refresh Button */}
              <button
                type="button"
                onClick={onRefreshData}
                disabled={isRefreshing}
                className={`p-2 ${
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

              {/* Filter Button - Primary color #ff6900 active styling matching Image 2 */}
              <button
                type="button"
                onClick={() => setIsFilterPanelOpen(!isFilterPanelOpen)}
                className={`p-2 transition-colors cursor-pointer ${
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

          {/* Expanded Filter Panel (DAS, Provinsi, Kab/Kota, Reset & Cari) matching Image 2 */}
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
                  className={`w-full appearance-none px-3 py-2 ${
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
                  className={`w-full appearance-none px-3 py-2 ${
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
                  className={`w-full appearance-none px-3 py-2 ${
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

              {/* Buttons: Reset (Left) & Cari (Right) matching Image 2 */}
              <div className="flex items-center justify-between pt-1">
                <button
                  type="button"
                  onClick={handleReset}
                  className={`px-4 py-1.5 ${
                    isDarkMode
                      ? 'bg-slate-800 border-slate-600 text-slate-200 hover:bg-slate-700'
                      : 'bg-white border-gray-300 text-gray-800 hover:bg-gray-50'
                  } border rounded-lg text-xs font-semibold transition-colors shadow-2xs cursor-pointer`}
                >
                  Reset
                </button>

                <button
                  type="button"
                  onClick={handleApplyFilter}
                  className="px-6 py-1.5 bg-[#ff6900] hover:bg-[#e05d00] active:bg-[#c75300] text-white rounded-lg text-xs font-bold transition-colors shadow-xs cursor-pointer"
                >
                  Cari
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Section: Monitoring */}
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
                    ? 'bg-slate-800 border-slate-700'
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
                    isDarkMode ? 'bg-slate-700 text-slate-300' : 'bg-gray-100 text-gray-500'
                  } flex items-center justify-center`}
                >
                  <Mountain className="w-4 h-4" />
                </div>
              </div>

              <div
                className={`${
                  isDarkMode
                    ? 'bg-slate-800 border-slate-700'
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
                    isDarkMode ? 'bg-slate-700 text-slate-300' : 'bg-gray-100 text-gray-500'
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
                    ? 'bg-slate-800 border-slate-700'
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
                    isDarkMode ? 'bg-slate-700 text-slate-300' : 'bg-gray-100 text-gray-500'
                  } flex items-center justify-center`}
                >
                  <Activity className="w-4 h-4" />
                </div>
              </div>

              <div
                className={`${
                  isDarkMode
                    ? 'bg-slate-800 border-slate-700'
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
                    isDarkMode ? 'bg-slate-700 text-slate-300' : 'bg-gray-100 text-gray-500'
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
                    ? 'bg-slate-800 border-slate-700'
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
                    isDarkMode ? 'bg-slate-700 text-slate-300' : 'bg-gray-100 text-gray-500'
                  } flex items-center justify-center`}
                >
                  <Building2 className="w-4 h-4" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Section: Indeks Pencemaran tiap Stasiun */}
        <div className="pt-2">
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
                className="text-xs text-[#ff6900] hover:underline cursor-pointer font-medium"
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
                      ? 'bg-slate-800/80 border-slate-700/60 hover:border-slate-600'
                      : 'bg-white border-gray-200/70 hover:border-gray-300'
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

      {/* Bottom Notification: Peraturan Indeks Pencemaran matching Image 1 */}
      {!isRegulationExpanded ? (
        /* Collapsed State: exact design as in Image 1 */
        <div
          className={`p-3 m-3 ${
            isDarkMode
              ? 'bg-slate-800 border-slate-700'
              : 'bg-white border-gray-200'
          } border rounded-xl shadow-2xs flex items-center justify-between`}
        >
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-full border-2 border-blue-500 flex items-center justify-center text-blue-500 font-serif font-bold text-xs">
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
            className="text-xs font-semibold text-[#ff6900] hover:text-[#e05d00] cursor-pointer"
          >
            Lihat Detail
          </button>
        </div>
      ) : (
        /* Expanded State: with description and "Tutup" button matching initial design */
        <div
          className={`p-3 m-3 ${
            isDarkMode
              ? 'bg-slate-800/90 border-slate-700'
              : 'bg-[#eef7ff] border-blue-200'
          } border rounded-xl shadow-2xs`}
        >
          <div className="flex items-start justify-between gap-1 mb-1.5">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded-full border-2 border-blue-500 flex items-center justify-center text-blue-500 font-serif font-bold text-xs">
                i
              </div>
              <button
                type="button"
                onClick={onOpenRegulationInfo}
                className={`text-xs font-bold ${
                  isDarkMode ? 'text-slate-100' : 'text-gray-900'
                } hover:underline text-left cursor-pointer`}
              >
                Peraturan Indeks Pencemaran
              </button>
            </div>
            <button
              type="button"
              onClick={() => setIsRegulationExpanded(false)}
              className="text-xs font-semibold text-[#ff6900] hover:text-[#e05d00] hover:underline cursor-pointer"
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
    </aside>
  );
};
