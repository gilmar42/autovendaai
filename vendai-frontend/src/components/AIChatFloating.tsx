"use client";
import { useState, useRef, useEffect } from 'react';
import api from '@/services/api';

export default function AIChatFloating() {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [history, setHistory] = useState<{role: string, content: string}[]>([]);
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleToggle = () => setIsOpen(true);
    window.addEventListener('toggle-ai-chat', handleToggle);
    return () => window.removeEventListener('toggle-ai-chat', handleToggle);
  }, []);

  const inputRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  const handleSend = async () => {
    if (!message.trim()) return;
    
    const userMsg = { role: 'user', content: message };
    setHistory(prev => [...prev, userMsg]);
    setMessage('');
    setLoading(true);

    try {
      const res = await api.post('ai/chat', {
        message: message,
        history: history
      });
      setHistory(prev => [...prev, { role: 'assistant', content: res.data.response }]);
    } catch {
      setHistory(prev => [...prev, { role: 'assistant', content: "Desculpe, tive um problema técnico. Pode repetir?" }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-8 right-8 z-100">
      {!isOpen && (
        <button 
          onClick={() => setIsOpen(true)}
          className="btn-primary w-16 h-16 rounded-full shadow-2xl flex items-center justify-center text-3xl hover:scale-110 transition-transform active:scale-95"
        >
          🤖
        </button>
      )}

      {isOpen && (
        <div className="glass w-96 h-125 flex flex-col overflow-hidden shadow-2xl border-indigo-500/50 bg-[#0a0a0c]/90 backdrop-blur-2xl animate-in fade-in slide-in-from-bottom-6 duration-300">
          <div className="px-6 py-4 bg-white/5 flex justify-between items-center border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse"></div>
              <h4 className="font-bold">Assistente VendAI</h4>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-gray-500 hover:text-white transition-colors">✕</button>
          </div>

          <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-4">
            <div className="bg-white/5 p-4 rounded-2xl rounded-tl-none border border-white/5 text-sm">
              Olá! Sou o assistente da VendAI. Como posso ajudar com suas vendas hoje?
            </div>
            {history.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] p-4 rounded-2xl text-sm ${
                  msg.role === 'user' 
                  ? 'bg-indigo-600/20 border border-indigo-500/30 rounded-tr-none' 
                  : 'bg-white/5 border border-white/5 rounded-tl-none'
                }`}>
                  {msg.content}
                </div>
              </div>
            ))}
            {loading && <div className="text-xs text-gray-500 animate-pulse">Pensando...</div>}
          </div>

          <div className="p-4 bg-white/5 border-t border-white/10">
            <div className="flex gap-2">
              <input 
                ref={inputRef}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Pergunte qualquer coisa..."
                className="flex-1 bg-white/10 border border-white/10 rounded-xl px-4 py-2 text-sm focus:border-indigo-500 outline-none"
              />
              <button onClick={handleSend} className="btn-primary px-4">➤</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
