/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo, useEffect } from 'react';
import { Header } from './components/Header';
import { MapContainer } from './components/MapContainer';
import { Sidebar } from './components/Sidebar';
import { TableView } from './components/TableView';
import { StationDetailModal } from './components/StationDetailModal';
import { LoginModal } from './components/LoginModal';
import { FilterModal } from './components/FilterModal';
import { RegulationModal } from './components/RegulationModal';
import { MOCK_STATIONS } from './data/mockStations';
import { Station, WaterQualityStatus } from './types/onlimo';
import { BarChart3, X } from 'lucide-react';

export default function App() {
  const [viewMode, setViewMode] = useState<'dashboard' | 'table'>('dashboard');
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
  const [stations, setStations] = useState<Station[]>(MOCK_STATIONS);
  const [selectedStation, setSelectedStation] = useState<Station | null>(null);
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<WaterQualityStatus | 'all'>('all');
  const [selectedProvince, setSelectedProvince] = useState<string>('all');
  const [selectedDas, setSelectedDas] = useState<string>('all');
  const [selectedCity, setSelectedCity] = useState<string>('all');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [isRegulationModalOpen, setIsRegulationModalOpen] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [refreshNotification, setRefreshNotification] = useState<string | null>(null);

  // Sync dark mode class on document
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const toggleDarkMode = () => {
    setIsDarkMode((prev) => !prev);
  };

  // Provinces, DAS, and Cities lists for filters
  const provinces = useMemo(() => {
    return Array.from(new Set(stations.map((s) => s.province))).sort();
  }, [stations]);

  const dases = useMemo(() => {
    return Array.from(new Set(stations.map((s) => s.das))).sort();
  }, [stations]);

  const cities = useMemo(() => {
    const list = selectedProvince === 'all'
      ? stations.map((s) => s.city)
      : stations.filter((s) => s.province === selectedProvince).map((s) => s.city);
    return Array.from(new Set(list)).sort();
  }, [stations, selectedProvince]);

  // Filter stations based on user selections
  const filteredStations = useMemo(() => {
    return stations.filter((station) => {
      if (selectedStatusFilter !== 'all' && station.status !== selectedStatusFilter) {
        return false;
      }

      if (selectedProvince !== 'all' && station.province !== selectedProvince) {
        return false;
      }

      if (selectedDas !== 'all' && station.das !== selectedDas) {
        return false;
      }

      if (selectedCity !== 'all' && station.city !== selectedCity) {
        return false;
      }

      return true;
    });
  }, [stations, selectedStatusFilter, selectedProvince, selectedDas, selectedCity]);

  const handleResetAllFilters = () => {
    setSelectedStation(null);
    setSelectedStatusFilter('all');
    setSelectedProvince('all');
    setSelectedDas('all');
    setSelectedCity('all');
  };

  // Simulate refreshing real-time sensor data
  const handleRefreshData = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      // Slightly perturb sensor readings to simulate live stream
      setStations((prevStations) =>
        prevStations.map((st) => {
          if (st.status === 'tanpa_data') return st;
          const delta = (Math.random() - 0.5) * 0.2;
          const newPh = Math.max(5.0, Math.min(9.5, +(st.parameters.ph + delta).toFixed(2)));
          const now = new Date();
          const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now
            .getMinutes()
            .toString()
            .padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')} WIB`;

          return {
            ...st,
            parameters: {
              ...st.parameters,
              ph: newPh,
            },
            lastUpdate: `2025-08-28 ${timeStr}`,
          };
        })
      );
      setIsRefreshing(false);
      setRefreshNotification('Data sensor telemetri berhasil diperbarui secara real-time!');
      setTimeout(() => setRefreshNotification(null), 3000);
    }, 800);
  };

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-[#f4f6f8] dark:bg-slate-950 text-gray-900 dark:text-slate-100 select-none transition-colors">
      {/* Top Navbar */}
      <Header
        viewMode={viewMode}
        setViewMode={setViewMode}
        onOpenLogin={() => setIsLoginModalOpen(true)}
        isDarkMode={isDarkMode}
        toggleDarkMode={toggleDarkMode}
        onToggleSidebarMobile={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
        isMobileSidebarOpen={isMobileSidebarOpen}
      />

      {/* Main Content Area */}
      <main className="flex-1 flex relative overflow-hidden">
        {viewMode === 'dashboard' ? (
          <>
            {/* Left / Center Map Container */}
            <div className="flex-1 h-full relative">
              <MapContainer
                stations={stations}
                filteredStations={filteredStations}
                selectedStation={selectedStation}
                onSelectStation={(st) => setSelectedStation(st)}
                isDarkMode={isDarkMode}
                onOpenRegulationInfo={() => setIsRegulationModalOpen(true)}
              />

              {/* Mobile Floating Action Button to open Sidebar Drawer */}
              <div className="md:hidden absolute bottom-4 left-4 z-20">
                <button
                  onClick={() => setIsMobileSidebarOpen(true)}
                  className="flex items-center gap-2 px-3.5 py-2 bg-white/95 dark:bg-slate-800/95 backdrop-blur-md text-gray-800 dark:text-white rounded-full shadow-lg border border-gray-200 dark:border-slate-700 text-xs font-bold cursor-pointer hover:bg-white dark:hover:bg-slate-700 transition-transform active:scale-95"
                >
                  <BarChart3 className="w-4 h-4 text-[#ff6900]" />
                  <span>Statistik Monitoring</span>
                </button>
              </div>

              {/* Toast Notification */}
              {refreshNotification && (
                <div className="absolute top-4 left-1/2 -translate-x-1/2 z-30 bg-emerald-600 text-white text-xs px-4 py-2 rounded-full shadow-lg flex items-center gap-2 animate-in fade-in slide-in-from-top-2">
                  <span className="w-2 h-2 rounded-full bg-white animate-ping" />
                  <span>{refreshNotification}</span>
                </div>
              )}
            </div>

            {/* Desktop Right Sidebar matching Screenshot & Image 1 & 2 */}
            <div className="hidden md:flex h-full">
              <Sidebar
                stations={stations}
                selectedStation={selectedStation}
                onSelectStation={(st) => setSelectedStation(st)}
                selectedStatusFilter={selectedStatusFilter}
                onSelectStatusFilter={(status) => setSelectedStatusFilter(status)}
                selectedProvince={selectedProvince}
                onSelectProvince={(prov) => setSelectedProvince(prov)}
                selectedDas={selectedDas}
                onSelectDas={(das) => setSelectedDas(das)}
                selectedCity={selectedCity}
                onSelectCity={(city) => setSelectedCity(city)}
                provinces={provinces}
                dases={dases}
                cities={cities}
                onRefreshData={handleRefreshData}
                isRefreshing={isRefreshing}
                onOpenRegulationInfo={() => setIsRegulationModalOpen(true)}
                onResetFilters={handleResetAllFilters}
                isDarkMode={isDarkMode}
              />
            </div>

            {/* Mobile Sidebar Off-Canvas / Drawer */}
            {isMobileSidebarOpen && (
              <div className="md:hidden fixed inset-0 z-40 flex">
                <div
                  className="fixed inset-0 bg-black/50 backdrop-blur-2xs transition-opacity"
                  onClick={() => setIsMobileSidebarOpen(false)}
                />
                <div className="relative ml-auto w-5/6 max-w-sm h-full bg-[#f4f6f8] dark:bg-slate-900 shadow-2xl flex flex-col z-50">
                  <div
                    className={`p-3 border-b ${
                      isDarkMode
                        ? 'bg-[#0f172a] border-slate-800 text-white'
                        : 'bg-white border-gray-200 text-gray-900'
                    } flex items-center justify-between`}
                  >
                    <span className="text-xs font-bold">
                      Statistik & Pemantauan
                    </span>
                    <button
                      onClick={() => setIsMobileSidebarOpen(false)}
                      className={`p-1 rounded-lg ${
                        isDarkMode
                          ? 'text-gray-400 hover:text-white'
                          : 'text-gray-500 hover:text-gray-700'
                      }`}
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                  <div className="flex-1 overflow-y-auto">
                    <Sidebar
                      stations={stations}
                      selectedStation={selectedStation}
                      onSelectStation={(st) => {
                        setSelectedStation(st);
                        setIsMobileSidebarOpen(false);
                      }}
                      selectedStatusFilter={selectedStatusFilter}
                      onSelectStatusFilter={(status) => setSelectedStatusFilter(status)}
                      selectedProvince={selectedProvince}
                      onSelectProvince={(prov) => setSelectedProvince(prov)}
                      selectedDas={selectedDas}
                      onSelectDas={(das) => setSelectedDas(das)}
                      selectedCity={selectedCity}
                      onSelectCity={(city) => setSelectedCity(city)}
                      provinces={provinces}
                      dases={dases}
                      cities={cities}
                      onRefreshData={handleRefreshData}
                      isRefreshing={isRefreshing}
                      onOpenRegulationInfo={() => {
                        setIsMobileSidebarOpen(false);
                        setIsRegulationModalOpen(true);
                      }}
                      onResetFilters={handleResetAllFilters}
                      isDarkMode={isDarkMode}
                    />
                  </div>
                </div>
              </div>
            )}
          </>
        ) : (
          /* Table View */
          <TableView
            stations={filteredStations}
            onSelectStation={(st) => setSelectedStation(st)}
            onSwitchToDashboard={() => setViewMode('dashboard')}
          />
        )}
      </main>

      {/* Station Detail Modal */}
      <StationDetailModal
        station={selectedStation}
        onClose={() => setSelectedStation(null)}
      />

      {/* Login Modal */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
      />

      {/* Advanced Filter Modal */}
      <FilterModal
        isOpen={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
        selectedStatus={selectedStatusFilter}
        onApplyStatus={(status) => setSelectedStatusFilter(status)}
        provinces={provinces}
        selectedProvince={selectedProvince}
        onApplyProvince={(prov) => setSelectedProvince(prov)}
        dases={dases}
        selectedDas={selectedDas}
        onApplyDas={(das) => setSelectedDas(das)}
      />

      {/* Regulation Info Modal */}
      <RegulationModal
        isOpen={isRegulationModalOpen}
        onClose={() => setIsRegulationModalOpen(false)}
      />
    </div>
  );
}
