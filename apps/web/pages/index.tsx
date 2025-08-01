import { useState, useEffect, FormEvent } from 'react'
import Head from 'next/head'
import Image from 'next/image'
import { 
  Calculator, 
  Droplets, 
  Building2, 
  Shuffle, 
  TrendingUp, 
  Unlock,
  Users,
  Star,
  CheckCircle,
  ArrowRight,
  Mail,
  Facebook,
  Twitter,
  Linkedin,
  Instagram,
  LogOut
} from 'lucide-react'
import AuthModal from '../components/AuthModal'
import { supabase, signOut, getCurrentUser } from '../lib/supabase'

interface StepItem {
  step: number;
  title: string;
  desc: string;
}

interface User {
  id: string;
  email?: string;
}

export default function Home() {
  const [activeUsers, setActiveUsers] = useState<number>(1247)
  const [totalQuestions, setTotalQuestions] = useState<number>(5420)
  const [successStories, setSuccessStories] = useState<number>(892)
  const [user, setUser] = useState<User | null>(null)
  const [authModalOpen, setAuthModalOpen] = useState(false)
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin')

  // Check for authenticated user on mount
  useEffect(() => {
    const checkUser = async () => {
      const currentUser = await getCurrentUser()
      setUser(currentUser)
    }
    checkUser()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setUser(session?.user ?? null)
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  // Simulate real-time active users counter
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveUsers(prev => prev + Math.floor(Math.random() * 3) - 1)
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  const handleSignOut = async () => {
    await signOut()
    setUser(null)
  }

  const openAuthModal = (mode: 'signin' | 'signup') => {
    setAuthMode(mode)
    setAuthModalOpen(true)
  }

  const stepItems: StepItem[] = [
    { step: 1, title: "Sign Up", desc: "Create your free account" },
    { step: 2, title: "Choose Category", desc: "Select Math, HGE, or Structural" },
    { step: 3, title: "Practice", desc: "Answer randomized questions" },
    { step: 4, title: "Track Progress", desc: "Monitor your improvement" },
    { step: 5, title: "Pass Your Exam", desc: "Achieve your CE license" }
  ]

  return (
    <>
      <Head>
        <title>easCE - Master Your Civil Engineering Board Exam For Free</title>
        <meta name="description" content="Free review platform for civil engineering board exam preparation. Practice with past board exam questions in Math, HGE, and Structural engineering." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {/* Header Section */}
      <header className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-50">
        <nav className="container-max flex items-center justify-between py-4">
          <div className="flex items-center space-x-8">
            <div className="text-2xl font-bold text-primary-600">
              eas<span className="text-secondary-600">CE</span>
            </div>
            <div className="hidden md:flex space-x-6">
              <a href="#home" className="text-gray-700 hover:text-primary-600 transition-colors">Home</a>
              <a href="#about" className="text-gray-700 hover:text-primary-600 transition-colors">About</a>
              <a href="#features" className="text-gray-700 hover:text-primary-600 transition-colors">Features</a>
              <a href="#contact" className="text-gray-700 hover:text-primary-600 transition-colors">Contact</a>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <Users className="w-4 h-4" />
              <span className="font-medium">{activeUsers.toLocaleString()}</span>
              <span>active users</span>
            </div>
            {user ? (
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-600">Welcome, {user.email}</span>
                <button 
                  onClick={handleSignOut}
                  className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out</span>
                </button>
              </div>
            ) : (
              <button 
                onClick={() => openAuthModal('signin')}
                className="btn-primary"
              >
                Login / Register
              </button>
            )}
          </div>
        </nav>
      </header>

      <main>
        {/* Hero Section */}
        <section id="home" className="bg-gradient-to-br from-primary-50 to-secondary-50 section-padding">
          <div className="container-max">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-8">
                <div className="space-y-4">
                  <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 leading-tight">
                    Master Your Civil Engineering Board Exam - 
                    <span className="text-primary-600"> For Free</span>
                  </h1>
                  <p className="text-xl text-gray-600 leading-relaxed">
                    Join thousands of CE students and graduates preparing for their board exams with our comprehensive question bank
                  </p>
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span>100% Free platform</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span>Past board exam questions</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span>Math, HGE, Structural</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span>Random question generation</span>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <button 
                    onClick={() => user ? alert('Redirect to practice page') : openAuthModal('signup')}
                    className="btn-primary flex items-center justify-center space-x-2"
                  >
                    <span>{user ? 'Continue Practicing' : 'Start Practicing Now'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                  <button className="btn-secondary">Learn More</button>
                </div>
              </div>

              <div className="relative">
                {user ? (
                  <div className="bg-white rounded-2xl shadow-2xl p-8 border border-gray-100">
                    <h3 className="text-2xl font-bold text-gray-900 mb-6">Welcome Back!</h3>
                    <div className="text-center space-y-4">
                      <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto">
                        <Users className="w-8 h-8 text-primary-600" />
                      </div>
                      <p className="text-gray-600">You're signed in as:</p>
                      <p className="font-semibold text-gray-900">{user.email}</p>
                      <button 
                        onClick={() => alert('Redirect to dashboard')}
                        className="w-full btn-primary"
                      >
                        Go to Dashboard
                      </button>
                      <button 
                        onClick={handleSignOut}
                        className="w-full btn-secondary"
                      >
                        Sign Out
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="bg-white rounded-2xl shadow-2xl p-8 border border-gray-100">
                    <h3 className="text-2xl font-bold text-gray-900 mb-6">Get Started</h3>
                    <div className="space-y-4">
                      <p className="text-gray-600 text-center mb-6">
                        Join thousands of students preparing for their CE board exam
                      </p>
                      <button 
                        onClick={() => openAuthModal('signup')}
                        className="w-full btn-primary"
                      >
                        Create Free Account
                      </button>
                      <button 
                        onClick={() => openAuthModal('signin')}
                        className="w-full btn-secondary"
                      >
                        Sign In
                      </button>
                      <div className="text-center text-sm text-gray-500">
                        ✓ No credit card required<br/>
                        ✓ 100% free forever
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="section-padding bg-white">
          <div className="container-max">
            <div className="text-center mb-16">
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                Everything You Need to Pass Your CE Board Exam
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Our comprehensive platform covers all major topics with thousands of past board exam questions
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="card text-center group hover:shadow-xl transition-shadow duration-300">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-blue-200 transition-colors">
                  <Calculator className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Math Questions</h3>
                <p className="text-gray-600">
                  Comprehensive math problems from past board exams covering algebra, calculus, differential equations, and more
                </p>
              </div>

              <div className="card text-center group hover:shadow-xl transition-shadow duration-300">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-green-200 transition-colors">
                  <Droplets className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">HGE Engineering</h3>
                <p className="text-gray-600">
                  Specialized questions covering Hydraulics, Geotechnical, and Environmental engineering topics
                </p>
              </div>

              <div className="card text-center group hover:shadow-xl transition-shadow duration-300">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-purple-200 transition-colors">
                  <Building2 className="w-8 h-8 text-purple-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Structural Engineering</h3>
                <p className="text-gray-600">
                  Structural analysis and design questions including concrete, steel, and timber structures
                </p>
              </div>

              <div className="card text-center group hover:shadow-xl transition-shadow duration-300">
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-orange-200 transition-colors">
                  <Shuffle className="w-8 h-8 text-orange-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Random Generator</h3>
                <p className="text-gray-600">
                  Get randomized questions for effective practice and avoid memorizing question patterns
                </p>
              </div>

              <div className="card text-center group hover:shadow-xl transition-shadow duration-300">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-red-200 transition-colors">
                  <TrendingUp className="w-8 h-8 text-red-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Progress Tracking</h3>
                <p className="text-gray-600">
                  Monitor your improvement over time with detailed analytics and performance insights
                </p>
              </div>

              <div className="card text-center group hover:shadow-xl transition-shadow duration-300">
                <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-yellow-200 transition-colors">
                  <Unlock className="w-8 h-8 text-yellow-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">100% Free Access</h3>
                <p className="text-gray-600">
                  No paid review centers needed. Complete access to all features without any cost
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Statistics Section */}
        <section className="section-padding bg-primary-600">
          <div className="container-max">
            <div className="grid md:grid-cols-4 gap-8 text-center text-white">
              <div>
                <div className="text-4xl font-bold mb-2">{totalQuestions.toLocaleString()}+</div>
                <div className="text-primary-100">Questions Available</div>
              </div>
              <div>
                <div className="text-4xl font-bold mb-2">{activeUsers.toLocaleString()}</div>
                <div className="text-primary-100">Active Users</div>
              </div>
              <div>
                <div className="text-4xl font-bold mb-2">{successStories}+</div>
                <div className="text-primary-100">Success Stories</div>
              </div>
              <div>
                <div className="text-4xl font-bold mb-2">3</div>
                <div className="text-primary-100">Categories Covered</div>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="section-padding bg-gray-50">
          <div className="container-max">
            <div className="text-center mb-16">
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                How It Works
              </h2>
              <p className="text-xl text-gray-600">
                Get started in just 5 simple steps
              </p>
            </div>

            <div className="grid md:grid-cols-5 gap-8">
              {stepItems.map((item, index) => (
                <div key={index} className="text-center">
                  <div className="w-16 h-16 bg-primary-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                    {item.step}
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{item.title}</h3>
                  <p className="text-gray-600">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Final CTA Section */}
        <section className="section-padding bg-gradient-to-r from-primary-600 to-secondary-600">
          <div className="container-max text-center">
            <div className="max-w-3xl mx-auto text-white">
              <h2 className="text-3xl lg:text-4xl font-bold mb-4">
                Ready to Start Your Free Practice?
              </h2>
              <p className="text-xl mb-8 text-primary-100">
                Join {activeUsers.toLocaleString()} students already preparing for their CE board exam
              </p>
              <button 
                onClick={() => user ? alert('Redirect to practice') : openAuthModal('signup')}
                className="btn-primary bg-white text-primary-600 hover:bg-gray-50 text-lg px-8 py-4"
              >
                {user ? 'Start Practicing' : 'Get Started Free'}
              </button>
              <div className="flex justify-center space-x-8 mt-8 text-sm text-primary-100">
                <span>✓ No credit card required</span>
                <span>✓ 100% free forever</span>
                <span>✓ Join in 30 seconds</span>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white section-padding">
        <div className="container-max">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="text-2xl font-bold mb-4">
                eas<span className="text-secondary-400">CE</span>
              </div>
              <p className="text-gray-400 mb-4">
                Free review platform for civil engineering board exam preparation
              </p>
              <div className="flex space-x-4">
                <Facebook className="w-5 h-5 text-gray-400 hover:text-white cursor-pointer" />
                <Twitter className="w-5 h-5 text-gray-400 hover:text-white cursor-pointer" />
                <Linkedin className="w-5 h-5 text-gray-400 hover:text-white cursor-pointer" />
                <Instagram className="w-5 h-5 text-gray-400 hover:text-white cursor-pointer" />
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white">About Us</a></li>
                <li><a href="#" className="hover:text-white">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white">Terms of Service</a></li>
                <li><a href="#" className="hover:text-white">FAQ</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Contact</h4>
              <ul className="space-y-2 text-gray-400">
                <li>support@easce.com</li>
                <li>+63 123 456 7890</li>
                <li>Manila, Philippines</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Newsletter</h4>
              <p className="text-gray-400 mb-4">Stay updated with new questions and features</p>
              <div className="flex">
                <input
                  type="email"
                  placeholder="Your email"
                  className="flex-1 px-4 py-2 bg-gray-800 border border-gray-700 rounded-l-lg focus:outline-none focus:border-primary-500"
                />
                <button className="bg-primary-600 hover:bg-primary-700 px-4 py-2 rounded-r-lg">
                  <Mail className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-800 pt-8 text-center text-gray-400">
            <p>&copy; 2024 easCE. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* Authentication Modal */}
      <AuthModal 
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        initialMode={authMode}
      />
    </>
  )
}
