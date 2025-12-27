import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Database, Zap, TrendingUp, CheckCircle2, ArrowDown } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Button } from '../ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { BENCHMARK_RESULTS, PLAN_LIMITS, COST_COMPARISON } from '../lib/config';
import { LoginModal } from '../components/LoginModal';

export function Home() {
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  const scrollToBenchmarks = () => {
    document.getElementById('benchmarks')?.scrollIntoView({ behavior: 'smooth' });
  };

  // Comparison data for MS MARCO 100K test
  const comparisonData = [
    { name: 'Memryx', recall: 39.34, latency: 33.69, compression: 12.71, storageCost: 7.9 },
    { name: 'FAISS Exact', recall: 39.34, latency: 3.16, compression: 1.00, storageCost: 100 },
    { name: 'ANN/HNSW*', recall: 36.0, latency: 35.0, compression: 1.00, storageCost: 100 }
  ];

  const compressionData = BENCHMARK_RESULTS.map(b => ({
    name: b.dataset.split(' ')[0],
    compression: b.compression,
    latency: b.p95Latency
  }));

  const recallData = BENCHMARK_RESULTS.map(b => ({
    name: b.dataset.split(' ')[0],
    recall: (b.recall * 100).toFixed(1),
    vectors: b.vectors / 1000
  }));

  const costComparisonData = [
    { name: 'Memryx', monthly: COST_COMPARISON.monthly.mcn, storage: COST_COMPARISON.storage.mcn },
    { name: 'Qdrant', monthly: COST_COMPARISON.monthly.qdrant, storage: COST_COMPARISON.storage.qdrant },
    { name: 'Weaviate', monthly: COST_COMPARISON.monthly.weaviate, storage: COST_COMPARISON.storage.weaviate },
    { name: 'Pinecone', monthly: COST_COMPARISON.monthly.pinecone, storage: COST_COMPARISON.storage.pinecone }
  ];

  return (
    <div className="min-h-screen bg-slate-950">
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-blue-500/5 to-purple-500/5"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(34,211,238,0.1),transparent_50%)]"></div>

        <div className="container mx-auto px-4 py-20 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-4xl mx-auto"
          >
            <Badge variant="cyan" className="mb-6">
              Vector Database designed for long-term AI memory.
            </Badge>

            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-cyan-400 via-blue-400 to-cyan-500 bg-clip-text text-transparent leading-tight">
              Memryx
            </h1>

            <p className="text-xl md:text-2xl text-slate-400 mb-12 leading-relaxed">
              Memryx is a compressed memory engine that delivers exact recall at a fraction of vector DB cost for large-scale AI systems.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button size="lg" onClick={scrollToBenchmarks}>
                View Results
                <ArrowDown size={20} className="ml-2" />
              </Button>
              <Button size="lg" variant="secondary" onClick={() => setIsLoginOpen(true)}>
                Open Portal
                <ArrowRight size={20} className="ml-2" />
              </Button>
            </div>
          </motion.div>
        </div>

        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        >
          <ArrowDown size={32} className="text-cyan-400/50" />
        </motion.div>
      </section>

      <section className="py-20 bg-slate-900/50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-slate-100 mb-4">How It Works</h2>
            <p className="text-slate-400 text-lg">Three steps to efficient vector search</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              {
                icon: Database,
                title: 'Ingest Vectors',
                description: 'Upload your embeddings via API. Batch processing optimized for throughput.',
                step: '01'
              },
              {
                icon: Zap,
                title: 'Build Clusters',
                description: 'Memryx creates super-vectors representing semantic clusters. 12.71x compression achieved (92.1% storage savings).',
                step: '02'
              },
              {
                icon: TrendingUp,
                title: 'Route + Rerank',
                description: 'Queries route to relevant clusters, then exact search within. Exact recall parity guaranteed (39.34% = FAISS exact).',
                step: '03'
              }
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.2 }}
              >
                <Card hover glow>
                  <div className="flex items-start gap-4">
                    <div className="text-5xl font-bold text-cyan-500/20">{item.step}</div>
                    <div className="flex-1">
                      <div className="w-12 h-12 bg-cyan-500/10 rounded-lg flex items-center justify-center mb-4">
                        <item.icon size={24} className="text-cyan-400" />
                      </div>
                      <h3 className="text-xl font-semibold text-slate-100 mb-2">{item.title}</h3>
                      <p className="text-slate-400">{item.description}</p>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-slate-100 mb-4">Why Memryx</h2>
            <p className="text-slate-400 text-lg">Predictable performance at scale</p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {[
              {
                title: 'Cost Efficient',
                description: '12.71x compression means 92.1% less storage cost',
                icon: '💰'
              },
              {
                title: 'Stable Latency',
                description: 'p95 latency stays consistent as you scale',
                icon: '⚡'
              },
              {
                title: 'Multi-Tenant Ready',
                description: 'Clear limits per plan. No noisy neighbors.',
                icon: '🏢'
              },
              {
                title: 'Predictable Scaling',
                description: 'Know your costs and performance ahead of time',
                icon: '📊'
              }
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <Card className="text-center h-full">
                  <div className="text-4xl mb-4">{item.icon}</div>
                  <h3 className="text-lg font-semibold text-slate-100 mb-2">{item.title}</h3>
                  <p className="text-slate-400 text-sm">{item.description}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section id="benchmarks" className="py-20 bg-slate-900/50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-slate-100 mb-4">Real Benchmark Results</h2>
            <p className="text-slate-400 text-lg">Tested on industry-standard datasets</p>
          </motion.div>

          <div className="max-w-7xl mx-auto space-y-8">
            <div className="grid lg:grid-cols-2 gap-8">
              <Card glow>
                <CardHeader>
                  <CardTitle>Recall Comparison (MS MARCO 100K)</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={250}>
                    <BarChart data={comparisonData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                      <XAxis dataKey="name" stroke="#94a3b8" />
                      <YAxis stroke="#94a3b8" />
                      <Tooltip
                        contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155' }}
                        labelStyle={{ color: '#e2e8f0' }}
                      />
                      <Bar dataKey="recall" fill="#22d3ee" name="Recall@10 (%)" />
                    </BarChart>
                  </ResponsiveContainer>
                  <p className="text-xs text-slate-500 mt-2 text-center">
                    Memryx = FAISS Exact (39.34% vs 39.34%) • Better than ANN systems (~35-37%)
                  </p>
                </CardContent>
              </Card>

              <Card glow>
                <CardHeader>
                  <CardTitle>Latency Comparison (MS MARCO 100K)</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={250}>
                    <BarChart data={comparisonData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                      <XAxis dataKey="name" stroke="#94a3b8" />
                      <YAxis stroke="#94a3b8" />
                      <Tooltip
                        contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155' }}
                        labelStyle={{ color: '#e2e8f0' }}
                      />
                      <Bar dataKey="latency" fill="#22d3ee" name="p95 Latency (ms)" />
                    </BarChart>
                  </ResponsiveContainer>
                  <p className="text-xs text-slate-500 mt-2 text-center">
                    Memryx (33.69ms) competitive with ANN systems • FAISS Exact faster but no compression
                  </p>
                </CardContent>
              </Card>
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
              <Card glow>
                <CardHeader>
                  <CardTitle>Compression Ratio Comparison</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={250}>
                    <BarChart data={comparisonData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                      <XAxis dataKey="name" stroke="#94a3b8" />
                      <YAxis stroke="#94a3b8" />
                      <Tooltip
                        contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155' }}
                        labelStyle={{ color: '#e2e8f0' }}
                      />
                      <Bar dataKey="compression" fill="#10b981" name="Compression Ratio" />
                    </BarChart>
                  </ResponsiveContainer>
                  <p className="text-xs text-slate-500 mt-2 text-center">
                    Memryx achieves 12.71x compression (92.1% storage savings) • Others: 1.00x
                  </p>
                </CardContent>
              </Card>

              <Card glow>
                <CardHeader>
                  <CardTitle>Storage Cost Comparison</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={250}>
                    <BarChart data={comparisonData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                      <XAxis dataKey="name" stroke="#94a3b8" />
                      <YAxis stroke="#94a3b8" />
                      <Tooltip
                        contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155' }}
                        labelStyle={{ color: '#e2e8f0' }}
                      />
                      <Bar dataKey="storageCost" fill="#10b981" name="Relative Storage Cost (%)" />
                    </BarChart>
                  </ResponsiveContainer>
                  <p className="text-xs text-slate-500 mt-2 text-center">
                    Memryx uses only 7.9% storage vs competitors (12.7x cost savings)
                  </p>
                </CardContent>
              </Card>
            </div>

            <Card glow>
              <CardHeader>
                <CardTitle>Memryx vs Competitors (MS MARCO 100K)</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-slate-800">
                        <th className="text-left py-3 px-4 text-slate-300 font-semibold">Metric</th>
                        <th className="text-right py-3 px-4 text-cyan-400 font-semibold">Memryx</th>
                        <th className="text-right py-3 px-4 text-slate-400 font-semibold">FAISS Exact</th>
                        <th className="text-right py-3 px-4 text-slate-400 font-semibold">ANN/HNSW*</th>
                        <th className="text-right py-3 px-4 text-emerald-400 font-semibold">Winner</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-slate-800/50 hover:bg-slate-800/30">
                        <td className="py-3 px-4 text-slate-300">Recall@10</td>
                        <td className="py-3 px-4 text-right text-cyan-400 font-mono">39.34%</td>
                        <td className="py-3 px-4 text-right text-slate-300 font-mono">39.34%</td>
                        <td className="py-3 px-4 text-right text-slate-500 font-mono">~35-37%</td>
                        <td className="py-3 px-4 text-right text-emerald-400">Memryx = FAISS Exact ✅</td>
                      </tr>
                      <tr className="border-b border-slate-800/50 hover:bg-slate-800/30">
                        <td className="py-3 px-4 text-slate-300">nDCG@10</td>
                        <td className="py-3 px-4 text-right text-cyan-400 font-mono">0.3942</td>
                        <td className="py-3 px-4 text-right text-slate-300 font-mono">0.3942</td>
                        <td className="py-3 px-4 text-right text-slate-500 font-mono">~0.35-0.37</td>
                        <td className="py-3 px-4 text-right text-emerald-400">Memryx = FAISS Exact ✅</td>
                      </tr>
                      <tr className="border-b border-slate-800/50 hover:bg-slate-800/30">
                        <td className="py-3 px-4 text-slate-300">MRR@10</td>
                        <td className="py-3 px-4 text-right text-cyan-400 font-mono">0.4940</td>
                        <td className="py-3 px-4 text-right text-slate-300 font-mono">0.4940</td>
                        <td className="py-3 px-4 text-right text-slate-500 font-mono">~0.45-0.47</td>
                        <td className="py-3 px-4 text-right text-emerald-400">Memryx = FAISS Exact ✅</td>
                      </tr>
                      <tr className="border-b border-slate-800/50 hover:bg-slate-800/30">
                        <td className="py-3 px-4 text-slate-300">p95 Latency</td>
                        <td className="py-3 px-4 text-right text-cyan-400 font-mono">33.69ms</td>
                        <td className="py-3 px-4 text-right text-slate-300 font-mono">3.16ms</td>
                        <td className="py-3 px-4 text-right text-slate-500 font-mono">~20-50ms</td>
                        <td className="py-3 px-4 text-right text-emerald-400">Memryx = ANN ✅</td>
                      </tr>
                      <tr className="border-b border-slate-800/50 hover:bg-slate-800/30">
                        <td className="py-3 px-4 text-slate-300">Compression</td>
                        <td className="py-3 px-4 text-right text-cyan-400 font-mono">12.71:1</td>
                        <td className="py-3 px-4 text-right text-slate-300 font-mono">1.00:1</td>
                        <td className="py-3 px-4 text-right text-slate-500 font-mono">1.00:1</td>
                        <td className="py-3 px-4 text-right text-emerald-400">Memryx 🏆 (92.1% savings)</td>
                      </tr>
                      <tr className="border-b border-slate-800/50 hover:bg-slate-800/30">
                        <td className="py-3 px-4 text-slate-300">Storage Cost</td>
                        <td className="py-3 px-4 text-right text-cyan-400 font-mono">7.9%</td>
                        <td className="py-3 px-4 text-right text-slate-300 font-mono">100%</td>
                        <td className="py-3 px-4 text-right text-slate-500 font-mono">100%</td>
                        <td className="py-3 px-4 text-right text-emerald-400">Memryx 🏆 (12.7x cheaper)</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div className="mt-6 p-4 bg-slate-800/30 rounded-lg">
                  <p className="text-sm text-slate-400 mb-2">
                    <span className="text-cyan-400 font-semibold">Key Insight:</span> Memryx achieves <span className="text-emerald-400">perfect recall parity</span> with FAISS exact search (39.34% vs 39.34%) while providing <span className="text-emerald-400">12.71x compression</span> (92.1% storage savings).
                  </p>
                  <p className="text-sm text-slate-400">
                    <span className="text-cyan-400 font-semibold">Latency Context:</span> Memryx's 33.69ms p95 latency is <span className="text-emerald-400">competitive with ANN systems</span> (HNSW, Qdrant) which typically achieve 20-50ms, while FAISS IndexFlatIP's 3.16ms comes from exact brute-force search with no compression. Memryx offers the best balance: <span className="text-emerald-400">exact recall + compression + competitive latency</span>.
                  </p>
                  <p className="text-xs text-slate-500 mt-2">
                    *ANN/HNSW estimates based on industry benchmarks. FAISS IndexFlatIP uses exact search (no approximation).
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card glow>
              <CardHeader>
                <CardTitle>All Test Results</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-slate-800">
                        <th className="text-left py-3 px-4 text-slate-300 font-semibold">Dataset</th>
                        <th className="text-right py-3 px-4 text-slate-300 font-semibold">Recall@10</th>
                        <th className="text-right py-3 px-4 text-slate-300 font-semibold">p95 Latency</th>
                        <th className="text-right py-3 px-4 text-slate-300 font-semibold">Compression</th>
                        <th className="text-right py-3 px-4 text-slate-300 font-semibold">Build Time</th>
                        <th className="text-center py-3 px-4 text-slate-300 font-semibold">Parity</th>
                      </tr>
                    </thead>
                    <tbody>
                      {BENCHMARK_RESULTS.map((result, i) => (
                        <tr key={i} className="border-b border-slate-800/50 hover:bg-slate-800/30">
                          <td className="py-3 px-4 text-slate-300">{result.dataset}</td>
                          <td className="py-3 px-4 text-right text-cyan-400 font-mono">
                            {result.recallPercent ? `${result.recallPercent.toFixed(1)}%` : `${(result.recall * 100).toFixed(1)}%`}
                          </td>
                          <td className="py-3 px-4 text-right text-slate-300 font-mono">
                            {result.p95Latency.toFixed(2)}ms
                          </td>
                          <td className="py-3 px-4 text-right text-emerald-400 font-mono">
                            {result.compression.toFixed(2)}:1
                          </td>
                          <td className="py-3 px-4 text-right text-slate-300 font-mono">
                            {result.buildTime.toFixed(2)}s
                          </td>
                          <td className="py-3 px-4 text-center">
                            {result.parityWithFAISS && (
                              <Badge variant="success">
                                <CheckCircle2 size={14} className="mr-1" />
                                FAISS Exact
                              </Badge>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section className="py-20 bg-slate-900/50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto mb-16"
          >
            <Card glow className="mb-12">
              <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-slate-100 mb-4">Why Memryx is Cheaper</h2>
              <p className="text-slate-400 text-lg mb-4">
                Traditional vector databases store every embedding individually.
              </p>
              <p className="text-xl text-cyan-400 font-semibold">
                Memryx compresses embeddings into semantic clusters, reducing storage by 10–15× without accuracy loss.
              </p>
              </div>

              <div className="grid md:grid-cols-2 gap-6 mb-6">
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
                    Memryx uses only 7.9% storage vs competitors (12.71x compression)
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
                    Memryx: $19/mo • Qdrant: ~$45/mo • Weaviate: ~$55/mo • Pinecone: ~$70/mo
                  </p>
                </div>
              </div>
            </Card>
          </motion.div>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-slate-100 mb-4">Simple Pricing</h2>
            <p className="text-slate-400 text-lg">Start free, scale as you grow</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {Object.values(PLAN_LIMITS).map((plan, i) => (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <Card hover glow={plan.name === 'Pro'} className={plan.name === 'Pro' ? 'border-cyan-500/50' : ''}>
                  <div className="text-center">
                    <h3 className="text-2xl font-bold text-slate-100 mb-2">{plan.name}</h3>
                    <div className="mb-6">
                      {plan.price !== null ? (
                        <>
                          <span className="text-4xl font-bold text-cyan-400">${plan.price}</span>
                          <span className="text-slate-400">/month</span>
                        </>
                      ) : (
                        <span className="text-4xl font-bold text-slate-100">Custom</span>
                      )}
                    </div>
                    <ul className="space-y-3 mb-8 text-left">
                      {plan.features.map((feature, j) => (
                        <li key={j} className="flex items-start gap-2 text-slate-300">
                          <CheckCircle2 size={18} className="text-cyan-400 mt-0.5 flex-shrink-0" />
                          <span className="text-sm">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <Button
                      variant={plan.name === 'Pro' ? 'primary' : 'secondary'}
                      className="w-full"
                      onClick={() => setIsLoginOpen(true)}
                    >
                      {plan.name === 'Enterprise' ? 'Contact Sales' : 'Get Started'}
                    </Button>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <footer className="py-12 border-t border-slate-800 bg-slate-900/50">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <h4 className="text-slate-100 font-semibold mb-4">Product</h4>
              <ul className="space-y-2">
                <li><a href="/docs" className="text-slate-400 hover:text-cyan-400 transition-colors">Documentation</a></li>
                <li><a href="/pricing" className="text-slate-400 hover:text-cyan-400 transition-colors">Pricing</a></li>
                <li><a href="#benchmarks" className="text-slate-400 hover:text-cyan-400 transition-colors">Benchmarks</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-slate-100 font-semibold mb-4">Company</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-slate-400 hover:text-cyan-400 transition-colors">About</a></li>
                <li><a href="#" className="text-slate-400 hover:text-cyan-400 transition-colors">Blog</a></li>
                <li><a href="#" className="text-slate-400 hover:text-cyan-400 transition-colors">Careers</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-slate-100 font-semibold mb-4">Resources</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-slate-400 hover:text-cyan-400 transition-colors">Status</a></li>
                <li><a href="#" className="text-slate-400 hover:text-cyan-400 transition-colors">Support</a></li>
                <li><a href="#" className="text-slate-400 hover:text-cyan-400 transition-colors">Community</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-slate-100 font-semibold mb-4">Legal</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-slate-400 hover:text-cyan-400 transition-colors">Privacy</a></li>
                <li><a href="#" className="text-slate-400 hover:text-cyan-400 transition-colors">Terms</a></li>
                <li><a href="#" className="text-slate-400 hover:text-cyan-400 transition-colors">Security</a></li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-slate-800 text-center text-slate-500 text-sm">
            © 2025 Memryx. All rights reserved.
          </div>
        </div>
      </footer>

      <LoginModal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />
    </div>
  );
}
