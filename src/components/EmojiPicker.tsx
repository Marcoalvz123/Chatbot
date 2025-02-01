import React from 'react';

// Definición de las propiedades que el componente recibirá
interface EmojiPickerProps {
  // Función que se llama cuando se selecciona un emoji, pasando el emoji como argumento
  onSelect: (emoji: string) => void;
}

// Componente funcional de React para mostrar un selector de emojis
const EmojiPicker: React.FC<EmojiPickerProps> = ({ onSelect }) => {
  // Lista de emojis disponibles para seleccionar
  const emojis = ["😀", "😂", "😎", "😍", "😭", "😜", "🤖", "✨", "💥", "❤️"];
  
  return (
    // Contenedor principal con diseño de rejilla (grid) para mostrar los emojis
    <div className="grid grid-cols-5 gap-2 p-2 bg-gray-100 rounded-lg shadow-md">
      {/* Mapear la lista de emojis y renderizarlos como botones */}
      {emojis.map((emoji, index) => (
        <button
          key={index} // Utilizar el índice como key única para cada botón (aunque sería mejor usar un ID único si estuviera disponible)
          onClick={() => onSelect(emoji)} // Llamar a la función onSelect con el emoji seleccionado al hacer clic
          className="text-2xl hover:bg-gray-200 p-2 rounded-lg" // Clases de estilo para el botón: tamaño del texto, efectos de hover, padding y bordes redondeados
        >
          {emoji} {/* Mostrar el emoji dentro del botón */}
        </button>
      ))}
    </div>
  );
};

export default EmojiPicker;
