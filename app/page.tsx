"use client";
import { useChat } from "@ai-sdk/react";
import { useState, useEffect, useRef } from "react";
import { Settings } from "lucide-react";
import Sidebar, { ChatSession } from "./components/Sidebar";
import ChatArea from "./components/ChatArea";
import SettingsModal from "./components/SettingsModal"; 

export default function Chat() {
  const [inputValue, setInputValue] = useState("");
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [isLoadingHistory, setIsLoadingHistory] = useState(true);

  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isDesktopSidebarOpen, setIsDesktopSidebarOpen] = useState(true);

  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.3); 
  const [theme, setTheme] = useState("green"); 

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
        
        if (isMounted) {
          setSessions(data);
        }
      } catch (err) {
        console.error("Erro ao carregar sessões iniciais:", err);
      } finally {
        if (isMounted) {
          setIsLoadingHistory(false);
        }
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
      { headers: { "x-chat-id": currentChatId.current } }
    );
    setInputValue("");
  };

  return (
    <div className="flex h-screen w-full bg-black font-mono text-green-500 overflow-hidden relative">
      <div className="absolute inset-0 z-[0] bg-[url('/lainwallpaper.jpg')] bg-cover bg-center bg-no-repeat opacity-3 pointer-events-none mix-blend-screen" />

      <audio 
        ref={audioRef} 
        src="/backgroundmusic.mp3" 
        loop 
        preload="auto"
      />

      {/* button do modal de settings */}
      <button
        onClick={() => setIsSettingsOpen(true)}
        className="absolute top-4 right-4 z-30 p-2 text-green-600 hover:text-green-400 bg-black/80 border border-green-900/50 hover:border-green-400 backdrop-blur-sm transition-all cursor-pointer shadow-[0_0_10px_rgba(0,0,0,0.5)] active:scale-95"
        title="Configurações do Sistema"
      >
        <Settings size={20} className="animate-[spin_4s_linear_infinite] hover:animate-none" />
      </button>

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
    </div>
  );
}