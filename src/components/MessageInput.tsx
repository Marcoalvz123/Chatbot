import React, { useState } from 'react';
// Importamos los iconos 'Send' y 'Smile' de la librería 'lucide-react' para los botones de enviar y emoji
import { Send, Smile } from 'lucide-react';
// Importamos el componente EmojiPicker que se usa para seleccionar emojis
import EmojiPicker from './EmojiPicker';  

// Definición de las propiedades que el componente recibirá
interface MessageInputProps {
  // Función que se ejecuta cuando se envía un mensaje
  onSendMessage: (message: string) => void;
}

const MessageInput: React.FC<MessageInputProps> = ({ onSendMessage }) => {
  // Estado para almacenar el contenido del mensaje que el usuario está escribiendo
  const [message, setMessage] = useState('');
  // Estado para manejar la visibilidad del teclado de emojis
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  // Función que se ejecuta cuando se envía el formulario (es decir, el mensaje)
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault(); // Prevenir que el formulario se recargue
    if (message.trim()) {  // Verificamos que el mensaje no esté vacío
      onSendMessage(message);  // Llamamos la función de callback para enviar el mensaje
      setMessage('');  // Limpiamos el campo de texto después de enviar el mensaje
    }
  };

  // Función para manejar la selección de un emoji desde el teclado de emojis
  const handleEmojiSelect = (emoji: string) => {
    setMessage(prev => prev + emoji);  // Añadimos el emoji al final del mensaje actual
    setShowEmojiPicker(false);  // Ocultamos el teclado de emojis después de seleccionar un emoji
  };

  return (
    // Formulario para enviar el mensaje
    <form onSubmit={handleSubmit} className="flex gap-2 border-t p-4 bg-white">
      {/* Campo de entrada donde el usuario escribe el mensaje */}
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}  // Actualizamos el estado cuando el usuario escribe
        placeholder="Escribe un mensaje..."
        className="flex-1 rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none"
      />

      {/* Botón para mostrar/ocultar el teclado de emojis */}
      <button
        type="button"
        onClick={() => setShowEmojiPicker(prev => !prev)}  // Alterna la visibilidad del teclado de emojis
        className="flex items-center justify-center rounded-lg bg-gray-200 px-2 py-2 text-gray-500 hover:bg-gray-300"
      >
        {/* Icono de emoji para el botón */}
        <Smile className="h-5 w-5" />
      </button>

      {/* Botón para enviar el mensaje */}
      <button
        type="submit"
        disabled={!message.trim()}  // Deshabilitar el botón si el mensaje está vacío
        className="flex items-center justify-center rounded-lg bg-blue-500 px-4 py-2 text-white transition-colors hover:bg-blue-600 disabled:bg-gray-300"
      >
        {/* Icono de enviar para el botón */}
        <Send className="h-5 w-5" />
      </button>

      {/* Mostrar el teclado de emojis si 'showEmojiPicker' es verdadero */}
      {showEmojiPicker && <EmojiPicker onSelect={handleEmojiSelect} />}
    </form>
  );
};

export default MessageInput;
