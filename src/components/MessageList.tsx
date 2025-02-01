import React, { useEffect, useRef } from 'react';
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

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, clientHeight, scrollHeight } = e.currentTarget;
    if (scrollTop === 0 && scrollHeight > clientHeight) {
      onLoadMore();
    }
  };

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
