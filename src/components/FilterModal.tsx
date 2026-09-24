import React, { useState } from 'react';
import { X, Filter, RotateCcw, Check } from 'lucide-react';
import { WaterQualityStatus } from '../types/onlimo';
import { STATUS_SUMMARIES } from '../data/mockStations';

interface FilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedStatus: WaterQualityStatus | 'all';
  onApplyStatus: (status: WaterQualityStatus | 'all') => void;
  provinces: string[];
  selectedProvince: string;
  onApplyProvince: (prov: string) => void;
  dases: string[];
  selectedDas: string;
  onApplyDas: (das: string) => void;
}

export const FilterModal: React.FC<FilterModalProps> = ({
  isOpen,
  onClose,
  selectedStatus,
  onApplyStatus,
  provinces,
  selectedProvince,
  onApplyProvince,
  dases,
  selectedDas,
  onApplyDas,
}) => {
  const [tempStatus, setTempStatus] = useState<WaterQualityStatus | 'all'>(selectedStatus);
  const [tempProvince, setTempProvince] = useState<string>(selectedProvince);
  const [tempDas, setTempDas] = useState<string>(selectedDas);

  if (!isOpen) return null;

  const handleReset = () => {
    setTempStatus('all');
    setTempProvince('all');
    setTempDas('all');
  };

  const handleApply = () => {
    onApplyStatus(tempStatus);
    onApplyProvince(tempProvince);
    onApplyDas(tempDas);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-slate-800 w-full max-w-lg overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-gray-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <Filter className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold text-gray-900 dark:text-white">
              Filter Pemantauan Stasiun
            </h3>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-slate-200 hover:bg-gray-100 dark:hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filter Body */}
        <div className="p-5 space-y-4 max-h-[70vh] overflow-y-auto">
          {/* Status Mutu Air */}
          <div>
            <label className="block text-xs font-bold text-gray-800 dark:text-slate-200 mb-2">
              Status Indeks Pencemaran
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setTempStatus('all')}
                className={`flex items-center justify-between p-2.5 rounded-xl border text-xs transition-colors cursor-pointer ${
                  tempStatus === 'all'
                    ? 'border-blue-500 bg-blue-50/70 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 font-semibold'
                    : 'border-gray-200 dark:border-slate-700 text-gray-700 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-800'
                }`}
              >
                <span>Semua Status</span>
                {tempStatus === 'all' && <Check className="w-4 h-4 text-blue-600" />}
              </button>

              {STATUS_SUMMARIES.map((item) => (
                <button
                  key={item.status}
                  type="button"
                  onClick={() => setTempStatus(item.status)}
                  className={`flex items-center justify-between p-2.5 rounded-xl border text-xs transition-colors cursor-pointer ${
                    tempStatus === item.status
                      ? `${item.bgColor} ${item.borderColor} font-semibold ring-1 ring-[#ff6900]`
                      : 'border-gray-200 dark:border-slate-700 text-gray-700 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-800'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span
                      className="w-2.5 h-2.5 rounded-full"
                      style={{ backgroundColor: item.color }}
                    />
                    <span>{item.label}</span>
                  </div>
                  {tempStatus === item.status && <Check className="w-4 h-4 text-[#ff6900]" />}
                </button>
              ))}
            </div>
          </div>

          {/* Provinsi */}
          <div>
            <label className="block text-xs font-bold text-gray-800 dark:text-slate-200 mb-1.5">
              Provinsi
            </label>
            <select
              value={tempProvince}
              onChange={(e) => setTempProvince(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl text-gray-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-[#ff6900]"
            >
              <option value="all">Semua Provinsi (Seluruh Indonesia)</option>
              {provinces.map((prov) => (
                <option key={prov} value={prov}>
                  {prov}
                </option>
              ))}
            </select>
          </div>

          {/* DAS (Daerah Aliran Sungai) */}
          <div>
            <label className="block text-xs font-bold text-gray-800 dark:text-slate-200 mb-1.5">
              Daerah Aliran Sungai (DAS)
            </label>
            <select
              value={tempDas}
              onChange={(e) => setTempDas(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl text-gray-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-[#ff6900]"
            >
              <option value="all">Semua DAS</option>
              {dases.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-gray-50 dark:bg-slate-800/60 border-t border-gray-100 dark:border-slate-800 flex items-center justify-between">
          <button
            type="button"
            onClick={handleReset}
            className="flex items-center gap-1.5 text-xs text-gray-600 hover:text-gray-900 dark:text-slate-400 dark:hover:text-white cursor-pointer font-medium"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Filter</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-1.5 rounded-lg text-xs font-medium text-gray-600 dark:text-slate-300 hover:bg-gray-200 dark:hover:bg-slate-700 cursor-pointer"
            >
              Batal
            </button>
            <button
              type="button"
              onClick={handleApply}
              className="px-4 py-1.5 rounded-lg text-xs font-bold text-white bg-[#ff6900] hover:bg-[#e05d00] active:bg-[#c75300] transition-colors shadow-xs cursor-pointer"
            >
              Terapkan
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
