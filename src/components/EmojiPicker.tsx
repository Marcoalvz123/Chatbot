import React from 'react';

interface EmojiPickerProps {
  onSelect: (emoji: string) => void; 
}

const EmojiPicker: React.FC<EmojiPickerProps> = ({ onSelect }) => {
  
  const emojis = ["😀", "😂", "😎", "😍", "😭", "😜", "🤖", "✨", "💥", "❤️"];

  return (
    
    <div className="grid grid-cols-5 gap-2 p-2 bg-gray-100 rounded-lg shadow-md mx-auto max-w-[90%]">
      
      {emojis.map((emoji, index) => (
        <button
          key={index} 
          onClick={() => onSelect(emoji)} 
          className="text-2xl hover:bg-gray-200 p-2 rounded-lg" 
        >
          {emoji}
        </button>
      ))}
    </div>
  );
};

export default EmojiPicker;
