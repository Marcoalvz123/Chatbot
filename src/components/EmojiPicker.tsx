import React from 'react';

interface EmojiPickerProps {
  onSelect: (emoji: string) => void; // Función que se ejecuta cuando se selecciona un emoji
}

const EmojiPicker: React.FC<EmojiPickerProps> = ({ onSelect }) => {
  // Lista de emojis disponibles para seleccionar
  const emojis = ["😀", "😂", "😎", "😍", "😭", "😜", "🤖", "✨", "💥", "❤️"];

  return (
    // Contenedor principal con estilo grid para mostrar los emojis
    <div className="grid grid-cols-5 gap-2 p-2 bg-gray-100 rounded-lg shadow-md mx-auto max-w-[90%]">
      {/* Mapeo de cada emoji a un botón */}
      {emojis.map((emoji, index) => (
        <button
          key={index} // Asegura que cada botón tiene una clave única
          onClick={() => onSelect(emoji)} // Ejecuta la función onSelect pasando el emoji seleccionado
          className="text-2xl hover:bg-gray-200 p-2 rounded-lg" // Estilos del botón (tamaño de texto, color al pasar el cursor, padding, etc.)
        >
          {emoji} {/* Muestra el emoji dentro del botón */}
        </button>
      ))}
    </div>
  );
};

export default EmojiPicker;
