import React, { useEffect, useState } from 'react';
import localforage from 'localforage'; // Biblioteca para almacenamiento local
import MessageList from './MessageList'; // Componente que muestra la lista de mensajes
import MessageInput from './MessageInput'; // Componente para ingresar nuevos mensajes

interface Message {
  id: string;
  content: string;
  timestamp: number;
  isBot: boolean;
}

// Configuración de mensajes
const MESSAGES_PER_PAGE = 20; // Número de mensajes a mostrar por página
const BOT_RESPONSES = [
  "Veré como puedo ayudarte.",
  "Eso suena interesante, ¡Cuentame más!",
  "Entiendo, ¿Podrías darme más detalles?",
  "Me gusta lo que oigo, ¡Dime más!",
  "¡Cuentame más!",
  "¡Gracias por conversar conmigo!",
];

// Respuestas predeterminadas según el contexto de la conversación
const GREETING_RESPONSES = [
  "¡Hola! ¿Cómo estás?👋",
  "¡Hola! ¿En qué puedo ayudarte hoy?👀",
  "¡Buenos días! ¿Cómo te va?😊",
];

const EMPATHY_RESPONSES = [
  "¡Ya veo! ¿Hay algo que pueda hacer para ayudarte?",
  "¡Te comprendo! Dime, ¿Como puedo ayudarte?",
  "¡Vaya! Espero serte de ayuda",
];

const FUN_RESPONSES = [
  "¿Sabías que los delfines son súper inteligentes? 🐬",
  "¡Estuve pensando en un chiste! ¿Por qué el libro de matemáticas está triste? Porque tenía demasiados problemas! 😄",
  "¡A veces sólo hace falta reír para sentirte mejor! 😂",
];

// Palabras clave para detectar el contexto de la conversación
const KEYWORDS_GREETING = ["hola", "saludos", "buenos días", "buenas", "buen día", "hello", "hi","mucho gusto"];
const KEYWORDS_EMPATHY = ["triste", "enojado", "deprimido", "mal", "feliz", "entusiasmado"];
const KEYWORDS_FUN = ["chiste", "diversión", "joke", "risa", "payaso"];

// Función para generar una respuesta aleatoria con emoji
const getRandomEmojiResponse = (): string => {
  const emojiResponses = ['👍', '😊', '😂', '🙌', '🎉'];
  return emojiResponses[Math.floor(Math.random() * emojiResponses.length)];
};

const ChatContainer: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]); // Estado para los mensajes
  const [page, setPage] = useState(1); // Página actual para cargar mensajes antiguos
  const [isProcessing, setIsProcessing] = useState(false); // Estado para saber si el bot está procesando
  const [showWaitMessage, setShowWaitMessage] = useState(false); // Estado para mostrar mensaje de espera

  // Cargar los mensajes al inicio
  useEffect(() => {
    loadMessages();
  }, []);

  // Función para cargar mensajes desde localforage (almacenamiento local)
  const loadMessages = async () => {
    const storedMessages = await localforage.getItem<Message[]>('chatMessages');
    if (storedMessages) {
      setMessages(storedMessages.slice(-MESSAGES_PER_PAGE)); // Cargar solo los últimos 20 mensajes
    }
  };

  // Función para guardar mensajes en el almacenamiento local
  const saveMessages = async (newMessages: Message[]) => {
    await localforage.setItem('chatMessages', newMessages);
  };

  // Función para manejar el envío de un nuevo mensaje
  const handleSendMessage = async (content: string) => {
    if (isProcessing) {
      setShowWaitMessage(true); // Muestra mensaje de espera si el bot está procesando
      return;
    }

    // Crear mensaje del usuario
    const userMessage: Message = {
      id: Date.now().toString(),
      content,
      timestamp: Date.now(),
      isBot: false,
    };

    // Verificar si el mensaje solo contiene un emoji
    const emojiOnlyPattern = /^[\p{Emoji}\u200B]+$/gu;
    const isEmojiOnly = emojiOnlyPattern.test(content);

    let botMessage: Message;

    // Detectar el tipo de mensaje (saludo, empatía, diversión)
    const containsGreeting = KEYWORDS_GREETING.some(keyword => content.toLowerCase().includes(keyword));
    const containsEmpathy = KEYWORDS_EMPATHY.some(keyword => content.toLowerCase().includes(keyword));
    const containsFun = KEYWORDS_FUN.some(keyword => content.toLowerCase().includes(keyword));

    // Responder con saludo si el mensaje contiene palabras clave de saludo
    if (containsGreeting) {
      const processingMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: "...",
        timestamp: Date.now() + 1000,
        isBot: true,
      };

      // Actualizar mensajes con el mensaje del usuario y el mensaje de procesamiento
      const newMessages = [...messages, userMessage, processingMessage];
      setMessages(newMessages);
      saveMessages(newMessages);

      setIsProcessing(true); // Cambiar estado a "procesando"
      setTimeout(() => {
        botMessage = {
          id: (Date.now() + 2).toString(),
          content: GREETING_RESPONSES[Math.floor(Math.random() * GREETING_RESPONSES.length)],
          timestamp: Date.now() + 2000,
          isBot: true,
        };

        // Actualizar los mensajes con la respuesta del bot
        const updatedMessages = newMessages.filter((msg) => msg.id !== processingMessage.id);
        updatedMessages.push(botMessage);

        setMessages(updatedMessages);
        saveMessages(updatedMessages);
        setIsProcessing(false); // Terminar procesamiento
      }, Math.random() * (3000 - 1000) + 1000); // Esperar entre 1 y 3 segundos antes de responder
      return;
    }

    // Responder con mensaje de empatía si el mensaje contiene palabras clave de empatía
    if (containsEmpathy) {
      const processingMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: "...",
        timestamp: Date.now() + 1000,
        isBot: true,
      };

      // Actualizar mensajes con el mensaje del usuario y el mensaje de procesamiento
      const newMessages = [...messages, userMessage, processingMessage];
      setMessages(newMessages);
      saveMessages(newMessages);

      setIsProcessing(true);
      setTimeout(() => {
        botMessage = {
          id: (Date.now() + 2).toString(),
          content: EMPATHY_RESPONSES[Math.floor(Math.random() * EMPATHY_RESPONSES.length)],
          timestamp: Date.now() + 2000,
          isBot: true,
        };

        const updatedMessages = newMessages.filter((msg) => msg.id !== processingMessage.id);
        updatedMessages.push(botMessage);

        setMessages(updatedMessages);
        saveMessages(updatedMessages);
        setIsProcessing(false);
      }, Math.random() * (3000 - 1000) + 1000);
      return;
    }

    // Responder con mensaje divertido si el mensaje contiene palabras clave de diversión
    if (containsFun) {
      const processingMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: "...",
        timestamp: Date.now() + 1000,
        isBot: true,
      };

      const newMessages = [...messages, userMessage, processingMessage];
      setMessages(newMessages);
      saveMessages(newMessages);

      setIsProcessing(true);
      setTimeout(() => {
        botMessage = {
          id: (Date.now() + 2).toString(),
          content: FUN_RESPONSES[Math.floor(Math.random() * FUN_RESPONSES.length)],
          timestamp: Date.now() + 2000,
          isBot: true,
        };

        const updatedMessages = newMessages.filter((msg) => msg.id !== processingMessage.id);
        updatedMessages.push(botMessage);

        setMessages(updatedMessages);
        saveMessages(updatedMessages);
        setIsProcessing(false);
      }, Math.random() * (3000 - 1000) + 1000);
      return;
    }

    // Responder con mensaje genérico si no se encuentra una coincidencia
    const processingMessage: Message = {
      id: (Date.now() + 1).toString(),
      content: "...",
      timestamp: Date.now() + 1000,
      isBot: true,
    };

    const newMessages = [...messages, userMessage, processingMessage];
    setMessages(newMessages);
    saveMessages(newMessages);

    setIsProcessing(true);
    setTimeout(() => {
      if (isEmojiOnly) {
        const randomEmojiResponse = getRandomEmojiResponse();
        botMessage = {
          id: (Date.now() + 2).toString(),
          content: randomEmojiResponse,
          timestamp: Date.now() + 2000,
          isBot: true,
        };
      } else {
        const randomResponse = BOT_RESPONSES[Math.floor(Math.random() * BOT_RESPONSES.length)];
        botMessage = {
          id: (Date.now() + 2).toString(),
          content: randomResponse,
          timestamp: Date.now() + 2000,
          isBot: true,
        };
      }

      const updatedMessages = newMessages.filter((msg) => msg.id !== processingMessage.id);
      updatedMessages.push(botMessage);

      setMessages(updatedMessages);
      saveMessages(updatedMessages);
      setIsProcessing(false);
    }, Math.random() * (3000 - 1000) + 1000);
  };

  // Función para cargar más mensajes cuando el usuario se desplace hacia abajo
  const handleLoadMore = async () => {
    const storedMessages = await localforage.getItem<Message[]>('chatMessages');
    if (storedMessages) {
      const startIndex = Math.max(0, storedMessages.length - (page + 1) * MESSAGES_PER_PAGE);
      setMessages(storedMessages.slice(startIndex));
      setPage(page + 1);
    }
  };

  // Función para cerrar el mensaje de espera
  const handleCloseWaitMessage = () => {
    setShowWaitMessage(false);
  };

  // Función para limpiar el chat
  const handleClearChat = () => {
    setMessages([]);
    saveMessages([]);
  };

  return (
    <div className="flex h-screen flex-col bg-white relative">
      {/* Encabezado del chat */}
      <div className="border-b bg-white px-4 py-3 flex justify-between items-center">
        <h1 className="text-lg font-semibold text-center uppercase">ChatBot</h1>
        <button 
          className="bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600"
          onClick={handleClearChat}
        >
          Limpiar
        </button>
      </div>

      {/* Mensaje de espera */}
      {showWaitMessage && (
        <div className="absolute inset-0 flex justify-center items-center bg-gray-900 bg-opacity-50 z-50">
          <div className="bg-gray-800 text-white p-6 rounded-md shadow-lg flex items-center space-x-4">
            <span>Por favor espera la respuesta del bot antes de enviar otro mensaje.</span>
            <button 
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md" 
              onClick={handleCloseWaitMessage}>
              OK
            </button>
          </div>
        </div>
      )}

      {/* Componente de lista de mensajes */}
      <MessageList messages={messages} onLoadMore={handleLoadMore} />
      {/* Componente para ingresar nuevo mensaje */}
      <MessageInput onSendMessage={handleSendMessage} />
    </div>
  );
};

export default ChatContainer;
