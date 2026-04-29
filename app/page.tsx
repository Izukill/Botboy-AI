"use client";
import { useChat } from "@ai-sdk/react";
import { useState, useEffect, useRef } from "react";
import { Volume2, VolumeX } from "lucide-react";
import Sidebar, { ChatSession } from "./components/Sidebar";
import ChatArea from "./components/ChatArea";

export default function Chat() {
  const [inputValue, setInputValue] = useState("");
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [isLoadingHistory, setIsLoadingHistory] = useState(true);

  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isDesktopSidebarOpen, setIsDesktopSidebarOpen] = useState(true);

  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const currentChatId = useRef(crypto.randomUUID());
  const messagesEndRef = useRef<HTMLDivElement>(null);

  //musica de fundo
  const toggleMusic = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
        audioRef.current.volume = 0.1;
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

      <button
        onClick={toggleMusic}
        className="absolute top-4 right-4 z-50 p-2 text-green-600 hover:text-green-400 bg-black/80 border border-green-900/50 hover:border-green-400 backdrop-blur-sm transition-all cursor-pointer shadow-[0_0_10px_rgba(0,0,0,0.5)] active:scale-95 flex items-center gap-2"
        title="BGM Toggle"
      >
        {isPlaying ? (
          <>
            <span className="text-[10px] uppercase tracking-widest hidden md:inline animate-pulse">BGM_ON</span>
            <Volume2 size={20} />
          </>
        ) : (
          <>
            <span className="text-[10px] uppercase tracking-widest hidden md:inline text-green-900">BGM_OFF</span>
            <VolumeX size={20} className="text-green-900" />
          </>
        )}
      </button>

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