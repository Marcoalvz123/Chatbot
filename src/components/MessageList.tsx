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
  containerRef: React.RefObject<HTMLDivElement>;
}

const MessageList: React.FC<MessageListProps> = ({ messages, onLoadMore, containerRef }) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (containerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
      const isAtBottom = scrollHeight - scrollTop - clientHeight < 10;
      if (isAtBottom) {
        scrollToBottom();
      }
    }
  }, [messages, containerRef]);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, clientHeight, scrollHeight } = e.currentTarget;
    if (scrollTop < 10 && scrollHeight > clientHeight) {
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