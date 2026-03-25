'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/contexts/AuthContext';
import Navigation from '@/components/Navigation';
import { motion } from 'framer-motion';
import { apiClient } from '@/lib/api';
import toast from 'react-hot-toast';
import { Send, Loader, MessageSquare, Plus } from 'lucide-react';

export default function Chat() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [profile, setProfile] = useState(null);
  const [chats, setChats] = useState([]);
  const [activeChat, setActiveChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [sending, setSending] = useState(false);
  const [mode, setMode] = useState('twin'); // 'twin', 'advisor', 'future-self'
  const [loadingChats, setLoadingChats] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/login');
      return;
    }

    if (user) {
      fetchProfile();
      fetchChats();
    }
  }, [user, loading, router]);

  const fetchProfile = async () => {
    try {
      const response = await apiClient.getProfile();
      setProfile(response.data);
    } catch (error) {
      console.error('Failed to fetch profile:', error);
    }
  };

  const fetchChats = async () => {
    setLoadingChats(true);
    try {
      const response = await apiClient.getChats();
      setChats(response.data);
    } catch (error) {
      console.error('Failed to fetch chats:', error);
    } finally {
      setLoadingChats(false);
    }
  };

  const handleCreateChat = async () => {
    try {
      const response = await apiClient.createChat({
        mode,
        title: `${mode.charAt(0).toUpperCase() + mode.slice(1)} Chat`,
      });
      setActiveChat(response.data._id);
      setMessages([]);
      setChats([...chats, response.data]);
      toast.success('Chat created!');
    } catch (error) {
      toast.error('Failed to create chat');
    }
  };

  const handleSelectChat = async (chatId) => {
    try {
      const response = await apiClient.getChat(chatId);
      setActiveChat(chatId);
      setMessages(response.data.messages || []);
      setMode(response.data.mode);
    } catch (error) {
      toast.error('Failed to load chat');
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputValue.trim() || !activeChat) return;

    setSending(true);
    const userMessage = inputValue;
    setInputValue('');

    try {
      // Add user message immediately
      setMessages((prev) => [...prev, { role: 'user', content: userMessage }]);

      // Get AI response
      const response = await apiClient.sendMessage(activeChat, {
        content: userMessage,
      });

      // Add AI response
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: response.data.aiResponse },
      ]);
    } catch (error) {
      toast.error('Failed to send message');
      console.error(error);
      // Remove the user message if it failed
      setMessages((prev) => prev.slice(0, -1));
    } finally {
      setSending(false);
    }
  };

  if (loading || !user || !profile) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-900 via-dark-800 to-dark-700">
      <Navigation />

      <div className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-screen">
            {/* Sidebar - Chats List */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="glass rounded-xl overflow-hidden flex flex-col"
            >
              <div className="p-4 border-b border-gray-700">
                <h2 className="font-bold mb-4">Conversations</h2>
                <button
                  onClick={handleCreateChat}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-neon-cyan text-dark-900 rounded font-bold hover:shadow-neon transition-all"
                >
                  <Plus className="w-4 h-4" />
                  New Chat
                </button>
              </div>

              <div className="flex-1 overflow-y-auto">
                {loadingChats ? (
                  <div className="p-4 text-center text-gray-400">Loading...</div>
                ) : chats.length === 0 ? (
                  <div className="p-4 text-center text-gray-400 text-sm">
                    No conversations yet
                  </div>
                ) : (
                  chats.map((chat) => (
                    <button
                      key={chat._id}
                      onClick={() => handleSelectChat(chat._id)}
                      className={`w-full text-left px-4 py-3 border-b border-gray-700 hover:bg-dark-700 transition-colors ${
                        activeChat === chat._id ? 'bg-dark-700' : ''
                      }`}
                    >
                      <p className="text-sm font-bold truncate">{chat.title}</p>
                      <p className="text-xs text-gray-500 mt-1 capitalize">{chat.mode}</p>
                    </button>
                  ))
                )}
              </div>
            </motion.div>

            {/* Main Chat Area */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="lg:col-span-3 glass rounded-xl overflow-hidden flex flex-col"
            >
              {activeChat ? (
                <>
                  {/* Header */}
                  <div className="p-6 border-b border-gray-700">
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-xl font-bold">
                        {mode === 'twin' && '🤖 Your Digital Twin'}
                        {mode === 'advisor' && '🎯 Life Advisor'}
                        {mode === 'future-self' && '🔮 Future Self'}
                      </h2>
                    </div>
                    <div className="flex gap-2">
                      {['twin', 'advisor', 'future-self'].map((m) => (
                        <button
                          key={m}
                          disabled
                          className={`px-3 py-1 text-xs rounded font-bold ${
                            mode === m
                              ? 'bg-neon-cyan text-dark-900'
                              : 'bg-dark-700 text-gray-400'
                          }`}
                        >
                          {m === 'twin' && 'Twin'}
                          {m === 'advisor' && 'Advisor'}
                          {m === 'future-self' && 'Future'}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Messages */}
                  <div className="flex-1 overflow-y-auto p-6 space-y-4">
                    {messages.length === 0 && (
                      <div className="flex items-center justify-center h-full text-gray-500">
                        <div className="text-center">
                          <MessageSquare className="w-12 h-12 mx-auto mb-3 opacity-50" />
                          <p>Start a conversation...</p>
                        </div>
                      </div>
                    )}

                    {messages.map((msg, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-md px-4 py-3 rounded-lg ${
                            msg.role === 'user'
                              ? 'bg-gradient-to-r from-neon-cyan to-neon-purple text-white'
                              : 'glass'
                          }`}
                        >
                          {msg.content}
                        </div>
                      </motion.div>
                    ))}

                    {sending && (
                      <div className="flex justify-start">
                        <div className="bg-dark-700 px-4 py-3 rounded-lg flex items-center gap-2">
                          <Loader className="w-4 h-4 animate-spin" />
                          <span>Thinking...</span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Input */}
                  <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-700 flex gap-2">
                    <input
                      type="text"
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      placeholder="Type your message..."
                      disabled={sending}
                      className="flex-1 px-4 py-2 bg-dark-700 border border-gray-600 rounded text-white placeholder-gray-500 focus:outline-none focus:border-neon-cyan disabled:opacity-50"
                    />
                    <button
                      type="submit"
                      disabled={sending || !inputValue.trim()}
                      className="px-4 py-2 bg-neon-cyan text-dark-900 rounded font-bold hover:shadow-neon transition-all disabled:opacity-50"
                    >
                      <Send className="w-5 h-5" />
                    </button>
                  </form>
                </>
              ) : (
                <div className="flex items-center justify-center h-full text-gray-500">
                  <div className="text-center">
                    <MessageSquare className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p>Select or create a conversation to get started</p>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
