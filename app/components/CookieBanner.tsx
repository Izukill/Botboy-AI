import { Info, Check } from "lucide-react";

interface CookieBannerProps {
  onAccept: () => void;
  onDecline: () => void;
}

export default function CookieBanner({ onAccept, onDecline }: CookieBannerProps) {
  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-8 md:w-96 bg-sys-bg border border-sys-border shadow-[0_0_20px_var(--sys-shadow)] p-4 z-[100] font-mono text-sys-fg animate-[slideUp_0.3s_ease-out]">
      <div className="flex items-start gap-3">
        <Info size={20} className="text-sys-accent shrink-0 mt-0.5" />
        <div>
          <h3 className="text-sm font-bold text-sys-accent-light mb-1 uppercase tracking-widest">
            Uso de Cookies
          </h3>
          <p className="text-xs text-sys-muted-light mb-4 leading-relaxed">
            Este terminal utiliza cookies locais para salvar suas preferências de interface (temas). Sem o seu consentimento, o sistema operará em modo volátil (Guest).
          </p>
          <div className="flex gap-2">
            <button
              onClick={onAccept}
              className="flex-1 flex items-center justify-center gap-2 bg-sys-dark/30 hover:bg-sys-dark/50 border border-sys-accent text-sys-accent-light text-xs py-2 transition-all cursor-pointer shadow-[inset_2px_0_0_var(--sys-accent)]"
            >
              <Check size={14} />
              [ ACEITAR ]
            </button>
            <button
              onClick={onDecline}
              className="flex-1 bg-sys-panel/10 hover:bg-sys-panel/30 border border-sys-border text-sys-muted text-xs py-2 transition-all cursor-pointer"
            >
              [ RECUSAR ]
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}