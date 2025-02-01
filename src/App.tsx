import React from 'react';
import ChatContainer from './components/ChatContainer';

function App() {
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto max-w-3xl p-4">
        <div className="rounded-lg shadow-lg overflow-hidden">
          <ChatContainer />
        </div>
      </div>
    </div>
  );
}

export default App;