'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/contexts/AuthContext';
import Navigation from '@/components/Navigation';
import { motion } from 'framer-motion';
import { apiClient } from '@/lib/api';
import toast from 'react-hot-toast';
import { Send, Zap, Loader } from 'lucide-react';

const PERSONALITY_QUIZ = [
  'How would you describe your approach to making decisions? (analytical/intuitive/balanced)',
  'What is your biggest life ambition right now?',
  'How do you typically handle stressful situations?',
  'What values are most important to you?',
  'Describe your ideal career path',
];

export default function TwinTraining() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [profile, setProfile] = useState(null);
  const [trainMode, setTrainMode] = useState('chat'); // 'chat' or 'quiz'
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [sending, setSending] = useState(false);
  const [quizIndex, setQuizIndex] = useState(0);
  const [analyzing, setAnalyzing] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/login');
      return;
    }

    if (user) {
      fetchProfile();
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

  const handleAddTrainingData = async (content) => {
    try {
      await apiClient.addTrainingData({
        type: 'chat',
        content,
      });
      toast.success('Training data added!');
    } catch (error) {
      console.error('Failed to add training data:', error);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    setSending(true);
    const userMessage = inputValue;
    setInputValue('');

    try {
      // Add user message
      setMessages([...messages, { role: 'user', content: userMessage }]);

      // Save training data
      await handleAddTrainingData(userMessage);

      // Get AI response
      const response = await apiClient.sendMessage('temp-chat', {
        content: userMessage,
      });

      // Add AI response
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: response.data.aiResponse },
      ]);
    } catch (error) {
      toast.error('Failed to get response');
      console.error(error);
    } finally {
      setSending(false);
    }
  };

  const handleQuizAnswer = async () => {
    if (!inputValue.trim()) return;

    setSending(true);
    const answer = inputValue;
    setInputValue('');

    try {
      // Add quiz response as training data
      await handleAddTrainingData(`Q: ${PERSONALITY_QUIZ[quizIndex]}\nA: ${answer}`);

      if (quizIndex < PERSONALITY_QUIZ.length - 1) {
        setQuizIndex(quizIndex + 1);
        setMessages([
          ...messages,
          { role: 'user', content: answer },
          { role: 'assistant', content: PERSONALITY_QUIZ[quizIndex + 1] },
        ]);
      } else {
        // Quiz complete
        setMessages([
          ...messages,
          { role: 'user', content: answer },
          {
            role: 'assistant',
            content: 'Great! Quiz complete. Your twin is learning more about you!',
          },
        ]);
        setTrainMode('chat');
      }
    } catch (error) {
      toast.error('Failed to save answer');
    } finally {
      setSending(false);
    }
  };

  const handleAnalyzePersonality = async () => {
    if ((profile?.trainingDataPoints || 0) < 3) {
      toast.error('Add at least 3 training data points first');
      return;
    }

    setAnalyzing(true);
    try {
      const response = await apiClient.analyzePersonality();
      toast.success('Personality analysis complete!');
      setProfile(response.data.user);
    } catch (error) {
      toast.error('Failed to analyze personality');
    } finally {
      setAnalyzing(false);
    }
  };

  if (loading || !user || !profile) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-900 via-dark-800 to-dark-700">
      <Navigation />

      <div className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="text-4xl font-bold glow-text mb-2">Train Your Digital Twin</h1>
            <p className="text-gray-400">
              {profile.trainingDataPoints || 0} data points collected • Phase: {profile.trainingPhase}
            </p>
          </motion.div>

          {/* Mode Selector */}
          <div className="flex gap-4 mb-8">
            <button
              onClick={() => setTrainMode('chat')}
              className={`px-6 py-2 rounded font-bold transition-all ${
                trainMode === 'chat'
                  ? 'bg-neon-cyan text-dark-900'
                  : 'glass hover:border-neon-cyan'
              }`}
            >
              Chat Training
            </button>
            <button
              onClick={() => {
                setTrainMode('quiz');
                setQuizIndex(0);
                setMessages([{ role: 'assistant', content: PERSONALITY_QUIZ[0] }]);
              }}
              className={`px-6 py-2 rounded font-bold transition-all ${
                trainMode === 'quiz'
                  ? 'bg-neon-purple text-white'
                  : 'glass hover:border-neon-purple'
              }`}
            >
              Quiz Mode
            </button>
          </div>

          {/* Chat Box */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="glass rounded-xl overflow-hidden flex flex-col h-96 mb-8"
          >
            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {messages.length === 0 && (
                <div className="flex items-center justify-center h-full text-gray-500">
                  <p>
                    {trainMode === 'chat'
                      ? 'Start chatting to train your twin...'
                      : 'Get ready to answer questions...'}
                  </p>
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
                    className={`max-w-xs px-4 py-2 rounded-lg ${
                      msg.role === 'user'
                        ? 'bg-neon-cyan text-dark-900'
                        : 'glass'
                    }`}
                  >
                    {msg.content}
                  </div>
                </motion.div>
              ))}

              {sending && (
                <div className="flex justify-start">
                  <div className="bg-gray-700 px-4 py-2 rounded-lg flex items-center gap-2">
                    <Loader className="w-4 h-4 animate-spin" />
                    Thinking...
                  </div>
                </div>
              )}
            </div>

            {/* Input */}
            <form
              onSubmit={trainMode === 'chat' ? handleSendMessage : handleQuizAnswer}
              className="border-t border-gray-700 p-4 flex gap-2"
            >
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder={trainMode === 'chat' ? 'Chat with your twin...' : 'Your answer...'}
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
          </motion.div>

          {/* Action Buttons */}
          <div className="flex gap-4">
            <button
              onClick={handleAnalyzePersonality}
              disabled={analyzing || (profile.trainingDataPoints || 0) < 3}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-neon-cyan to-neon-purple text-white font-bold rounded hover:shadow-neon transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <Zap className="w-5 h-5" />
              {analyzing ? 'Analyzing...' : 'Analyze Personality'}
            </button>
          </div>

          {/* Info */}
          <div className="mt-8 glass p-6 rounded-xl">
            <h3 className="font-bold mb-3">Tips for Better Training:</h3>
            <ul className="text-gray-400 space-y-2 text-sm">
              <li>• Be natural and authentic in your responses</li>
              <li>• Share details about your decision-making process</li>
              <li>• Mention your values and long-term goals</li>
              <li>• Collect at least 10-15 data points for best results</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
