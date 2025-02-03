import React from 'react';
import { format } from 'date-fns';
import { Bot, User } from 'lucide-react';

interface MessageProps {
  content: string;
  timestamp: number;
  isBot: boolean;
}

const Message: React.FC<MessageProps> = ({ content, timestamp, isBot }) => {
  return (
    
    <div className={`flex gap-3 ${isBot ? '' : 'flex-row-reverse'} mb-4`}>
      <div className={`flex h-8 w-8 shrink-0 select-none items-center justify-center rounded-full ${isBot ? 'bg-blue-500' : 'bg-gray-200'}`}>
        {isBot ? <Bot className="h-5 w-5 text-white" /> : <User className="h-5 w-5 text-gray-500" />}
      </div>

      <div className={`flex max-w-[80%] flex-col ${isBot ? '' : 'items-end'}`}>
        <div className={`rounded-lg px-4 py-2 ${isBot ? 'bg-gray-100' : 'bg-blue-500 text-white'}`}>
          <p className="text-sm">{content}</p>
        </div>
        
        <span className="mt-1 text-xs text-gray-500">
          {format(timestamp, 'HH:mm')}
        </span>
      </div>
    </div>
  );
};

export default Message;
