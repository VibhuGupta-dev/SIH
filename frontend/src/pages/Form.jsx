import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, CheckCircle, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function MentalHealthQuiz() {
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showResults, setShowResults] = useState(false);
  const navigate = useNavigate();

  // Check assessment status on mount
  useEffect(() => {
    checkAssessmentStatus();
    fetchQuestions();
  }, []);

  const checkAssessmentStatus = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/usermentalhealth/status', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Failed to check assessment status');
      }

      if (data.hasCompletedAssessment) {
        navigate('/assessment'); // Redirect to assessment if completed
      }
    } catch (err) {
      console.error('Error checking assessment status:', err.message);
      setError('Failed to verify assessment status: ' + err.message);
    }
  };

  const fetchQuestions = async () => {
    setLoading(true);
    setError('');
    try {
      setQuestions(getMentalHealthQuestions());
    } catch (err) {
      console.error('Error fetching questions:', err);
      setError('Failed to load questions. Using sample data.');
      setQuestions(getMentalHealthQuestions());
    } finally {
      setLoading(false);
    }
  };

  // Mental Health Questions (unchanged, 10 questions)
  const getMentalHealthQuestions = () => [
    {
      id: 1,
      question: "How would you describe your overall mood in the past two weeks?",
      options: [
        { value: "a", text: "Very positive and energetic" },
        { value: "b", text: "Generally good with occasional dips" },
        { value: "c", text: "Neutral or balanced" },
        { value: "d", text: "Often down or low" },
        { value: "e", text: "Consistently sad or depressed" },
      ],
    },
    {
    id: 2,
    question: "How well have you been sleeping recently?",
    options: [
      { value: "a", text: "Sleeping very well, feeling rested" },
      { value: "b", text: "Mostly good sleep with minor issues" },
      { value: "c", text: "Average sleep, sometimes restless" },
      { value: "d", text: "Frequent difficulty falling or staying asleep" },
      { value: "e", text: "Severe sleep problems or insomnia" },
    ],
  },
  {
    id: 3,
    question: "How often do you feel anxious or worried?",
    options: [
      { value: "a", text: "Rarely or never" },
      { value: "b", text: "Occasionally, but manageable" },
      { value: "c", text: "Sometimes, moderate level" },
      { value: "d", text: "Often, causes noticeable distress" },
      { value: "e", text: "Almost constantly, overwhelming" },
    ],
  },
  {
    id: 4,
    question: "How is your energy level throughout the day?",
    options: [
      { value: "a", text: "High energy, feeling motivated" },
      { value: "b", text: "Good energy most of the time" },
      { value: "c", text: "Variable energy, some ups and downs" },
      { value: "d", text: "Often tired or lacking motivation" },
      { value: "e", text: "Consistently low energy or exhausted" },
    ],
  },
  {
    id: 5,
    question: "How well are you able to concentrate and focus?",
    options: [
      { value: "a", text: "Excellent focus and concentration" },
      { value: "b", text: "Generally good, minor distractions" },
      { value: "c", text: "Moderate focus, sometimes scattered" },
      { value: "d", text: "Difficulty concentrating frequently" },
      { value: "e", text: "Very poor concentration most of the time" },
    ],
  },
  {
    id: 6,
    question: "How satisfied are you with your relationships?",
    options: [
      { value: "a", text: "Very satisfied, strong connections" },
      { value: "b", text: "Mostly satisfied with some relationships" },
      { value: "c", text: "Mixed feelings about relationships" },
      { value: "d", text: "Often feel disconnected or lonely" },
      { value: "e", text: "Very isolated or unsatisfied with relationships" },
    ],
  },
  {
    id: 7,
    question: "How do you typically handle stress?",
    options: [
      { value: "a", text: "Very effective coping strategies" },
      { value: "b", text: "Usually manage stress well" },
      { value: "c", text: "Sometimes struggle but get by" },
      { value: "d", text: "Often feel overwhelmed by stress" },
      { value: "e", text: "Stress feels unmanageable most of the time" },
    ],
  },
  {
    id: 8,
    question: "How often do you engage in activities you enjoy?",
    options: [
      { value: "a", text: "Regularly, several times a week" },
      { value: "b", text: "Fairly often, when I have time" },
      { value: "c", text: "Occasionally, when motivated" },
      { value: "d", text: "Rarely, lost interest in many things" },
      { value: "e", text: "Almost never, don't enjoy much anymore" },
    ],
  },
  {
    id: 9,
    question: "How do you feel about your self-worth and confidence?",
    options: [
      { value: "a", text: "Very confident and positive self-image" },
      { value: "b", text: "Generally good self-esteem" },
      { value: "c", text: "Average confidence, varies by situation" },
      { value: "d", text: "Often doubt myself or feel inadequate" },
      { value: "e", text: "Very low self-worth or self-criticism" },
    ],
  },
  {
    id: 10,
    question: "How well are you taking care of your physical health?",
    options: [
      { value: "a", text: "Excellent self-care and healthy habits" },
      { value: "b", text: "Generally good care of myself" },
      { value: "c", text: "Inconsistent but trying" },
      { value: "d", text: "Neglecting health needs frequently" },
      { value: "e", text: "Very poor self-care or neglect" },
    ],
  },

 
    // ... (other 9 questions as previously shared)
  ];

  const handleAnswerSelect = (value) => {
    console.log(`Selected answer for question ${currentQuestion + 1}: ${value}`);
    setAnswers({ ...answers, [currentQuestion]: value });
  };

  const handleNextOrSubmit = () => {
    if (!answers[currentQuestion]) {
      setError('Please select an answer before proceeding.');
      return;
    }
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setError('');
    } else {
      handleSubmit();
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
      setError('');
    }
  };

  const handleSubmit = async () => {
    try {
      if (Object.keys(answers).length !== questions.length) {
        setError('Please answer all questions before submitting.');
        console.log('Missing answers:', { answered: Object.keys(answers).length, required: questions.length });
        return;
      }

      const profileResponse = await fetch('http://localhost:3000/api/auth/me', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      const profileData = await profileResponse.json();
      if (!profileResponse.ok) {
        throw new Error(profileData.message || 'Failed to fetch user profile');
      }

      const userId = profileData.user.id;
      console.log('Fetched userId:', userId);

      const formattedAnswers = questions.map((question, index) => {
        const selectedValue = answers[index];
        const selectedOption = question.options.find((opt) => opt.value === selectedValue)?.text;
        if (!selectedOption) {
          console.warn(`No valid option selected for question ${index + 1}: ${question.question}`);
          return null;
        }
        return {
          questionText: question.question,
          selectedOption,
        };
      });

      if (formattedAnswers.some((answer) => !answer || !answer.selectedOption)) {
        setError('Some answers are invalid. Please ensure all questions are answered correctly.');
        console.log('Invalid formattedAnswers:', formattedAnswers);
        return;
      }

      const payload = {
        userId,
        mentalHealthAnswers: formattedAnswers,
      };

      console.log('Submitting payload:', JSON.stringify(payload, null, 2));

      const response = await fetch('http://localhost:3000/api/usermentalhealth/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      console.log('Server response:', data);

      if (response.ok) {
        setShowResults(true);
      } else {
        throw new Error(data.message || 'Failed to submit quiz');
      }
    } catch (err) {
      console.error('Error submitting quiz:', err.message);
      setError('Failed to submit quiz: ' + err.message);
    }
  };

  const progress = ((currentQuestion + 1) / questions.length) * 100;
  const answeredCount = Object.keys(answers).length;

  if (loading) return <LoadingScreen />;
  if (error && questions.length === 0) return <ErrorScreen error={error} retry={fetchQuestions} />;
  if (showResults) return <ResultsScreen />;

  const currentQ = questions[currentQuestion];

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-100 flex flex-col">
      <div className="relative z-10 p-6 max-w-4xl mx-auto w-full">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-teal-800">Mental Health Assessment</h1>
          <div className="text-sm text-teal-600 font-medium">
            Question {currentQuestion + 1} of {questions.length}
          </div>
        </div>
        <div className="w-full bg-teal-100 rounded-full h-3 mb-8 shadow-inner">
          <div
            className="mental-progress-bar h-3 rounded-full transition-all duration-700 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 text-red-700 text-center">
            {error}
          </div>
        )}

        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 border border-teal-200/50 shadow-xl">
          <h2 className="text-2xl font-semibold text-teal-800 mb-8 text-center leading-relaxed">
            {currentQ?.question}
          </h2>

          <div className="space-y-4 mb-8">
            {currentQ?.options?.map((option) => (
              <button
                key={option.value}
                onClick={() => handleAnswerSelect(option.value)}
                className={`w-full text-left p-5 rounded-xl border-2 transition-all duration-300 ${
                  answers[currentQuestion] === option.value
                    ? 'border-teal-400 bg-teal-50 text-teal-800 shadow-md'
                    : 'border-teal-200/50 bg-white/50 text-teal-700 hover:border-teal-300 hover:bg-teal-50/70 hover:shadow-sm'
                }`}
              >
                <div className="flex items-center">
                  <div
                    className={`w-5 h-5 rounded-full border-2 mr-4 transition-all duration-200 ${
                      answers[currentQuestion] === option.value ? 'border-teal-400 bg-teal-400 scale-110' : 'border-teal-300'
                    }`}
                  >
                    {answers[currentQuestion] === option.value && (
                      <div className="w-full h-full rounded-full bg-white/80 scale-75 transition-transform duration-200"></div>
                    )}
                  </div>
                  <span className="font-medium text-base leading-relaxed">{option.text}</span>
                </div>
              </button>
            ))}
          </div>

          <div className="flex justify-between items-center pt-4 border-t border-teal-100">
            <button
              onClick={handlePrevious}
              disabled={currentQuestion === 0}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all duration-200 ${
                currentQuestion === 0
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-teal-100 text-teal-700 hover:bg-teal-200 hover:shadow-sm'
              }`}
            >
              <ChevronLeft className="w-4 h-4" />
              Previous
            </button>

            <div className="text-sm text-teal-600 font-medium">
              {answeredCount} of {questions.length} answered
            </div>

            <button
              onClick={handleNextOrSubmit}
              disabled={!answers[currentQuestion]}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all duration-200 ${
                !answers[currentQuestion]
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : currentQuestion === questions.length - 1
                  ? 'bg-emerald-500 hover:bg-emerald-600 text-white shadow-md hover:shadow-lg'
                  : 'bg-teal-500 hover:bg-teal-600 text-white shadow-md hover:shadow-lg'
              }`}
            >
              {currentQuestion === questions.length - 1 ? 'Complete Assessment' : 'Next'}
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Loading, Error, and Results Screens (unchanged)
const LoadingScreen = () => (
  <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-100 flex items-center justify-center">
    <div className="text-center">
      <div className="w-16 h-16 border-4 border-teal-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
      <p className="text-teal-800 text-xl font-medium">Loading Mental Health Assessment...</p>
    </div>
  </div>
);

const ErrorScreen = ({ error, retry }) => (
  <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-100 flex items-center justify-center p-6">
    <div className="bg-red-50 border border-red-200 rounded-xl p-8 max-w-md w-full shadow-lg">
      <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
      <h2 className="text-red-700 text-xl font-bold text-center mb-2">Error Loading Assessment</h2>
      <p className="text-red-600 text-center mb-6">{error}</p>
      <button
        onClick={retry}
        className="w-full bg-red-500 hover:bg-red-600 text-white py-3 px-6 rounded-lg font-semibold transition-colors"
      >
        Try Again
      </button>
    </div>
  </div>
);

const ResultsScreen = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-100 flex items-center justify-center p-6">
      <div className="bg-white/90 backdrop-blur-sm rounded-xl p-8 max-w-md w-full border border-teal-200 shadow-xl">
        <CheckCircle className="w-16 h-16 text-emerald-500 mx-auto mb-6" />
        <h2 className="text-2xl font-bold text-teal-800 text-center mb-4">Assessment Completed!</h2>
        <p className="text-teal-700 text-center mb-8 leading-relaxed">
          Thank you for completing the mental health assessment. Your responses have been recorded and will help provide personalized recommendations.
        </p>
        <button
          onClick={() => navigate('/dashboard')}
          className="w-full bg-teal-600 hover:bg-teal-700 text-white py-3 px-6 rounded-lg font-semibold transition-colors shadow-md"
        >
          Go to Dashboard
        </button>
      </div>
    </div>
  );
};

// Custom CSS (unchanged)
// Custom CSS remains unchanged

      {/* Custom CSS for mental health theme */}
      <style>{`
        @keyframes gentleFloat {
          0%, 100% {
            transform: translateY(0px) translateX(0px) rotate(0deg);
            opacity: 0.2;
          }
          50% {
            transform: translateY(-20px) translateX(10px) rotate(180deg);
            opacity: 0.4;
          }
        }

        @keyframes gentleWave {
          0%, 100% {
            transform: scale(1) rotate(0deg);
            opacity: 0.1;
          }
          50% {
            transform: scale(1.1) rotate(90deg);
            opacity: 0.2;
          }
        }

        @keyframes gentleSway {
          0%, 100% {
            transform: rotate(-5deg) translateY(0px);
            opacity: 0.3;
          }
          50% {
            transform: rotate(5deg) translateY(-10px);
            opacity: 0.6;
          }
        }

        .mental-progress-bar {
          background: linear-gradient(90deg, #14B8A6, #0D9488, #059669);
          box-shadow: 0 2px 8px -2px rgba(20, 184, 166, 0.3);
        }

        .mental-option {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
          overflow: hidden;
        }

        .mental-option::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(20, 184, 166, 0.1), transparent);
          transition: left 0.6s ease;
        }

        .mental-option:hover::before {
          left: 100%;
        }

        .mental-option:hover {
          transform: translateY(-2px);
        }

        .mental-option-selected {
          transform: translateY(-1px);
          animation: gentleGlow 3s ease-in-out infinite;
        }

        @keyframes gentleGlow {
          0%, 100% {
            box-shadow: 0 4px 12px -2px rgba(20, 184, 166, 0.2);
          }
          50% {
            box-shadow: 0 6px 16px -2px rgba(20, 184, 166, 0.3);
          }
        }

        .mental-card {
          animation: cardSlideIn 0.6s cubic-bezier(0.4, 0, 0.2, 1);
        }

        @keyframes cardSlideIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
   