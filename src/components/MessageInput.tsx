import React, { useState } from 'react';
import { Send, Smile } from 'lucide-react';
import EmojiPicker from './EmojiPicker';  // Importamos el componente del teclado de emojis

// Definición de las propiedades que el componente recibirá
interface MessageInputProps {
  // La función que se llamará al enviar un mensaje
  onSendMessage: (message: string) => void;
}

const MessageInput: React.FC<MessageInputProps> = ({ onSendMessage }) => {
  const [message, setMessage] = useState('');  // Estado para manejar el contenido del mensaje
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);  // Estado para mostrar el teclado de emojis

  // Función para manejar el envío del mensaje
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();  // Prevenir el comportamiento predeterminado del formulario
    if (message.trim()) {  // Solo enviar el mensaje si no está vacío
      onSendMessage(message);  // Llamar a la función que se pasa como propiedad para enviar el mensaje
      setMessage('');  // Limpiar el campo de texto después de enviar el mensaje
    }
  };

  // Función para manejar la selección de un emoji
  const handleEmojiSelect = (emoji: string) => {
    setMessage(prev => prev + emoji);  // Añadir el emoji al mensaje
    setShowEmojiPicker(false);  // Ocultar el teclado de emojis después de seleccionar uno
  };

  return (
    <div className="relative">
      <form onSubmit={handleSubmit} className="flex gap-2 border-t p-4 bg-white">
        {/* Campo de texto para escribir el mensaje */}
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}  // Actualizar el estado del mensaje a medida que el usuario escribe
          placeholder="Escribe un mensaje..."
          className="flex-1 rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none"
        />

        {/* Botón para mostrar/ocultar el teclado de emojis */}
        <button
          type="button"
          onClick={() => setShowEmojiPicker(prev => !prev)}  // Alterna la visibilidad del teclado de emojis
          className="flex items-center justify-center rounded-lg bg-gray-200 px-2 py-2 text-gray-500 hover:bg-gray-300"
        >
          <Smile className="h-5 w-5" />  {/* Icono de la carita sonriente para representar el emoji */}
        </button>

        {/* Botón para enviar el mensaje */}
        <button
          type="submit"
          disabled={!message.trim()}  // Deshabilitar el botón si el campo de mensaje está vacío
          className="flex items-center justify-center rounded-lg bg-blue-500 px-4 py-2 text-white transition-colors hover:bg-blue-600 disabled:bg-gray-300"
        >
          <Send className="h-5 w-5" />  {/* Icono de enviar (avión de papel) */}
        </button>
      </form>

      {/* Condición para mostrar el teclado de emojis solo si el estado 'showEmojiPicker' es verdadero */}
      {showEmojiPicker && (
        <div className="absolute bottom-16 left-0 w-full z-10">
          <EmojiPicker onSelect={handleEmojiSelect} />  {/* Mostramos el teclado de emojis y pasamos la función para manejar la selección */}
        </div>
      )}
    </div>
  );
};

export default MessageInput;
