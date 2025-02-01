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
  const [isAtBottom, setIsAtBottom] = useState(true);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isAtBottom) {
      scrollToBottom();
    }
  }, [messages, isAtBottom]);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;

    // Si el usuario ha subido, no hacemos scroll automático
    if (scrollTop + clientHeight >= scrollHeight - 5) {
      setIsAtBottom(true);
    } else {
      setIsAtBottom(false);
    }

    // Cargar más mensajes si el usuario llega al inicio
    if (scrollTop === 0 && scrollHeight > clientHeight) {
      onLoadMore();
    }
  };

  return (
    <div
      ref={containerRef}
      onScroll={handleScroll}
      className="flex-1 overflow-y-auto p-4"
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
