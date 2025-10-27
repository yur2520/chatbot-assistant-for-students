
import React, { useState, useEffect, useRef } from 'react';
import { GenerateContentResponse } from '@google/genai';
import { chat } from './services/geminiService';
import { ChatMessage, MessageRole } from './types';
import ChatMessageComponent from './components/ChatMessage';
import ChatInput from './components/ChatInput';

const App: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Scroll to the bottom whenever messages change
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);
  
  useEffect(() => {
    // Initiate conversation with the initial greeting from the model
    const startConversation = async () => {
        try {
            const initialPrompt = "Please provide your initial greeting as defined in your system instructions.";
            const stream = await chat.sendMessageStream({ message: initialPrompt });

            let responseText = '';
            setMessages([{ role: MessageRole.MODEL, content: '' }]);

            for await (const chunk of stream) {
                const chunkText = chunk.text;
                responseText += chunkText;
                setMessages([{ role: MessageRole.MODEL, content: responseText }]);
            }

        } catch (error) {
            console.error("Failed to start conversation:", error);
            setMessages([{ role: MessageRole.MODEL, content: "앗, 뭔가 문제가 생겼어요! 잠시 후 다시 시도해주세요." }]);
        } finally {
            setIsLoading(false);
        }
    };
    
    startConversation();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSendMessage = async (userInput: string) => {
    setIsLoading(true);
    const userMessage: ChatMessage = { role: MessageRole.USER, content: userInput };
    const updatedMessages: ChatMessage[] = [...messages, userMessage, { role: MessageRole.MODEL, content: '' }];
    setMessages(updatedMessages);

    try {
      const stream = await chat.sendMessageStream({ message: userInput });
      let responseText = '';

      for await (const chunk of stream) {
        const chunkText = chunk.text;
        responseText += chunkText;
        setMessages(prevMessages => {
            const newMessages = [...prevMessages];
            newMessages[newMessages.length - 1].content = responseText;
            return newMessages;
        });
      }
    } catch (error) {
      console.error("Error sending message:", error);
      setMessages(prevMessages => {
        const newMessages = [...prevMessages];
        newMessages[newMessages.length - 1].content = "미안해요, 답변을 생성하는 중에 오류가 발생했어요. 다시 질문해줄래요?";
        return newMessages;
      });
    } finally {
      setIsLoading(false);
    }
  };

  const TypingIndicator = () => (
    <div className="flex items-start gap-3 my-4">
        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center shadow-md">
            <span className="text-xl">🤖</span>
        </div>
        <div className="p-4 rounded-2xl rounded-tl-none bg-white text-gray-800 shadow-md">
            <div className="flex items-center justify-center space-x-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
            </div>
        </div>
    </div>
  );

  return (
    <div className="flex flex-col h-screen font-sans bg-gradient-to-b from-blue-100 to-yellow-50">
        <header className="bg-white/80 backdrop-blur-sm p-4 text-center border-b border-gray-200 shadow-sm">
            <h1 className="text-2xl font-bold text-blue-600">
                ✨ 자료 조사 도우미 챗봇 ✨
            </h1>
        </header>

        <main ref={chatContainerRef} className="flex-1 overflow-y-auto p-4 md:p-6">
            <div className="max-w-4xl mx-auto">
                {messages.map((msg, index) => (
                    <ChatMessageComponent key={index} message={msg} />
                ))}
                {isLoading && <TypingIndicator />}
            </div>
        </main>
        
        <footer className="sticky bottom-0">
            <ChatInput onSendMessage={handleSendMessage} isLoading={isLoading} />
        </footer>
    </div>
  );
};

export default App;
