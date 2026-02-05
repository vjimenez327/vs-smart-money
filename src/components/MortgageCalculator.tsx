import { useState } from 'react';
import { Home, DollarSign, Calendar, TrendingDown } from 'lucide-react';

interface MortgageInputs {
  principal: number;
  interestRate: number;
  monthlyPayment: number;
  extraBiWeeklyPayment: number;
}

export default function MortgageCalculator() {
  const [mortgage, setMortgage] = useState<MortgageInputs>({
    principal: 300000,
    interestRate: 6.5,
    monthlyPayment: 1896,
    extraBiWeeklyPayment: 100
  });

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(amount);
  };

  const calculateMortgageScenarios = () => {
    const principal = mortgage.principal;
    const monthlyRate = mortgage.interestRate / 100 / 12;
    
    // Scenario 1: Monthly payments
    let monthlyBalance = principal;
    let monthlyTotalInterest = 0;
    let monthlyMonths = 0;
    
    while (monthlyBalance > 0 && monthlyMonths < 360) {
      const interest = monthlyBalance * monthlyRate;
      const principalPayment = mortgage.monthlyPayment - interest;
      monthlyTotalInterest += interest;
      monthlyBalance -= principalPayment;
      monthlyMonths++;
      
      if (monthlyBalance < 0) monthlyBalance = 0;
    }
    
    // Scenario 2: Bi-weekly payments (half of monthly payment every 2 weeks = 26 payments/year)
    let biWeeklyBalance = principal;
    let biWeeklyTotalInterest = 0;
    let biWeeklyPayments = 0;
    const biWeeklyPayment = mortgage.monthlyPayment / 2;
    const biWeeklyRate = mortgage.interestRate / 100 / 26;
    
    while (biWeeklyBalance > 0 && biWeeklyPayments < 780) {
      const interest = biWeeklyBalance * biWeeklyRate;
      const principalPayment = biWeeklyPayment - interest;
      biWeeklyTotalInterest += interest;
      biWeeklyBalance -= principalPayment;
      biWeeklyPayments++;
      
      if (biWeeklyBalance < 0) biWeeklyBalance = 0;
    }
    
    // Scenario 3: Bi-weekly with extra principal
    let extraBalance = principal;
    let extraTotalInterest = 0;
    let extraPayments = 0;
    const extraPayment = biWeeklyPayment + mortgage.extraBiWeeklyPayment;
    
    while (extraBalance > 0 && extraPayments < 780) {
      const interest = extraBalance * biWeeklyRate;
      const principalPayment = extraPayment - interest;
      extraTotalInterest += interest;
      extraBalance -= principalPayment;
      extraPayments++;
      
      if (extraBalance < 0) extraBalance = 0;
    }
    
    return {
      monthly: {
        months: monthlyMonths,
        years: (monthlyMonths / 12).toFixed(1),
        totalInterest: monthlyTotalInterest,
        totalPaid: principal + monthlyTotalInterest
      },
      biWeekly: {
        payments: biWeeklyPayments,
        years: (biWeeklyPayments / 26).toFixed(1),
        totalInterest: biWeeklyTotalInterest,
        totalPaid: principal + biWeeklyTotalInterest,
        savedVsMonthly: monthlyTotalInterest - biWeeklyTotalInterest,
        yearsShaved: (monthlyMonths / 12) - (biWeeklyPayments / 26)
      },
      extra: {
        payments: extraPayments,
        years: (extraPayments / 26).toFixed(1),
        totalInterest: extraTotalInterest,
        totalPaid: principal + extraTotalInterest,
        savedVsMonthly: monthlyTotalInterest - extraTotalInterest,
        savedVsBiWeekly: biWeeklyTotalInterest - extraTotalInterest,
        yearsShaved: (monthlyMonths / 12) - (extraPayments / 26)
      }
    };
  };

  const results = calculateMortgageScenarios();

  return (
    <div>
      {/* Mortgage Inputs */}
      <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Your Mortgage Details</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Outstanding Principal ($)
            </label>
            <input
              type="number"
              value={mortgage.principal}
              onChange={(e) => setMortgage({...mortgage, principal: Number(e.target.value)})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Interest Rate (%)
            </label>
            <input
              type="number"
              step="0.01"
              value={mortgage.interestRate}
              onChange={(e) => setMortgage({...mortgage, interestRate: Number(e.target.value)})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Current Monthly Payment ($)
            </label>
            <input
              type="number"
              value={mortgage.monthlyPayment}
              onChange={(e) => setMortgage({...mortgage, monthlyPayment: Number(e.target.value)})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Extra Bi-Weekly Payment ($)
            </label>
            <input
              type="number"
              value={mortgage.extraBiWeeklyPayment}
              onChange={(e) => setMortgage({...mortgage, extraBiWeeklyPayment: Number(e.target.value)})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
            />
            <p className="text-xs text-gray-500 mt-1">Additional amount per bi-weekly payment</p>
          </div>
        </div>
      </div>

      {/* Results Comparison */}
      <div className="grid md:grid-cols-3 gap-6 mb-6">
        {/* Monthly Payments */}
        <div className="bg-white rounded-lg shadow-lg p-6 border-2 border-gray-200">
          <div className="flex items-center gap-2 mb-4">
            <Calendar className="w-6 h-6 text-gray-600" />
            <h3 className="text-lg font-semibold text-gray-900">Monthly Payments</h3>
          </div>
          
          <div className="space-y-3">
            <div>
              <p className="text-sm text-gray-600">Time to Pay Off</p>
              <p className="text-2xl font-bold text-gray-900">{results.monthly.years} years</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Interest</p>
              <p className="text-xl font-bold text-red-600">{formatCurrency(results.monthly.totalInterest)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Paid</p>
              <p className="text-lg font-semibold text-gray-700">{formatCurrency(results.monthly.totalPaid)}</p>
            </div>
          </div>
        </div>

        {/* Bi-Weekly Payments */}
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg shadow-lg p-6 border-2 border-indigo-300">
          <div className="flex items-center gap-2 mb-4">
            <TrendingDown className="w-6 h-6 text-indigo-600" />
            <h3 className="text-lg font-semibold text-indigo-900">Bi-Weekly Payments</h3>
          </div>
          
          <div className="space-y-3">
            <div>
              <p className="text-sm text-gray-600">Time to Pay Off</p>
              <p className="text-2xl font-bold text-indigo-900">{results.biWeekly.years} years</p>
              <p className="text-xs text-green-600 font-semibold">Save {results.biWeekly.yearsShaved.toFixed(1)} years!</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Interest</p>
              <p className="text-xl font-bold text-red-600">{formatCurrency(results.biWeekly.totalInterest)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Interest Saved</p>
              <p className="text-lg font-bold text-green-600">{formatCurrency(results.biWeekly.savedVsMonthly)}</p>
            </div>
          </div>
        </div>

        {/* Bi-Weekly + Extra */}
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg shadow-lg p-6 border-2 border-green-300">
          <div className="flex items-center gap-2 mb-4">
            <DollarSign className="w-6 h-6 text-green-600" />
            <h3 className="text-lg font-semibold text-green-900">Bi-Weekly + Extra</h3>
          </div>
          
          <div className="space-y-3">
            <div>
              <p className="text-sm text-gray-600">Time to Pay Off</p>
              <p className="text-2xl font-bold text-green-900">{results.extra.years} years</p>
              <p className="text-xs text-green-600 font-semibold">Save {results.extra.yearsShaved.toFixed(1)} years!</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Interest</p>
              <p className="text-xl font-bold text-red-600">{formatCurrency(results.extra.totalInterest)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Interest Saved</p>
              <p className="text-lg font-bold text-green-600">{formatCurrency(results.extra.savedVsMonthly)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Summary */}
      <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg shadow-xl p-8 text-white">
        <div className="flex items-center gap-3 mb-4">
          <Home className="w-8 h-8" />
          <h2 className="text-2xl font-bold">The Best Strategy</h2>
        </div>
        
        <div className="bg-white bg-opacity-90 rounded-lg p-6 text-gray-900">
          <p className="text-lg font-semibold mb-3">
            💡 Recommendation: Bi-Weekly Payments with Extra Principal
          </p>
          <div className="space-y-2 text-sm">
            <p>
              • By switching to bi-weekly payments and adding <strong>{formatCurrency(mortgage.extraBiWeeklyPayment)}</strong> extra per payment, you'll save <strong>{formatCurrency(results.extra.savedVsMonthly)}</strong> in interest.
            </p>
            <p>
              • You'll pay off your mortgage <strong>{results.extra.yearsShaved.toFixed(1)} years earlier</strong> than monthly payments.
            </p>
            <p>
              • Even without the extra payment, bi-weekly payments alone save you <strong>{formatCurrency(results.biWeekly.savedVsMonthly)}</strong>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}