import React, { useEffect, useRef, useState } from 'react';
import Message from './Message';

interface MessageData {
  id: string;
  content: string;
  timestamp: number;
  isBot: boolean;
}

interface MessageListProps {
  messages: MessageData[];
  onLoadMore: () => void;
}

const MessageList: React.FC<MessageListProps> = ({ messages, onLoadMore }) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isUserAtBottom, setIsUserAtBottom] = useState(true);

  // Función para hacer scroll hasta la parte inferior
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Controlar cuándo el usuario está en la parte inferior
  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, clientHeight, scrollHeight } = e.currentTarget;

    // Si el usuario llega a la parte superior, cargar más mensajes pero NO forzar el scroll hacia abajo
    if (scrollTop === 0) {
      onLoadMore();
    }

    // Determinar si el usuario está en la parte inferior (con un margen de 50px)
    setIsUserAtBottom(scrollHeight - (scrollTop + clientHeight) < 50);
  };

  // Si llega un nuevo mensaje y el usuario NO está explorando mensajes viejos, hacer scroll automáticamente al final
  useEffect(() => {
    if (isUserAtBottom) {
      scrollToBottom();
    }
  }, [messages, isUserAtBottom]); // ✅ Se agrega isUserAtBottom como dependencia

  return (
    <div
      ref={containerRef}
      onScroll={handleScroll}
      className="flex-1 overflow-y-auto p-4 bg-gray-50"
    >
      {messages.map((message) => (
        <Message
          key={message.id}
          content={message.content}
          timestamp={message.timestamp}
          isBot={message.isBot}
        />
      ))}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default MessageList;
