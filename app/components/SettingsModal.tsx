import { X, Volume2, VolumeX, Monitor, Music, Settings2 } from "lucide-react";

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  isPlaying: boolean;
  toggleMusic: () => void;
  volume: number;
  setVolume: (vol: number) => void;
  theme: string;
  setTheme: (theme: string) => void;
}

export default function SettingsModal({
  isOpen,
  onClose,
  isPlaying,
  toggleMusic,
  volume,
  setVolume,
  theme,
  setTheme,
}: SettingsModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 z-[100] flex items-center justify-center backdrop-blur-md font-mono text-green-500">
      <div className="w-full max-w-md bg-black border border-green-600 shadow-[0_0_20px_rgba(0,255,0,0.15)] p-6 relative">
        {/* Header */}
        <div className="flex justify-between items-center border-b border-green-800 pb-4 mb-6">
          <h2 className="text-lg font-bold tracking-widest flex items-center gap-2">
            <Settings2 size={20} />
            SYS_CONFIG
          </h2>
          <button
            onClick={onClose}
            className="text-green-600 hover:text-green-400 transition-colors cursor-pointer"
          >
            <X size={24} />
          </button>
        </div>

        <div className="space-y-8">
          {/* Seção: Áudio */}
          <section>
            <h3 className="text-xs uppercase tracking-wider text-green-700 mb-4 flex items-center gap-2">
              <Music size={14} />
              Background Audio
            </h3>
            
            <div className="bg-green-950/20 border border-green-900/50 p-4 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm">Music Status</span>
                <button
                  onClick={toggleMusic}
                  className={`text-xs px-3 py-1 border transition-all cursor-pointer ${
                    isPlaying 
                      ? "border-green-400 text-green-400 shadow-[0_0_8px_rgba(0,255,0,0.2)]" 
                      : "border-green-900 text-green-700 hover:border-green-600"
                  }`}
                >
                  {isPlaying ? "[ ON ]" : "[ OFF ]"}
                </button>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-xs text-green-600">
                  <span>Volume</span>
                  <span>{Math.round(volume * 100)}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={volume}
                  onChange={(e) => setVolume(parseFloat(e.target.value))}
                  className="w-full accent-green-500 cursor-pointer h-1 bg-green-950 appearance-none rounded-none"
                />
              </div>
            </div>
          </section>

          {/* Seção: Temas */}
          <section>
            <h3 className="text-xs uppercase tracking-wider text-green-700 mb-4 flex items-center gap-2">
              <Monitor size={14} />
              Interface Theme
            </h3>
            
            <div className="grid grid-cols-2 gap-2">
              {['green', 'amber', 'blue', 'crt-white'].map((t) => (
                <button
                  key={t}
                  onClick={() => setTheme(t)}
                  className={`p-2 text-xs border uppercase tracking-wider transition-all cursor-pointer ${
                    theme === t
                      ? "border-green-400 bg-green-900/30 text-green-300 shadow-[inset_2px_0_0_#4ade80]"
                      : "border-green-900/30 bg-green-950/10 text-green-700 hover:border-green-600"
                  }`}
                >
                  {t.replace('-', ' ')}
                </button>
              ))}
            </div>
            <p className="text-[10px] text-green-800 mt-2 text-center">
              *Aplicações de tema requerem mapeamento de variáveis CSS no globals.css.
            </p>
          </section>
        </div>

        <div className="mt-8 text-center border-t border-green-900/50 pt-4">
          <span className="text-[10px] text-green-800 animate-pulse">Aguardando novas diretrizes...</span>
        </div>
      </div>
    </div>
  );
}