'use client';
import { useChat } from '@ai-sdk/react'
import Image from 'next/image';
import Mewo from './components/Mewo';
import { useState, useEffect, useRef } from 'react';
import { Send, User, Terminal, MessageSquare, Database, Menu, X } from 'lucide-react';

export default function Chat() {
  const [inputValue, setInputValue] = useState('');
  
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isDesktopSidebarOpen, setIsDesktopSidebarOpen] = useState(true);
  
  const { messages, sendMessage } = useChat();

  const messagesEndRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages?.length]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;
    sendMessage({ text: inputValue });
    setInputValue('');
  };

  return (
    <div className="flex h-screen w-full bg-black font-mono text-green-500 overflow-hidden relative">

      <div 
        className="absolute inset-0 z-[0] bg-[url('/lainwallpaper.jpg')] bg-cover bg-center bg-no-repeat opacity-3 pointer-events-none mix-blend-screen"
      />
      
      {isMobileSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/80 z-40 md:hidden backdrop-blur-sm"
          onClick={() => setIsMobileSidebarOpen(false)}
        />
      )}

      {/* sidebar */}
      <aside 
        className={`fixed inset-y-0 left-0 z-50 h-full bg-black/95 transition-all duration-300 ease-in-out overflow-hidden
        ${isMobileSidebarOpen ? 'translate-x-0 shadow-[4px_0_15px_rgba(0,255,0,0.02)]' : '-translate-x-full'} 
        w-72
        md:relative md:translate-x-0
        ${isDesktopSidebarOpen ? 'md:w-72 border-r border-green-800' : 'md:w-0 border-r-0'}
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
              {/* botão pra minimizar sidebar no desktop */}
              <button 
                className="hidden md:flex items-center justify-center text-green-600 hover:text-green-400 p-1 w-8 h-8 font-bold text-xl transition-colors cursor-pointer"
                onClick={() => setIsDesktopSidebarOpen(false)}
                title="Minimizar terminal"
              >
                _
              </button>
              
              {/* botão pra fechar sidebar no mobile */}
              <button 
                className="md:hidden text-green-600 hover:text-green-400 p-1 cursor-pointer"
                onClick={() => setIsMobileSidebarOpen(false)}
              >
                <X size={24} />
              </button>
            </div>
          </div>

          <div className="flex-1 space-y-6">
            <div>
              <h2 className="text-xs text-green-600 uppercase tracking-wider mb-3 flex items-center gap-2">
                <MessageSquare size={14} />
                Sessões
              </h2>
              <div className="text-sm text-green-800/60 p-2 border border-green-900/50 bg-green-950/10 border-dashed">
                [ Banco de dados vazio ]
              </div>
            </div>

            <div>
              <h2 className="text-xs text-green-600 uppercase tracking-wider mb-3 flex items-center gap-2">
                <Database size={14} />
                Contextos
              </h2>
              <div className="text-sm text-green-800/60 p-2 border border-green-900/50 bg-green-950/10 border-dashed">
                [ Nenhum vetor carregado ]
              </div>
            </div>            
          </div>

          <div className="mt-50 mb-3 pt-4 text-sm text-green-700 text-center hover:text-green-400 transition-colors">
            <a href="https://loretoportifolio.vercel.app/" target="_blank" rel="noopener noreferrer">
              <p>Sobre o Criador</p>
            </a>
          </div>
          <div className="mt-auto pt-4 border-t border-green-800 text-xs text-green-700 text-center">          
            <p>Acesso root autorizado.</p>
          </div>
        </div>
      </aside>

      <div className="flex-1 flex flex-col h-full relative overflow-hidden">
        
        <button
          onClick={() => {
            setIsMobileSidebarOpen(true);
            setIsDesktopSidebarOpen(true);
          }}
          className={`absolute top-4 left-4 z-30 p-2 text-green-600 hover:text-green-400 focus:outline-none bg-black/50 backdrop-blur-sm transition-opacity duration-300 cursor-pointer
            ${isDesktopSidebarOpen ? 'md:opacity-0 md:pointer-events-none' : 'opacity-100'}
          `}
          title="Abrir terminal"
        >
          <Menu size={24} />
        </button>

        {/* área do chat >:) */}    
        <main className="flex-1 overflow-y-auto p-4 pt-16 md:p-8 md:pt-16 w-full">
          <div className="w-full max-w-2xl mx-auto space-y-6 pb-32">
            
            {messages?.map((m) => (
              <div
                key={m.id}
                className={`flex items-start gap-3 md:gap-4 ${m.role === 'user' ? 'flex-row-reverse' : ''}`}
              >
                <div className={`p-2 border flex-shrink-0 ${
                  m.role === 'user'
                    ? 'border-green-400 bg-green-950/50 text-green-400'
                    : 'border-green-600 bg-black text-green-600'
                }`}>
                  {m.role === 'user' ? <User size={20} className="md:w-6 md:h-6" /> : <Terminal size={20} className="md:w-6 md:h-6" />}
                </div>

                <div
                  className={`p-3 md:p-5 border w-full overflow-hidden shadow-[0_0_10px_rgba(0,255,0,0.05)] ${
                    m.role === 'user'
                      ? 'bg-green-950/30 border-green-400 text-green-300'
                      : 'bg-black border-green-700 text-green-500'
                  }`}
                >
                  <div className="text-xs opacity-50 mb-2 md:mb-3 select-none border-b border-green-900 pb-1">
                    {m.role === 'user' ? 'user@botboy:~$' : 'root@botboy:~# /bin/bash'}
                  </div>

                  <div className="text-base md:text-lg leading-relaxed">
                    {m.parts.map((part, i) =>
                      part.type === 'text' ? (
                        <span key={i} className="break-words whitespace-pre-wrap">
                          {part.text}
                        </span>
                      ) : null
                    )}
                  </div>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        </main>

        {/* inputs */}
        <div className="absolute bottom-0 w-full p-4 md:p-8 bg-gradient-to-t from-black via-black/90 to-transparent pointer-events-none flex justify-center z-20">
          
          {/* 1. Wrapper flex que segura o form e o gif juntos no mesmo limite de largura (max-w-2xl) */}
          <div className="w-full max-w-2xl flex items-end gap-2 md:gap-3 pointer-events-auto">
            
            {/* 2. Adicionado 'flex-grow' para o formulário ocupar todo o espaço possível */}
            <form
              onSubmit={handleSubmit}
              className="flex-grow flex gap-2 bg-black shadow-[0_-10px_20px_rgba(0,0,0,0.8)]"
            >
              <div className="relative flex-grow flex items-center">
                <span className="absolute left-3 md:left-4 text-green-700 font-bold select-none animate-pulse md:text-lg">
                  &gt;
                </span>
                <input
                  className="w-full pl-8 md:pl-10 p-3 md:p-4 bg-black border border-green-600 text-green-400 placeholder-green-900 outline-none focus:border-green-400 focus:shadow-[0_0_12px_rgba(34,197,94,0.3)] transition-all md:text-lg"
                  value={inputValue}
                  placeholder="Inserir comando..."
                  onChange={(e) => setInputValue(e.target.value)}
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
    </div>
  );
}