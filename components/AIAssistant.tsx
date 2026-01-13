import React, { useState, useRef, useEffect } from 'react';
import { sendChatMessage } from '../services/geminiService';
import { ChatMessage } from '../types';
import { Button } from './Button';

export const AIAssistant: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<'pro' | 'fast' | 'search' | 'maps'>('pro');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: input
    };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      let location;
      if (mode === 'maps') {
         // Try to get location
         try {
           const pos = await new Promise<GeolocationPosition>((resolve, reject) => {
             navigator.geolocation.getCurrentPosition(resolve, reject);
           });
           location = {
             lat: pos.coords.latitude,
             lng: pos.coords.longitude
           };
         } catch (e) {
           console.warn("Location permission denied or unavailable", e);
         }
      }

      const response = await sendChatMessage(userMsg.text, mode, location);
      
      const modelMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: response.text,
        groundingMetadata: response.groundingMetadata
      };
      setMessages(prev => [...prev, modelMsg]);
    } catch (error) {
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        role: 'model',
        text: 'Sorry, I encountered an error. Please try again.',
        isError: true
      }]);
    } finally {
      setLoading(false);
    }
  };

  const renderGrounding = (metadata: any) => {
    if (!metadata?.groundingChunks) return null;
    
    // Simplification for rendering links
    const chunks = metadata.groundingChunks;
    const webLinks = chunks.flatMap((c: any) => c.web ? [c.web] : []);
    const mapLinks = chunks.flatMap((c: any) => c.maps ? [c.maps] : []);

    if (webLinks.length === 0 && mapLinks.length === 0) return null;

    return (
      <div className="mt-2 pt-2 border-t border-gray-200 text-xs">
        <p className="font-semibold text-gray-500 mb-1">Sources:</p>
        <div className="flex flex-wrap gap-2">
          {webLinks.map((link: any, idx: number) => (
             <a key={idx} href={link.uri} target="_blank" rel="noopener noreferrer" className="bg-blue-50 text-blue-600 px-2 py-1 rounded hover:underline truncate max-w-full block">
               {link.title || link.uri}
             </a>
          ))}
          {mapLinks.map((link: any, idx: number) => (
             <a key={idx} href={link.uri} target="_blank" rel="noopener noreferrer" className="bg-green-50 text-green-600 px-2 py-1 rounded hover:underline block">
               <i className="fas fa-map-marker-alt mr-1"></i>{link.title}
             </a>
          ))}
        </div>
      </div>
    );
  };

  return (
    <>
      {/* Floating Action Button */}
      <button 
        onClick={() => setIsOpen(true)}
        className="fixed bottom-24 right-4 w-12 h-12 bg-gradient-to-tr from-[#FFD54F] to-[#F57F17] text-white rounded-2xl shadow-lg flex items-center justify-center z-40 active:scale-90 transition-transform border-2 border-white"
      >
        <i className="fas fa-sparkles text-xl"></i>
      </button>

      {/* Full Screen / Bottom Sheet Chat UI */}
      {isOpen && (
        <div className="fixed inset-0 z-50 bg-[#FFFBEB] flex flex-col sm:max-w-md sm:mx-auto sm:border-x sm:border-[#FFECB3] animate-in slide-in-from-bottom duration-300">
          
          {/* Header */}
          <div className="bg-[#FFD54F] p-4 flex justify-between items-center shadow-sm">
            <h2 className="font-bold text-[#5D4037] flex items-center gap-2">
              <i className="fas fa-robot text-white"></i> AI 助手
            </h2>
            <button onClick={() => setIsOpen(false)} className="w-8 h-8 bg-white/30 rounded-full flex items-center justify-center hover:bg-white/50 transition-colors">
              <i className="fas fa-chevron-down text-[#5D4037]"></i>
            </button>
          </div>

          {/* Mode Selector */}
          <div className="p-2 bg-white border-b border-[#FFECB3] overflow-x-auto whitespace-nowrap no-scrollbar flex gap-2">
            {[
              { id: 'pro', label: '智能 (Pro)', icon: 'fa-brain' },
              { id: 'fast', label: '极速 (Fast)', icon: 'fa-bolt' },
              { id: 'search', label: '搜索 (Search)', icon: 'fa-search' },
              { id: 'maps', label: '地图 (Maps)', icon: 'fa-map' },
            ].map((m) => (
              <button
                key={m.id}
                onClick={() => setMode(m.id as any)}
                className={`px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1 border transition-colors ${
                  mode === m.id 
                    ? 'bg-[#FFD54F]/20 border-[#FFD54F] text-[#F57F17]' 
                    : 'bg-gray-50 border-gray-200 text-gray-500 hover:bg-gray-100'
                }`}
              >
                <i className={`fas ${m.icon}`}></i> {m.label}
              </button>
            ))}
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 bg-[#FFF8E1] space-y-4">
            {messages.length === 0 && (
              <div className="text-center text-[#8D6E63]/50 mt-12">
                <div className="w-16 h-16 bg-[#FFE0B2] rounded-full flex items-center justify-center mx-auto mb-3">
                   <i className="fas fa-comments text-2xl text-[#FFB74D]"></i>
                </div>
                <p>你好呀！有什么可以帮你的吗？</p>
              </div>
            )}
            {messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] rounded-2xl px-4 py-3 shadow-sm text-sm ${
                  msg.role === 'user' 
                    ? 'bg-[#FFD54F] text-[#5D4037] rounded-br-none' 
                    : 'bg-white text-gray-800 rounded-bl-none border border-[#FFECB3]'
                }`}>
                  <div className="whitespace-pre-wrap">{msg.text}</div>
                  {msg.groundingMetadata && renderGrounding(msg.groundingMetadata)}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-white rounded-2xl px-4 py-3 shadow-sm border border-[#FFECB3] rounded-bl-none flex gap-1">
                  <div className="w-2 h-2 bg-[#FFD54F] rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-[#FFD54F] rounded-full animate-bounce delay-75"></div>
                  <div className="w-2 h-2 bg-[#FFD54F] rounded-full animate-bounce delay-150"></div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-3 bg-white border-t border-[#FFECB3]">
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                placeholder="输入消息..."
                className="flex-1 bg-[#F9FAFB] border border-gray-100 rounded-2xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#FFD54F] focus:border-transparent transition-all"
              />
              <button 
                onClick={handleSend}
                disabled={loading || !input.trim()}
                className="w-10 h-10 rounded-xl bg-[#FFD54F] text-[#5D4037] flex items-center justify-center disabled:opacity-50 shadow-sm active:scale-95 hover:bg-[#FFC107] transition-colors"
              >
                <i className="fas fa-paper-plane"></i>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};