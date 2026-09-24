import React, { useState } from 'react';
import {
  X,
  LogIn,
  Lock,
  Mail,
  Shield,
  Eye,
  EyeOff,
  CheckCircle,
  AlertCircle,
  Droplets,
} from 'lucide-react';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [captchaCode, setCaptchaCode] = useState('7K9P2');
  const [captchaInput, setCaptchaInput] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  if (!isOpen) return null;

  const refreshCaptcha = () => {
    const chars = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ';
    let code = '';
    for (let i = 0; i < 5; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setCaptchaCode(code);
    setCaptchaInput('');
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setMessage({ type: 'error', text: 'Silakan isi email/NIP dan kata sandi Anda.' });
      return;
    }
    if (captchaInput.toUpperCase() !== captchaCode) {
      setMessage({ type: 'error', text: 'Kode Captcha tidak sesuai. Silakan coba lagi.' });
      return;
    }

    setIsLoading(true);
    setMessage(null);

    // Simulate login verification
    setTimeout(() => {
      setIsLoading(false);
      setMessage({
        type: 'success',
        text: 'Autentikasi berhasil! Mengalihkan ke portal internal ONLIMO...',
      });
      setTimeout(() => {
        onClose();
        setMessage(null);
      }, 1500);
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-slate-800 w-full max-w-md overflow-hidden">
        {/* Header */}
        <div className="relative bg-gradient-to-r from-[#0a2540] to-[#1e3a5f] p-5 text-white">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white/70 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              <Droplets className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold leading-tight">Masuk Sistem ONLIMO</h3>
              <p className="text-xs text-blue-200 mt-0.5">
                Kementerian Lingkungan Hidup / Badan Pengendalian Lingkungan Hidup
              </p>
            </div>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleLogin} className="p-5 space-y-4">
          {message && (
            <div
              className={`p-3 rounded-lg text-xs flex items-center gap-2 ${
                message.type === 'success'
                  ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200'
                  : 'bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300 border border-rose-200'
              }`}
            >
              {message.type === 'success' ? (
                <CheckCircle className="w-4 h-4 shrink-0" />
              ) : (
                <AlertCircle className="w-4 h-4 shrink-0" />
              )}
              <span>{message.text}</span>
            </div>
          )}

          {/* Email / NIP */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-slate-300 mb-1">
              Email atau NIP Pengguna
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="nama@menlhk.go.id atau NIP"
                className="w-full pl-9 pr-3 py-2 text-xs bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#ff6900] text-gray-900 dark:text-white"
                required
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-semibold text-gray-700 dark:text-slate-300">
                Kata Sandi
              </label>
              <a
                href="#forgot"
                onClick={(e) => {
                  e.preventDefault();
                  alert('Silakan hubungi Administrator PUSDATIN KLHK untuk pemulihan kata sandi.');
                }}
                className="text-xs text-blue-600 dark:text-blue-400 hover:underline"
              >
                Lupa Sandi?
              </a>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Masukkan kata sandi"
                className="w-full pl-9 pr-9 py-2 text-xs bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#ff6900] text-gray-900 dark:text-white"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-slate-200"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Captcha */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-slate-300 mb-1">
              Verifikasi Keamanan (Captcha)
            </label>
            <div className="flex items-center gap-2 mb-2">
              <div
                onClick={refreshCaptcha}
                className="px-4 py-2 bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-100 font-mono font-bold tracking-widest text-sm rounded-lg border border-slate-300 dark:border-slate-600 select-none cursor-pointer flex items-center justify-center line-through"
                title="Klik untuk ganti kode captcha"
              >
                {captchaCode}
              </div>
              <input
                type="text"
                value={captchaInput}
                onChange={(e) => setCaptchaInput(e.target.value)}
                placeholder="Ketik kode di kiri"
                maxLength={5}
                className="flex-1 px-3 py-2 text-xs bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#ff6900] uppercase tracking-widest text-gray-900 dark:text-white font-mono"
                required
              />
            </div>
          </div>

          {/* Remember me */}
          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 text-xs text-gray-600 dark:text-slate-300 cursor-pointer">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="rounded border-gray-300 text-[#ff6900] focus:ring-[#ff6900]"
              />
              <span>Ingat perangkat ini</span>
            </label>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2.5 bg-[#ff6900] hover:bg-[#e05d00] active:bg-[#c75300] text-white rounded-xl text-xs font-bold transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {isLoading ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <LogIn className="w-4 h-4" />
                <span>Masuk ke Portal ONLIMO</span>
              </>
            )}
          </button>
        </form>

        {/* Footer Notice */}
        <div className="p-3 bg-gray-50 dark:bg-slate-800/60 border-t border-gray-100 dark:border-slate-800 text-center">
          <div className="flex items-center justify-center gap-1.5 text-xs text-gray-500">
            <Shield className="w-3.5 h-3.5 text-emerald-500" />
            <span>Sistem Terenkripsi & Terintegrasi Satu Data Lingkungan Hidup</span>
          </div>
        </div>
      </div>
    </div>
  );
};
