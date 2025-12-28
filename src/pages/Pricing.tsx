import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Link as LinkIcon } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { PLAN_LIMITS, COST_COMPARISON } from '../lib/config';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { LoginModal } from '../components/LoginModal';
import { useAuth } from '../lib/auth-context';

export function Pricing() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  const comparisonFeatures = [
    { name: 'Vector capacity', free: '10K', starter: '100K', pro: '250K', scale: '1M', enterprise: 'Unlimited' },
    { name: 'QPS burst', free: '~5', starter: '~10', pro: '~25', scale: '~60', enterprise: 'Custom' },
    { name: 'Concurrent searches', free: '2', starter: '5', pro: '10', scale: '25', enterprise: 'Unlimited' },
    { name: 'Daily query limit', free: '5K', starter: '50K', pro: '200K', scale: '1M', enterprise: 'Unlimited' },
    { name: 'Compression ratio', free: '12.71x', starter: '12.71x', pro: '12.71x', scale: '12.71x', enterprise: '12.71x' },
    { name: 'Recall@10', free: '39.34%*', starter: '39.34%*', pro: '39.34%*', scale: '39.34%*', enterprise: '39.34%*' },
    { name: 'p95 Latency', free: '33.69ms*', starter: '33.69ms*', pro: '33.69ms*', scale: '33.69ms*', enterprise: '33.69ms*' },
    { name: 'Support', free: 'Community', starter: 'Community', pro: 'Priority', scale: 'Priority', enterprise: 'Dedicated' },
    { name: 'SLA', free: '—', starter: '—', pro: '—', scale: '99.9%', enterprise: '99.9%' },
    { name: 'Custom deployment', free: '—', starter: '—', pro: '—', scale: '—', enterprise: '✓' },
  ];

  const costComparisonData = [
    { name: 'Veclite', monthly: COST_COMPARISON.monthly.mcn, storage: COST_COMPARISON.storage.mcn },
    { name: 'Qdrant', monthly: COST_COMPARISON.monthly.qdrant, storage: COST_COMPARISON.storage.qdrant },
    { name: 'Weaviate', monthly: COST_COMPARISON.monthly.weaviate, storage: COST_COMPARISON.storage.weaviate },
    { name: 'Pinecone', monthly: COST_COMPARISON.monthly.pinecone, storage: COST_COMPARISON.storage.pinecone }
  ];

  return (
    <div className="min-h-screen bg-slate-950 pt-24 pb-16">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto mb-16 text-center"
        >
          <Badge variant="cyan" className="mb-6">
            Results-Driven Pricing
          </Badge>
          <h1 className="text-5xl font-bold text-slate-100 mb-6">
            Simple, Transparent Pricing
          </h1>
          <p className="text-xl text-slate-400 mb-4">
            Start free, scale as you grow. No hidden fees.
          </p>
          <Link to="/#benchmarks" className="inline-flex items-center gap-2 text-cyan-400 hover:text-cyan-300 transition-colors">
            <LinkIcon size={16} />
            View benchmark results
          </Link>
        </motion.div>

        {/* Why Veclite is Cheaper Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto mb-20"
        >
          <Card glow className="mb-12">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-slate-100 mb-4">Why Veclite is Cheaper</h2>
              <p className="text-slate-400 text-lg mb-6">
                Traditional vector databases store every embedding individually.
              </p>
              <p className="text-xl text-cyan-400 font-semibold">
                Veclite compresses embeddings into semantic clusters, reducing storage by 10–15× without accuracy loss.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-slate-800/30 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-slate-100 mb-3">Storage Cost Comparison</h3>
                <p className="text-sm text-slate-400 mb-4">Cost per 1M vectors/month (relative)</p>
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={costComparisonData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                    <XAxis dataKey="name" stroke="#94a3b8" />
                    <YAxis stroke="#94a3b8" />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155' }}
                      labelStyle={{ color: '#e2e8f0' }}
                    />
                    <Bar dataKey="storage" fill="#22d3ee" name="Storage Cost (%)" />
                  </BarChart>
                </ResponsiveContainer>
                <p className="text-xs text-slate-500 mt-2 text-center">
                  Veclite uses only 7.9% storage vs competitors (12.71x compression)
                </p>
              </div>

              <div className="bg-slate-800/30 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-slate-100 mb-3">Monthly Cost Comparison</h3>
                <p className="text-sm text-slate-400 mb-4">250K vectors + 200K queries/day</p>
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={costComparisonData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                    <XAxis dataKey="name" stroke="#94a3b8" />
                    <YAxis stroke="#94a3b8" />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155' }}
                      labelStyle={{ color: '#e2e8f0' }}
                      formatter={(value) => `$${value}`}
                    />
                    <Bar dataKey="monthly" fill="#10b981" name="Monthly Cost ($)" />
                  </BarChart>
                </ResponsiveContainer>
                <p className="text-xs text-slate-500 mt-2 text-center">
                  Veclite: $19/mo • Qdrant: ~$45/mo • Weaviate: ~$55/mo • Pinecone: ~$70/mo
                </p>
              </div>
            </div>
          </Card>
        </motion.section>

        <div className="max-w-7xl mx-auto mb-20">
          <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-6">
            {Object.values(PLAN_LIMITS).map((plan, i) => {
              const isCurrentPlan = user && user.plan === plan.name.toLowerCase();
              return (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <Card
                  hover
                  glow={plan.name === 'Pro' || plan.name === 'Scale' || isCurrentPlan}
                  className={`h-full flex flex-col ${
                    (plan.name === 'Pro' || plan.name === 'Scale' || isCurrentPlan) ? 'border-cyan-500/50 relative' : ''
                  }`}
                >
                  {(plan.name === 'Pro' || plan.name === 'Scale') && !isCurrentPlan && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                      <Badge variant="cyan">{plan.name === 'Pro' ? 'Popular' : 'Best Value'}</Badge>
                    </div>
                  )}
                  {isCurrentPlan && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                      <Badge variant="cyan">Current Plan</Badge>
                    </div>
                  )}

                  <div className="text-center mb-6">
                    <h3 className="text-xl font-bold text-slate-100 mb-3">{plan.name}</h3>
                    <div className="mb-2">
                      {plan.price !== null ? (
                        <>
                          <span className="text-4xl font-bold text-cyan-400">${plan.price}</span>
                          <span className="text-slate-400 text-sm">/month</span>
                        </>
                      ) : (
                        <span className="text-4xl font-bold text-slate-100">Custom</span>
                      )}
                    </div>
                    {plan.useCase && (
                      <p className="text-xs text-slate-500 mt-2">{plan.useCase}</p>
                    )}
                  </div>

                  <ul className="space-y-3 mb-6 flex-1 text-sm">
                    {plan.features.map((feature, j) => (
                      <li key={j} className="flex items-start gap-2">
                        <CheckCircle2 size={16} className="text-cyan-400 mt-0.5 flex-shrink-0" />
                        <span className="text-slate-300">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <Button
                    variant={plan.name === 'Pro' || plan.name === 'Scale' ? 'primary' : 'secondary'}
                    className="w-full"
                    size="md"
                    onClick={async () => {
                      if (!user) {
                        setIsLoginOpen(true);
                        return;
                      }
                      
                      // Check if user is already on this plan
                      if (user.plan === plan.name.toLowerCase()) {
                        alert(`You are already on the ${plan.name} plan.`);
                        return;
                      }
                      
                      // If Enterprise, show contact message
                      if (plan.name === 'Enterprise') {
                        alert('Please contact sales for Enterprise pricing.');
                        return;
                      }
                      
                      // For paid plans, redirect to Stripe checkout
                      try {
                        const apiUrl = import.meta.env.VITE_MCN_API_URL || 'http://localhost:8000';
                        const response = await fetch(`${apiUrl}/api/stripe/create-checkout-session`, {
                          method: 'POST',
                          headers: {
                            'Content-Type': 'application/json',
                          },
                          body: JSON.stringify({
                            api_key: user.apiKey,
                            plan: plan.name.toLowerCase(),
                          }),
                        });
                        
                        if (!response.ok) {
                          const errorData = await response.json().catch(() => ({ detail: 'Unknown error' }));
                          throw new Error(errorData.detail || `HTTP ${response.status}: ${response.statusText}`);
                        }
                        
                        const data = await response.json();
                        if (data.url) {
                          window.location.href = data.url;
                        } else {
                          throw new Error('No checkout URL returned from server');
                        }
                      } catch (error: any) {
                        console.error('Stripe checkout error:', error);
                        const errorMessage = error.message || 'Failed to create checkout session';
                        alert(`Unable to start checkout: ${errorMessage}\n\nPlease contact support at patelhetul803@gmail.com if this persists.`);
                      }
                    }}
                  >
                    {plan.name === 'Enterprise' 
                      ? 'Contact Sales' 
                      : user?.plan === plan.name.toLowerCase() 
                        ? 'Current Plan' 
                        : user 
                          ? 'Upgrade' 
                          : 'Get Started'}
                  </Button>
                </Card>
              </motion.div>
            );
            })}
          </div>
        </div>

        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-6xl mx-auto mb-20"
        >
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-100 mb-4">Detailed Comparison</h2>
            <p className="text-slate-400">Side-by-side feature breakdown</p>
          </div>

          <Card glow>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-800">
                    <th className="text-left py-4 px-4 text-slate-300 font-semibold">Feature</th>
                    <th className="text-center py-4 px-3 text-slate-300 font-semibold text-xs">Free</th>
                    <th className="text-center py-4 px-3 text-slate-300 font-semibold text-xs">Starter</th>
                    <th className="text-center py-4 px-3 text-cyan-400 font-semibold text-xs">Pro</th>
                    <th className="text-center py-4 px-3 text-cyan-400 font-semibold text-xs">Scale</th>
                    <th className="text-center py-4 px-3 text-slate-300 font-semibold text-xs">Enterprise</th>
                  </tr>
                </thead>
                <tbody>
                  {comparisonFeatures.map((feature, i) => (
                    <tr key={i} className="border-b border-slate-800/50 hover:bg-slate-800/30">
                      <td className="py-4 px-4 text-slate-300 text-sm">{feature.name}</td>
                      <td className="py-4 px-3 text-center text-slate-400 font-mono text-xs">
                        {feature.free}
                      </td>
                      <td className="py-4 px-3 text-center text-slate-400 font-mono text-xs">
                        {feature.starter}
                      </td>
                      <td className="py-4 px-3 text-center text-cyan-400 font-mono text-xs font-semibold">
                        {feature.pro}
                      </td>
                      <td className="py-4 px-3 text-center text-cyan-400 font-mono text-xs font-semibold">
                        {feature.scale}
                      </td>
                      <td className="py-4 px-3 text-center text-slate-400 font-mono text-xs">
                        {feature.enterprise}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto mt-20"
        >
          <div className="text-center">
            <h2 className="text-3xl font-bold text-slate-100 mb-6">
              Backed by Real Results
            </h2>
            <p className="text-slate-400 mb-8">
              All plans benefit from the same core technology proven across industry benchmarks
            </p>
            <div className="grid md:grid-cols-3 gap-6">
              <Card className="text-center">
                <div className="text-4xl font-bold text-cyan-400 mb-2">12.71x</div>
                <p className="text-slate-300">Compression Ratio</p>
                <p className="text-xs text-slate-500 mt-1">MS MARCO 100K test</p>
                <p className="text-xs text-emerald-400 mt-1">92.1% storage savings</p>
              </Card>
              <Card className="text-center">
                <div className="text-4xl font-bold text-cyan-400 mb-2">39.34%</div>
                <p className="text-slate-300">Recall@10</p>
                <p className="text-xs text-slate-500 mt-1">MS MARCO 100K test</p>
                <p className="text-xs text-emerald-400 mt-1">Perfect parity with FAISS</p>
              </Card>
              <Card className="text-center">
                <div className="text-4xl font-bold text-cyan-400 mb-2">33.69ms</div>
                <p className="text-slate-300">p95 Latency</p>
                <p className="text-xs text-slate-500 mt-1">MS MARCO 100K test</p>
                <p className="text-xs text-emerald-400 mt-1">Competitive with ANN systems</p>
                <p className="text-xs text-slate-500 mt-1">*FAISS Exact: 3.16ms (no compression)</p>
              </Card>
            </div>
            <Link to="/#benchmarks" className="inline-block mt-8">
              <Button variant="secondary">View Full Benchmarks</Button>
            </Link>
          </div>
        </motion.section>
      </div>

      <LoginModal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />
    </div>
  );
}
