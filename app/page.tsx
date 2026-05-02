"use client";
import { useChat } from "@ai-sdk/react";
import { useState, useEffect, useRef, useMemo } from "react";
import { Settings, User, LogIn, LogOut } from "lucide-react";
import Link from "next/link";
import Sidebar, { ChatSession } from "./components/Sidebar";
import ChatArea from "./components/ChatArea";
import SettingsModal from "./components/SettingsModal";
import CookieBanner from "./components/CookieBanner";
import { useAuth } from "./contexts/AuthContext";
import { DefaultChatTransport } from "ai";

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
  // ✅ Apenas o que o AuthContext realmente expõe
  const { token, isLoggedIn, logout } = useAuth();

  // ✅ useMemo para não recriar o objeto a cada render
  const userId = useMemo(() => {
    if (!token) return null;
    try {
      return JSON.parse(atob(token.split(".")[1])).sub as string;
    } catch {
      return null;
    }
  }, [token]);

  const authHeaders = useMemo(
      () => (userId ? { "x-user-id": userId } : {}) as Record<string, string>,
      [userId]
  );

  const transport = useMemo(
      () => new DefaultChatTransport({ api: "/api/chat" }),
      []
  );

  const [inputValue, setInputValue] = useState("");
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [isLoadingHistory, setIsLoadingHistory] = useState(true);

  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isDesktopSidebarOpen, setIsDesktopSidebarOpen] = useState(true);

  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.3);

  const [showBanner, setShowBanner] = useState(false);

  const [theme, setTheme] = useState<string>("green");
  const [cookieConsent, setCookieConsent] = useState<boolean | null>(null);

  const audioRef = useRef<HTMLAudioElement>(null);
  const currentChatId = useRef(crypto.randomUUID());
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { messages, sendMessage, setMessages } = useChat({
    transport,
    onFinish: () => {
      refreshHistory();
      if (!activeChatId) setActiveChatId(currentChatId.current);
    },
  });

  useEffect(() => {
    setShowBanner(getCookie(CONSENT_KEY) === null);
  }, []);

  useEffect(() => {
    const consent = getCookie(CONSENT_KEY);
    if (consent === "accepted") {
      setCookieConsent(true);
      setTheme(getCookie(THEME_KEY) ?? "green");
    } else if (consent === "declined") {
      setCookieConsent(false);
    }
  }, []);

  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = volume;
  }, [volume]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages?.length]);

  useEffect(() => {
    let isMounted = true;

    const fetchInitialHistory = async () => {
      if (!userId) {
        if (isMounted) setIsLoadingHistory(false);
        return;
      }
      try {
        const response = await fetch("/api/history", { headers: authHeaders });
        if (response.ok) {
          const data = await response.json();
          if (isMounted) setSessions(data);
        }
      } catch (err) {
        console.error("Erro ao carregar sessões iniciais:", err);
      } finally {
        if (isMounted) setIsLoadingHistory(false);
      }
    };

    fetchInitialHistory();
    return () => { isMounted = false; };
  }, [userId]); // recarrega quando o login muda

  const refreshHistory = async () => {
    if (!userId) return;
    try {
      const response = await fetch("/api/history", { headers: authHeaders });
      if (response.ok) setSessions(await response.json());
    } catch (err) {
      console.error("Erro ao recarregar sessões:", err);
    }
  };

  const loadChat = async (id: string) => {
    try {
      setActiveChatId(id);
      currentChatId.current = id;
      const response = await fetch(`/api/chat/${id}`, { headers: authHeaders });
      if (!response.ok) throw new Error("Falha ao buscar mensagens");
      setMessages(await response.json());
    } catch (err) {
      console.error("Erro ao carregar chat:", err);
    }
  };

  const createNewChat = () => {
    currentChatId.current = crypto.randomUUID();
    setActiveChatId(null);
    setMessages([]);
  };

  const toggleMusic = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
      audioRef.current.volume = volume;
    }
    setIsPlaying(!isPlaying);
  };

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    sendMessage(
        { text: inputValue },
        {
          headers: {
            "x-chat-id": currentChatId.current,
            ...(userId ? { "x-user-id": userId } : {}),
          },
        }
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

                {/* ✅ isLoggedIn em vez de user (que não existe) */}
                {isLoggedIn ? (
                    <button
                        onClick={() => {
                          logout();
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