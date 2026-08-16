import { Link } from 'react-router-dom';
import {
  Cloud,
  Server,
  Boxes,
  AppWindow,
  ArrowRight,
  CheckCircle2,
  TrendingUp,
  DollarSign,
  ShieldCheck,
  FileText,
} from 'lucide-react';

export function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <header className="bg-slate-900 text-white">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Cloud className="w-7 h-7 text-sky-400" />
            <span className="font-semibold text-lg">Cloud Service Model Advisor</span>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/login" className="text-slate-300 hover:text-white text-sm font-medium">
              Sign In
            </Link>
            <Link
              to="/register"
              className="bg-sky-600 hover:bg-sky-500 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
            >
              Get Started
            </Link>
          </div>
        </nav>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-slate-800 px-3 py-1 rounded-full text-xs text-sky-400 mb-6">
              <span className="w-2 h-2 bg-sky-400 rounded-full" />
              Academic Decision-Support Framework
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
              Should you choose{' '}
              <span className="text-sky-400">IaaS</span>,{' '}
              <span className="text-emerald-400">PaaS</span>, or{' '}
              <span className="text-amber-400">SaaS</span>?
            </h1>
            <p className="text-lg text-slate-300 mb-8 max-w-2xl mx-auto">
              A data-driven decision-support platform that evaluates your business, technical,
              operational, and financial requirements — then scores, ranks, and recommends the
              right cloud service model with cost and TCO analysis.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/register"
                className="inline-flex items-center justify-center gap-2 bg-sky-600 hover:bg-sky-500 text-white px-6 py-3 rounded-lg font-medium transition-colors"
              >
                Start Analyzing
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/login"
                className="inline-flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-white px-6 py-3 rounded-lg font-medium transition-colors border border-slate-700"
              >
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Models */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-4">Three Cloud Service Models</h2>
          <p className="text-center text-gray-500 mb-12 max-w-2xl mx-auto">
            The application evaluates all three models against your requirements and recommends the best fit.
          </p>
          <div className="grid md:grid-cols-3 gap-6">
            <ModelCard
              icon={<Server className="w-8 h-8" />}
              title="IaaS"
              subtitle="Infrastructure as a Service"
              description="Rent virtual machines, storage, and networking. You manage OS, runtime, and applications."
              color="sky"
              examples="AWS EC2, Azure VM, Google Compute Engine"
            />
            <ModelCard
              icon={<Boxes className="w-8 h-8" />}
              title="PaaS"
              subtitle="Platform as a Service"
              description="Rent a managed platform to build and run applications. You bring code and data."
              color="emerald"
              examples="Heroku, AWS Elastic Beanstalk, Azure App Service"
            />
            <ModelCard
              icon={<AppWindow className="w-8 h-8" />}
              title="SaaS"
              subtitle="Software as a Service"
              description="Use ready-made software over the internet. The provider manages everything."
              color="amber"
              examples="Google Workspace, Microsoft 365, Salesforce"
            />
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">How It Works</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <FeatureCard
              icon={<CheckCircle2 className="w-6 h-6" />}
              title="Requirement Scoring"
              description="14+ weighted factors across technical, operational, financial, and business categories."
            />
            <FeatureCard
              icon={<TrendingUp className="w-6 h-6" />}
              title="Intelligent Ranking"
              description="Scores IaaS, PaaS, SaaS on a 0-100 scale with confidence indicators."
            />
            <FeatureCard
              icon={<DollarSign className="w-6 h-6" />}
              title="Cost & TCO Analysis"
              description="Monthly, annual, and 3-year total cost of ownership for each model."
            />
            <FeatureCard
              icon={<FileText className="w-6 h-6" />}
              title="Decision Reports"
              description="Downloadable reports with recommendations, trade-offs, and comparisons."
            />
          </div>
        </div>
      </section>

      {/* Responsibility */}
      <section className="py-20 bg-slate-900 text-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-4">Shared Responsibility Model</h2>
          <p className="text-center text-slate-400 mb-12 max-w-2xl mx-auto">
            Different cloud models shift the responsibility boundary between you and the provider.
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-700">
                  <th className="text-left py-3 px-4 text-slate-300 font-medium">Component</th>
                  <th className="text-center py-3 px-4 text-sky-400 font-medium">IaaS</th>
                  <th className="text-center py-3 px-4 text-emerald-400 font-medium">PaaS</th>
                  <th className="text-center py-3 px-4 text-amber-400 font-medium">SaaS</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ['Application', 'You', 'You', 'Provider'],
                  ['Data', 'You', 'You', 'You / Provider'],
                  ['Runtime', 'You', 'Provider', 'Provider'],
                  ['Operating System', 'You', 'Provider', 'Provider'],
                  ['Virtualization', 'Provider', 'Provider', 'Provider'],
                  ['Servers', 'Provider', 'Provider', 'Provider'],
                  ['Storage', 'Provider', 'Provider', 'Provider'],
                  ['Networking', 'Provider', 'Provider', 'Provider'],
                ].map(([comp, iaas, paas, saas]) => (
                  <tr key={comp} className="border-b border-slate-800">
                    <td className="py-3 px-4 text-slate-300">{comp}</td>
                    <td className="text-center py-3 px-4 text-slate-400">{iaas}</td>
                    <td className="text-center py-3 px-4 text-slate-400">{paas}</td>
                    <td className="text-center py-3 px-4 text-slate-400">{saas}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-center text-slate-500 text-xs mt-6">
            Exact responsibility boundaries vary by provider. This is a general model.
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-white">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <ShieldCheck className="w-12 h-12 text-sky-600 mx-auto mb-4" />
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Ready to Make a Data-Driven Decision?</h2>
          <p className="text-gray-500 mb-8">
            Create your first cloud decision scenario and get an instant recommendation with cost analysis.
          </p>
          <Link
            to="/register"
            className="inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white px-6 py-3 rounded-lg font-medium transition-colors"
          >
            Get Started Free
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-8">
        <div className="max-w-7xl mx-auto px-4 text-center text-sm">
          <p>Cloud Service Model Advisor — Academic Decision-Support Framework</p>
          <p className="text-xs mt-2 text-slate-500">
            IBM Internship Project — Illustrative academic cost model. Not real cloud pricing.
          </p>
        </div>
      </footer>
    </div>
  );
}

function ModelCard({
  icon,
  title,
  subtitle,
  description,
  color,
  examples,
}: {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  description: string;
  color: 'sky' | 'emerald' | 'amber';
  examples: string;
}) {
  const colorMap = {
    sky: 'bg-sky-50 text-sky-600 border-sky-200',
    emerald: 'bg-emerald-50 text-emerald-600 border-emerald-200',
    amber: 'bg-amber-50 text-amber-600 border-amber-200',
  };
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
      <div className={`w-14 h-14 rounded-xl flex items-center justify-center mb-4 border ${colorMap[color]}`}>
        {icon}
      </div>
      <h3 className="text-xl font-bold text-gray-800">{title}</h3>
      <p className="text-sm text-gray-500 mb-3">{subtitle}</p>
      <p className="text-sm text-gray-600 mb-4">{description}</p>
      <p className="text-xs text-gray-400 font-medium">{examples}</p>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="p-6 rounded-xl border border-gray-200 bg-white">
      <div className="w-10 h-10 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center mb-4">
        {icon}
      </div>
      <h3 className="font-semibold text-gray-800 mb-2">{title}</h3>
      <p className="text-sm text-gray-500">{description}</p>
    </div>
  );
}
