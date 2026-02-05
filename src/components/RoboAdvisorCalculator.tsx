import { useState } from 'react';
import { DollarSign, TrendingUp, Clock, Calculator, Sparkles } from 'lucide-react';

interface Account {
  balance: number;
  annualFees: number;
}

interface Assumptions {
  hourlyValue: number;
  hoursPerYear: number;
  taxBracket: number;
  estimatedTLHBenefit: number;
  expectedGrowth: number;
  yearsToProject: number;
}

export default function RoboAdvisorCalculator() {
  const [selfDirected, setSelfDirected] = useState<Account>({
    balance: 25000,
    annualFees: 12.50
  });
  
  const [roboAdvisor, setRoboAdvisor] = useState<Account>({
    balance: 15000,
    annualFees: 51
  });

  const [assumptions, setAssumptions] = useState<Assumptions>({
    hourlyValue: 50,
    hoursPerYear: 4,
    taxBracket: 24,
    estimatedTLHBenefit: 0.25,
    expectedGrowth: 9,
    yearsToProject: 10
  });

  const selfDirectedCost = selfDirected.annualFees || 0;
  const roboAdvisorCost = roboAdvisor.annualFees || 0;
  
  const selfDirectedPercent = selfDirected.balance > 0 ? (selfDirected.annualFees / selfDirected.balance * 100) : 0;
  const roboAdvisorPercent = roboAdvisor.balance > 0 ? (roboAdvisor.annualFees / roboAdvisor.balance * 100) : 0;
  
  const timeSavingsValue = (assumptions.hourlyValue || 0) * (assumptions.hoursPerYear || 0);
  const tlhValue = ((assumptions.estimatedTLHBenefit || 0) / 100) * (roboAdvisor.balance || 0) * ((assumptions.taxBracket || 0) / 100);
  const totalBenefits = timeSavingsValue + tlhValue;
  
  const feesDifference = roboAdvisorCost - selfDirectedCost;
  const netValue = totalBenefits - feesDifference;
  const isWorthIt = netValue > 0;

  const calculateCompoundFees = (balance: number, feePercent: number, growthRate: number, years: number): number => {
    let totalFeesPaid = 0;
    let currentBalance = balance;
    
    for (let year = 1; year <= years; year++) {
      const yearlyFee = currentBalance * (feePercent / 100);
      totalFeesPaid += yearlyFee;
      currentBalance = currentBalance * (1 + growthRate / 100) - yearlyFee;
    }
    
    return totalFeesPaid;
  };

  const selfDirectedTotalFees = calculateCompoundFees(
    selfDirected.balance, 
    selfDirectedPercent, 
    assumptions.expectedGrowth, 
    assumptions.yearsToProject
  );
  
  const roboAdvisorTotalFees = calculateCompoundFees(
    roboAdvisor.balance, 
    roboAdvisorPercent, 
    assumptions.expectedGrowth, 
    assumptions.yearsToProject
  );

  const feesDifferenceOverTime = roboAdvisorTotalFees - selfDirectedTotalFees;

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(amount);
  };

  return (
    <div>
      {/* Account Inputs */}
      <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Your Accounts</h2>
        <div className="grid md:grid-cols-2 gap-6">
          {/* Self-Directed Account */}
          <div className="border-2 border-indigo-200 rounded-lg p-4 bg-indigo-50">
            <h3 className="text-lg font-semibold text-indigo-900 mb-4">Self-Directed (Fidelity)</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Account Balance ($)
                </label>
                <input
                  type="number"
                  value={selfDirected.balance}
                  onChange={(e) => setSelfDirected({...selfDirected, balance: Number(e.target.value)})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Total Annual Fees ($)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={selfDirected.annualFees}
                  onChange={(e) => setSelfDirected({...selfDirected, annualFees: Number(e.target.value)})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                />
                <p className="text-xs text-gray-500 mt-1">
                  That's {selfDirectedPercent.toFixed(3)}% of your balance
                </p>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-indigo-300">
              <div className="flex justify-between items-center">
                <span className="font-semibold text-gray-700">Annual Cost:</span>
                <span className="text-2xl font-bold text-indigo-900">{formatCurrency(selfDirectedCost)}</span>
              </div>
            </div>
          </div>

          {/* Robo-Advisor Account */}
          <div className="border-2 border-purple-200 rounded-lg p-4 bg-purple-50">
            <h3 className="text-lg font-semibold text-purple-900 mb-4">Robo-Advisor (Betterment)</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Account Balance ($)
                </label>
                <input
                  type="number"
                  value={roboAdvisor.balance}
                  onChange={(e) => setRoboAdvisor({...roboAdvisor, balance: Number(e.target.value)})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Total Annual Fees ($)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={roboAdvisor.annualFees}
                  onChange={(e) => setRoboAdvisor({...roboAdvisor, annualFees: Number(e.target.value)})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                />
                <p className="text-xs text-gray-500 mt-1">
                  That's {roboAdvisorPercent.toFixed(3)}% of your balance
                </p>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-purple-300">
              <div className="flex justify-between items-center">
                <span className="font-semibold text-gray-700">Annual Cost:</span>
                <span className="text-2xl font-bold text-purple-900">{formatCurrency(roboAdvisorCost)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Value Assumptions */}
      <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Value of Robo-Advisor Benefits</h2>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Your Time Value ($/hour)
              </label>
              <input
                type="number"
                value={assumptions.hourlyValue}
                onChange={(e) => setAssumptions({...assumptions, hourlyValue: Number(e.target.value)})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
              />
              <p className="text-xs text-gray-500 mt-1">How much is your time worth?</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Hours Saved Per Year
              </label>
              <input
                type="number"
                value={assumptions.hoursPerYear}
                onChange={(e) => setAssumptions({...assumptions, hoursPerYear: Number(e.target.value)})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
              />
              <p className="text-xs text-gray-500 mt-1">Time saved on rebalancing, research, management</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Your Tax Bracket (%)
              </label>
              <input
                type="number"
                value={assumptions.taxBracket}
                onChange={(e) => setAssumptions({...assumptions, taxBracket: Number(e.target.value)})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
              />
              <p className="text-xs text-gray-500 mt-1">Federal income tax rate</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Est. Tax-Loss Harvesting Benefit (%)
              </label>
              <input
                type="number"
                step="0.01"
                value={assumptions.estimatedTLHBenefit}
                onChange={(e) => setAssumptions({...assumptions, estimatedTLHBenefit: Number(e.target.value)})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
              />
              <p className="text-xs text-gray-500 mt-1">Typical range: 0.1% - 0.5% of balance</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Expected Portfolio Growth (%)
              </label>
              <input
                type="number"
                step="0.1"
                value={assumptions.expectedGrowth}
                onChange={(e) => setAssumptions({...assumptions, expectedGrowth: Number(e.target.value)})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
              />
              <p className="text-xs text-gray-500 mt-1">Average annual return (e.g., 7-10%)</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Years to Project
              </label>
              <input
                type="number"
                value={assumptions.yearsToProject}
                onChange={(e) => setAssumptions({...assumptions, yearsToProject: Number(e.target.value)})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
              />
              <p className="text-xs text-gray-500 mt-1">How far into the future?</p>
            </div>
          </div>
        </div>
      </div>

      {/* Results */}
      <div className={`rounded-lg shadow-xl p-8 text-white ${isWorthIt ? 'bg-gradient-to-r from-green-500 to-emerald-600' : 'bg-gradient-to-r from-orange-500 to-red-600'}`}>
        <div className="flex items-center gap-3 mb-6 text-white">
          <TrendingUp className="w-8 h-8" />
          <h2 className="text-2xl font-bold">The Verdict</h2>
        </div>
        
        <div className="grid md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white bg-opacity-20 rounded-lg p-4 text-gray-900">
            <div className="flex items-center gap-2 mb-1">
              <DollarSign className="w-4 h-4" />
              <div className="text-sm font-medium">Extra Cost</div>
            </div>
            <div className="text-2xl font-bold">
              {feesDifference ? formatCurrency(feesDifference) : '$0.00'}/yr
            </div>
            <div className="text-xs mt-1">Robo-advisor premium</div>
          </div>
          
          <div className="bg-white bg-opacity-20 rounded-lg p-4 text-gray-900">
            <div className="flex items-center gap-2 mb-1">
              <Clock className="w-4 h-4" />
              <div className="text-sm font-medium">Time Saved</div>
            </div>
            <div className="text-2xl font-bold">
              {timeSavingsValue ? formatCurrency(timeSavingsValue) : '$0.00'}/yr
            </div>
            <div className="text-xs mt-1">
              {assumptions.hoursPerYear || 0} hours × ${assumptions.hourlyValue || 0}/hr
            </div>
          </div>

          <div className="bg-white bg-opacity-20 rounded-lg p-4 text-gray-900">
            <div className="flex items-center gap-2 mb-1">
              <Calculator className="w-4 h-4" />
              <div className="text-sm font-medium">Tax Benefits</div>
            </div>
            <div className="text-2xl font-bold">
              {tlhValue ? formatCurrency(tlhValue) : '$0.00'}/yr
            </div>
            <div className="text-xs mt-1">From tax-loss harvesting</div>
          </div>
          
          <div className="bg-white bg-opacity-20 rounded-lg p-4 text-gray-900">
            <div className="flex items-center gap-2 mb-1">
              <Sparkles className="w-4 h-4" />
              <div className="text-sm font-medium">Net Value</div>
            </div>
            <div className="text-2xl font-bold">
              {netValue ? formatCurrency(Math.abs(netValue)) : '$0.00'}/yr
            </div>
            <div className="text-xs mt-1">{isWorthIt ? 'Worth it!' : 'Not worth it'}</div>
          </div>
        </div>

        <div className="p-4 bg-white bg-opacity-90 rounded-lg text-gray-900">
          <p className="text-lg font-semibold mb-2">
            {isWorthIt ? '✅ Robo-Advisor is Worth It!' : '⚠️ Consider Self-Directed'}
          </p>
          <p className="text-sm">
            {isWorthIt 
              ? `The robo-advisor saves you ${formatCurrency(netValue)} per year after accounting for the extra fees. The automation, tax-loss harvesting, and time savings justify the cost.`
              : `You're paying ${formatCurrency(Math.abs(netValue))} more per year than the value you're getting. Consider managing your investments yourself or adjust your assumptions if you value the convenience differently.`
            }
          </p>
        </div>

        <div className="mt-4 p-4 bg-white bg-opacity-90 rounded-lg text-gray-900">
          <p className="text-sm font-semibold mb-2">
            📊 Total Fees Over {assumptions.yearsToProject} Years (with {assumptions.expectedGrowth}% growth):
          </p>
          <div className="grid md:grid-cols-2 gap-4 text-xs">
            <div>
              <p className="opacity-80">Self-Directed Total Fees:</p>
              <p className="text-lg font-bold">{formatCurrency(selfDirectedTotalFees)}</p>
            </div>
            <div>
              <p className="opacity-80">Robo-Advisor Total Fees:</p>
              <p className="text-lg font-bold">{formatCurrency(roboAdvisorTotalFees)}</p>
            </div>
          </div>
          <p className="text-xs mt-3 opacity-90">
            <strong>Difference:</strong> You'll pay {formatCurrency(Math.abs(feesDifferenceOverTime))} {feesDifferenceOverTime > 0 ? 'more' : 'less'} in fees with the robo-advisor over {assumptions.yearsToProject} years. This accounts for your portfolio growing at {assumptions.expectedGrowth}% annually while fees are charged on the increasing balance.
          </p>
        </div>
      </div>
    </div>
  );
}