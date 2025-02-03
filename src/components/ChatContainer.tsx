import React, { useEffect, useRef, useState } from 'react';
import localforage from 'localforage'; 
import MessageList from './MessageList'; 
import MessageInput from './MessageInput'; 

interface Message {
  id: string;
  content: string;
  timestamp: number;
  isBot: boolean;
}


const MESSAGES_PER_PAGE = 15; 
const BOT_RESPONSES = [
  "Veré como puedo ayudarte.",
  "Eso suena interesante, ¡Cuentame más!",
  "Entiendo, ¿Podrías darme más detalles?",
  "Me gusta lo que oigo, ¡Dime más!",
  "¡Cuentame más!",
  "¡Gracias por conversar conmigo!",
];

const GREETING_RESPONSES = [
  "¡Hola! ¿Cómo estás?👋",
  "¡Hola! ¿En qué puedo ayudarte hoy?👀",
  "¡Buenos días! ¿Cómo te va?😊",
];

const EMPATHY_RESPONSES = [
  "¡Ya veo! ¿Hay algo que pueda hacer para ayudarte?",
  "¡Te comprendo! Dime, ¿Como puedo ayudarte?",
  "¡Vaya! Espero serte de ayuda",
];

const FUN_RESPONSES = [
  "¿Sabías que los delfines son súper inteligentes? 🐬",
  "¡Estuve pensando en un chiste! ¿Por qué el libro de matemáticas está triste? Porque tenía demasiados problemas! 😄",
  "¡A veces sólo hace falta reír para sentirte mejor! 😂",
];

const KEYWORDS_GREETING = ["hola", "saludos", "buenos días", "buenas", "buen día", "hello", "hi", "mucho gusto"];
const KEYWORDS_EMPATHY = ["triste", "enojado", "deprimido", "mal", "feliz", "entusiasmado"];
const KEYWORDS_FUN = ["chiste", "diversión", "joke", "risa", "payaso", "divertido"];


const getRandomEmojiResponse = (): string => {
  const emojiResponses = ['👍', '😊', '😂', '🙌', '🎉'];
  return emojiResponses[Math.floor(Math.random() * emojiResponses.length)];
};

const ChatContainer: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [page, setPage] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showWaitMessage, setShowWaitMessage] = useState(false);


  const chatContainerRef = useRef<HTMLDivElement>(null);

  
  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  };

  
  useEffect(() => {
    loadMessages();
  }, []);

  
  useEffect(() => {
    
    if (page === 1 && messages.length > 0) {
      setTimeout(() => {
        scrollToBottom();
      }, 0);
    }
  }, [messages, page]);

  
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

    let botMessage: Message;
    const lowerContent = content.toLowerCase();
    const containsGreeting = KEYWORDS_GREETING.some(keyword => lowerContent.includes(keyword));
    const containsEmpathy = KEYWORDS_EMPATHY.some(keyword => lowerContent.includes(keyword));
    const containsFun = KEYWORDS_FUN.some(keyword => lowerContent.includes(keyword));

    
    const addProcessingMessage = (): Message => {
      return {
        id: (Date.now() + 1).toString(),
        content: "...",
        timestamp: Date.now() + 1000,
        isBot: true,
      };
    };

    if (containsGreeting) {
      const processingMessage = addProcessingMessage();
      const newMessages = [...messages, userMessage, processingMessage];
      setMessages(newMessages);
      saveMessages(newMessages);
      setIsProcessing(true);

      
      setTimeout(() => {
        scrollToBottom();
      }, 0);

      setTimeout(() => {
        botMessage = {
          id: (Date.now() + 2).toString(),
          content: GREETING_RESPONSES[Math.floor(Math.random() * GREETING_RESPONSES.length)],
          timestamp: Date.now() + 2000,
          isBot: true,
        };

        const updatedMessages = newMessages.filter((msg) => msg.id !== processingMessage.id);
        updatedMessages.push(botMessage);
        setMessages(updatedMessages);
        saveMessages(updatedMessages);
        setIsProcessing(false);

        
        setTimeout(() => {
          scrollToBottom();
        }, 0);
      }, Math.random() * (3000 - 1000) + 1000);
      return;
    }

    if (containsEmpathy) {
      const processingMessage = addProcessingMessage();
      const newMessages = [...messages, userMessage, processingMessage];
      setMessages(newMessages);
      saveMessages(newMessages);
      setIsProcessing(true);

      setTimeout(() => {
        scrollToBottom();
      }, 0);

      setTimeout(() => {
        botMessage = {
          id: (Date.now() + 2).toString(),
          content: EMPATHY_RESPONSES[Math.floor(Math.random() * EMPATHY_RESPONSES.length)],
          timestamp: Date.now() + 2000,
          isBot: true,
        };

        const updatedMessages = newMessages.filter((msg) => msg.id !== processingMessage.id);
        updatedMessages.push(botMessage);
        setMessages(updatedMessages);
        saveMessages(updatedMessages);
        setIsProcessing(false);

        setTimeout(() => {
          scrollToBottom();
        }, 0);
      }, Math.random() * (3000 - 1000) + 1000);
      return;
    }

    if (containsFun) {
      const processingMessage = addProcessingMessage();
      const newMessages = [...messages, userMessage, processingMessage];
      setMessages(newMessages);
      saveMessages(newMessages);
      setIsProcessing(true);

      setTimeout(() => {
        scrollToBottom();
      }, 0);

      setTimeout(() => {
        botMessage = {
          id: (Date.now() + 2).toString(),
          content: FUN_RESPONSES[Math.floor(Math.random() * FUN_RESPONSES.length)],
          timestamp: Date.now() + 2000,
          isBot: true,
        };

        const updatedMessages = newMessages.filter((msg) => msg.id !== processingMessage.id);
        updatedMessages.push(botMessage);
        setMessages(updatedMessages);
        saveMessages(updatedMessages);
        setIsProcessing(false);

        setTimeout(() => {
          scrollToBottom();
        }, 0);
      }, Math.random() * (3000 - 1000) + 1000);
      return;
    }

    const processingMessage = addProcessingMessage();
    const newMessages = [...messages, userMessage, processingMessage];
    setMessages(newMessages);
    saveMessages(newMessages);
    setIsProcessing(true);

    setTimeout(() => {
      scrollToBottom();
    }, 0);

    setTimeout(() => {
      
      const emojiOnlyPattern = /^[\p{Emoji}\u200B]+$/gu;
      if (emojiOnlyPattern.test(content)) {
        botMessage = {
          id: (Date.now() + 2).toString(),
          content: getRandomEmojiResponse(),
          timestamp: Date.now() + 2000,
          isBot: true,
        };
      } else {
        botMessage = {
          id: (Date.now() + 2).toString(),
          content: BOT_RESPONSES[Math.floor(Math.random() * BOT_RESPONSES.length)],
          timestamp: Date.now() + 2000,
          isBot: true,
        };
      }

      const updatedMessages = newMessages.filter((msg) => msg.id !== processingMessage.id);
      updatedMessages.push(botMessage);
      setMessages(updatedMessages);
      saveMessages(updatedMessages);
      setIsProcessing(false);

      setTimeout(() => {
        scrollToBottom();
      }, 0);
    }, Math.random() * (3000 - 1000) + 1000);
  };

  
  const handleLoadMore = async () => {
    
    const container = chatContainerRef.current;
    if (!container) return;

    
    const previousScrollHeight = container.scrollHeight;

    const storedMessages = await localforage.getItem<Message[]>('chatMessages');
    if (storedMessages) {
      const startIndex = Math.max(
        0,
        storedMessages.length - (page + 1) * MESSAGES_PER_PAGE
      );
      
      setMessages(storedMessages.slice(startIndex));
      setPage(prevPage => prevPage + 1);

      
      setTimeout(() => {
        const newScrollHeight = container.scrollHeight;
        container.scrollTop = newScrollHeight - previousScrollHeight;
      }, 0);
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
            <span>Por favor espera la respuesta del bot antes de enviar otro mensaje.</span>
            <button 
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md" 
              onClick={handleCloseWaitMessage}
            >
              OK
            </button>
          </div>
        </div>
      )}

      <MessageList
        messages={messages}
        onLoadMore={handleLoadMore}
        containerRef={chatContainerRef}
      />

      <MessageInput onSendMessage={handleSendMessage} />
    </div>
  );
};

export default ChatContainer;