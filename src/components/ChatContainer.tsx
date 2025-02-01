import React, { useEffect, useState } from 'react';
import localforage from 'localforage';
import MessageList from './MessageList';
import MessageInput from './MessageInput';

interface Message {
  id: string;
  content: string;
  timestamp: number;
  isBot: boolean;
}

const MESSAGES_PER_PAGE = 20;
const BOT_RESPONSES = [
  "Hola, soy un bot de prueba como puedo ayudarte.",
  "Eso suena interesante cuentame más",
  "Entiendo a que te refieres continua",
  "Dejame procesar tu mensaje...",
  "Muchas gracias por conversar conmigo.",
];

const getRandomEmojiResponse = (): string => {
  const emojiResponses = ['👍', '😊', '😂', '🙌', '🎉'];
  return emojiResponses[Math.floor(Math.random() * emojiResponses.length)];
};

const KEYWORDS = ["hola", "saludos", "buenos dias", "buenas", "buen dia"];

const ChatContainer: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [page, setPage] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showWaitMessage, setShowWaitMessage] = useState(false);

  useEffect(() => {
    loadMessages();
  }, []);

  const loadMessages = async () => {
    const storedMessages = await localforage.getItem<Message[]>('chatMessages');
    if (storedMessages) {
      setMessages(storedMessages.slice(-MESSAGES_PER_PAGE));
    }
  };

  const saveMessages = async (newMessages: Message[]) => {
    await localforage.setItem('chatMessages', newMessages);
  };

  const handleSendMessage = async (content: string) => {
    if (isProcessing) {
      setShowWaitMessage(true);
      return;
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      content,
      timestamp: Date.now(),
      isBot: false,
    };

    const emojiOnlyPattern = /^[\p{Emoji}\u200B]+$/gu;
    const isEmojiOnly = emojiOnlyPattern.test(content);

    let botMessage: Message;

    const containsKeyword = KEYWORDS.some(keyword => content.toLowerCase().includes(keyword));
    if (containsKeyword) {
      const processingMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: "...",
        timestamp: Date.now() + 1000,
        isBot: true,
      };

      const newMessages = [...messages, userMessage, processingMessage];
      setMessages(newMessages);
      saveMessages(newMessages);

      setIsProcessing(true);
      setTimeout(() => {
        botMessage = {
          id: (Date.now() + 2).toString(),
          content: "Hola, soy el chatbot de prueba",
          timestamp: Date.now() + 2000,
          isBot: true,
        };

        const updatedMessages = newMessages.filter((msg) => msg.id !== processingMessage.id);
        updatedMessages.push(botMessage);

        setMessages(updatedMessages);
        saveMessages(updatedMessages);
        setIsProcessing(false);
      }, Math.random() * (3000 - 1000) + 1000);

      return;
    }

    const processingMessage: Message = {
      id: (Date.now() + 1).toString(),
      content: "...",
      timestamp: Date.now() + 1000,
      isBot: true,
    };

    const newMessages = [...messages, userMessage, processingMessage];
    setMessages(newMessages);
    saveMessages(newMessages);

    setIsProcessing(true);
    setTimeout(() => {
      if (isEmojiOnly) {
        const randomEmojiResponse = getRandomEmojiResponse();
        botMessage = {
          id: (Date.now() + 2).toString(),
          content: randomEmojiResponse,
          timestamp: Date.now() + 2000,
          isBot: true,
        };
      } else {
        const randomResponse = BOT_RESPONSES[Math.floor(Math.random() * BOT_RESPONSES.length)];
        botMessage = {
          id: (Date.now() + 2).toString(),
          content: randomResponse,
          timestamp: Date.now() + 2000,
          isBot: true,
        };
      }

      const updatedMessages = newMessages.filter((msg) => msg.id !== processingMessage.id);
      updatedMessages.push(botMessage);

      setMessages(updatedMessages);
      saveMessages(updatedMessages);
      setIsProcessing(false);
    }, Math.random() * (3000 - 1000) + 1000);
  };

  const handleLoadMore = async () => {
    const storedMessages = await localforage.getItem<Message[]>('chatMessages');
    if (storedMessages) {
      const startIndex = Math.max(0, storedMessages.length - (page + 1) * MESSAGES_PER_PAGE);
      setMessages(storedMessages.slice(startIndex));
      setPage(page + 1);
    }
  };

  const handleCloseWaitMessage = () => {
    setShowWaitMessage(false);
  };

  const handleClearChat = () => {
    setMessages([]);
    saveMessages([]);
  };

  return (
    <div className="flex h-screen flex-col bg-white relative">
      <div className="border-b bg-white px-4 py-3 flex justify-between items-center">
        <h1 className="text-lg font-semibold text-center uppercase">ChatBot</h1>
        <button 
          className="bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600"
          onClick={handleClearChat}
        >
          Limpiar
        </button>
      </div>
      {showWaitMessage && (
        <div className="absolute inset-0 flex justify-center items-center bg-gray-900 bg-opacity-50 z-50">
          <div className="bg-gray-800 text-white p-6 rounded-md shadow-lg flex items-center space-x-4">
            <span>Por favor espera que el bot responda antes de enviar otro mensaje.</span>
            <button 
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md" 
              onClick={handleCloseWaitMessage}>
              OK
            </button>
          </div>
        </div>
      )}

      <MessageList messages={messages} onLoadMore={handleLoadMore} />
      <MessageInput onSendMessage={handleSendMessage} />
    </div>
  );
};

export default ChatContainer;
