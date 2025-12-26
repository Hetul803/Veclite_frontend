import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { AlertTriangle, Users, Database, DollarSign, Activity, Shield, Edit2, Save, X } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { useAuth } from '../lib/auth-context';
import { getAdminStats, updatePlanPrice, AdminStats } from '../lib/api';
import { PLAN_LIMITS } from '../lib/config';

export function Admin() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [editingPrice, setEditingPrice] = useState<string | null>(null);
  const [priceValues, setPriceValues] = useState<Record<string, number | null>>({});

  useEffect(() => {
    if (!user?.isAdmin) {
      navigate('/');
      return;
    }

    loadStats();
  }, [user, navigate]);

  const loadStats = async () => {
    const data = await getAdminStats();
    setStats(data);
    // Initialize price values
    const prices: Record<string, number | null> = {};
    data.planStats.forEach(plan => {
      prices[plan.plan] = plan.price;
    });
    setPriceValues(prices);
  };

  const handleEditPrice = (planName: string) => {
    setEditingPrice(planName);
  };

  const handleSavePrice = async (planName: string) => {
    const newPrice = priceValues[planName];
    await updatePlanPrice(planName, newPrice);
    setEditingPrice(null);
    loadStats(); // Reload to get updated data
  };

  const handleCancelEdit = () => {
    setEditingPrice(null);
    loadStats(); // Reset to original values
  };

  if (!user?.isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-slate-950 pt-24 pb-16">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-red-500/10 rounded-lg flex items-center justify-center">
              <Shield size={24} className="text-red-400" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-slate-100">Admin Console</h1>
              <p className="text-slate-400">System-wide monitoring and control</p>
            </div>
          </div>

          <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 flex items-start gap-3">
            <AlertTriangle size={20} className="text-red-400 mt-0.5 flex-shrink-0" />
            <div>
              <div className="text-red-400 font-semibold mb-1">Admin Access Only</div>
              <div className="text-red-400/80 text-sm">
                You have elevated privileges. All actions are logged and audited.
              </div>
            </div>
          </div>
        </motion.div>

        <div className="space-y-8 max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card glow>
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-cyan-500/10 rounded-lg flex items-center justify-center">
                    <Users size={20} className="text-cyan-400" />
                  </div>
                  <div className="text-sm text-slate-400">Total Users</div>
                </div>
                <div className="text-3xl font-bold text-slate-100">
                  {stats?.totalTenants.toLocaleString()}
                </div>
                <div className="text-xs text-slate-500 mt-1">
                  {stats?.paidUsers} paid • {stats?.freeUsers} free
                </div>
              </Card>

              <Card glow>
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-cyan-500/10 rounded-lg flex items-center justify-center">
                    <Database size={20} className="text-cyan-400" />
                  </div>
                  <div className="text-sm text-slate-400">Total Vectors</div>
                </div>
                <div className="text-3xl font-bold text-slate-100">
                  {stats?.totalVectors.toLocaleString()}
                </div>
              </Card>

              <Card glow>
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-cyan-500/10 rounded-lg flex items-center justify-center">
                    <Activity size={20} className="text-cyan-400" />
                  </div>
                  <div className="text-sm text-slate-400">Global QPS</div>
                </div>
                <div className="text-3xl font-bold text-slate-100">
                  {stats?.globalQPS.toLocaleString()}
                </div>
              </Card>

              <Card glow>
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-emerald-500/10 rounded-lg flex items-center justify-center">
                    <DollarSign size={20} className="text-emerald-400" />
                  </div>
                  <div className="text-sm text-slate-400">Monthly Revenue</div>
                </div>
                <div className="text-3xl font-bold text-emerald-400">
                  ${stats?.monthlyRevenue.toLocaleString()}
                </div>
              </Card>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
          >
            <Card glow>
              <CardHeader>
                <CardTitle>Users by Plan</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-slate-800">
                        <th className="text-left py-3 px-4 text-slate-300 font-semibold">Plan</th>
                        <th className="text-right py-3 px-4 text-slate-300 font-semibold">Users</th>
                        <th className="text-right py-3 px-4 text-slate-300 font-semibold">Total Vectors</th>
                        <th className="text-right py-3 px-4 text-slate-300 font-semibold">Total QPS</th>
                        <th className="text-right py-3 px-4 text-slate-300 font-semibold">Avg QPS/User</th>
                        <th className="text-right py-3 px-4 text-slate-300 font-semibold">Price</th>
                        <th className="text-center py-3 px-4 text-slate-300 font-semibold">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {stats?.planStats.map((plan, i) => {
                        const planConfig = Object.values(PLAN_LIMITS).find(p => p.name === plan.plan);
                        return (
                          <tr key={i} className="border-b border-slate-800/50 hover:bg-slate-800/30">
                            <td className="py-3 px-4 text-slate-100 font-medium">
                              <Badge variant={
                                plan.plan === 'Enterprise' ? 'cyan' :
                                plan.plan === 'Scale' ? 'success' :
                                plan.plan === 'Pro' ? 'success' : 'default'
                              }>
                                {plan.plan}
                              </Badge>
                            </td>
                            <td className="py-3 px-4 text-right text-slate-300 font-mono">
                              {plan.userCount.toLocaleString()}
                            </td>
                            <td className="py-3 px-4 text-right text-slate-300 font-mono">
                              {plan.totalVectors.toLocaleString()}
                            </td>
                            <td className="py-3 px-4 text-right text-cyan-400 font-mono">
                              {plan.totalQPS.toLocaleString()}
                            </td>
                            <td className="py-3 px-4 text-right text-slate-300 font-mono">
                              {plan.avgQPSPerUser.toFixed(1)}
                            </td>
                            <td className="py-3 px-4 text-right">
                              {editingPrice === plan.plan ? (
                                <div className="flex items-center gap-2 justify-end">
                                  <Input
                                    type="number"
                                    value={priceValues[plan.plan] ?? ''}
                                    onChange={(e) => setPriceValues({
                                      ...priceValues,
                                      [plan.plan]: e.target.value === '' ? null : parseFloat(e.target.value)
                                    })}
                                    className="w-20 text-right"
                                    placeholder="0"
                                  />
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleSavePrice(plan.plan)}
                                  >
                                    <Save size={14} />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={handleCancelEdit}
                                  >
                                    <X size={14} />
                                  </Button>
                                </div>
                              ) : (
                                <div className="flex items-center gap-2 justify-end">
                                  <span className="text-slate-300 font-mono">
                                    {plan.price !== null ? `$${plan.price}` : 'Custom'}
                                  </span>
                                  {plan.price !== null && (
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => handleEditPrice(plan.plan)}
                                    >
                                      <Edit2 size={14} />
                                    </Button>
                                  )}
                                </div>
                              )}
                            </td>
                            <td className="py-3 px-4 text-center">
                              <div className="text-xs text-slate-500">
                                {planConfig && (
                                  <>
                                    {planConfig.vectors === Infinity ? 'Unlimited' : `${(planConfig.vectors / 1000).toFixed(0)}K`} vectors
                                    <br />
                                    {planConfig.qps === Infinity ? 'Custom' : `~${planConfig.qps}`} QPS burst
                                  </>
                                )}
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card glow>
              <CardHeader>
                <CardTitle>Top Users by Usage</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {stats?.topUsers.map((tenant, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between p-4 bg-slate-800/30 rounded-lg hover:bg-slate-800/50 transition-colors"
                    >
                      <div className="flex items-center gap-4 flex-1">
                        <div className="w-8 h-8 bg-cyan-500/10 rounded-full flex items-center justify-center">
                          <span className="text-cyan-400 font-semibold text-sm">{i + 1}</span>
                        </div>
                        <div className="flex-1">
                          <div className="text-slate-100 font-medium">{tenant.email}</div>
                          <div className="text-slate-500 text-sm">
                            {tenant.vectors.toLocaleString()} vectors • {tenant.qps} QPS • {tenant.dailyQueries.toLocaleString()} queries/day
                          </div>
                        </div>
                      </div>
                      <Badge variant={
                        tenant.plan === 'Enterprise' ? 'cyan' :
                        tenant.plan === 'Scale' ? 'success' :
                        tenant.plan === 'Pro' ? 'success' : 'default'
                      }>
                        {tenant.plan}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card glow>
              <CardHeader>
                <CardTitle>Rate Limit Presets</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { name: 'Free Tier', qps: 10, status: true },
                    { name: 'Pro Tier', qps: 100, status: true },
                    { name: 'Enterprise Tier', qps: 1000, status: true },
                    { name: 'Emergency Rate Limit', qps: 5, status: false }
                  ].map((preset, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between p-4 bg-slate-800/30 rounded-lg"
                    >
                      <div>
                        <div className="text-slate-100 font-medium">{preset.name}</div>
                        <div className="text-slate-500 text-sm">{preset.qps} QPS limit</div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge variant={preset.status ? 'success' : 'default'}>
                          {preset.status ? 'Active' : 'Inactive'}
                        </Badge>
                        <button
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                            preset.status ? 'bg-cyan-500' : 'bg-slate-700'
                          }`}
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                              preset.status ? 'translate-x-6' : 'translate-x-1'
                            }`}
                          />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>System Health</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-4">
                  {[
                    { name: 'API Gateway', status: 'healthy', uptime: '99.99%' },
                    { name: 'Database Cluster', status: 'healthy', uptime: '99.97%' },
                    { name: 'Query Workers', status: 'healthy', uptime: '99.95%' }
                  ].map((service, i) => (
                    <div
                      key={i}
                      className="p-4 bg-slate-800/30 rounded-lg"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="text-slate-100 font-medium">{service.name}</div>
                        <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
                      </div>
                      <div className="text-slate-500 text-sm">{service.uptime} uptime</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
