import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, DollarSign, Target, TrendingUp, Users } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { FAQ_ITEMS } from '../lib/config';

export function Why() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  return (
    <div className="min-h-screen bg-slate-950 pt-24 pb-16">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto mb-16 text-center"
        >
          <h1 className="text-5xl font-bold text-slate-100 mb-6">Why Memryx?</h1>
          <p className="text-xl text-slate-400">
            A technical deep-dive into our approach to vector memory
          </p>
        </motion.div>

        <div className="max-w-5xl mx-auto space-y-16">
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Card glow>
              <div className="flex items-start gap-4 mb-6">
                <div className="w-12 h-12 bg-cyan-500/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <DollarSign size={24} className="text-cyan-400" />
                </div>
                <div>
                  <h2 className="text-3xl font-bold text-slate-100 mb-4">Cost Model</h2>
                  <p className="text-slate-300 leading-relaxed mb-4">
                    Traditional vector databases store every embedding in its full dimensional form. At scale,
                    this becomes prohibitively expensive. A 1M vector collection with 384 dimensions requires
                    significant storage and memory overhead.
                  </p>
                  <p className="text-slate-300 leading-relaxed mb-4">
                    Memryx achieves <span className="text-cyan-400 font-semibold">12.71x compression</span> (92.1% storage savings) by
                    building semantic clusters and representing them as "super vectors". Your original vectors
                    are compressed into cluster memberships plus lightweight metadata. This means:
                  </p>
                  <ul className="space-y-2 text-slate-300">
                    <li className="flex items-start gap-2">
                      <span className="text-cyan-400 mt-1">•</span>
                      <span>12.71x less storage cost on disk and in memory (92.1% savings)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-cyan-400 mt-1">•</span>
                      <span>Dramatically reduced infrastructure requirements</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-cyan-400 mt-1">•</span>
                      <span>Predictable costs as you scale to millions of vectors</span>
                    </li>
                  </ul>
                </div>
              </div>
            </Card>
          </motion.section>

          <motion.section
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Card glow>
              <div className="flex items-start gap-4 mb-6">
                <div className="w-12 h-12 bg-cyan-500/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Target size={24} className="text-cyan-400" />
                </div>
                <div>
                  <h2 className="text-3xl font-bold text-slate-100 mb-4">Recall Philosophy</h2>
                  <p className="text-slate-300 leading-relaxed mb-4">
                    Most ANN (Approximate Nearest Neighbor) systems trade recall for speed. HNSW might give you
                    95% recall with fast queries, but you're missing 5% of relevant results. For many applications,
                    this is unacceptable.
                  </p>
                  <p className="text-slate-300 leading-relaxed mb-4">
                    Memryx takes a different approach: <span className="text-cyan-400 font-semibold">route then rerank</span>.
                    We use fast cluster routing to narrow down to relevant super vectors, then perform exact search
                    within those clusters. This gives you:
                  </p>
                  <ul className="space-y-2 text-slate-300">
                    <li className="flex items-start gap-2">
                      <span className="text-cyan-400 mt-1">•</span>
                      <span>Exact recall parity (39.34% vs 39.34% with FAISS exact baseline - perfect match)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-cyan-400 mt-1">•</span>
                      <span>No false negatives from ANN approximations</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-cyan-400 mt-1">•</span>
                      <span>Practical correctness for production systems</span>
                    </li>
                  </ul>
                </div>
              </div>
            </Card>
          </motion.section>

          <motion.section
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Card glow>
              <div className="flex items-start gap-4 mb-6">
                <div className="w-12 h-12 bg-cyan-500/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <TrendingUp size={24} className="text-cyan-400" />
                </div>
                <div>
                  <h2 className="text-3xl font-bold text-slate-100 mb-4">Scaling Behavior</h2>
                  <p className="text-slate-300 leading-relaxed mb-4">
                    One of Memryx's key advantages is predictable scaling behavior. As your vector count grows,
                    our performance characteristics remain stable:
                  </p>
                  <ul className="space-y-2 text-slate-300 mb-4">
                    <li className="flex items-start gap-2">
                      <span className="text-cyan-400 mt-1">•</span>
                      <span><span className="font-semibold">Latency:</span> p95 at 33.69ms (MS MARCO test) - competitive with ANN systems (HNSW, Qdrant typically 20-50ms), while maintaining exact recall parity</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-cyan-400 mt-1">•</span>
                      <span><span className="font-semibold">Memory:</span> Grows sub-linearly thanks to compression</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-cyan-400 mt-1">•</span>
                      <span><span className="font-semibold">Build time:</span> Scales predictably (137.48s for 100K vectors in production test)</span>
                    </li>
                  </ul>
                  <p className="text-slate-300 leading-relaxed">
                    This makes capacity planning straightforward. You can project costs and performance with confidence.
                  </p>
                </div>
              </div>
            </Card>
          </motion.section>

          <motion.section
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Card glow>
              <div className="flex items-start gap-4 mb-6">
                <div className="w-12 h-12 bg-cyan-500/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Users size={24} className="text-cyan-400" />
                </div>
                <div>
                  <h2 className="text-3xl font-bold text-slate-100 mb-4">Who It's For</h2>
                  <p className="text-slate-300 leading-relaxed mb-4">
                    Memryx is ideal for teams who need:
                  </p>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="bg-slate-800/30 rounded-lg p-4">
                      <h3 className="text-cyan-400 font-semibold mb-2">Production RAG Systems</h3>
                      <p className="text-slate-400 text-sm">
                        Retrieval-augmented generation that can't afford to miss relevant context
                      </p>
                    </div>
                    <div className="bg-slate-800/30 rounded-lg p-4">
                      <h3 className="text-cyan-400 font-semibold mb-2">Semantic Search</h3>
                      <p className="text-slate-400 text-sm">
                        Document search where recall accuracy matters more than millisecond latency
                      </p>
                    </div>
                    <div className="bg-slate-800/30 rounded-lg p-4">
                      <h3 className="text-cyan-400 font-semibold mb-2">Cost-Conscious Scale</h3>
                      <p className="text-slate-400 text-sm">
                        Growing to millions of vectors without 10x infrastructure costs
                      </p>
                    </div>
                    <div className="bg-slate-800/30 rounded-lg p-4">
                      <h3 className="text-cyan-400 font-semibold mb-2">Batch Workflows</h3>
                      <p className="text-slate-400 text-sm">
                        Applications that can ingest vectors in batches and tolerate build windows
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </motion.section>

          <motion.section
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-slate-100 mb-4">How Routing Works</h2>
              <p className="text-slate-400">The technical flow behind Memryx queries</p>
            </div>

            <Card glow>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="w-16 h-16 bg-cyan-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl font-bold text-cyan-400">1</span>
                  </div>
                  <h3 className="font-semibold text-slate-100 mb-2">Query Arrives</h3>
                  <p className="text-sm text-slate-400">
                    Your embedding vector enters the system
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-cyan-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl font-bold text-cyan-400">2</span>
                  </div>
                  <h3 className="font-semibold text-slate-100 mb-2">Fast Routing</h3>
                  <p className="text-sm text-slate-400">
                    Compare against super vectors to identify relevant clusters
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-cyan-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl font-bold text-cyan-400">3</span>
                  </div>
                  <h3 className="font-semibold text-slate-100 mb-2">Exact Rerank</h3>
                  <p className="text-sm text-slate-400">
                    Perform exact search within selected clusters
                  </p>
                </div>
              </div>
              <div className="mt-6 pt-6 border-t border-slate-800">
                <p className="text-center text-slate-400 text-sm">
                  Result: Exact recall parity (39.34% = FAISS exact) with 12.71x compression (92.1% storage savings)
                </p>
              </div>
            </Card>
          </motion.section>

          <motion.section
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-slate-100 mb-4">Frequently Asked Questions</h2>
              <p className="text-slate-400">Common questions about Memryx</p>
            </div>

            <div className="space-y-4">
              {FAQ_ITEMS.map((faq, index) => (
                <Card key={index} hover>
                  <button
                    onClick={() => setOpenFaq(openFaq === index ? null : index)}
                    className="w-full text-left flex items-center justify-between"
                  >
                    <h3 className="text-lg font-semibold text-slate-100 pr-4">{faq.question}</h3>
                    <motion.div
                      animate={{ rotate: openFaq === index ? 180 : 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <ChevronDown size={20} className="text-cyan-400 flex-shrink-0" />
                    </motion.div>
                  </button>
                  <AnimatePresence>
                    {openFaq === index && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        <p className="text-slate-400 mt-4 leading-relaxed">{faq.answer}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </Card>
              ))}
            </div>
          </motion.section>
        </div>
      </div>
    </div>
  );
}
