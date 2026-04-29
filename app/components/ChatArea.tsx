import { User, Terminal, Send, Menu } from "lucide-react";
import Mewo from "./Mewo";

export interface UIPart {
  type: string;
  text?: string;
}

export interface UIMessage {
  id: string;
  role: string;
  parts?: UIPart[];
}

interface ChatAreaProps {
  messages: UIMessage[];
  messagesEndRef: React.RefObject<HTMLDivElement | null>;
  inputValue: string;
  setInputValue: (value: string) => void;
  handleSubmit: (e: React.FormEvent) => void;
  isDesktopSidebarOpen: boolean;
  setIsMobileSidebarOpen: (isOpen: boolean) => void;
  setIsDesktopSidebarOpen: (isOpen: boolean) => void;
}

export default function ChatArea({
  messages,
  messagesEndRef,
  inputValue,
  setInputValue,
  handleSubmit,
  isDesktopSidebarOpen,
  setIsMobileSidebarOpen,
  setIsDesktopSidebarOpen,
}: ChatAreaProps) {
  return (
    <div className="flex-1 flex flex-col h-full relative overflow-hidden">
      <button
        onClick={() => {
          setIsMobileSidebarOpen(true);
          setIsDesktopSidebarOpen(true);
        }}
        className={`absolute top-4 left-4 z-30 p-2 text-green-600 hover:text-green-400 focus:outline-none bg-black/50 backdrop-blur-sm transition-opacity duration-300 cursor-pointer
          ${isDesktopSidebarOpen ? "md:opacity-0 md:pointer-events-none" : "opacity-100"}
        `}
        title="Abrir terminal"
      >
        <Menu size={24} />
      </button>

      <main className="flex-1 overflow-y-auto p-4 pt-16 md:p-8 md:pt-16 w-full">
        <div className="w-full max-w-2xl mx-auto space-y-6 pb-32">
          {messages?.map((m) => (
            <div
              key={m.id}
              className={`flex items-start gap-3 md:gap-4 ${m.role === "user" ? "flex-row-reverse" : ""}`}
            >
              <div
                className={`p-2 border flex-shrink-0 ${
                  m.role === "user"
                    ? "border-green-400 bg-green-950/50 text-green-400"
                    : "border-green-600 bg-black text-green-600"
                }`}
              >
                {m.role === "user" ? (
                  <User size={20} className="md:w-6 md:h-6" />
                ) : (
                  <Terminal size={20} className="md:w-6 md:h-6" />
                )}
              </div>

              <div
                className={`p-3 md:p-5 border w-full overflow-hidden shadow-[0_0_10px_rgba(0,255,0,0.05)] ${
                  m.role === "user"
                    ? "bg-green-950/30 border-green-400 text-green-300"
                    : "bg-black border-green-700 text-green-500"
                }`}
              >
                <div className="text-xs opacity-50 mb-2 md:mb-3 select-none border-b border-green-900 pb-1">
                  {m.role === "user"
                    ? "user@botboy:~$"
                    : "root@botboy:~# /bin/bash"}
                </div>

                <div className="text-base md:text-lg leading-relaxed">
                  {m.parts?.map((part: UIPart, i: number) =>
                    part.type === "text" ? (
                      <span key={i} className="break-words whitespace-pre-wrap">
                        {part.text}
                      </span>
                    ) : null,
                  )}
                </div>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </main>

      <div className="absolute bottom-0 w-full p-4 md:p-8 bg-gradient-to-t from-black via-black/90 to-transparent pointer-events-none flex justify-center z-20">
        <div className="w-full max-w-2xl flex items-end gap-2 md:gap-3 pointer-events-auto">
          <form
            onSubmit={handleSubmit}
            className="flex-grow flex gap-2 bg-black shadow-[0_-10px_20px_rgba(0,0,0,0.8)]"
          >
            <div className="relative flex-grow flex items-top">
              <span className="absolute left-3 md:left-4 top-3 md:top-4 text-green-700 font-bold select-none animate-pulse md:text-lg">
                ~$
              </span>
              <textarea
                className="w-full pl-8 md:pl-10 p-3 md:p-4 bg-black border border-green-600 text-green-400 placeholder-green-900 outline-none focus:border-green-400 focus:shadow-[0_0_12px_rgba(34,197,94,0.3)] transition-all md:text-lg resize-none overflow-y-auto max-h-[120px]"
                value={inputValue}
                placeholder="Inserir comando..."
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSubmit(e as React.FormEvent);
                  }
                }}
                onInput={(e) => {
                  const target = e.target as HTMLTextAreaElement;

                  target.style.height = "auto";

                  const maxHeight = 120;
                  if (target.scrollHeight <= maxHeight) {
                    target.style.height = target.scrollHeight + "px";
                    target.style.overflowY = "hidden";
                  } else {
                    target.style.height = maxHeight + "px";
                    target.style.overflowY = "auto";
                  }
                }}
                rows={1}
                autoComplete="off"
                spellCheck="false"
              />
            </div>
            <button
              type="submit"
              className="p-3 md:p-4 bg-black border border-green-600 text-green-500 hover:bg-green-900 hover:text-green-300 hover:border-green-400 transition-colors flex items-center justify-center cursor-pointer"
            >
              <Send size={20} className="md:w-6 md:h-6" />
            </button>
          </form>
          <Mewo />
        </div>
      </div>
    </div>
  );
}
