
import React, { useRef, useEffect, useState } from 'react';
import { Message, GenerationStatus } from '../types';

interface ChatWindowProps {
  messages: Message[];
  status: GenerationStatus;
  onSendMessage: (text: string) => void;
  onImageClick: (url: string) => void;
}

const ChatWindow: React.FC<ChatWindowProps> = ({ messages, status, onSendMessage, onImageClick }) => {
  const [inputText, setInputText] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, status]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputText.trim() && status === GenerationStatus.IDLE) {
      onSendMessage(inputText);
      setInputText('');
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-slate-900 to-slate-950">
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-4 md:p-8 space-y-6"
      >
        {messages.map((msg) => (
          <div 
            key={msg.id} 
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`max-w-[85%] md:max-w-[70%] ${msg.role === 'user' ? 'order-2' : ''}`}>
              <div className={`p-4 rounded-2xl shadow-xl ${
                msg.role === 'user' 
                  ? 'bg-blue-600 text-white rounded-tr-none' 
                  : 'bg-slate-800 text-slate-100 border border-slate-700 rounded-tl-none'
              }`}>
                {msg.role === 'assistant' && (
                  <p className="text-[10px] font-bold text-blue-400 uppercase tracking-widest mb-1">Captain Block</p>
                )}
                <p className="text-sm md:text-base leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                
                {msg.imageUrl && (
                  <div className="mt-4 flex flex-col gap-2">
                    {msg.shipName && (
                      <div className="bg-slate-900/50 px-3 py-1.5 rounded-lg border border-slate-700/50 flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                        <span className="text-xs font-bold text-white uppercase tracking-tighter roblox-font">{msg.shipName}</span>
                      </div>
                    )}
                    <div 
                      onClick={() => onImageClick(msg.imageUrl!)}
                      className="rounded-xl overflow-hidden border-2 border-slate-700/50 cursor-pointer hover:border-blue-400 transition-all group"
                    >
                      <img src={msg.imageUrl} alt={msg.shipName || "Generated Ship"} className="w-full h-auto group-hover:scale-105 transition-transform duration-500" />
                    </div>
                  </div>
                )}
              </div>
              <p className={`text-[10px] mt-1 text-slate-500 ${msg.role === 'user' ? 'text-right' : 'text-left'}`}>
                {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          </div>
        ))}

        {status !== GenerationStatus.IDLE && (
          <div className="flex justify-start">
            <div className="bg-slate-800 border border-slate-700 p-4 rounded-2xl rounded-tl-none shadow-lg">
              <div className="flex items-center gap-3">
                <div className="flex gap-1">
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce"></div>
                </div>
                <span className="text-xs font-medium text-slate-400 uppercase tracking-widest">
                  {status === GenerationStatus.THINKING ? 'Captain is thinking...' : 'Rendering Model...'}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="p-4 md:p-6 bg-slate-900/50 backdrop-blur-xl border-t border-slate-800">
        <form onSubmit={handleSubmit} className="max-w-4xl mx-auto flex gap-3">
          <input 
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            disabled={status !== GenerationStatus.IDLE}
            placeholder="Type your design ideas... e.g. 'Build a futuristic neon cruise ship'"
            className="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-5 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all disabled:opacity-50"
          />
          <button 
            type="submit"
            disabled={status !== GenerationStatus.IDLE || !inputText.trim()}
            className="bg-blue-600 hover:bg-blue-500 disabled:bg-slate-700 text-white font-bold py-3 px-6 rounded-xl transition-all shadow-lg shadow-blue-900/20 active:scale-95 flex items-center gap-2"
          >
            <span className="hidden sm:inline roblox-font">Deploy</span>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 5l7 7-7 7M5 5l7 7-7 7" /></svg>
          </button>
        </form>
        <div className="mt-3 text-center">
          <p className="text-[10px] text-slate-500 uppercase tracking-widest">Tip: Mention "Generate" to see your design come to life</p>
        </div>
      </div>
    </div>
  );
};

export default ChatWindow;
