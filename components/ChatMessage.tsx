
import React from 'react';
import { ChatMessage, MessageRole } from '../types';

interface ChatMessageProps {
  message: ChatMessage;
}

const ChatMessageComponent: React.FC<ChatMessageProps> = ({ message }) => {
  const isModel = message.role === MessageRole.MODEL;

  const wrapperClasses = `flex items-start gap-3 my-4 ${!isModel ? 'justify-end' : ''}`;
  const bubbleClasses = `p-4 rounded-2xl max-w-sm md:max-w-md lg:max-w-lg break-words ${
    isModel
      ? 'bg-white text-gray-800 rounded-tl-none shadow-md'
      : 'bg-blue-500 text-white rounded-br-none shadow-md'
  }`;

  const BotAvatar = () => (
    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center shadow-md">
      <span className="text-xl">🤖</span>
    </div>
  );

  const UserAvatar = () => (
    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-200 flex items-center justify-center shadow-md">
      <span className="text-xl">🧑‍🎓</span>
    </div>
  );
  
  // A simple markdown-like renderer for bold text
  const renderContent = (content: string) => {
    return content.split(/(\*\*.*?\*\*)/g).map((part, index) => {
        if (part.startsWith('**') && part.endsWith('**')) {
            return <strong key={index}>{part.slice(2, -2)}</strong>;
        }
        return part;
    });
  };

  return (
    <div className={wrapperClasses}>
      {isModel && <BotAvatar />}
      <div className={bubbleClasses}>
        <p className="text-base leading-relaxed whitespace-pre-wrap">{renderContent(message.content)}</p>
      </div>
      {!isModel && <UserAvatar />}
    </div>
  );
};

export default ChatMessageComponent;
