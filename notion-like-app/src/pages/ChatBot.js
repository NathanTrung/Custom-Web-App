import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ChatBot = () => {
  const [chats, setChats] = useState([]);
  const [currentChatId, setCurrentChatId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch chat history
  const fetchChatHistory = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/chat');
      setChats(response.data);
    } catch (err) {
      console.error('Error fetching chat history:', err);
      setError('Failed to fetch chat history.');
    }
  };

  // Start a new chat
  const startNewChat = async () => {
    try {
      const response = await axios.post('http://localhost:3000/api/chat');
      setCurrentChatId(response.data.id);
      setMessages([]);
      setChats((prev) => [...prev, response.data]); // Add new chat to chat history
    } catch (err) {
      console.error('Error starting new chat:', err);
      setError('Failed to start a new chat.');
    }
  };

  // Send a message
  const sendMessage = async () => {
    if (!input.trim() || !currentChatId) return;

    const newMessage = { role: 'user', content: input };
    setMessages((prev) => [...prev, newMessage]); // Optimistically add user message
    setInput('');
    setLoading(true);

    try {
      const token = localStorage.getItem('token'); // Assuming user authentication token
      const response = await axios.post(
        `http://localhost:3000/api/chat/${currentChatId}/message`,
        newMessage,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Add bot's response to messages
      setMessages((prev) => [...prev, response.data]);
    } catch (err) {
      console.error('Error communicating with backend:', err);
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: "I'm sorry, I couldn't process your message." },
      ]);
      setError('Failed to send your message.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChatHistory();
  }, []);

  return (
    <div className="flex flex-col items-center p-6">
      <h1 className="text-3xl font-bold mb-6">AI ChatBot</h1>
      {error && <div className="text-red-500 mb-4">{error}</div>}
      <button
        onClick={startNewChat}
        className="mb-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        Start New Chat
      </button>
      <div className="flex w-full">
        {/* Chat History */}
        <div className="w-1/3 p-4 border-r">
          <h2 className="font-bold mb-4">Chat History</h2>
          {chats.length === 0 ? (
            <p className="text-gray-500">No chats available.</p>
          ) : (
            chats.map((chat) => (
              <div
                key={chat.id}
                className={`cursor-pointer mb-2 p-2 border rounded ${
                  currentChatId === chat.id ? 'bg-gray-300' : 'hover:bg-gray-200'
                }`}
                onClick={() => {
                  setCurrentChatId(chat.id);
                  setMessages(chat.messages || []);
                }}
              >
                Chat {chat.id} - {new Date(chat.createdAt).toLocaleDateString()}
              </div>
            ))
          )}
        </div>

        {/* Chat Window */}
        <div className="w-2/3 p-4">
          <div className="h-96 overflow-y-scroll border mb-4">
            {messages.length === 0 ? (
              <p className="text-gray-500 p-4">No messages yet.</p>
            ) : (
              messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`p-2 ${
                    msg.role === 'user' ? 'text-right bg-blue-100' : 'text-left bg-gray-100'
                  } mb-2 rounded`}
                >
                  {msg.content}
                </div>
              ))
            )}
          </div>
          <div className="flex">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 border px-4 py-2 rounded"
            />
            <button
              onClick={sendMessage}
              className={`ml-4 px-4 py-2 rounded ${
                loading ? 'bg-gray-500 cursor-not-allowed' : 'bg-green-500 text-white hover:bg-green-600'
              }`}
              disabled={loading}
            >
              {loading ? 'Loading...' : 'Send'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatBot;
