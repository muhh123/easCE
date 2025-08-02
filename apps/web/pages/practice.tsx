import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { ArrowLeft, Check, X, Loader2, RefreshCw } from 'lucide-react';
import { Button } from '../components/ui/button';
import Link from 'next/link';

interface Question {
  id: string;
  topic: string;
  difficulty: string;
  question: string;
  options: string[];
  answer: number;
  explanation: string;
  created_at?: string;
  updated_at?: string;
}

interface ApiResponse {
  success: boolean;
  data: Question[];
  message?: string;
  meta?: {
    count: number;
    topic: string;
    difficulty: string;
    limit: number;
  };
}

export default function Practice() {
  const router = useRouter();
  const { topic, difficulty } = router.query;
  const [questions, setQuestions] = useState<Question[] | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [score, setScore] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchQuestions = async () => {
      if (!topic || !difficulty) return;
      
      try {
        setIsLoading(true);
        const response = await fetch(`/api/questions?topic=${topic}&difficulty=${difficulty}`);
        const result = await response.json();
        
        if (!response.ok) {
          throw new Error(result.message || 'Failed to fetch questions');
        }

        if (!result.success) {
          throw new Error(result.message || 'API request was not successful');
        }

        // The questions are in result.data
        const questions = result.data || [];
        console.log('Fetched questions:', questions);
        
        if (questions.length === 0) {
          console.warn('No questions found for the given criteria');
        }
        
        setQuestions(questions);
      } catch (error) {
        console.error('Error fetching questions:', error);
        // Set questions to empty array to trigger the no-questions UI
        setQuestions([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchQuestions();
  }, [topic, difficulty]);

  const handleOptionSelect = (optionIndex: number) => {
    if (showExplanation) return; // Prevent changing answer after submission
    setSelectedOption(optionIndex);
  };

  const handleSubmit = () => {
    if (selectedOption === null) return;
    
    setShowExplanation(true);
    if (selectedOption === currentQuestion.answer) {
      setScore(prev => prev + 1);
    }
  };

  const handleNext = () => {
    if (!questions || questions.length === 0) {
      console.error('No questions available');
      return;
    }
    
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedOption(null);
      setShowExplanation(false);
    } else {
      // Quiz completed
      alert(`Quiz completed! Your score: ${score}/${questions.length}`);
      router.push('/dashboard');
    }
  };

  if (isLoading || questions === null) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
        <p className="text-gray-600">Loading questions...</p>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <div className="max-w-md w-full text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">No Questions Found</h1>
          <p className="text-gray-600 mb-6">
            We couldn't find any {difficulty} questions for {topic}. Please try a different topic or difficulty level.
          </p>
          <Button onClick={() => router.push('/dashboard')}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  
  // Add null check for currentQuestion
  if (!currentQuestion) {
    console.error('Current question is undefined', { 
      currentQuestionIndex, 
      questionsLength: questions.length,
      questions
    });
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <div className="max-w-md w-full text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Error Loading Question</h1>
          <p className="text-gray-600 mb-6">
            There was an error loading the current question. Please try again.
          </p>
          <Button onClick={() => window.location.reload()}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Reload Page
          </Button>
        </div>
      </div>
    );
  }

  const isLastQuestion = currentQuestionIndex === questions.length - 1;
  const isCorrect = selectedOption === currentQuestion.answer;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-xl font-semibold text-gray-900">
            {topic} - {difficulty}
          </h1>
          <div className="text-sm text-gray-600">
            Question {currentQuestionIndex + 1} of {questions.length}
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Question Card */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-medium text-gray-900 mb-6">
            {currentQuestion.question}
          </h2>
          
          {/* Options */}
          <div className="space-y-3 mb-6">
            {currentQuestion.options.map((option, index) => {
              let optionStyle = "border-gray-200 hover:bg-gray-50";
              
              if (showExplanation) {
                if (index === currentQuestion.answer) {
                  optionStyle = "border-green-500 bg-green-50";
                } else if (index === selectedOption && index !== currentQuestion.answer) {
                  optionStyle = "border-red-500 bg-red-50";
                }
              } else if (selectedOption === index) {
                optionStyle = "border-primary-500 bg-primary-50";
              }
              
              return (
                <button
                  key={index}
                  className={`w-full text-left p-4 border rounded-lg transition-colors ${optionStyle}`}
                  onClick={() => handleOptionSelect(index)}
                  disabled={showExplanation}
                >
                  <div className="flex items-center">
                    <div className={`w-5 h-5 rounded-full border mr-3 flex-shrink-0 flex items-center justify-center ${
                      showExplanation 
                        ? index === currentQuestion.answer 
                          ? 'bg-green-500 border-green-500 text-white'
                          : index === selectedOption 
                            ? 'bg-red-500 border-red-500 text-white'
                            : 'border-gray-300'
                        : selectedOption === index
                          ? 'border-primary-500 bg-primary-500 text-white'
                          : 'border-gray-300'
                    }`}>
                      {showExplanation && index === currentQuestion.answer && <Check className="h-3 w-3" />}
                      {showExplanation && index === selectedOption && index !== currentQuestion.answer && (
                        <X className="h-3 w-3" />
                      )}
                      {!showExplanation && selectedOption === index && (
                        <div className="w-2 h-2 rounded-full bg-white"></div>
                      )}
                    </div>
                    <span>{option}</span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Explanation */}
          {showExplanation && (
            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <h3 className="font-medium text-blue-800 mb-2">Explanation:</h3>
              <p className="text-blue-700">{currentQuestion.explanation}</p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="mt-8 flex justify-between">
            <Button
              variant="outline"
              onClick={() => router.push('/dashboard')}
              className="flex items-center"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Exit Quiz
            </Button>
            
            {!showExplanation ? (
              <Button
                onClick={handleSubmit}
                disabled={selectedOption === null}
                className="ml-auto"
              >
                Submit Answer
              </Button>
            ) : (
              <Button onClick={handleNext} className="ml-auto">
                {isLastQuestion ? 'Finish Quiz' : 'Next Question'}
              </Button>
            )}
          </div>
        </div>

        {/* Progress */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-700">Progress</span>
            <span className="text-sm font-medium text-gray-900">
              {currentQuestionIndex + 1} / {questions.length}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div
              className="bg-primary-600 h-2.5 rounded-full"
              style={{
                width: `${((currentQuestionIndex + 1) / questions.length) * 100}%`,
              }}
            ></div>
          </div>
        </div>
      </main>
    </div>
  );
}
