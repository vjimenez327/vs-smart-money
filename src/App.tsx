import { useState } from 'react';
import { Sparkles, TrendingUp, Home, Scale } from 'lucide-react';
import RoboAdvisorCalculator from './components/RoboAdvisorCalculator';
import MortgageCalculator from './components/MortgageCalculator';
import PayOffVsInvestCalculator from './components/PayOffVsInvestCalculator';

type Tab = 'robo' | 'mortgage' | 'payoff-invest';

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>('robo');

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Sparkles className="w-8 h-8 text-indigo-600" />
            <h1 className="text-3xl font-bold text-gray-900">V's Smart Money Savings</h1>
          </div>
          <p className="text-gray-600">Your personal finance optimization toolkit</p>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-4 mb-6">
          <button
            onClick={() => setActiveTab('robo')}
            className={`flex-1 py-3 px-6 rounded-lg font-semibold transition-all ${
              activeTab === 'robo'
                ? 'bg-indigo-600 text-white shadow-lg'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              <TrendingUp className="w-5 h-5" />
              <span className="hidden sm:inline">Robo-Advisor</span>
            </div>
          </button>
          <button
            onClick={() => setActiveTab('mortgage')}
            className={`flex-1 py-3 px-6 rounded-lg font-semibold transition-all ${
              activeTab === 'mortgage'
                ? 'bg-indigo-600 text-white shadow-lg'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              <Home className="w-5 h-5" />
              <span className="hidden sm:inline">Mortgage</span>
            </div>
          </button>
          <button
            onClick={() => setActiveTab('payoff-invest')}
            className={`flex-1 py-3 px-6 rounded-lg font-semibold transition-all ${
              activeTab === 'payoff-invest'
                ? 'bg-indigo-600 text-white shadow-lg'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              <Scale className="w-5 h-5" />
              <span className="hidden sm:inline">Pay Off vs Invest</span>
            </div>
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === 'robo' && <RoboAdvisorCalculator />}
        {activeTab === 'mortgage' && <MortgageCalculator />}
        {activeTab === 'payoff-invest' && <PayOffVsInvestCalculator />}
      </div>
    </div>
  );
}