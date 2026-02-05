import { useState } from 'react';
import { TrendingUp, Home, DollarSign, Scale, AlertCircle } from 'lucide-react';

interface Inputs {
  mortgageBalance: number;
  mortgageRate: number;
  monthlyPayment: number;
  extraPayment: number;
  investmentReturn: number;
  taxBracket: number;
  yearsToCompare: number;
}

export default function PayOffVsInvestCalculator() {
  const [inputs, setInputs] = useState<Inputs>({
    mortgageBalance: 280000,
    mortgageRate: 6.5,
    monthlyPayment: 1896,
    extraPayment: 200,
    investmentReturn: 9,
    taxBracket: 24,
    yearsToCompare: 20
  });

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const calculateScenarios = () => {
    const monthlyRate = inputs.mortgageRate / 100 / 12;
    const monthlyInvestmentRate = inputs.investmentReturn / 100 / 12;
    const totalMonths = inputs.yearsToCompare * 12;

    // Scenario 1: Pay extra on mortgage
    let mortgageBalance = inputs.mortgageBalance;
    let totalInterestPaid = 0;
    let monthsPaidOff = 0;
    let month = 0;

    while (mortgageBalance > 0 && month < totalMonths) {
      const interest = mortgageBalance * monthlyRate;
      const principal = inputs.monthlyPayment + inputs.extraPayment - interest;
      totalInterestPaid += interest;
      mortgageBalance -= principal;
      month++;
      
      if (mortgageBalance <= 0) {
        monthsPaidOff = month;
        mortgageBalance = 0;
        break;
      }
    }

    // After mortgage is paid off, invest everything
    let investmentAfterPayoff = 0;
    if (monthsPaidOff > 0 && monthsPaidOff < totalMonths) {
      const monthsRemaining = totalMonths - monthsPaidOff;
      const monthlyInvestAmount = inputs.monthlyPayment + inputs.extraPayment;
      
      for (let i = 0; i < monthsRemaining; i++) {
        investmentAfterPayoff = (investmentAfterPayoff + monthlyInvestAmount) * (1 + monthlyInvestmentRate);
      }
    }

    const payOffScenario = {
      interestPaid: totalInterestPaid,
      monthsPaidOff: monthsPaidOff || totalMonths,
      yearsPaidOff: monthsPaidOff ? monthsPaidOff / 12 : inputs.yearsToCompare,
      remainingBalance: mortgageBalance,
      investmentValue: investmentAfterPayoff,
      netWorth: investmentAfterPayoff - mortgageBalance
    };

    // Scenario 2: Invest the extra payment, make regular mortgage payments
    let investBalance = inputs.mortgageBalance;
    let investInterestPaid = 0;
    let investmentValue = 0;

    for (let i = 0; i < totalMonths; i++) {
      // Mortgage payment
      if (investBalance > 0) {
        const interest = investBalance * monthlyRate;
        const principal = inputs.monthlyPayment - interest;
        investInterestPaid += interest;
        investBalance -= principal;
        
        if (investBalance < 0) investBalance = 0;
      }
      
      // Investment growth
      investmentValue = (investmentValue + inputs.extraPayment) * (1 + monthlyInvestmentRate);
    }

    const investScenario = {
      interestPaid: investInterestPaid,
      remainingMortgage: investBalance,
      investmentValue: investmentValue,
      netWorth: investmentValue - investBalance
    };

    // Calculate tax benefits
    const mortgageInterestDeduction = (totalInterestPaid - investInterestPaid) * (inputs.taxBracket / 100);

    const netDifference = investScenario.netWorth - payOffScenario.netWorth + mortgageInterestDeduction;
    const betterChoice = netDifference > 0 ? 'invest' : 'payoff';

    return {
      payOff: payOffScenario,
      invest: investScenario,
      comparison: {
        netDifference: Math.abs(netDifference),
        betterChoice,
        mortgageInterestDeduction,
        guaranteedReturn: inputs.mortgageRate,
        expectedReturn: inputs.investmentReturn
      }
    };
  };

  const results = calculateScenarios();

  return (
    <div>
      {/* Inputs */}
      <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Your Financial Situation</h2>
        
        <div className="grid md:grid-cols-3 gap-6">
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-700 text-sm">Mortgage Details</h3>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Current Mortgage Balance ($)
              </label>
              <input
                type="number"
                value={inputs.mortgageBalance}
                onChange={(e) => setInputs({...inputs, mortgageBalance: Number(e.target.value)})}
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
                value={inputs.mortgageRate}
                onChange={(e) => setInputs({...inputs, mortgageRate: Number(e.target.value)})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Monthly Payment ($)
              </label>
              <input
                type="number"
                value={inputs.monthlyPayment}
                onChange={(e) => setInputs({...inputs, monthlyPayment: Number(e.target.value)})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold text-gray-700 text-sm">Investment Assumptions</h3>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Extra Monthly Payment ($)
              </label>
              <input
                type="number"
                value={inputs.extraPayment}
                onChange={(e) => setInputs({...inputs, extraPayment: Number(e.target.value)})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
              />
              <p className="text-xs text-gray-500 mt-1">Amount to either pay extra or invest</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Expected Investment Return (%)
              </label>
              <input
                type="number"
                step="0.1"
                value={inputs.investmentReturn}
                onChange={(e) => setInputs({...inputs, investmentReturn: Number(e.target.value)})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
              />
              <p className="text-xs text-gray-500 mt-1">Typical: 7-10% for stocks</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tax Bracket (%)
              </label>
              <input
                type="number"
                value={inputs.taxBracket}
                onChange={(e) => setInputs({...inputs, taxBracket: Number(e.target.value)})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
              />
              <p className="text-xs text-gray-500 mt-1">For mortgage interest deduction</p>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold text-gray-700 text-sm">Time Horizon</h3>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Years to Compare
              </label>
              <input
                type="number"
                value={inputs.yearsToCompare}
                onChange={(e) => setInputs({...inputs, yearsToCompare: Number(e.target.value)})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
              />
              <p className="text-xs text-gray-500 mt-1">How far into the future?</p>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <div className="flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                <p className="text-xs text-blue-800">
                  We'll compare putting ${inputs.extraPayment}/month extra toward your mortgage vs investing it.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Comparison Cards */}
      <div className="grid md:grid-cols-2 gap-6 mb-6">
        {/* Pay Off Mortgage */}
        <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-lg shadow-lg p-6 border-2 border-orange-300">
          <div className="flex items-center gap-2 mb-4">
            <Home className="w-6 h-6 text-orange-600" />
            <h3 className="text-xl font-semibold text-orange-900">Pay Off Mortgage Early</h3>
          </div>

          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-600">Mortgage Paid Off In</p>
              <p className="text-3xl font-bold text-orange-900">{results.payOff.yearsPaidOff.toFixed(1)} years</p>
            </div>

            <div>
              <p className="text-sm text-gray-600">Total Interest Paid</p>
              <p className="text-xl font-bold text-red-600">{formatCurrency(results.payOff.interestPaid)}</p>
            </div>

            <div>
              <p className="text-sm text-gray-600">Investment Value After Payoff</p>
              <p className="text-xl font-bold text-green-600">{formatCurrency(results.payOff.investmentValue)}</p>
              <p className="text-xs text-gray-500 mt-1">
                From investing ${inputs.monthlyPayment + inputs.extraPayment}/month after mortgage is paid
              </p>
            </div>

            <div className="pt-4 border-t border-orange-200">
              <p className="text-sm text-gray-600">Net Worth After {inputs.yearsToCompare} Years</p>
              <p className="text-2xl font-bold text-orange-900">{formatCurrency(results.payOff.netWorth)}</p>
            </div>

            <div className="bg-white bg-opacity-60 rounded p-3">
              <p className="text-xs text-gray-700">
                <strong>Guaranteed return:</strong> {inputs.mortgageRate.toFixed(2)}% (your mortgage rate)
              </p>
            </div>
          </div>
        </div>

        {/* Invest Instead */}
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg shadow-lg p-6 border-2 border-blue-300">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-6 h-6 text-blue-600" />
            <h3 className="text-xl font-semibold text-blue-900">Invest the Extra</h3>
          </div>

          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-600">Remaining Mortgage Balance</p>
              <p className="text-3xl font-bold text-red-600">{formatCurrency(results.invest.remainingMortgage)}</p>
            </div>

            <div>
              <p className="text-sm text-gray-600">Total Interest Paid</p>
              <p className="text-xl font-bold text-red-600">{formatCurrency(results.invest.interestPaid)}</p>
            </div>

            <div>
              <p className="text-sm text-gray-600">Investment Portfolio Value</p>
              <p className="text-xl font-bold text-green-600">{formatCurrency(results.invest.investmentValue)}</p>
              <p className="text-xs text-gray-500 mt-1">
                From investing ${inputs.extraPayment}/month for {inputs.yearsToCompare} years
              </p>
            </div>

            <div className="pt-4 border-t border-blue-200">
              <p className="text-sm text-gray-600">Net Worth After {inputs.yearsToCompare} Years</p>
              <p className="text-2xl font-bold text-blue-900">{formatCurrency(results.invest.netWorth)}</p>
            </div>

            <div className="bg-white bg-opacity-60 rounded p-3">
              <p className="text-xs text-gray-700">
                <strong>Expected return:</strong> {inputs.investmentReturn.toFixed(1)}% (not guaranteed)
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* The Verdict */}
      <div className={`rounded-lg shadow-xl p-8 text-white ${results.comparison.betterChoice === 'invest' ? 'bg-gradient-to-r from-blue-500 to-indigo-600' : 'bg-gradient-to-r from-orange-500 to-red-600'}`}>
        <div className="flex items-center gap-3 mb-6">
          <Scale className="w-8 h-8" />
          <h2 className="text-2xl font-bold">The Verdict</h2>
        </div>

        <div className="grid md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white bg-opacity-20 rounded-lg p-4 text-gray-900">
            <div className="flex items-center gap-2 mb-1">
              <DollarSign className="w-4 h-4" />
              <div className="text-sm font-medium">Net Worth Difference</div>
            </div>
            <div className="text-2xl font-bold">
              {formatCurrency(results.comparison.netDifference)}
            </div>
            <div className="text-xs mt-1">
              {results.comparison.betterChoice === 'invest' ? 'More with investing' : 'More with paying off'}
            </div>
          </div>

          <div className="bg-white bg-opacity-20 rounded-lg p-4 text-gray-900">
            <div className="flex items-center gap-2 mb-1">
              <TrendingUp className="w-4 h-4" />
              <div className="text-sm font-medium">Return Spread</div>
            </div>
            <div className="text-2xl font-bold">
              {(results.comparison.expectedReturn - results.comparison.guaranteedReturn).toFixed(2)}%
            </div>
            <div className="text-xs mt-1">
              Investment return - Mortgage rate
            </div>
          </div>

          <div className="bg-white bg-opacity-20 rounded-lg p-4 text-gray-900">
            <div className="flex items-center gap-2 mb-1">
              <Home className="w-4 h-4" />
              <div className="text-sm font-medium">Tax Benefit</div>
            </div>
            <div className="text-2xl font-bold">
              {formatCurrency(results.comparison.mortgageInterestDeduction)}
            </div>
            <div className="text-xs mt-1">
              Mortgage interest deduction value
            </div>
          </div>
        </div>

        <div className="bg-white bg-opacity-90 rounded-lg p-6 text-gray-900">
          <p className="text-lg font-semibold mb-3">
            {results.comparison.betterChoice === 'invest' 
              ? '📈 Investing Wins Financially' 
              : '🏠 Paying Off Mortgage Wins Financially'}
          </p>
          <div className="space-y-2 text-sm">
            {results.comparison.betterChoice === 'invest' ? (
              <>
                <p>
                  • After {inputs.yearsToCompare} years, you'll have <strong>{formatCurrency(results.comparison.netDifference)}</strong> more by investing the extra money instead of paying off your mortgage early.
                </p>
                <p>
                  • Your expected investment return ({inputs.investmentReturn}%) is higher than your mortgage rate ({inputs.mortgageRate}%), making investing more profitable.
                </p>
                <p>
                  • <strong>However:</strong> Investment returns aren't guaranteed. Paying off the mortgage gives you a guaranteed {inputs.mortgageRate}% return and peace of mind.
                </p>
              </>
            ) : (
              <>
                <p>
                  • After {inputs.yearsToCompare} years, you'll have <strong>{formatCurrency(results.comparison.netDifference)}</strong> more by paying off your mortgage early.
                </p>
                <p>
                  • Your mortgage rate ({inputs.mortgageRate}%) is higher than your expected investment return ({inputs.investmentReturn}%), making early payoff more profitable.
                </p>
                <p>
                  • Plus, you'll own your home in {results.payOff.yearsPaidOff.toFixed(1)} years and have no mortgage payment!
                </p>
              </>
            )}
          </div>
        </div>

        <div className="mt-4 bg-white bg-opacity-90 rounded-lg p-4 text-gray-900">
          <p className="text-xs font-semibold mb-2">⚖️ Other Factors to Consider:</p>
          <ul className="text-xs space-y-1 list-disc list-inside">
            <li><strong>Risk tolerance:</strong> Paying off mortgage = guaranteed return. Investing = potential for higher returns but more risk.</li>
            <li><strong>Liquidity:</strong> Investments can be accessed if needed. Home equity is harder to tap.</li>
            <li><strong>Peace of mind:</strong> Some people sleep better knowing they own their home outright.</li>
            <li><strong>Employer match:</strong> If you have a 401(k) match, always max that first (free money!).</li>
            <li><strong>High-interest debt:</strong> Pay off credit cards and high-interest loans before either option.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}