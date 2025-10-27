
import React, { useState } from 'react';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  isLoading: boolean;
}

const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage, isLoading }) => {
  const [input, setInput] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !isLoading) {
      onSendMessage(input.trim());
      setInput('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e as unknown as React.FormEvent);
    }
  };

  return (
    <div className="bg-white/80 backdrop-blur-sm p-4 border-t border-gray-200">
      <form onSubmit={handleSubmit} className="max-w-4xl mx-auto flex items-center gap-3">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="여기에 궁금한 것을 물어보세요..."
          className="flex-1 p-3 border border-gray-300 rounded-xl resize-none focus:ring-2 focus:ring-blue-500 focus:outline-none transition-shadow duration-200 disabled:bg-gray-100"
          rows={1}
          disabled={isLoading}
        />
        <button
          type="submit"
          disabled={isLoading || !input.trim()}
          className="w-12 h-12 bg-blue-500 text-white rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-200 ease-in-out hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed transform hover:scale-105 disabled:scale-100"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
            <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
          </svg>
        </button>
      </form>
    </div>
  );
};

export default ChatInput;
