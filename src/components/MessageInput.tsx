import React, { useState } from 'react';
import { Send, Smile } from 'lucide-react';
import EmojiPicker from './EmojiPicker';

interface MessageInputProps {
  onSendMessage: (message: string) => void;
}

const MessageInput: React.FC<MessageInputProps> = ({ onSendMessage }) => {
  const [message, setMessage] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      onSendMessage(message);
      setMessage('');
    }
  };

  const handleEmojiSelect = (emoji: string) => {
    setMessage((prev) => prev + emoji);
    setShowEmojiPicker(false);
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 p-4 bg-white">
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Escribe un mensaje..."
        className="flex-1 rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none max-w-full"
      />

      <button
        type="button"
        onClick={() => setShowEmojiPicker((prev) => !prev)}
        className="flex items-center justify-center rounded-lg bg-gray-200 px-2 py-2 text-gray-500 hover:bg-gray-300 max-w-[30px]"
      >
        <Smile className="h-5 w-5" />
      </button>

      <button
        type="submit"
        disabled={!message.trim()}
        className="flex items-center justify-center rounded-lg bg-blue-500 px-4 py-2 text-white transition-colors hover:bg-blue-600 disabled:bg-gray-300"
      >
        <Send className="h-5 w-5" />
      </button>

      {showEmojiPicker && <EmojiPicker onSelect={handleEmojiSelect} />}
    </form>
  );
};

export default MessageInput;
