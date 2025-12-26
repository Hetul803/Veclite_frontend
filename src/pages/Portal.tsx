import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BarChart3, Database, Key, Settings, LayoutDashboard, Plus, Play, Upload, Loader2, Eye, EyeOff, Copy, RefreshCw, AlertTriangle } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { Modal } from '../ui/Modal';
import { Input } from '../ui/Input';
import { useAuth } from '../lib/auth-context';
import { LoginModal } from '../components/LoginModal';
import { getStats, getUsage, listIndexes, createIndex, finalizeIndex, regenerateApiKey, Index, UsageData } from '../lib/api';
import { PLAN_LIMITS } from '../lib/config';

type TabType = 'overview' | 'indexes' | 'usage' | 'keys' | 'settings';

export function Portal() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isCreateIndexOpen, setIsCreateIndexOpen] = useState(false);
  const [isFinalizingIndex, setIsFinalizingIndex] = useState<string | null>(null);

  const [stats, setStats] = useState<any>(null);
  const [usage, setUsage] = useState<UsageData[]>([]);
  const [indexes, setIndexes] = useState<Index[]>([]);
  const [loading, setLoading] = useState(true);
  const [apiKeyVisible, setApiKeyVisible] = useState(false);
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [showRegenerateConfirm, setShowRegenerateConfirm] = useState(false);

  const [newIndexName, setNewIndexName] = useState('');
  const [newIndexDim, setNewIndexDim] = useState('384');
  const [newIndexDesc, setNewIndexDesc] = useState('');

  useEffect(() => {
    if (!user) {
      setIsLoginOpen(true);
      return;
    }

    loadData();
  }, [user]);

  const loadData = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const [statsData, usageData, indexesData] = await Promise.all([
        getStats(user.id),
        getUsage(user.id),
        listIndexes(user.id)
      ]);
      setStats(statsData);
      setUsage(usageData.slice(-14));
      setIndexes(indexesData);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateIndex = async () => {
    if (!user || !newIndexName || !newIndexDim) return;

    await createIndex(user.id, newIndexName, parseInt(newIndexDim), newIndexDesc);
    setIsCreateIndexOpen(false);
    setNewIndexName('');
    setNewIndexDim('384');
    setNewIndexDesc('');
    loadData();
  };

  const handleFinalizeIndex = async (indexId: string) => {
    if (!user) return;
    
    setIsFinalizingIndex(indexId);
    try {
      await finalizeIndex(user.apiKey, indexId);
      loadData();
    } finally {
      setIsFinalizingIndex(null);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <Card className="max-w-md w-full mx-4">
          <CardContent className="text-center py-12">
            <h2 className="text-2xl font-bold text-slate-100 mb-4">Portal Access Required</h2>
            <p className="text-slate-400 mb-8">Sign in to access your command console</p>
            <Button onClick={() => setIsLoginOpen(true)}>Sign In</Button>
          </CardContent>
        </Card>
        <LoginModal isOpen={isLoginOpen} onClose={() => navigate('/')} />
      </div>
    );
  }

  const plan = PLAN_LIMITS[user.plan];
  const vectorUsage = ((stats?.totalVectors || 0) / plan.vectors) * 100;
  const qpsUsage = ((stats?.currentQPS || 0) / plan.qps) * 100;

  const tabs = [
    { id: 'overview' as TabType, label: 'Overview', icon: LayoutDashboard },
    { id: 'indexes' as TabType, label: 'Indexes', icon: Database },
    { id: 'usage' as TabType, label: 'Usage', icon: BarChart3 },
    { id: 'keys' as TabType, label: 'API Keys', icon: Key },
    { id: 'settings' as TabType, label: 'Settings', icon: Settings }
  ];

  return (
    <div className="min-h-screen bg-slate-950 pt-16">
      <div className="flex h-[calc(100vh-4rem)]">
        <aside className="w-64 border-r border-slate-800 bg-slate-900/30 p-4">
          <div className="mb-8">
            <div className="text-sm text-slate-500 mb-2">Logged in as</div>
            <div className="text-slate-100 font-medium truncate">{user.email}</div>
            <Badge variant="cyan" className="mt-2">{plan.name} Plan</Badge>
          </div>

          <nav className="space-y-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                    activeTab === tab.id
                      ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30'
                      : 'text-slate-400 hover:text-slate-300 hover:bg-slate-800/50'
                  }`}
                >
                  <Icon size={20} />
                  <span className="font-medium">{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </aside>

        <main className="flex-1 overflow-y-auto p-8">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
          >
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <div>
                  <h1 className="text-3xl font-bold text-slate-100 mb-2">Command Console</h1>
                  <p className="text-slate-400">Monitor your Memryx deployment</p>
                </div>

                {loading ? (
                  <div className="flex items-center justify-center py-12">
                    <Loader2 size={32} className="text-cyan-400 animate-spin" />
                  </div>
                ) : (
                  <>
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                      <Card>
                        <div className="text-sm text-slate-400 mb-1">Plan</div>
                        <div className="text-2xl font-bold text-cyan-400">{plan.name}</div>
                      </Card>
                      <Card>
                        <div className="text-sm text-slate-400 mb-1">Total Vectors</div>
                        <div className="text-2xl font-bold text-slate-100">
                          {(stats?.totalVectors || 0).toLocaleString()}
                        </div>
                        <div className="text-xs text-slate-500 mt-1">
                          {vectorUsage.toFixed(1)}% of {plan.vectors.toLocaleString()}
                        </div>
                      </Card>
                      <Card>
                        <div className="text-sm text-slate-400 mb-1">Current QPS</div>
                        <div className="text-2xl font-bold text-slate-100">{stats?.currentQPS || 0}</div>
                        <div className="text-xs text-slate-500 mt-1">
                          {qpsUsage.toFixed(1)}% of {plan.qps} limit
                        </div>
                      </Card>
                      <Card>
                        <div className="text-sm text-slate-400 mb-1">Queries (24h)</div>
                        <div className="text-2xl font-bold text-slate-100">
                          {(stats?.queriesLast24h || 0).toLocaleString()}
                        </div>
                      </Card>
                    </div>

                    <Card glow>
                      <CardHeader>
                        <CardTitle>Active Indexes</CardTitle>
                      </CardHeader>
                      <CardContent>
                        {indexes.length === 0 ? (
                          <div className="text-center py-8 text-slate-400">
                            No indexes yet. Create your first index to get started.
                          </div>
                        ) : (
                          <div className="space-y-3">
                            {indexes.slice(0, 3).map((index) => (
                              <div
                                key={index.id}
                                className="flex items-center justify-between p-4 bg-slate-800/30 rounded-lg"
                              >
                                <div>
                                  <div className="font-semibold text-slate-100">{index.name}</div>
                                  <div className="text-sm text-slate-400">
                                    {index.vector_count.toLocaleString()} vectors
                                    {index.compression_ratio && (
                                      <span className="text-cyan-400 ml-2">
                                        {index.compression_ratio.toFixed(1)}x compressed
                                      </span>
                                    )}
                                  </div>
                                </div>
                                <Badge
                                  variant={
                                    index.status === 'ready' ? 'success' :
                                    index.status === 'building' ? 'warning' :
                                    index.status === 'error' ? 'danger' : 'default'
                                  }
                                >
                                  {index.status}
                                </Badge>
                              </div>
                            ))}
                          </div>
                        )}
                      </CardContent>
                    </Card>

                    <Card glow>
                      <CardHeader>
                        <CardTitle>Quick Actions</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid md:grid-cols-2 gap-4">
                          <Button
                            variant="secondary"
                            className="justify-start"
                            onClick={() => {
                              setActiveTab('indexes');
                              setIsCreateIndexOpen(true);
                            }}
                          >
                            <Plus size={20} className="mr-2" />
                            Create New Index
                          </Button>
                          <Button variant="secondary" className="justify-start" onClick={() => setActiveTab('keys')}>
                            <Key size={20} className="mr-2" />
                            View API Keys
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </>
                )}
              </div>
            )}

            {activeTab === 'indexes' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h1 className="text-3xl font-bold text-slate-100 mb-2">Indexes</h1>
                    <p className="text-slate-400">Manage your vector indexes</p>
                  </div>
                  <Button onClick={() => setIsCreateIndexOpen(true)}>
                    <Plus size={20} className="mr-2" />
                    Create Index
                  </Button>
                </div>

                {loading ? (
                  <div className="flex items-center justify-center py-12">
                    <Loader2 size={32} className="text-cyan-400 animate-spin" />
                  </div>
                ) : indexes.length === 0 ? (
                  <Card>
                    <CardContent className="text-center py-12">
                      <Database size={48} className="text-slate-700 mx-auto mb-4" />
                      <h3 className="text-xl font-semibold text-slate-100 mb-2">No indexes yet</h3>
                      <p className="text-slate-400 mb-6">Create your first index to start storing vectors</p>
                      <Button onClick={() => setIsCreateIndexOpen(true)}>
                        <Plus size={20} className="mr-2" />
                        Create Index
                      </Button>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="space-y-4">
                    {indexes.map((index) => (
                      <Card key={index.id} hover glow>
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="text-xl font-semibold text-slate-100">{index.name}</h3>
                              <Badge
                                variant={
                                  index.status === 'ready' ? 'success' :
                                  index.status === 'building' ? 'warning' :
                                  index.status === 'error' ? 'danger' : 'default'
                                }
                              >
                                {index.status}
                              </Badge>
                            </div>
                            <p className="text-slate-400 text-sm mb-4">{index.description || 'No description'}</p>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                              <div>
                                <div className="text-slate-500">Vectors</div>
                                <div className="text-slate-100 font-semibold">
                                  {index.vector_count.toLocaleString()}
                                </div>
                              </div>
                              <div>
                                <div className="text-slate-500">Dimensions</div>
                                <div className="text-slate-100 font-semibold">{index.embedding_dim}</div>
                              </div>
                              <div>
                                <div className="text-slate-500">Compression</div>
                                <div className="text-cyan-400 font-semibold">
                                  {index.compression_ratio ? `${index.compression_ratio.toFixed(1)}x` : '—'}
                                </div>
                              </div>
                              <div>
                                <div className="text-slate-500">Last Finalized</div>
                                <div className="text-slate-100 font-semibold">
                                  {index.last_finalized
                                    ? new Date(index.last_finalized).toLocaleDateString()
                                    : 'Never'}
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="flex gap-2 ml-4">
                            <Button
                              variant="ghost"
                              size="sm"
                              disabled={index.status === 'building'}
                            >
                              <Upload size={16} />
                            </Button>
                            <Button
                              variant="secondary"
                              size="sm"
                              onClick={() => handleFinalizeIndex(index.id)}
                              disabled={index.status === 'building' || isFinalizingIndex === index.id}
                            >
                              {isFinalizingIndex === index.id ? (
                                <Loader2 size={16} className="animate-spin" />
                              ) : (
                                <Play size={16} />
                              )}
                            </Button>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'usage' && (
              <div className="space-y-6">
                <div>
                  <h1 className="text-3xl font-bold text-slate-100 mb-2">Usage Analytics</h1>
                  <p className="text-slate-400">Track your query patterns and performance</p>
                </div>

                {loading ? (
                  <div className="flex items-center justify-center py-12">
                    <Loader2 size={32} className="text-cyan-400 animate-spin" />
                  </div>
                ) : (
                  <>
                    <Card glow>
                      <CardHeader>
                        <CardTitle>Daily Query Volume (Last 14 Days)</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ResponsiveContainer width="100%" height={300}>
                          <LineChart data={usage}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                            <XAxis
                              dataKey="date"
                              stroke="#94a3b8"
                              tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                            />
                            <YAxis stroke="#94a3b8" />
                            <Tooltip
                              contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155' }}
                              labelStyle={{ color: '#e2e8f0' }}
                              labelFormatter={(value) => new Date(value).toLocaleDateString()}
                            />
                            <Line
                              type="monotone"
                              dataKey="queries"
                              stroke="#22d3ee"
                              strokeWidth={2}
                              dot={{ fill: '#22d3ee' }}
                              name="Queries"
                            />
                          </LineChart>
                        </ResponsiveContainer>
                      </CardContent>
                    </Card>

                    <Card glow>
                      <CardHeader>
                        <CardTitle>p95 Latency (Last 14 Days)</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ResponsiveContainer width="100%" height={300}>
                          <LineChart data={usage}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                            <XAxis
                              dataKey="date"
                              stroke="#94a3b8"
                              tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                            />
                            <YAxis stroke="#94a3b8" />
                            <Tooltip
                              contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155' }}
                              labelStyle={{ color: '#e2e8f0' }}
                              labelFormatter={(value) => new Date(value).toLocaleDateString()}
                            />
                            <Line
                              type="monotone"
                              dataKey="p95Latency"
                              stroke="#10b981"
                              strokeWidth={2}
                              dot={{ fill: '#10b981' }}
                              name="p95 Latency (ms)"
                            />
                          </LineChart>
                        </ResponsiveContainer>
                      </CardContent>
                    </Card>
                  </>
                )}
              </div>
            )}

            {activeTab === 'keys' && (
              <div className="space-y-6">
                <div>
                  <h1 className="text-3xl font-bold text-slate-100 mb-2">API Keys</h1>
                  <p className="text-slate-400">Manage your authentication credentials</p>
                </div>

                <Card glow>
                  <CardHeader>
                    <CardTitle>Active API Key</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {user?.apiKey ? (
                      <>
                        <div className="bg-slate-800/30 rounded-lg p-4 mb-4">
                          <div className="flex items-center justify-between gap-3">
                            <code className="text-slate-100 font-mono text-sm flex-1 break-all">
                              {apiKeyVisible ? user.apiKey : `${user.apiKey.substring(0, 20)}${'•'.repeat(20)}${user.apiKey.substring(user.apiKey.length - 8)}`}
                            </code>
                            <div className="flex gap-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setApiKeyVisible(!apiKeyVisible)}
                                title={apiKeyVisible ? "Hide key" : "Show key"}
                              >
                                {apiKeyVisible ? <EyeOff size={16} /> : <Eye size={16} />}
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={async () => {
                                  try {
                                    await navigator.clipboard.writeText(user.apiKey);
                                    // Show toast or feedback
                                  } catch (err) {
                                    console.error('Failed to copy:', err);
                                  }
                                }}
                                title="Copy to clipboard"
                              >
                                <Copy size={16} />
                              </Button>
                            </div>
                          </div>
                          <div className="text-sm text-slate-500 mt-2">
                            Created on {user.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A'}
                          </div>
                        </div>
                        <Button
                          variant="danger"
                          onClick={() => setShowRegenerateConfirm(true)}
                          disabled={isRegenerating}
                        >
                          {isRegenerating ? (
                            <>
                              <Loader2 size={16} className="mr-2 animate-spin" />
                              Regenerating...
                            </>
                          ) : (
                            <>
                              <RefreshCw size={16} className="mr-2" />
                              Regenerate Key
                            </>
                          )}
                        </Button>
                        <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4 mt-4">
                          <div className="flex items-start gap-3">
                            <AlertTriangle size={20} className="text-yellow-400 mt-0.5 flex-shrink-0" />
                            <div className="text-sm text-yellow-400/80">
                              <div className="font-semibold mb-1">Before Regenerating:</div>
                              <ul className="list-disc list-inside space-y-1">
                                <li>Update all applications using this key</li>
                                <li>The old key will stop working immediately</li>
                                <li>Your vectors remain stored but inaccessible with the old key</li>
                                <li>Use different API keys for different projects by creating separate accounts</li>
                              </ul>
                            </div>
                          </div>
                        </div>
                      </>
                    ) : (
                      <div className="text-center py-8 text-slate-400">
                        <Key size={48} className="mx-auto mb-4 text-slate-700" />
                        <p>No API key found. Please contact support.</p>
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Using Multiple Projects</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3 text-slate-300 text-sm">
                      <p>
                        <strong className="text-slate-100">Option 1:</strong> Create separate accounts for each project. Each account gets its own API key.
                      </p>
                      <p>
                        <strong className="text-slate-100">Option 2:</strong> Use metadata to tag vectors by project. All vectors are isolated per API key.
                      </p>
                      <p>
                        <strong className="text-slate-100">Option 3:</strong> Use the same API key for all projects. Vectors are automatically isolated by your account.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Regenerate Confirmation Modal */}
            <Modal
              isOpen={showRegenerateConfirm}
              onClose={() => setShowRegenerateConfirm(false)}
              title="Regenerate API Key"
            >
              <div className="space-y-4">
                <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <AlertTriangle size={20} className="text-red-400 mt-0.5 flex-shrink-0" />
                    <div className="text-sm text-red-400/80">
                      <div className="font-semibold mb-2">This action cannot be undone!</div>
                      <ul className="list-disc list-inside space-y-1">
                        <li>Your current API key will stop working immediately</li>
                        <li>All applications using the old key will fail</li>
                        <li>You must update all integrations before regenerating</li>
                      </ul>
                    </div>
                  </div>
                </div>
                <div className="flex gap-3">
                  <Button
                    variant="danger"
                    className="flex-1"
                    onClick={async () => {
                      if (!user) return;
                      setIsRegenerating(true);
                      try {
                        await regenerateApiKey(user.id);
                        setShowRegenerateConfirm(false);
                        // Reload user data to get new key
                        window.location.reload();
                      } catch (error) {
                        console.error('Failed to regenerate key:', error);
                        alert('Failed to regenerate key. Please try again.');
                      } finally {
                        setIsRegenerating(false);
                      }
                    }}
                    disabled={isRegenerating}
                  >
                    {isRegenerating ? 'Regenerating...' : 'Yes, Regenerate'}
                  </Button>
                  <Button
                    variant="ghost"
                    className="flex-1"
                    onClick={() => setShowRegenerateConfirm(false)}
                    disabled={isRegenerating}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </Modal>

            {activeTab === 'settings' && (
              <div className="space-y-6">
                <div>
                  <h1 className="text-3xl font-bold text-slate-100 mb-2">Settings</h1>
                  <p className="text-slate-400">Manage your account and preferences</p>
                </div>

                <Card glow>
                  <CardHeader>
                    <CardTitle>Organization Details</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <Input label="Organization Name" defaultValue="My Organization" />
                      <Input label="Billing Email" defaultValue={user.email} type="email" />
                      <Button variant="secondary">Save Changes</Button>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Plan & Billing</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <div className="text-slate-100 font-semibold">{plan.name} Plan</div>
                        <div className="text-slate-400 text-sm">
                          {plan.price ? `$${plan.price}/month` : 'Custom pricing'}
                        </div>
                      </div>
                      <Button variant="primary">Upgrade Plan</Button>
                    </div>
                    <div className="text-sm text-slate-500">
                      {plan.vectors === Infinity ? 'Unlimited' : plan.vectors.toLocaleString()} vectors •{' '}
                      {plan.qps === Infinity ? 'Custom' : plan.qps} QPS
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </motion.div>
        </main>
      </div>

      <Modal
        isOpen={isCreateIndexOpen}
        onClose={() => setIsCreateIndexOpen(false)}
        title="Create New Index"
      >
        <div className="space-y-4">
          <Input
            label="Index Name"
            placeholder="my-embeddings"
            value={newIndexName}
            onChange={(e) => setNewIndexName(e.target.value)}
          />
          <Input
            label="Embedding Dimensions"
            type="number"
            placeholder="384"
            value={newIndexDim}
            onChange={(e) => setNewIndexDim(e.target.value)}
          />
          <Input
            label="Description (optional)"
            placeholder="Describe your index..."
            value={newIndexDesc}
            onChange={(e) => setNewIndexDesc(e.target.value)}
          />
          <div className="flex gap-3">
            <Button onClick={handleCreateIndex} className="flex-1">
              Create Index
            </Button>
            <Button variant="ghost" onClick={() => setIsCreateIndexOpen(false)} className="flex-1">
              Cancel
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
