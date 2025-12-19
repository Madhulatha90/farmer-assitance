
import React, { useEffect, useRef } from 'react';
import { Message } from '../types';

interface ChatWindowProps {
  messages: Message[];
  isLoading: boolean;
}

const ChatWindow: React.FC<ChatWindowProps> = ({ messages, isLoading }) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const formatText = (text: string) => {
    return text.split('\n').map((line, i) => {
      if (line.trim().startsWith('🌱') || 
          line.trim().startsWith('📌') || 
          line.trim().startsWith('🔍') || 
          line.trim().startsWith('✅') || 
          line.trim().startsWith('🌿') || 
          line.trim().startsWith('🛡️') || 
          line.trim().startsWith('☎️')) {
        return <div key={i} className="font-bold text-green-800 mt-2 mb-1">{line}</div>;
      }
      return <p key={i} className="mb-1 leading-relaxed">{line}</p>;
    });
  };

  if (messages.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-gray-500">
        <div className="bg-green-50 p-6 rounded-full mb-4">
          <i className="fas fa-robot text-5xl text-green-600"></i>
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Namaste! I am your Agri-Expert.</h2>
        <p className="max-w-md">Ask me about your crops, pests, fertilizers, or the weather. You can type in English, Hindi, or Telugu.</p>
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-3 w-full max-w-lg">
          <div className="p-3 bg-white border border-gray-200 rounded-lg text-sm italic">
            "My tomato leaves are turning yellow. What should I do?"
          </div>
          <div className="p-3 bg-white border border-gray-200 rounded-lg text-sm italic">
            "Best fertilizer for paddy field in first 30 days?"
          </div>
        </div>
      </div>
    );
  }

  return (
    <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 scroll-smooth">
      {messages.map((msg) => (
        <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
          <div className={`max-w-[85%] rounded-2xl p-4 shadow-sm ${
            msg.role === 'user' 
              ? 'bg-green-600 text-white rounded-tr-none' 
              : 'bg-white text-gray-800 border border-gray-200 rounded-tl-none'
          }`}>
            {msg.image && (
              <img src={msg.image} alt="Crop issue" className="w-full max-h-60 object-cover rounded-lg mb-2 shadow-inner" />
            )}
            <div className="message-content text-sm md:text-base">
              {formatText(msg.text)}
            </div>
            <div className={`text-[10px] mt-2 opacity-60 ${msg.role === 'user' ? 'text-right' : 'text-left'}`}>
              {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </div>
          </div>
        </div>
      ))}
      {isLoading && (
        <div className="flex justify-start">
          <div className="bg-white border border-gray-200 rounded-2xl rounded-tl-none p-4 flex gap-2 items-center">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce delay-100"></div>
            <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce delay-200"></div>
            <span className="text-xs text-gray-400 font-medium ml-1">Analyzing...</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatWindow;
