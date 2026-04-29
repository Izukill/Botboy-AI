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
    <div className="fixed inset-0 bg-sys-bg/80 z-[100] flex items-center justify-center backdrop-blur-md font-mono text-sys-fg">
      <div className="w-full max-w-md bg-sys-bg border border-sys-border shadow-[0_0_20px_var(--sys-shadow)] p-6 relative">
        <div className="flex justify-between items-center border-b border-sys-border pb-4 mb-6">
          <h2 className="text-lg font-bold tracking-widest flex items-center gap-2">
            <Settings2 size={20} />
            SYS_CONFIG
          </h2>
          <button
            onClick={onClose}
            className="text-sys-muted-light hover:text-sys-accent transition-colors cursor-pointer"
          >
            <X size={24} />
          </button>
        </div>

        <div className="space-y-8">
          <section>
            <h3 className="text-xs uppercase tracking-wider text-sys-muted mb-4 flex items-center gap-2">
              <Music size={14} />
              Background Audio
            </h3>

            <div className="bg-sys-panel/20 border border-sys-border/50 p-4 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm">Music Status</span>
                <button
                  onClick={toggleMusic}
                  style={
                    isPlaying
                      ? { boxShadow: `0 0 8px var(--color-sys-shadow)` }
                      : {}
                  }
                  className={`text-xs px-3 py-1 border transition-all cursor-pointer ${
                    isPlaying
                      ? "border-sys-accent text-sys-accent"
                      : "border-sys-border text-sys-muted hover:border-sys-muted-light"
                  }`}
                >
                  {isPlaying ? "[ ON ]" : "[ OFF ]"}
                </button>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-xs text-sys-muted-light">
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
                  className="w-full cursor-pointer h-1 bg-sys-panel appearance-none rounded-none"
                  style={{ accentColor: "var(--color-sys-fg)" }}
                />
              </div>
            </div>
          </section>

          <section>
            <h3 className="text-xs uppercase tracking-wider text-sys-muted mb-4 flex items-center gap-2">
              <Monitor size={14} />
              Interface Theme
            </h3>

            <div className="grid grid-cols-2 gap-2">
              {["green", "win95", "akane", "blue"].map((t) => {
                const isActive = theme === t;
                return (
                  <button
                    key={t}
                    onClick={() => setTheme(t)}
                    className={`p-2 text-xs border uppercase tracking-wider transition-all cursor-pointer ${
                      isActive
                        ? "border-sys-accent bg-sys-dark/30 text-sys-accent-light shadow-[inset_2px_0_0_var(--sys-accent)]"
                        : "border-sys-border/50 bg-sys-panel/10 text-sys-muted hover:border-sys-muted-light"
                    }`}
                  >
                    {t.replace("-", " ")}
                  </button>
                );
              })}
            </div>
          </section>
        </div>

        <div className="mt-8 text-center border-t border-sys-border/50 pt-4">
          <span className="text-[10px] text-sys-border animate-pulse">
            Aguardando novas diretrizes...
          </span>
        </div>
      </div>
    </div>
  );
}
