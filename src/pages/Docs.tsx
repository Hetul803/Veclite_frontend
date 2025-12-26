import { motion } from 'framer-motion';
import { Code, Zap, Shield, TrendingUp, HelpCircle, Bot } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { PLAN_LIMITS } from '../lib/config';

const API_BASE_URL = import.meta.env.VITE_MCN_API_URL || 'https://api.memryx.com';

export function Docs() {
  return (
    <div className="min-h-screen bg-slate-950 pt-24 pb-16">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto mb-16"
        >
          <Badge variant="cyan" className="mb-6">
            API Documentation
          </Badge>
          <h1 className="text-5xl font-bold text-slate-100 mb-6">Getting Started</h1>
          <p className="text-xl text-slate-400">
            Integrate Memryx into your application in minutes. Replace FAISS with 12.71x compression and exact recall.
          </p>
        </motion.div>

        <div className="max-w-5xl mx-auto space-y-12">
          {/* Quickstart */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Card glow>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-cyan-500/10 rounded-lg flex items-center justify-center">
                    <Zap size={20} className="text-cyan-400" />
                  </div>
                  <CardTitle>Quickstart</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <h3 className="text-slate-100 font-semibold mb-3">1. Get Your API Key</h3>
                    <p className="text-slate-400 mb-3">
                      Sign up at <a href="/app" className="text-cyan-400 hover:underline">memryx.com/app</a> and go to Portal → API Keys. Copy your API key (starts with <code className="text-cyan-400">memryx_sk_</code>).
                    </p>
                  </div>

                  <div>
                    <h3 className="text-slate-100 font-semibold mb-3">2. Add Vectors</h3>
                    <p className="text-slate-400 mb-3 text-sm">
                      Upload your vectors. All vectors must be 384-dimensional (use <code className="text-cyan-400">sentence-transformers/all-MiniLM-L6-v2</code>).
                    </p>
                    <div className="bg-slate-950 rounded-lg p-4 border border-slate-800 overflow-x-auto mb-3">
                      <pre className="text-sm text-slate-300">
                        <code>{`POST ${API_BASE_URL}/add
Content-Type: application/json

{
  "api_key": "memryx_sk_YOUR_KEY_HERE",
  "vectors": [
    {
      "id": "doc1",
      "values": [0.1, 0.2, ..., 0.384],  // 384 floats
      "metadata": {"title": "Document 1"}
    }
  ]
}`}</code>
                      </pre>
                    </div>
                    <p className="text-slate-400 text-sm">
                      <strong>Python:</strong> Upload in batches of 1000-5000 for best performance.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-slate-100 font-semibold mb-3">3. Finalize Index</h3>
                    <p className="text-slate-400 mb-3">
                      Build the cluster structure (makes vectors searchable). Returns immediately with a <code className="text-cyan-400">build_id</code>.
                    </p>
                    <div className="bg-slate-950 rounded-lg p-4 border border-slate-800 overflow-x-auto mb-3">
                      <pre className="text-sm text-slate-300">
                        <code>{`POST ${API_BASE_URL}/finalize
Content-Type: application/json

{
  "api_key": "memryx_sk_YOUR_KEY_HERE",
  "timeout_s": 300.0
}`}</code>
                      </pre>
                    </div>
                    <p className="text-slate-400 text-sm">
                      Check status: <code className="text-cyan-400">GET {API_BASE_URL}/finalize/status?build_id=...</code>
                    </p>
                  </div>

                  <div>
                    <h3 className="text-slate-100 font-semibold mb-3">4. Search</h3>
                    <div className="bg-slate-950 rounded-lg p-4 border border-slate-800 overflow-x-auto">
                      <pre className="text-sm text-slate-300">
                        <code>{`POST ${API_BASE_URL}/search
Content-Type: application/json

{
  "api_key": "memryx_sk_YOUR_KEY_HERE",
  "vector": [0.1, 0.2, ..., 0.384],  // Query vector
  "k": 10  // Number of results
}`}</code>
                      </pre>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.section>

          {/* Chatbot Example */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Card glow>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-cyan-500/10 rounded-lg flex items-center justify-center">
                    <Bot size={20} className="text-cyan-400" />
                  </div>
                  <CardTitle>Chatbot Example (Python)</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p className="text-slate-400">
                    Complete example: Build a chatbot with RAG using Memryx instead of FAISS.
                  </p>
                  <div className="bg-slate-950 rounded-lg p-4 border border-slate-800 overflow-x-auto">
                    <pre className="text-sm text-slate-300">
                      <code>{`import requests
from sentence_transformers import SentenceTransformer

# Setup
API_KEY = "memryx_sk_YOUR_KEY_HERE"
API_URL = "${API_BASE_URL}"
model = SentenceTransformer('sentence-transformers/all-MiniLM-L6-v2')

# 1. Add knowledge base
documents = ["Doc 1", "Doc 2", ...]
embeddings = model.encode(documents)

for i, emb in enumerate(embeddings):
    requests.post(f"{API_URL}/add", json={
        "api_key": API_KEY,
        "vectors": [{
            "id": f"doc_{i}",
            "values": emb.tolist(),
            "metadata": {"text": documents[i]}
        }]
    })

# 2. Finalize
build = requests.post(f"{API_URL}/finalize", json={
    "api_key": API_KEY
}).json()
build_id = build["build_id"]

# Wait for build (check status)
while True:
    status = requests.get(
        f"{API_URL}/finalize/status?build_id={build_id}"
    ).json()
    if status["status"] == "ready":
        break
    time.sleep(5)

# 3. Search (for RAG)
query = "user question"
query_emb = model.encode([query])[0]
results = requests.post(f"{API_URL}/search", json={
    "api_key": API_KEY,
    "vector": query_emb.tolist(),
    "k": 5
}).json()

# Use results for LLM context
context = "\\n".join([r["metadata"]["text"] for r in results["results"]])
# ... pass to LLM`}</code>
                      </pre>
                  </div>
                  <p className="text-slate-400 text-sm">
                    <strong>Google Colab:</strong> Install <code className="text-cyan-400">!pip install sentence-transformers requests</code>, then use the code above.
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.section>

          {/* API Endpoints */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Card glow>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-cyan-500/10 rounded-lg flex items-center justify-center">
                    <Code size={20} className="text-cyan-400" />
                  </div>
                  <CardTitle>API Endpoints</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="pb-6 border-b border-slate-800">
                    <div className="flex items-center gap-3 mb-3">
                      <Badge variant="cyan">POST</Badge>
                      <code className="text-cyan-400">{API_BASE_URL}/add</code>
                    </div>
                    <p className="text-slate-400 mb-3">Upload vectors to your index</p>
                    <div className="bg-slate-950 rounded-lg p-4 border border-slate-800 overflow-x-auto">
                      <pre className="text-sm text-slate-300">
                        <code>{JSON.stringify({
                          api_key: "memryx_sk_...",
                          vectors: [
                            { id: "vec1", values: [0.1, 0.2], metadata: {} }
                          ]
                        }, null, 2)}</code>
                      </pre>
                    </div>
                  </div>

                  <div className="pb-6 border-b border-slate-800">
                    <div className="flex items-center gap-3 mb-3">
                      <Badge variant="cyan">POST</Badge>
                      <code className="text-cyan-400">{API_BASE_URL}/search</code>
                    </div>
                    <p className="text-slate-400 mb-3">Search for similar vectors</p>
                    <div className="bg-slate-950 rounded-lg p-4 border border-slate-800 overflow-x-auto">
                      <pre className="text-sm text-slate-300">
                        <code>{JSON.stringify({
                          api_key: "memryx_sk_...",
                          vector: [0.1, 0.2],
                          k: 10
                        }, null, 2)}</code>
                      </pre>
                    </div>
                  </div>

                  <div className="pb-6 border-b border-slate-800">
                    <div className="flex items-center gap-3 mb-3">
                      <Badge variant="cyan">POST</Badge>
                      <code className="text-cyan-400">{API_BASE_URL}/finalize</code>
                    </div>
                    <p className="text-slate-400 mb-3">Build index (non-blocking, returns build_id)</p>
                    <div className="bg-slate-950 rounded-lg p-4 border border-slate-800 overflow-x-auto">
                      <pre className="text-sm text-slate-300">
                        <code>{JSON.stringify({
                          api_key: "memryx_sk_...",
                          timeout_s: 300.0
                        }, null, 2)}</code>
                      </pre>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center gap-3 mb-3">
                      <Badge variant="cyan">GET</Badge>
                      <code className="text-cyan-400">{API_BASE_URL}/finalize/status?build_id=...</code>
                    </div>
                    <p className="text-slate-400 mb-3">Check build status</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.section>

          {/* Rate Limits */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Card glow>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-cyan-500/10 rounded-lg flex items-center justify-center">
                    <Shield size={20} className="text-cyan-400" />
                  </div>
                  <CardTitle>Rate Limits</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-slate-400 mb-6">
                  Rate limits vary by plan and are enforced per API key:
                </p>
                <div className="space-y-4">
                  {Object.values(PLAN_LIMITS).map((plan, i) => (
                    <div key={i} className="bg-slate-800/30 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="text-slate-100 font-semibold">{plan.name}</h3>
                        {plan.price !== null && (
                          <span className="text-slate-400 text-sm">${plan.price}/mo</span>
                        )}
                      </div>
                      <div className="grid md:grid-cols-2 gap-3 text-sm">
                        <div className="flex justify-between">
                          <span className="text-slate-400">QPS:</span>
                          <span className="text-cyan-400 font-mono">
                            {plan.qps === Infinity ? 'Custom' : plan.qps}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Concurrent:</span>
                          <span className="text-cyan-400 font-mono">
                            {plan.concurrent === Infinity ? 'Custom' : plan.concurrent}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Daily queries:</span>
                          <span className="text-cyan-400 font-mono">
                            {plan.dailyQueries === Infinity ? 'Unlimited' : plan.dailyQueries.toLocaleString()}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Max vectors:</span>
                          <span className="text-cyan-400 font-mono">
                            {plan.vectors === Infinity ? 'Unlimited' : plan.vectors.toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.section>

          {/* FAQs */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Card glow>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-cyan-500/10 rounded-lg flex items-center justify-center">
                    <HelpCircle size={20} className="text-cyan-400" />
                  </div>
                  <CardTitle>Frequently Asked Questions</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <h3 className="text-slate-100 font-semibold mb-2">Do I need a URL or just an API key?</h3>
                    <p className="text-slate-400">
                      Just your API key! The base URL is <code className="text-cyan-400">{API_BASE_URL}</code> (or set via <code className="text-cyan-400">VITE_MCN_API_URL</code>). Your API key authenticates all requests.
                    </p>
                  </div>
                  <div>
                    <h3 className="text-slate-100 font-semibold mb-2">Can I use multiple API keys for different projects?</h3>
                    <p className="text-slate-400">
                      Each user account has one API key. For multiple projects, create separate accounts or use metadata to tag vectors by project. All vectors are isolated per API key.
                    </p>
                  </div>
                  <div>
                    <h3 className="text-slate-100 font-semibold mb-2">What if I regenerate my API key?</h3>
                    <p className="text-slate-400">
                      Your old key will stop working immediately. Update all applications using the old key before regenerating. Vectors remain stored but are inaccessible with the old key.
                    </p>
                  </div>
                  <div>
                    <h3 className="text-slate-100 font-semibold mb-2">How do I replace FAISS with Memryx?</h3>
                    <p className="text-slate-400">
                      Instead of <code className="text-cyan-400">index.add(vectors)</code> and <code className="text-cyan-400">index.search(query)</code>, use <code className="text-cyan-400">POST /add</code> and <code className="text-cyan-400">POST /search</code> with your API key. Same exact recall, 12.71x compression.
                    </p>
                  </div>
                  <div>
                    <h3 className="text-slate-100 font-semibold mb-2">What vector dimension do you support?</h3>
                    <p className="text-slate-400">
                      Fixed 384 dimensions (sentence-transformers/all-MiniLM-L6-v2). Use this model for embeddings to ensure compatibility.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.section>

          {/* Best Practices */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Card glow>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-cyan-500/10 rounded-lg flex items-center justify-center">
                    <TrendingUp size={20} className="text-cyan-400" />
                  </div>
                  <CardTitle>Best Practices</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-4 text-slate-300">
                  <li className="flex items-start gap-3">
                    <span className="text-cyan-400 mt-1">•</span>
                    <div>
                      <span className="font-semibold text-slate-100">Batch uploads:</span> Upload vectors in batches of 1000-5000 for optimal throughput
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-cyan-400 mt-1">•</span>
                    <div>
                      <span className="font-semibold text-slate-100">Finalize strategically:</span> Run finalize after all vectors are uploaded. Takes 2-3 minutes for 100K vectors.
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-cyan-400 mt-1">•</span>
                    <div>
                      <span className="font-semibold text-slate-100">Use metadata:</span> Attach rich metadata to vectors for filtering and post-processing
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-cyan-400 mt-1">•</span>
                    <div>
                      <span className="font-semibold text-slate-100">Store API key securely:</span> Never commit API keys to git. Use environment variables.
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-cyan-400 mt-1">•</span>
                    <div>
                      <span className="font-semibold text-slate-100">Handle rate limits:</span> Implement retry logic with exponential backoff when you hit 429 errors.
                    </div>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </motion.section>
        </div>
      </div>
    </div>
  );
}
