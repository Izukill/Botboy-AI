'use client';
import Image from 'next/image';
import { useState, useCallback } from 'react';

type Heart = {
  id: number;
  xOffset: number; //seta um offset para os corações não subirem todos em linha reta
};

export default function Mewo() {
  const [hearts, setHearts] = useState<Heart[]>([]);
  const [color, setColor] = useState(0);

  const handleClick = useCallback(() => {
    //toca o audio
    const audio = new Audio('/meowrgh.mp3');
    audio.volume = 0.03; 
    audio.play().catch((err) => console.log('Erro ao tocar áudio:', err));
    Math.random() < 0.5 ? setColor(0) : setColor(1); //muda a cor do coração aleatoriamente entre 2 opções

    const newHeart: Heart = {
      id: Date.now(),
      xOffset: Math.random() * 40 - 20,
    };

    setHearts((prev) => [...prev, newHeart]);

    setTimeout(() => {
      setHearts((prev) => prev.filter((h) => h.id !== newHeart.id));
    }, 1500);
  }, []);

  return (
    <div 
      className="relative flex-shrink-0 pb-1 cursor-pointer select-none group" 
      onClick={handleClick}
      title="Este é Mewo :3"
    >
      {/* mewo :3*/}
      <div className="opacity-80 group-hover:opacity-100 transition-opacity">
        <Image 
          src="/mewo.gif" 
          alt="gif de gatinho dormindo" 
          width={60} 
          height={40} 
          className="w-12 md:w-16 h-auto object-contain pointer-events-none" 
        />
      </div>

      {/* corações*/}
      {hearts.map((heart) => (
        <div
          key={heart.id}
          className="absolute text-pink-500 text-lg md:text-xl pointer-events-none"
          style={{
            left: `calc(50% + ${heart.xOffset}px - 10px)`,
            bottom: '100%',
            animation: 'floatUp 1.5s ease-out forwards',
          }}
        >
          {color === 0 ? '🩵' : '💚'}
        </div>
      ))}

      {/* animação de flutuação dos corações */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes floatUp {
          0% { transform: translateY(0) scale(0.5); opacity: 1; }
          50% { transform: translateY(-30px) scale(1.2); opacity: 1; }
          100% { transform: translateY(-60px) scale(1); opacity: 0; }
        }
      `}} />
    </div>
  );
}