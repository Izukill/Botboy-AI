"use client";
import { useChat } from "@ai-sdk/react";
import { useState, useEffect, useRef } from "react";
import { Settings, User, LogIn, LogOut } from "lucide-react";
import Link from "next/link";
import Sidebar, { ChatSession } from "./components/Sidebar";
import ChatArea from "./components/ChatArea";
import SettingsModal from "./components/SettingsModal";
import CookieBanner from "./components/CookieBanner";

function getCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : null;
}

function setCookie(name: string, value: string, days = 365) {
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/; SameSite=Lax`;
}

function deleteCookie(name: string) {
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
}

const CONSENT_KEY = "cookie_consent";
const THEME_KEY = "pref_theme";

export default function Chat() {
  const [inputValue, setInputValue] = useState("");
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [isLoadingHistory, setIsLoadingHistory] = useState(true);

  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isDesktopSidebarOpen, setIsDesktopSidebarOpen] = useState(true);

  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // 3. Novo estado para controlar o menu dropdown do usuário
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  // Estado simulado de login (Substitua depois pelo seu Contexto de Auth)
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.3);

  const [cookieConsent, setCookieConsent] = useState<boolean | null>(() => {
    const saved = getCookie(CONSENT_KEY);
    if (saved === "accepted") return true;
    if (saved === "declined") return false;
    return null;
  });

  const [showBanner, setShowBanner] = useState(
      () => getCookie(CONSENT_KEY) === null,
  );

  const handleAcceptCookies = () => {
    setCookie(CONSENT_KEY, "accepted");
    setCookieConsent(true);
    setShowBanner(false);
    setCookie(THEME_KEY, theme);
  };

  const handleDeclineCookies = () => {
    setCookie(CONSENT_KEY, "declined");
    setCookieConsent(false);
    setShowBanner(false);
    deleteCookie(THEME_KEY);
  };

  const [theme, setTheme] = useState<string>(() => {
    if (typeof document === "undefined") return "green";
    const consent = getCookie(CONSENT_KEY);
    if (consent === "accepted") {
      return getCookie(THEME_KEY) ?? "green";
    }
    return "green";
  });

  useEffect(() => {
    if (cookieConsent === true) {
      setCookie(THEME_KEY, theme);
    }
  }, [theme, cookieConsent]);

  const audioRef = useRef<HTMLAudioElement>(null);
  const currentChatId = useRef(crypto.randomUUID());
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  const toggleMusic = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
        audioRef.current.volume = volume;
      }
      setIsPlaying(!isPlaying);
    }
  };

  const refreshHistory = async () => {
    try {
      const response = await fetch("/api/history");
      const data = await response.json();
      setSessions(data);
    } catch (err) {
      console.error("Erro ao recarregar sessões:", err);
    }
  };

  const { messages, sendMessage, setMessages } = useChat({
    onFinish: () => {
      refreshHistory();
      if (!activeChatId) {
        setActiveChatId(currentChatId.current);
      }
    },
  });

  const loadChat = async (id: string) => {
    try {
      setActiveChatId(id);
      currentChatId.current = id;

      const response = await fetch(`/api/chat/${id}`);
      if (!response.ok) throw new Error("Falha ao buscar mensagens");

      const history = await response.json();
      setMessages(history);
    } catch (err) {
      console.error("Erro ao carregar chat:", err);
    }
  };

  const createNewChat = () => {
    const newId = crypto.randomUUID();
    currentChatId.current = newId;
    setActiveChatId(null);
    setMessages([]);
  };

  useEffect(() => {
    let isMounted = true;

    const fetchInitialHistory = async () => {
      try {
        const response = await fetch("/api/history");
        const data = await response.json();
        if (isMounted) setSessions(data);
      } catch (err) {
        console.error("Erro ao carregar sessões iniciais:", err);
      } finally {
        if (isMounted) setIsLoadingHistory(false);
      }
    };

    fetchInitialHistory();
    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages?.length]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;
    sendMessage(
        { text: inputValue },
        { headers: { "x-chat-id": currentChatId.current } },
    );
    setInputValue("");
  };

  return (
      <div
          data-theme={theme}
          className="flex h-screen w-full bg-sys-bg font-mono text-sys-fg overflow-hidden relative transition-colors duration-300"
      >
        <div
            className="absolute inset-0 z-[0] bg-cover bg-center bg-no-repeat pointer-events-none transition-all duration-500 ease-in-out"
            style={{
              backgroundImage: "var(--sys-wallpaper)",
              mixBlendMode: "var(--sys-wp-blend)" as React.CSSProperties["mixBlendMode"],
              opacity: "var(--sys-wp-opacity)" as React.CSSProperties["opacity"],
            }}
        />

        <audio ref={audioRef} src="/backgroundmusic.mp3" loop preload="auto" />

        <div className="absolute top-4 right-4 z-30 flex flex-col items-end">
          {/* Botão do Ícone de Usuário */}
          <button
              onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              className={`p-2 backdrop-blur-sm transition-all cursor-pointer shadow-[0_0_10px_var(--sys-shadow)] active:scale-95 border flex items-center justify-center ${
                  isUserMenuOpen
                      ? "bg-sys-dark/50 border-sys-accent text-sys-accent"
                      : "bg-sys-bg/80 border-sys-border text-sys-muted-light hover:text-sys-accent hover:border-sys-accent"
              }`}
              title="Menu do Usuário"
          >
            <User size={20} />
          </button>

          {isUserMenuOpen && (
              <div className="mt-2 w-48 bg-sys-bg border border-sys-border shadow-[0_0_15px_var(--sys-shadow)] flex flex-col animate-[slideDown_0.2s_ease-out]">

                <button
                    onClick={() => {
                      setIsSettingsOpen(true);
                      setIsUserMenuOpen(false);
                    }}
                    className="flex items-center gap-3 p-3 text-sm text-sys-muted hover:text-sys-accent hover:bg-sys-panel/20 transition-colors text-left border-b border-sys-border/50 cursor-pointer"
                >
                  <Settings size={16} />
                  Configurações
                </button>

                {isLoggedIn ? (
                    <button
                        onClick={() => {
                          setIsLoggedIn(false); // Lógica de logout
                          setIsUserMenuOpen(false);
                        }}
                        className="flex items-center gap-3 p-3 text-sm text-red-500 hover:text-red-400 hover:bg-red-950/20 transition-colors text-left cursor-pointer"
                    >
                      <LogOut size={16} />
                      Encerrar Sessão
                    </button>
                ) : (
                    <Link
                        href="/login"
                        className="flex items-center gap-3 p-3 text-sm text-sys-muted hover:text-sys-accent hover:bg-sys-panel/20 transition-colors text-left cursor-pointer"
                    >
                      <LogIn size={16} />
                      Acessar Conta
                    </Link>
                )}
              </div>
          )}
        </div>

        <SettingsModal
            isOpen={isSettingsOpen}
            onClose={() => setIsSettingsOpen(false)}
            isPlaying={isPlaying}
            toggleMusic={toggleMusic}
            volume={volume}
            setVolume={setVolume}
            theme={theme}
            setTheme={setTheme}
        />

        <Sidebar
            isMobileSidebarOpen={isMobileSidebarOpen}
            setIsMobileSidebarOpen={setIsMobileSidebarOpen}
            isDesktopSidebarOpen={isDesktopSidebarOpen}
            setIsDesktopSidebarOpen={setIsDesktopSidebarOpen}
            sessions={sessions}
            isLoadingHistory={isLoadingHistory}
            activeChatId={activeChatId}
            loadChat={loadChat}
            createNewChat={createNewChat}
        />

        <ChatArea
            messages={messages}
            messagesEndRef={messagesEndRef}
            inputValue={inputValue}
            setInputValue={setInputValue}
            handleSubmit={handleSubmit}
            isDesktopSidebarOpen={isDesktopSidebarOpen}
            setIsMobileSidebarOpen={setIsMobileSidebarOpen}
            setIsDesktopSidebarOpen={setIsDesktopSidebarOpen}
        />

        {showBanner && (
            <CookieBanner
                onAccept={handleAcceptCookies}
                onDecline={handleDeclineCookies}
            />
        )}
      </div>
  );
}