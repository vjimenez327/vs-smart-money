import { ExternalLink } from 'lucide-react';

export default function About() {
  return (
    <div className="bg-white rounded-xl shadow-lg p-8 max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold text-gray-900 mb-4">
        V's Smart Money Savings: An AI-Assisted Personal Finance Tool
      </h2>
      
      <a 
        href="https://vs-smart-money-9ehgs7up9-vanessas-projects-fae731b5.vercel.app/"
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 text-indigo-600 hover:text-indigo-800 mb-6"
      >
        Live Demo <ExternalLink className="w-4 h-4" />
      </a>

      <section className="mb-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-2">The Problem</h3>
        <p className="text-gray-700 mb-3">
          Many people don't fully understand the true cost of investment fees, especially when comparing robo-advisors to self-directed accounts. The decision isn't straightforward—you need to account for tax-loss harvesting benefits, time saved on portfolio management, opportunity cost of your time, and long-term fee impact with compound growth.
        </p>
        <p className="text-gray-700">
          I faced this exact decision: Was paying 0.34% for Betterment's robo-advisor worth it compared to managing my own portfolio at Fidelity for 0.05%? The math wasn't immediately obvious.
        </p>
      </section>

      <section className="mb-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-2">My Solution</h3>
        <p className="text-gray-700 mb-3">
          I built a fun, personal React-based calculator that helps users make informed investment decisions by showing the complete financial picture: annual fees, time savings value, tax benefits, and net value over time.
        </p>
        <p className="text-gray-700">
          The tool provides a clear verdict: whether the extra cost is justified by the benefits, or if self-directed investing makes more financial sense.
        </p>
      </section>

      <section className="mb-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-2">How I Used AI</h3>
        <div className="space-y-3 text-gray-700">
          <div>
            <strong>Planning & Architecture:</strong>
            <ul className="list-disc ml-6 mt-1">
              <li>Used Claude to structure the comparison logic and validate my approach to calculating net value</li>
              <li>Discussed edge cases and considerations I might have missed (tax brackets, time value calculations)</li>
            </ul>
          </div>
          <div>
            <strong>Development:</strong>
            <ul className="list-disc ml-6 mt-1">
              <li>Leveraged GitHub Copilot to accelerate React component development</li>
              <li>Used Claude to validate fee calculation formulas and ensure accuracy</li>
              <li>AI-assisted debugging when implementing the 10-year projection with compound growth</li>
            </ul>
          </div>
          <div>
            <strong>UX & Copy:</strong>
            <ul className="list-disc ml-6 mt-1">
              <li>Used Claude to refine user-facing copy to be clear, actionable, and non-technical</li>
              <li>Iterated on the "verdict" messaging to be helpful without being prescriptive</li>
            </ul>
          </div>
          <p className="mt-2 font-semibold">Total build time: ~3/4 hours from concept to deployment on Vercel</p>
        </div>
      </section>

      <section className="mb-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-2">Key Features</h3>
        <div className="grid md:grid-cols-2 gap-4 text-gray-700">
          <div>
            <strong>User Inputs:</strong>
            <ul className="list-disc ml-6 mt-1">
              <li>Account balances for both investment types</li>
              <li>Annual fee percentages</li>
              <li>Personal time value ($/hour)</li>
              <li>Tax bracket for calculating tax-loss harvesting benefit</li>
              <li>Expected portfolio growth rate</li>
              <li>Investment time horizon</li>
            </ul>
          </div>
          <div>
            <strong>Comprehensive Analysis:</strong>
            <ul className="list-disc ml-6 mt-1">
              <li>Extra Cost: Annual premium for robo-advisor vs. self-directed</li>
              <li>Time Saved: Monetized value of automation</li>
              <li>Tax Benefits: Estimated value from tax-loss harvesting</li>
              <li>Net Value: Bottom-line annual benefit or cost</li>
            </ul>
          </div>
          <div>
            <strong>Long-Term Projection:</strong>
            <ul className="list-disc ml-6 mt-1">
              <li>Calculates total fees over 10 years, accounting for portfolio growth</li>
              <li>Shows compounding impact of fee differences</li>
              <li>Highlights true cost difference over time</li>
            </ul>
          </div>
          <div>
            <strong>Clear Recommendation:</strong>
            <ul className="list-disc ml-6 mt-1">
              <li>✅ or ❌ verdict based on net value calculation</li>
              <li>Explains the reasoning in plain language</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="mb-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-2">Technical Implementation</h3>
        <div className="text-gray-700">
          <p className="mb-2"><strong>Stack:</strong></p>
          <ul className="list-disc ml-6 mb-3">
            <li>React for component architecture and state management</li>
            <li>Hosted on Vercel for instant deployment and easy sharing</li>
            <li>Responsive design for mobile and desktop use</li>
          </ul>
          <p className="mb-2"><strong>Key Technical Decisions:</strong></p>
          <ul className="list-disc ml-6">
            <li>Used controlled form inputs for real-time calculation updates</li>
            <li>Implemented percentage-based fee calculations that scale with balance</li>
            <li>Built modular components for easy iteration and feature additions</li>
          </ul>
        </div>
      </section>

      <section className="mb-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-2">The Outcome</h3>
        <div className="text-gray-700 space-y-2">
          <p>
            <strong>Personal Impact:</strong> This tool helped me make an informed decision to switch from Betterment to self-directed investing at Fidelity, saving me approximately $170 per year.
          </p>
          <p>
            <strong>Product Learning:</strong> Building this reinforced that the best product solutions take complex decisions and make them simple. Users don't need to understand fee math—they need to understand if they're making a good choice.
          </p>
        </div>
      </section>

      <section className="mb-6">
        <p className="text-gray-700">
          <strong>This project demonstrates my approach to product building:</strong>
        </p>
        <ul className="list-disc ml-6 text-gray-700">
          <li>Start with a real problem I personally experienced</li>
          <li>Use AI to move fast from idea to working prototype</li>
          <li>Focus on clarity over complexity in the user experience</li>
          <li>Ship and iterate based on real usage and feedback</li>
        </ul>
      </section>
    </div>
  );
}
