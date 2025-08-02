import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { LogOut, Users, Calculator, Droplets, Building2 } from 'lucide-react';
import { getCurrentUser, signOut, supabase } from '../lib/supabase';

interface User {
  id: string;
  email?: string;
  user_metadata?: {
    full_name?: string;
    name?: string;
  };
}

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [activeUsers, setActiveUsers] = useState(1247);
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const [selectedDifficulty, setSelectedDifficulty] = useState<string | null>(null);

  const topics = [
    { id: 'math', name: 'Mathematics', icon: <Calculator className="w-6 h-6" />, color: 'bg-blue-100 text-blue-600' },
    { id: 'hge', name: 'Hydraulics & Geotech', icon: <Droplets className="w-6 h-6" />, color: 'bg-green-100 text-green-600' },
    { id: 'structural', name: 'Structural', icon: <Building2 className="w-6 h-6" />, color: 'bg-purple-100 text-purple-600' },
  ];

  const difficulties = [
    { id: 'easy', name: 'Easy', color: 'bg-green-100 text-green-800' },
    { id: 'medium', name: 'Medium', color: 'bg-yellow-100 text-yellow-800' },
    { id: 'hard', name: 'Hard', color: 'bg-red-100 text-red-800' },
  ];

  const handleStartPractice = () => {
    if (selectedTopic && selectedDifficulty) {
      // TODO: Implement navigation to practice session
      alert(`Starting ${selectedDifficulty} ${selectedTopic} practice session`);
    }
  };

  useEffect(() => {
    const checkAuth = async () => {
      const currentUser = await getCurrentUser();
      if (!currentUser) {
        router.push('/');
      } else {
        setUser(currentUser);
      }
    };
    checkAuth();

    // Simulate active users counter (you can replace this with real data)
    const interval = setInterval(() => {
      setActiveUsers(prev => prev + Math.floor(Math.random() * 3) - 1);
    }, 5000);

    return () => clearInterval(interval);
  }, [router]);

  const handleSignOut = async () => {
    await signOut();
    router.push('/');
  };

  return (
    <>
      <Head>
        <title>Dashboard - easCE</title>
        <meta name="description" content="Your easCE dashboard" />
      </Head>

      <main className="min-h-screen bg-gray-50">
        {/* Header with Navigation */}
        <header className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-50">
          <nav className="container-max flex items-center justify-between py-4">
            <div className="flex items-center space-x-8">
              <div className="flex items-center space-x-2">
                <img 
                  src="/logo.png" 
                  alt="easCE Logo" 
                  className="h-10 w-10 rounded-lg"
                />
                <div className="text-2xl font-bold text-primary-600">
                  eas<span className="text-secondary-600">CE</span>
                </div>
              </div>
              <div className="hidden md:flex space-x-6">
              {/* Navigation items can be added here later if needed */}
            </div>
            </div>
            
            <div className="flex items-center space-x-6">
              <div className="hidden md:flex items-center space-x-2 text-sm text-gray-600">
                <Users className="w-4 h-4" />
                <span className="font-medium">{activeUsers.toLocaleString()}</span>
                <span>active users</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="hidden md:inline text-gray-700">
                  {user?.user_metadata?.full_name || user?.user_metadata?.name || user?.email?.split('@')[0]}
                </span>
                <button
                  onClick={handleSignOut}
                  className="flex items-center space-x-2 text-gray-600 hover:text-red-600 transition-colors"
                  title="Sign out"
                >
                  <LogOut className="w-5 h-5" />
                  <span className="md:hidden">Sign Out</span>
                </button>
              </div>
            </div>
          </nav>
        </header>

        {/* Main Content */}
        <div className="container-max py-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Welcome back,{' '}
                <span className="text-primary-600">
                  {user?.user_metadata?.full_name || user?.user_metadata?.name || user?.email?.split('@')[0]}
                </span>
                {new Date().getHours() < 12 ? '! 🌞' : new Date().getHours() < 18 ? '! 🌤️' : '! 🌙'}
              </h1>
              <p className="text-gray-600 mt-2">
                {[
                  "Every problem you solve brings you one step closer to acing your CE board exam.",
                  "Consistent practice is the key to mastery. You've got this!",
                  "Your dedication to studying today will shape your success tomorrow.",
                  "Great engineers are built one problem at a time. Keep going!",
                  "The more you practice, the more confident you'll become."
                ][Math.floor(Math.random() * 5)]}
              </p>
            </div>
            <div className="mt-4 md:mt-0 flex items-center space-x-2 text-sm text-gray-600 md:hidden">
              <Users className="w-4 h-4" />
              <span className="font-medium">{activeUsers.toLocaleString()}</span>
              <span>active users</span>
            </div>
          </div>
          
          {/* Topic Selection */}
          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Choose a Topic</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              {topics.map((topic) => (
                <button
                  key={topic.id}
                  onClick={() => setSelectedTopic(topic.id)}
                  className={`p-6 rounded-lg border-2 transition-all duration-200 flex flex-col items-center justify-center space-y-2 ${
                    selectedTopic === topic.id
                      ? 'border-primary-500 bg-primary-50'
                      : 'border-gray-200 hover:border-primary-300 hover:bg-gray-50'
                  }`}
                >
                  <div className={`p-3 rounded-full ${topic.color} mb-2`}>
                    {topic.icon}
                  </div>
                  <h3 className="text-lg font-medium text-gray-900">{topic.name}</h3>
                  <p className="text-sm text-gray-500 text-center">
                    {topic.id === 'math' && 'Algebra, Trigonometry, Calculus, etc.'}
                    {topic.id === 'hge' && 'Fluid Mechanics, Soil Mechanics, etc.'}
                    {topic.id === 'structural' && 'Mechanics, Design, Analysis, etc.'}
                  </p>
                </button>
              ))}
            </div>

            {selectedTopic && (
              <div className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                  Select Difficulty
                </h2>
                <div className="flex flex-wrap gap-3">
                  {difficulties.map((difficulty) => (
                    <button
                      key={difficulty.id}
                      onClick={() => setSelectedDifficulty(difficulty.id)}
                      className={`px-6 py-3 rounded-lg border-2 transition-all duration-200 font-medium ${
                        selectedDifficulty === difficulty.id
                          ? 'border-primary-500 bg-primary-50 text-primary-700'
                          : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50 text-gray-700'
                      }`}
                    >
                      {difficulty.name}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {selectedTopic && selectedDifficulty && (
              <div className="flex justify-center mt-8">
                <button
                  onClick={handleStartPractice}
                  className="px-8 py-3 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-lg shadow-md transition-colors duration-200 flex items-center space-x-2"
                >
                  <span>Start {selectedTopic} Practice ({selectedDifficulty})</span>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            )}
          </div>

          {/* User Stats */}
          <div className="mt-12">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">Your Stats</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-2">Total Questions</h3>
                <p className="text-3xl font-bold text-primary-600">0</p>
                <p className="text-sm text-gray-500 mt-1">Questions answered</p>
              </div>
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-2">Accuracy</h3>
                <p className="text-3xl font-bold text-green-600">0%</p>
                <p className="text-sm text-gray-500 mt-1">Correct answers</p>
              </div>
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-2">Streak</h3>
                <p className="text-3xl font-bold text-yellow-600">0 days</p>
                <p className="text-sm text-gray-500 mt-1">Practice streak</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
