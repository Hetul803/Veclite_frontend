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

export function AdminStandalone() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [editingPrice, setEditingPrice] = useState<string | null>(null);
  const [priceValues, setPriceValues] = useState<Record<string, number | null>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Allow access even if not logged in (for testing)
    // In production, you'd want to check admin status
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      setLoading(true);
      const data = await getAdminStats();
      setStats(data);
      // Initialize price values
      const prices: Record<string, number | null> = {};
      data.planStats.forEach(plan => {
        prices[plan.plan] = plan.price;
      });
      setPriceValues(prices);
    } catch (error) {
      console.error('Failed to load admin stats:', error);
    } finally {
      setLoading(false);
    }
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
    // Reset price values
    if (stats) {
      const prices: Record<string, number | null> = {};
      stats.planStats.forEach(plan => {
        prices[plan.plan] = plan.price;
      });
      setPriceValues(prices);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400 mx-auto mb-4"></div>
          <p className="text-slate-400">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 pt-8 pb-16">
      <div className="container mx-auto px-4">
        {/* Standalone Admin Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold text-slate-100 mb-2 flex items-center gap-3">
                <Shield className="text-cyan-400" size={32} />
                Memryx Admin Console
              </h1>
              <p className="text-slate-400">System-wide monitoring and management</p>
            </div>
            <Badge variant="cyan" className="text-lg px-4 py-2">
              Admin Only
            </Badge>
          </div>
        </motion.div>

        {!stats && (
          <Card className="mb-6 border-yellow-500/50">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3 text-yellow-400">
                <AlertTriangle size={20} />
                <p>No admin statistics available. Make sure you're logged in as an admin.</p>
              </div>
            </CardContent>
          </Card>
        )}

        {stats && (
          <>
            {/* Summary Cards */}
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <Card glow>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between mb-2">
                    <Users className="text-cyan-400" size={24} />
                    <Badge variant="cyan">{stats.totalUsers}</Badge>
                  </div>
                  <p className="text-2xl font-bold text-slate-100">{stats.totalUsers}</p>
                  <p className="text-sm text-slate-400 mt-1">Total Users</p>
                  <div className="mt-3 flex gap-2 text-xs">
                    <span className="text-emerald-400">{stats.paidUsers} paid</span>
                    <span className="text-slate-500">•</span>
                    <span className="text-slate-400">{stats.freeUsers} free</span>
                  </div>
                </CardContent>
              </Card>

              <Card glow>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between mb-2">
                    <Database className="text-cyan-400" size={24} />
                    <Badge variant="cyan">{stats.totalIndexes}</Badge>
                  </div>
                  <p className="text-2xl font-bold text-slate-100">{stats.totalVectors.toLocaleString()}</p>
                  <p className="text-sm text-slate-400 mt-1">Total Vectors</p>
                  <p className="text-xs text-slate-500 mt-1">Across {stats.totalIndexes} indexes</p>
                </CardContent>
              </Card>

              <Card glow>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between mb-2">
                    <Activity className="text-cyan-400" size={24} />
                    <Badge variant="cyan">Live</Badge>
                  </div>
                  <p className="text-2xl font-bold text-slate-100">{stats.globalQPS.toFixed(1)}</p>
                  <p className="text-sm text-slate-400 mt-1">Global QPS</p>
                  <p className="text-xs text-slate-500 mt-1">Queries per second</p>
                </CardContent>
              </Card>

              <Card glow>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between mb-2">
                    <DollarSign className="text-cyan-400" size={24} />
                    <Badge variant="cyan">MRR</Badge>
                  </div>
                  <p className="text-2xl font-bold text-slate-100">${stats.monthlyRevenue.toFixed(2)}</p>
                  <p className="text-sm text-slate-400 mt-1">Monthly Revenue</p>
                  <p className="text-xs text-slate-500 mt-1">Recurring subscriptions</p>
                </CardContent>
              </Card>
            </div>

            {/* Users by Plan */}
            <Card className="mb-8">
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
                        <th className="text-right py-3 px-4 text-slate-300 font-semibold">Vectors</th>
                        <th className="text-right py-3 px-4 text-slate-300 font-semibold">QPS</th>
                        <th className="text-right py-3 px-4 text-slate-300 font-semibold">Price</th>
                        <th className="text-right py-3 px-4 text-slate-300 font-semibold">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {stats.planStats.map((plan) => (
                        <tr key={plan.plan} className="border-b border-slate-800/50 hover:bg-slate-800/30">
                          <td className="py-3 px-4">
                            <Badge variant={plan.plan === 'enterprise' ? 'cyan' : 'secondary'}>
                              {plan.plan}
                            </Badge>
                          </td>
                          <td className="py-3 px-4 text-right text-slate-300 font-mono">
                            {plan.userCount}
                          </td>
                          <td className="py-3 px-4 text-right text-slate-300 font-mono">
                            {plan.totalVectors.toLocaleString()}
                          </td>
                          <td className="py-3 px-4 text-right text-slate-300 font-mono">
                            {plan.totalQPS.toFixed(1)}
                          </td>
                          <td className="py-3 px-4 text-right">
                            {editingPrice === plan.plan ? (
                              <div className="flex items-center gap-2 justify-end">
                                <Input
                                  type="number"
                                  value={priceValues[plan.plan] ?? ''}
                                  onChange={(e) =>
                                    setPriceValues({
                                      ...priceValues,
                                      [plan.plan]: e.target.value ? parseFloat(e.target.value) : null,
                                    })
                                  }
                                  className="w-24"
                                  min="0"
                                  step="0.01"
                                />
                                <Button
                                  size="sm"
                                  variant="primary"
                                  onClick={() => handleSavePrice(plan.plan)}
                                >
                                  <Save size={14} />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={handleCancelEdit}
                                >
                                  <X size={14} />
                                </Button>
                              </div>
                            ) : (
                              <div className="flex items-center gap-2 justify-end">
                                <span className="text-slate-300 font-mono">
                                  {plan.price !== null ? `$${plan.price.toFixed(2)}` : 'Custom'}
                                </span>
                                {plan.plan !== 'enterprise' && (
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => handleEditPrice(plan.plan)}
                                  >
                                    <Edit2 size={14} />
                                  </Button>
                                )}
                              </div>
                            )}
                          </td>
                          <td className="py-3 px-4 text-right">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => {
                                // Navigate to user list filtered by plan
                                console.log(`View users on ${plan.plan} plan`);
                              }}
                            >
                              View Users
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>

            {/* System Limits */}
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <Card>
                <CardHeader>
                  <CardTitle>System Limits</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400">Max Vectors</span>
                      <span className="text-slate-100 font-mono">
                        {stats.totalVectors.toLocaleString()} / Unlimited
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400">Total QPS Capacity</span>
                      <span className="text-slate-100 font-mono">
                        {stats.globalQPS.toFixed(1)} / Unlimited
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400">Active Indexes</span>
                      <span className="text-slate-100 font-mono">{stats.totalIndexes}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <Button variant="secondary" className="w-full justify-start" size="sm">
                      View All Users
                    </Button>
                    <Button variant="secondary" className="w-full justify-start" size="sm">
                      View All Indexes
                    </Button>
                    <Button variant="secondary" className="w-full justify-start" size="sm">
                      System Logs
                    </Button>
                    <Button variant="secondary" className="w-full justify-start" size="sm">
                      Export Reports
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

