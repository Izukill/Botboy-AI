import { Terminal, MessageSquare, X } from "lucide-react";

export type ChatSession = {
  id: string;
  title: string;
  createdAt: string;
};

interface SidebarProps {
  isMobileSidebarOpen: boolean;
  setIsMobileSidebarOpen: (isOpen: boolean) => void;
  isDesktopSidebarOpen: boolean;
  setIsDesktopSidebarOpen: (isOpen: boolean) => void;
  sessions: ChatSession[];
  isLoadingHistory: boolean;
  activeChatId: string | null;
  loadChat: (id: string) => void;
  createNewChat: () => void;
}

export default function Sidebar({
  isMobileSidebarOpen,
  setIsMobileSidebarOpen,
  isDesktopSidebarOpen,
  setIsDesktopSidebarOpen,
  sessions,
  isLoadingHistory,
  activeChatId,
  loadChat,
  createNewChat,
}: SidebarProps) {
  return (
    <>
      {isMobileSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/80 z-40 md:hidden backdrop-blur-sm"
          onClick={() => setIsMobileSidebarOpen(false)}
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 h-full bg-black/95 transition-all duration-300 ease-in-out overflow-hidden
        ${isMobileSidebarOpen ? "translate-x-0 shadow-[4px_0_15px_rgba(0,255,0,0.02)]" : "-translate-x-full"} 
        w-72
        md:relative md:translate-x-0
        ${isDesktopSidebarOpen ? "md:w-72 border-r border-green-800" : "md:w-0 border-r-0"}
        `}
      >
        <div className="w-72 h-full p-4 flex flex-col">
          <div className="mb-8 border-b border-green-800 pb-4 flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-green-400 tracking-widest flex items-center gap-2">
                <Terminal size={24} />
                BOTBOY
              </h1>
              <span className="text-xs text-green-700 mt-1 block">v1.0.0_beta</span>
              <span className="text-xs text-green-700 mt-1 block">By Izuki :/</span>
            </div>

            <div className="flex items-center gap-1">
              <button
                className="hidden md:flex items-center justify-center text-green-600 hover:text-green-400 p-1 w-8 h-8 font-bold text-xl transition-colors cursor-pointer"
                onClick={() => setIsDesktopSidebarOpen(false)}
                title="Minimizar terminal"
              >
                _
              </button>

              <button
                className="md:hidden text-green-600 hover:text-green-400 p-1 cursor-pointer"
                onClick={() => setIsMobileSidebarOpen(false)}
              >
                <X size={24} />
              </button>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-xs text-green-600 uppercase tracking-wider flex items-center gap-2">
                <MessageSquare size={14} />
                Sessões
              </h2>
              <button
                onClick={createNewChat}
                className="text-xs text-green-500 hover:text-green-300 border border-green-800 hover:border-green-400 px-2 py-1 transition-all cursor-pointer bg-green-950/20 active:scale-95"
                title="Nova Sessão"
              >
                [ + ]
              </button>
            </div>

            <div className="space-y-2 max-h-[40vh] overflow-y-auto pr-2 custom-scrollbar">
              {isLoadingHistory ? (
                <div className="text-xs text-green-800 animate-pulse">[ Carregando... ]</div>
              ) : sessions.length > 0 ? (
                sessions.map((session) => {
                  const isActive = activeChatId === session.id;

                  return (
                    <button
                      key={session.id}
                      className={`w-full text-left p-2 border transition-all group cursor-pointer relative overflow-hidden ${
                        isActive
                          ? "border-green-400 bg-green-900/20 shadow-[inset_2px_0_0_#4ade80]" // Efeito de borda interna na ativa
                          : "border-green-900/30 bg-green-950/5 hover:bg-green-900/20 hover:border-green-600"
                      }`}
                      onClick={() => loadChat(session.id)}
                    >
                      {/* Área do título estilizado */}
                      <div
                        className={`text-sm truncate flex items-center gap-1 ${
                          isActive ? "text-green-300 font-bold" : "text-green-500 group-hover:text-green-300"
                        }`}
                      >
                        {/* Prefixo de linha de comando */}
                        <span className={`${isActive ? "text-green-400" : "text-green-700 font-normal"}`}>
                          {isActive ? ">_" : "~$"}
                        </span>
                        
                        <span className="truncate">
                          {session.title || "unnamed_session.sh"}
                        </span>
                        
                        {/* Efeito Cursor Piscando exclusivo para a aba ativa */}
                        {isActive && (
                          <span className="inline-block w-1.5 h-3.5 bg-green-400 animate-blink ml-1 align-middle"></span>
                        )}
                      </div>

                      {/* Metadados */}
                      <div className="text-[10px] text-green-900 mt-1 flex justify-between font-mono">
                        <span>{new Date(session.createdAt).toLocaleDateString("pt-BR")}</span>
                        <span className={isActive ? "text-green-600" : ""}>ID: {session.id.slice(0, 8)}</span>
                      </div>
                    </button>
                  );
                })
              ) : (
                <div className="text-sm text-green-800/60 p-2 border border-green-900/50 bg-green-950/10 border-dashed">
                  [ Banco de dados vazio ]
                </div>
              )}
            </div>
          </div>

          <div className="mt-44 mb-3 pt-4 text-sm text-green-700 text-center hover:text-green-400 transition-colors">
            <a href="https://loretoportifolio.vercel.app/" target="_blank" rel="noopener noreferrer">
              <p>Sobre o Criador</p>
            </a>
          </div>
          <div className="mt-auto pt-4 border-t border-green-800 text-xs text-green-700 text-center">
            <p>Acesso root autorizado.</p>
          </div>
        </div>
      </aside>
    </>
  );
}