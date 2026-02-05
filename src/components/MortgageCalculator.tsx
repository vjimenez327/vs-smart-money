import React, { useState } from 'react';
import { Home, DollarSign, Calendar, TrendingDown, PieChart } from 'lucide-react';

interface MortgageInputs {
  principal: number;
  interestRate: number;
  monthlyPayment: number;
  escrowAmount: number;
  extraPrincipal: number;
  extraEscrow: number;
}

export default function MortgageCalculator() {
  const [mortgage, setMortgage] = useState<MortgageInputs>({
    principal: 300000,
    interestRate: 6.5,
    monthlyPayment: 1896,
    escrowAmount: 300,
    extraPrincipal: 100,
    extraEscrow: 50
  });

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(amount);
  };

  // Calculate first month's payment breakdown
  const calculatePaymentBreakdown = () => {
    const monthlyRate = mortgage.interestRate / 100 / 12;
    const interestPayment = mortgage.principal * monthlyRate;
    const principalPayment = mortgage.monthlyPayment - mortgage.escrowAmount - interestPayment;
    
    return {
      principal: principalPayment,
      interest: interestPayment,
      escrow: mortgage.escrowAmount,
      baseTotal: mortgage.monthlyPayment,
      withExtras: mortgage.monthlyPayment + mortgage.extraPrincipal + mortgage.extraEscrow
    };
  };

  const calculateMortgageScenarios = () => {
    const monthlyRate = mortgage.interestRate / 100 / 12;
    const basePrincipalAndInterest = mortgage.monthlyPayment - mortgage.escrowAmount;
    
    // Scenario 1: Base payments only (no extras)
    let baseBalance = mortgage.principal;
    let baseTotalInterest = 0;
    let baseMonths = 0;
    
    while (baseBalance > 0 && baseMonths < 360) {
      const interest = baseBalance * monthlyRate;
      const principal = basePrincipalAndInterest - interest;
      baseTotalInterest += interest;
      baseBalance -= principal;
      baseMonths++;
      
      if (baseBalance < 0) baseBalance = 0;
    }
    
    // Scenario 2: Base + Extra Principal only
    let extraPrincipalBalance = mortgage.principal;
    let extraPrincipalTotalInterest = 0;
    let extraPrincipalMonths = 0;
    
    while (extraPrincipalBalance > 0 && extraPrincipalMonths < 360) {
      const interest = extraPrincipalBalance * monthlyRate;
      const principal = basePrincipalAndInterest + mortgage.extraPrincipal - interest;
      extraPrincipalTotalInterest += interest;
      extraPrincipalBalance -= principal;
      extraPrincipalMonths++;
      
      if (extraPrincipalBalance < 0) extraPrincipalBalance = 0;
    }
    
    // Scenario 3: Base + Extra Principal + Extra Escrow
    // Note: Extra escrow doesn't reduce mortgage, but we track total cash outflow
    let bothBalance = mortgage.principal;
    let bothTotalInterest = 0;
    let bothMonths = 0;
    let totalEscrowPaid = 0;
    
    while (bothBalance > 0 && bothMonths < 360) {
      const interest = bothBalance * monthlyRate;
      const principal = basePrincipalAndInterest + mortgage.extraPrincipal - interest;
      bothTotalInterest += interest;
      bothBalance -= principal;
      totalEscrowPaid += mortgage.escrowAmount + mortgage.extraEscrow;
      bothMonths++;
      
      if (bothBalance < 0) bothBalance = 0;
    }
    
    return {
      base: {
        months: baseMonths,
        years: (baseMonths / 12).toFixed(1),
        totalInterest: baseTotalInterest,
        totalPaid: mortgage.principal + baseTotalInterest + (mortgage.escrowAmount * baseMonths)
      },
      extraPrincipal: {
        months: extraPrincipalMonths,
        years: (extraPrincipalMonths / 12).toFixed(1),
        totalInterest: extraPrincipalTotalInterest,
        totalPaid: mortgage.principal + extraPrincipalTotalInterest + (mortgage.escrowAmount * extraPrincipalMonths) + (mortgage.extraPrincipal * extraPrincipalMonths),
        interestSaved: baseTotalInterest - extraPrincipalTotalInterest,
        monthsShaved: baseMonths - extraPrincipalMonths,
        extraPrincipalTotal: mortgage.extraPrincipal * extraPrincipalMonths
      },
      both: {
        months: bothMonths,
        years: (bothMonths / 12).toFixed(1),
        totalInterest: bothTotalInterest,
        totalPaid: mortgage.principal + bothTotalInterest + totalEscrowPaid + (mortgage.extraPrincipal * bothMonths),
        interestSaved: baseTotalInterest - bothTotalInterest,
        monthsShaved: baseMonths - bothMonths,
        extraPrincipalTotal: mortgage.extraPrincipal * bothMonths,
        extraEscrowTotal: mortgage.extraEscrow * bothMonths,
        totalEscrowPaid: totalEscrowPaid
      }
    };
  };

  const breakdown = calculatePaymentBreakdown();
  const results = calculateMortgageScenarios();

  return (
    <div>
      {/* Mortgage Inputs */}
      <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Your Mortgage Details</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Current Principal Balance ($)
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
              Base Monthly Payment ($)
            </label>
            <input
              type="number"
              value={mortgage.monthlyPayment}
              onChange={(e) => setMortgage({...mortgage, monthlyPayment: Number(e.target.value)})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
            />
            <p className="text-xs text-gray-500 mt-1">Total base payment (P+I+E)</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Monthly Escrow Amount ($)
            </label>
            <input
              type="number"
              value={mortgage.escrowAmount}
              onChange={(e) => setMortgage({...mortgage, escrowAmount: Number(e.target.value)})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
            />
            <p className="text-xs text-gray-500 mt-1">For taxes & insurance</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Extra Principal Payment ($)
            </label>
            <input
              type="number"
              value={mortgage.extraPrincipal}
              onChange={(e) => setMortgage({...mortgage, extraPrincipal: Number(e.target.value)})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
            />
            <p className="text-xs text-gray-500 mt-1">Additional toward loan balance</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Extra Escrow Payment ($)
            </label>
            <input
              type="number"
              value={mortgage.extraEscrow}
              onChange={(e) => setMortgage({...mortgage, extraEscrow: Number(e.target.value)})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
            <p className="text-xs text-gray-500 mt-1">Additional for escrow buffer</p>
          </div>
        </div>
      </div>

      {/* Payment Breakdown */}
      <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg shadow-lg p-6 mb-6 border-2 border-purple-200">
        <div className="flex items-center gap-2 mb-4">
          <PieChart className="w-6 h-6 text-purple-600" />
          <h3 className="text-xl font-semibold text-purple-900">Your Monthly Payment Breakdown</h3>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg p-4">
            <h4 className="font-semibold text-gray-700 mb-3">Base Payment: {formatCurrency(breakdown.baseTotal)}</h4>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Principal</span>
                <span className="font-semibold text-green-600">{formatCurrency(breakdown.principal)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Interest</span>
                <span className="font-semibold text-red-600">{formatCurrency(breakdown.interest)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Escrow</span>
                <span className="font-semibold text-blue-600">{formatCurrency(breakdown.escrow)}</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-4">
            <h4 className="font-semibold text-gray-700 mb-3">With Extra Payments: {formatCurrency(breakdown.withExtras)}</h4>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Base Payment</span>
                <span className="font-semibold">{formatCurrency(breakdown.baseTotal)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-green-600">+ Extra Principal</span>
                <span className="font-semibold text-green-600">{formatCurrency(mortgage.extraPrincipal)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-blue-600">+ Extra Escrow</span>
                <span className="font-semibold text-blue-600">{formatCurrency(mortgage.extraEscrow)}</span>
              </div>
              <div className="pt-2 border-t border-gray-200 flex justify-between items-center">
                <span className="font-semibold text-gray-700">Total Monthly</span>
                <span className="font-bold text-lg text-gray-900">{formatCurrency(breakdown.withExtras)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Results Comparison */}
      <div className="grid md:grid-cols-3 gap-6 mb-6">
        {/* Base Payments Only */}
        <div className="bg-white rounded-lg shadow-lg p-6 border-2 border-gray-200">
          <div className="flex items-center gap-2 mb-4">
            <Calendar className="w-6 h-6 text-gray-600" />
            <h3 className="text-lg font-semibold text-gray-900">Base Payments Only</h3>
          </div>
          
          <div className="space-y-3">
            <div>
              <p className="text-sm text-gray-600">Time to Pay Off</p>
              <p className="text-2xl font-bold text-gray-900">{results.base.years} years</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Interest</p>
              <p className="text-xl font-bold text-red-600">{formatCurrency(results.base.totalInterest)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Paid</p>
              <p className="text-lg font-semibold text-gray-700">{formatCurrency(results.base.totalPaid)}</p>
            </div>
          </div>
        </div>

        {/* Extra Principal */}
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg shadow-lg p-6 border-2 border-green-300">
          <div className="flex items-center gap-2 mb-4">
            <TrendingDown className="w-6 h-6 text-green-600" />
            <h3 className="text-lg font-semibold text-green-900">+ Extra Principal</h3>
          </div>
          
          <div className="space-y-3">
            <div>
              <p className="text-sm text-gray-600">Time to Pay Off</p>
              <p className="text-2xl font-bold text-green-900">{results.extraPrincipal.years} years</p>
              <p className="text-xs text-green-600 font-semibold">
                Save {(results.extraPrincipal.monthsShaved / 12).toFixed(1)} years!
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Interest</p>
              <p className="text-xl font-bold text-red-600">{formatCurrency(results.extraPrincipal.totalInterest)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Interest Saved</p>
              <p className="text-lg font-bold text-green-600">{formatCurrency(results.extraPrincipal.interestSaved)}</p>
            </div>
            <div className="text-xs text-gray-600 bg-white bg-opacity-60 rounded p-2">
              Total extra principal paid: {formatCurrency(results.extraPrincipal.extraPrincipalTotal)}
            </div>
          </div>
        </div>

        {/* Both Extras */}
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg shadow-lg p-6 border-2 border-blue-300">
          <div className="flex items-center gap-2 mb-4">
            <DollarSign className="w-6 h-6 text-blue-600" />
            <h3 className="text-lg font-semibold text-blue-900">+ Both Extras</h3>
          </div>
          
          <div className="space-y-3">
            <div>
              <p className="text-sm text-gray-600">Time to Pay Off</p>
              <p className="text-2xl font-bold text-blue-900">{results.both.years} years</p>
              <p className="text-xs text-green-600 font-semibold">
                Save {(results.both.monthsShaved / 12).toFixed(1)} years!
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Interest Saved</p>
              <p className="text-xl font-bold text-green-600">{formatCurrency(results.both.interestSaved)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Cash Outflow</p>
              <p className="text-lg font-semibold text-gray-700">{formatCurrency(results.both.totalPaid)}</p>
            </div>
            <div className="text-xs text-gray-600 bg-white bg-opacity-60 rounded p-2 space-y-1">
              <p>Extra principal: {formatCurrency(results.both.extraPrincipalTotal)}</p>
              <p>Extra escrow: {formatCurrency(results.both.extraEscrowTotal)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Summary */}
      <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg shadow-xl p-8 text-white">
        <div className="flex items-center gap-3 mb-4">
          <Home className="w-8 h-8" />
          <h2 className="text-2xl font-bold">Your Savings Summary</h2>
        </div>
        
        <div className="bg-white bg-opacity-90 rounded-lg p-6 text-gray-900">
          <p className="text-lg font-semibold mb-3">
            💰 Impact of Extra Payments
          </p>
          <div className="space-y-3 text-sm">
            <div className="bg-green-50 border-l-4 border-green-500 p-3 rounded">
              <p className="font-semibold text-green-900">Extra Principal Only:</p>
              <p>• Save <strong>{formatCurrency(results.extraPrincipal.interestSaved)}</strong> in interest</p>
              <p>• Pay off mortgage <strong>{(results.extraPrincipal.monthsShaved / 12).toFixed(1)} years earlier</strong></p>
              <p>• Total extra principal invested: <strong>{formatCurrency(results.extraPrincipal.extraPrincipalTotal)}</strong></p>
            </div>
            
            <div className="bg-blue-50 border-l-4 border-blue-500 p-3 rounded">
              <p className="font-semibold text-blue-900">Extra Escrow:</p>
              <p>• Builds escrow buffer of <strong>{formatCurrency(results.both.extraEscrowTotal)}</strong> over life of loan</p>
              <p>• Helps prepare for tax/insurance increases</p>
              <p>• <em>Note: Extra escrow doesn't reduce interest, but provides financial cushion</em></p>
            </div>

            <div className="bg-purple-50 border-l-4 border-purple-500 p-3 rounded">
              <p className="font-semibold text-purple-900">💡 Recommendation:</p>
              <p>Prioritize extra principal payments to save on interest. Add extra escrow only if you need a tax/insurance buffer or expect increases.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}