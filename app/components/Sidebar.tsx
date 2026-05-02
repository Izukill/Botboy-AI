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
          className="fixed inset-0 bg-sys-bg/80 z-40 md:hidden backdrop-blur-sm"
          onClick={() => setIsMobileSidebarOpen(false)}
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 h-full bg-sys-bg/95 transition-all duration-300 ease-in-out overflow-hidden
        ${isMobileSidebarOpen ? "translate-x-0 shadow-[4px_0_15px_var(--sys-shadow)]" : "-translate-x-full"} 
        w-72
        md:relative md:translate-x-0
        ${isDesktopSidebarOpen ? "md:w-72 border-r border-sys-border" : "md:w-0 border-r-0"}
        `}
      >
        <div className="w-72 h-full p-4 flex flex-col">
          <div className="mb-8 border-b border-sys-border pb-4 flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-sys-accent tracking-widest flex items-center gap-2">
                <Terminal size={24} />
                BOTBOY
              </h1>
              <span className="text-xs text-sys-muted mt-1 block">
                v1.0.0_beta
              </span>
              <span className="text-xs text-sys-muted mt-1 block">
                By Izuki :/
              </span>
            </div>

            <div className="flex items-center gap-1">
              <button
                className="hidden md:flex items-center justify-center text-sys-muted-light hover:text-sys-accent p-1 w-8 h-8 font-bold text-xl transition-colors cursor-pointer"
                onClick={() => setIsDesktopSidebarOpen(false)}
                title="Minimizar terminal"
              >
                _
              </button>

              <button
                className="md:hidden text-sys-muted-light hover:text-sys-accent p-1 cursor-pointer"
                onClick={() => setIsMobileSidebarOpen(false)}
              >
                <X size={24} />
              </button>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-xs text-sys-muted-light uppercase tracking-wider flex items-center gap-2">
                <MessageSquare size={14} />
                Sessões
              </h2>
              <button
                onClick={createNewChat}
                className="text-xs text-sys-fg hover:text-sys-accent-light border border-sys-border hover:border-sys-accent px-2 py-1 transition-all cursor-pointer bg-sys-panel/20 active:scale-95"
                title="Nova Sessão"
              >
                [ + ]
              </button>
            </div>

            <div className="space-y-2 max-h-[40vh] overflow-y-auto pr-2 custom-scrollbar">
              {isLoadingHistory ? (
                <div className="text-xs text-sys-border animate-pulse">
                  [ Carregando... ]
                </div>
              ) : sessions.length > 0 ? (
                sessions.map((session) => {
                  const isActive = activeChatId === session.id;

                  return (
                    <button
                      key={session.id}
                      className={`w-full text-left p-2 border transition-all group cursor-pointer relative overflow-hidden ${
                        isActive
                          ? "border-sys-accent bg-sys-dark/20 shadow-[inset_2px_0_0_var(--sys-accent)]"
                          : "border-sys-border/50 bg-sys-panel/5 hover:bg-sys-dark/20 hover:border-sys-muted-light"
                      }`}
                      onClick={() => loadChat(session.id)}
                    >
                      <div
                        className={`text-sm truncate flex items-center gap-1 ${
                          isActive
                            ? "text-sys-accent-light font-bold"
                            : "text-sys-fg group-hover:text-sys-accent-light"
                        }`}
                      >
                        <span
                          className={`${isActive ? "text-sys-accent" : "text-sys-muted font-normal"}`}
                        >
                          {isActive ? ">_" : "~$"}
                        </span>

                        <span className="truncate">
                          {session.title || "unnamed_session.sh"}
                        </span>

                        {isActive && (
                          <span className="inline-block w-1.5 h-3.5 bg-sys-accent animate-blink ml-1 align-middle"></span>
                        )}
                      </div>

                      <div className="text-[10px] text-sys-dark mt-1 flex justify-between font-mono">
                        <span>
                          {new Date(session.createdAt).toLocaleDateString(
                            "pt-BR",
                          )}
                        </span>
                        <span
                          className={isActive ? "text-sys-muted-light" : ""}
                        >
                          ID: {session.id.slice(0, 8)}
                        </span>
                      </div>
                    </button>
                  );
                })
              ) : (
                <div className="text-sm text-sys-border p-2 border border-sys-border/50 bg-sys-panel/10 border-dashed">
                  [ Banco de dados vazio ]
                </div>
              )}
            </div>
          </div>

          <div className="mt-auto flex flex-col">
            <div className="mb-3 pt-4 text-sm text-sys-muted text-center hover:text-sys-accent transition-colors">
              <a
                  href="https://loretoportifolio.vercel.app/"
                  target="_blank"
                  rel="noopener noreferrer"
              >
                <p>Sobre o Criador</p>
              </a>
            </div>

            <div className="pt-4 border-t border-sys-border text-xs text-sys-muted text-center">
              <p>Acesso root autorizado.</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
