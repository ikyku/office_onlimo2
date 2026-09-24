import React from 'react';
import { X, BookOpen, ExternalLink, CheckCircle } from 'lucide-react';

interface RegulationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const RegulationModal: React.FC<RegulationModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-slate-800 w-full max-w-xl overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-gray-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <BookOpen className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-gray-900 dark:text-white">
                Peraturan & Landasan Hukum Indeks Pencemaran
              </h3>
              <p className="text-xs text-gray-500 dark:text-slate-400">
                Kementerian Lingkungan Hidup / Badan Pengendalian Lingkungan Hidup
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-slate-200 hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 space-y-4 max-h-[70vh] overflow-y-auto text-xs text-gray-700 dark:text-slate-300 leading-relaxed">
          {/* Main Statement */}
          <div className="p-3.5 bg-blue-50 dark:bg-blue-950/40 rounded-xl border border-blue-100 dark:border-blue-900/60 text-blue-900 dark:text-blue-200 font-medium">
            &ldquo;Indeks adalah rasio konsentrasi parameter terhadap baku mutu air sungai kelas II Lampiran VI Peraturan Pemerintah Nomor 22 Tahun 2021 tentang Penyelenggaraan Perlindungan dan Pengelolaan Lingkungan Hidup.&rdquo;
          </div>

          <div>
            <h4 className="font-bold text-gray-900 dark:text-white mb-2">
              Kriteria Status Mutu Air (Metode Indeks Pencemaran / IP)
            </h4>
            <div className="space-y-2">
              <div className="p-2.5 rounded-lg border border-emerald-200 dark:border-emerald-900/60 bg-emerald-50/50 dark:bg-emerald-950/30 flex items-start gap-2.5">
                <span className="w-3 h-3 rounded-full bg-emerald-500 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-emerald-800 dark:text-emerald-300">
                    Memenuhi Baku Mutu (Kondisi Baik)
                  </span>
                  <p className="text-xs text-gray-600 dark:text-slate-400 mt-0.5">
                    Nilai Indeks Pencemaran: <strong>0 &le; P<sub>ij</sub> &le; 1.0</strong>
                  </p>
                </div>
              </div>

              <div className="p-2.5 rounded-lg border border-blue-200 dark:border-blue-900/60 bg-blue-50/50 dark:bg-blue-950/30 flex items-start gap-2.5">
                <span className="w-3 h-3 rounded-full bg-blue-500 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-blue-800 dark:text-blue-300">
                    Cemar Ringan
                  </span>
                  <p className="text-xs text-gray-600 dark:text-slate-400 mt-0.5">
                    Nilai Indeks Pencemaran: <strong>1.0 &lt; P<sub>ij</sub> &le; 5.0</strong>
                  </p>
                </div>
              </div>

              <div className="p-2.5 rounded-lg border border-amber-200 dark:border-amber-900/60 bg-amber-50/50 dark:bg-amber-950/30 flex items-start gap-2.5">
                <span className="w-3 h-3 rounded-full bg-amber-500 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-amber-800 dark:text-amber-300">
                    Cemar Sedang
                  </span>
                  <p className="text-xs text-gray-600 dark:text-slate-400 mt-0.5">
                    Nilai Indeks Pencemaran: <strong>5.0 &lt; P<sub>ij</sub> &le; 10.0</strong>
                  </p>
                </div>
              </div>

              <div className="p-2.5 rounded-lg border border-rose-200 dark:border-rose-900/60 bg-rose-50/50 dark:bg-rose-950/30 flex items-start gap-2.5">
                <span className="w-3 h-3 rounded-full bg-rose-500 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-rose-800 dark:text-rose-300">
                    Cemar Berat
                  </span>
                  <p className="text-xs text-gray-600 dark:text-slate-400 mt-0.5">
                    Nilai Indeks Pencemaran: <strong>P<sub>ij</sub> &gt; 10.0</strong>
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Baku Mutu Parameters Reference */}
          <div>
            <h4 className="font-bold text-gray-900 dark:text-white mb-1.5">
              Standar Baku Mutu Kelas II Air Sungai:
            </h4>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="bg-gray-50 dark:bg-slate-800 p-2 rounded-lg">
                &bull; <strong>pH:</strong> 6 - 9
              </div>
              <div className="bg-gray-50 dark:bg-slate-800 p-2 rounded-lg">
                &bull; <strong>DO:</strong> &ge; 4.0 mg/L
              </div>
              <div className="bg-gray-50 dark:bg-slate-800 p-2 rounded-lg">
                &bull; <strong>BOD:</strong> &le; 3.0 mg/L
              </div>
              <div className="bg-gray-50 dark:bg-slate-800 p-2 rounded-lg">
                &bull; <strong>COD:</strong> &le; 25.0 mg/L
              </div>
              <div className="bg-gray-50 dark:bg-slate-800 p-2 rounded-lg">
                &bull; <strong>TSS:</strong> &le; 50.0 mg/L
              </div>
              <div className="bg-gray-50 dark:bg-slate-800 p-2 rounded-lg">
                &bull; <strong>Suhu:</strong> Deviasi normal 3 &deg;C
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-gray-50 dark:bg-slate-800/60 border-t border-gray-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs text-gray-500">
            <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
            <span>Dokumen Resmi Republik Indonesia</span>
          </div>

          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-[#ff6900] hover:bg-[#e05d00] active:bg-[#c75300] text-white rounded-lg text-xs font-semibold transition-colors cursor-pointer"
          >
            Mengerti
          </button>
        </div>
      </div>
    </div>
  );
};
