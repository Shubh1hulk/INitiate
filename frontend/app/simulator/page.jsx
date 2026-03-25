'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/contexts/AuthContext';
import Navigation from '@/components/Navigation';
import { motion } from 'framer-motion';
import { apiClient } from '@/lib/api';
import toast from 'react-hot-toast';
import { Send, Loader, Save } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts';

export default function Simulator() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [profile, setProfile] = useState(null);
  const [inputDecision, setInputDecision] = useState('');
  const [simulation, setSimulation] = useState(null);
  const [simulating, setSimulating] = useState(false);
  const [selectedScenario, setSelectedScenario] = useState(0);

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

  const handleGenerateSimulation = async (e) => {
    e.preventDefault();
    if (!inputDecision.trim()) return;

    if (profile?.trainingPhase === 'incomplete') {
      toast.error('Train your digital twin first before simulating');
      router.push('/twin');
      return;
    }

    setSimulating(true);
    try {
      const response = await apiClient.generateSimulation({ decision: inputDecision });
      setSimulation(response.data);
      setSelectedScenario(0);
      setInputDecision('');
      toast.success('Simulation generated!');
    } catch (error) {
      toast.error('Failed to generate simulation');
      console.error(error);
    } finally {
      setSimulating(false);
    }
  };

  const handleSaveSimulation = async () => {
    if (!simulation) return;

    try {
      await apiClient.saveSimulation(simulation._id);
      toast.success('Simulation saved!');
    } catch (error) {
      toast.error('Failed to save simulation');
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
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="text-4xl font-bold glow-text mb-2">Life Decision Simulator</h1>
            <p className="text-gray-400">Simulate potential futures before making big decisions</p>
          </motion.div>

          {/* Input Form */}
          <motion.form
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            onSubmit={handleGenerateSimulation}
            className="glass p-6 rounded-xl mb-8"
          >
            <label className="block text-sm font-bold mb-3">What decision do you want to simulate?</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={inputDecision}
                onChange={(e) => setInputDecision(e.target.value)}
                placeholder="e.g., Should I switch careers to tech? Should I start a business? Should I move abroad?"
                disabled={simulating}
                className="flex-1 px-4 py-3 bg-dark-700 border border-neon-cyan border-opacity-30 rounded text-white placeholder-gray-500 focus:outline-none focus:border-neon-cyan disabled:opacity-50"
              />
              <button
                type="submit"
                disabled={simulating || !inputDecision.trim()}
                className="px-6 py-3 bg-neon-cyan text-dark-900 font-bold rounded hover:shadow-neon transition-all disabled:opacity-50 flex items-center gap-2 whitespace-nowrap"
              >
                {simulating ? (
                  <>
                    <Loader className="w-5 h-5 animate-spin" />
                    Simulating...
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    Simulate
                  </>
                )}
              </button>
            </div>
          </motion.form>

          {/* Simulation Results */}
          {simulation && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-8"
            >
              {/* Header */}
              <div className="glass p-6 rounded-xl">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h2 className="text-2xl font-bold mb-2">Decision: {simulation.decision}</h2>
                    <p className="text-gray-400">Simulated outcomes tailored to your profile</p>
                  </div>
                  <button
                    onClick={handleSaveSimulation}
                    className="flex items-center gap-2 px-4 py-2 bg-neon-purple text-white rounded hover:bg-opacity-80 transition-all"
                  >
                    <Save className="w-4 h-4" />
                    Save
                  </button>
                </div>
              </div>

              {/* Scenario Tabs */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {simulation.scenarios.map((scenario, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedScenario(i)}
                    className={`p-4 rounded-lg transition-all text-left ${
                      selectedScenario === i
                        ? 'glass border-2 border-neon-cyan'
                        : 'glass hover:border-neon-cyan'
                    }`}
                  >
                    <h3 className="font-bold mb-2">{scenario.title}</h3>
                    <div className="flex items-center gap-2">
                      <div className="w-full bg-dark-700 rounded-full h-2">
                        <div
                          className="bg-neon-cyan h-2 rounded-full"
                          style={{ width: `${scenario.probability}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-bold">{scenario.probability}%</span>
                    </div>
                  </button>
                ))}
              </div>

              {/* Selected Scenario Details */}
              {simulation.scenarios[selectedScenario] && (
                <motion.div
                  key={selectedScenario}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="glass p-8 rounded-xl"
                >
                  <div className="mb-8">
                    <h3 className="text-2xl font-bold mb-2">
                      {simulation.scenarios[selectedScenario].title}
                    </h3>
                    <p className="text-gray-400 mb-4">
                      {simulation.scenarios[selectedScenario].description}
                    </p>

                    <div className="grid grid-cols-3 gap-4 py-4 border-y border-gray-700">
                      <div>
                        <p className="text-xs font-bold text-neon-cyan mb-1">PROBABILITY</p>
                        <p className="text-2xl font-bold">
                          {simulation.scenarios[selectedScenario].probability}%
                        </p>
                      </div>
                      <div>
                        <p className="text-xs font-bold text-neon-purple mb-1">CONFIDENCE</p>
                        <p className="text-2xl font-bold">
                          {simulation.scenarios[selectedScenario].confidence}%
                        </p>
                      </div>
                      <div>
                        <p className="text-xs font-bold text-neon-green mb-1">TIMELINE</p>
                        <p className="text-sm">See details below</p>
                      </div>
                    </div>
                  </div>

                  {/* Timeline */}
                  <div className="mb-8">
                    <h4 className="font-bold mb-4">Outcome Timeline</h4>
                    <div className="space-y-3">
                      <div className="p-4 bg-dark-700 rounded">
                        <p className="text-xs font-bold text-neon-cyan mb-1">SHORT TERM (0-6 months)</p>
                        <p className="text-sm">
                          {simulation.scenarios[selectedScenario].timeline.shortTerm}
                        </p>
                      </div>
                      <div className="p-4 bg-dark-700 rounded">
                        <p className="text-xs font-bold text-neon-purple mb-1">MEDIUM TERM (6-18 months)</p>
                        <p className="text-sm">
                          {simulation.scenarios[selectedScenario].timeline.mediumTerm}
                        </p>
                      </div>
                      <div className="p-4 bg-dark-700 rounded">
                        <p className="text-xs font-bold text-neon-green mb-1">LONG TERM (18+ months)</p>
                        <p className="text-sm">
                          {simulation.scenarios[selectedScenario].timeline.longTerm}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Risks & Opportunities */}
                  <div className="grid grid-cols-2 gap-8">
                    <div>
                      <h4 className="font-bold mb-4 text-red-400">⚠️ Risks</h4>
                      <ul className="space-y-2">
                        {simulation.scenarios[selectedScenario].risks.map((risk, i) => (
                          <li key={i} className="flex gap-2 text-sm">
                            <span className="text-red-400">•</span>
                            <span>{risk}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-bold mb-4 text-green-400">✨ Opportunities</h4>
                      <ul className="space-y-2">
                        {simulation.scenarios[selectedScenario].opportunities.map((opp, i) => (
                          <li key={i} className="flex gap-2 text-sm">
                            <span className="text-green-400">•</span>
                            <span>{opp}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Personalized Insights */}
              <motion.div className="glass p-8 rounded-xl">
                <h3 className="text-xl font-bold mb-4">🧠 Personalized Insights</h3>
                <p className="text-gray-300 mb-4">{simulation.personalizedInsights}</p>
                <div className="p-4 bg-neon-cyan bg-opacity-10 border border-neon-cyan border-opacity-30 rounded">
                  <p className="font-bold">AI Recommendation</p>
                  <p className="text-gray-300 mt-2">{simulation.recommendation}</p>
                </div>
              </motion.div>
            </motion.div>
          )}

          {/* Empty State */}
          {!simulation && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="glass p-12 rounded-xl text-center"
            >
              <p className="text-gray-400">
                Ask a question above to generate your first life scenario simulation...
              </p>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
