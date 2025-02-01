import React from 'react';
// Importamos la función 'format' de la librería 'date-fns' para formatear la fecha y hora de los mensajes
import { format } from 'date-fns';
// Importamos los íconos de 'Bot' y 'User' desde la librería 'lucide-react' para representar el bot y el usuario
import { Bot, User } from 'lucide-react';

// Definición de las propiedades que el componente recibirá
interface MessageProps {
  // El contenido del mensaje, que puede ser texto o emojis
  content: string;
  // La marca de tiempo del mensaje para mostrar la hora
  timestamp: number;
  // Un valor booleano que indica si el mensaje fue enviado por el bot
  isBot: boolean;
}

// Componente funcional de React que representa un mensaje en el chat
const Message: React.FC<MessageProps> = ({ content, timestamp, isBot }) => {
  return (
    // Contenedor principal de cada mensaje. Usamos flexbox para organizar el mensaje y un condicional para invertir el orden si el mensaje no es del bot
    <div className={`flex gap-3 ${isBot ? '' : 'flex-row-reverse'} mb-4`}>
      {/* Icono del usuario o del bot dependiendo de la propiedad 'isBot' */}
      <div className={`flex h-8 w-8 shrink-0 select-none items-center justify-center rounded-full ${isBot ? 'bg-blue-500' : 'bg-gray-200'}`}>
        {/* Si el mensaje es del bot, mostramos el icono de bot, si es del usuario, mostramos el icono de usuario */}
        {isBot ? <Bot className="h-5 w-5 text-white" /> : <User className="h-5 w-5 text-gray-500" />}
      </div>

      {/* Contenedor del mensaje en sí. Si el mensaje no es del bot, alineamos el mensaje a la derecha */}
      <div className={`flex max-w-[80%] flex-col ${isBot ? '' : 'items-end'}`}>
        {/* Caja del mensaje con un estilo diferente para los mensajes del bot y del usuario */}
        <div className={`rounded-lg px-4 py-2 ${isBot ? 'bg-gray-100' : 'bg-blue-500 text-white'}`}>
          {/* El contenido del mensaje */}
          <p className="text-sm">{content}</p>
        </div>
        
        {/* Mostrar la hora del mensaje utilizando la librería 'date-fns' para formatear la marca de tiempo */}
        <span className="mt-1 text-xs text-gray-500">
          {format(timestamp, 'HH:mm')} {/* Formato de hora: 'HH:mm' */}
        </span>
      </div>
    </div>
  );
};

// Exportamos el componente para que se pueda usar en otros archivos
export default Message;
