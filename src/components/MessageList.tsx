import React, { useEffect, useRef } from 'react';
import Message from './Message';

// Definición de la estructura de los datos de cada mensaje
interface MessageData {
  id: string;  // Identificador único del mensaje
  content: string;  // Contenido del mensaje (puede ser texto o emojis)
  timestamp: number;  // Marca de tiempo cuando se envió el mensaje
  isBot: boolean;  // Indica si el mensaje fue enviado por el bot
}

// Propiedades que el componente recibirá
interface MessageListProps {
  messages: MessageData[];  // Array de mensajes que se mostrarán
  onLoadMore: () => void;  // Función para cargar más mensajes al hacer scroll
}

const MessageList: React.FC<MessageListProps> = ({ messages, onLoadMore }) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);  // Referencia para el final de la lista de mensajes
  const containerRef = useRef<HTMLDivElement>(null);  // Referencia para el contenedor de los mensajes

  // Función para hacer scroll hasta el final de los mensajes
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });  // Desplazar hasta el último mensaje
  };

  // Efecto que se ejecuta cada vez que se agregan nuevos mensajes
  useEffect(() => {
    scrollToBottom();  // Hacer scroll hacia el último mensaje cuando se agreguen nuevos
  }, [messages]);  // Dependencia en 'messages' para ejecutar el efecto cuando cambien

  // Manejo del evento de scroll
  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, clientHeight, scrollHeight } = e.currentTarget;
    // Si el usuario está en la parte superior del contenedor y hay más contenido para cargar
    if (scrollTop === 0 && scrollHeight > clientHeight) {
      onLoadMore();  // Llamar a la función para cargar más mensajes
    }
  };

  return (
    <div
      ref={containerRef}  // Asignamos la referencia al contenedor de mensajes
      onScroll={handleScroll}  // Manejar el evento de scroll
      className="flex-1 overflow-y-auto p-4 bg-gray-50"  // Estilos del contenedor de mensajes
    >
      {/* Mapeamos los mensajes y los renderizamos */}
      {messages.map((message) => (
        <Message
          key={message.id}  // Usamos el id como clave única para cada mensaje
          content={message.content}  // Pasamos el contenido del mensaje
          timestamp={message.timestamp}  // Pasamos la marca de tiempo del mensaje
          isBot={message.isBot}  // Pasamos si el mensaje es del bot o del usuario
        />
      ))}
      {/* Este div sirve como referencia para hacer scroll hacia el final */}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default MessageList;
