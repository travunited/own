'use client';

import { useState, useEffect } from 'react';
import {
  Server,
  Database,
  HardDrive,
  Activity,
  AlertCircle,
  CheckCircle,
  RefreshCw,
  Trash2,
  Mail,
  Zap,
  Clock,
  TrendingUp,
  Download,
  Upload,
} from 'lucide-react';

export default function MaintenanceAdminDashboard() {
  const [loading, setLoading] = useState(true);
  const [systemHealth, setSystemHealth] = useState({
    database: 'healthy',
    server: 'healthy',
    storage: 'warning',
    email: 'healthy',
    cache: 'healthy',
  });

  const [metrics, setMetrics] = useState({
    dbConnections: 45,
    serverLoad: 32,
    storageUsed: 78,
    emailQueue: 12,
    cacheHitRate: 94.5,
    uptime: 99.8,
  });

  useEffect(() => {
    loadSystemData();
    const interval = setInterval(loadSystemData, 30000); // Refresh every 30s
    return () => clearInterval(interval);
  }, []);

  const loadSystemData = async () => {
    try {
      // TODO: Replace with actual system monitoring API
      setLoading(false);
    } catch (error) {
      console.error('Error loading system data:', error);
    }
  };

  const healthStatus = [
    {
      name: 'Database',
      status: systemHealth.database,
      icon: Database,
      details: `${metrics.dbConnections} active connections`,
      action: 'View Logs',
    },
    {
      name: 'Server',
      status: systemHealth.server,
      icon: Server,
      details: `${metrics.serverLoad}% load`,
      action: 'Monitor',
    },
    {
      name: 'Storage',
      status: systemHealth.storage,
      icon: HardDrive,
      details: `${metrics.storageUsed}% used`,
      action: 'Manage',
    },
    {
      name: 'Email Service',
      status: systemHealth.email,
      icon: Mail,
      details: `${metrics.emailQueue} in queue`,
      action: 'View Queue',
    },
    {
      name: 'Cache',
      status: systemHealth.cache,
      icon: Zap,
      details: `${metrics.cacheHitRate}% hit rate`,
      action: 'Clear Cache',
    },
  ];

  const maintenanceTasks = [
    {
      title: 'Database Backup',
      description: 'Last backup: 2 hours ago',
      icon: Database,
      color: 'blue',
      action: 'Backup Now',
    },
    {
      title: 'Clear Cache',
      description: 'Improve performance',
      icon: Trash2,
      color: 'orange',
      action: 'Clear All',
    },
    {
      title: 'Log Analysis',
      description: '1,245 new entries',
      icon: Activity,
      color: 'purple',
      action: 'View Logs',
    },
    {
      title: 'Email Queue',
      description: `${metrics.emailQueue} pending`,
      icon: Mail,
      color: 'green',
      action: 'Process',
    },
  ];

  const recentLogs = [
    {
      type: 'info',
      message: 'Database backup completed successfully',
      time: '2 hours ago',
    },
    {
      type: 'warning',
      message: 'Storage usage approaching 80%',
      time: '3 hours ago',
    },
    {
      type: 'info',
      message: 'Cache cleared for optimization',
      time: '5 hours ago',
    },
    {
      type: 'error',
      message: 'Email queue processing delayed',
      time: '6 hours ago',
    },
  ];

  const performanceMetrics = [
    { label: 'CPU Usage', value: 32, color: 'green' },
    { label: 'Memory Usage', value: 65, color: 'yellow' },
    { label: 'Disk I/O', value: 42, color: 'green' },
    { label: 'Network', value: 28, color: 'green' },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy':
        return 'green';
      case 'warning':
        return 'yellow';
      case 'error':
        return 'red';
      default:
        return 'gray';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy':
        return CheckCircle;
      case 'warning':
        return AlertCircle;
      case 'error':
        return AlertCircle;
      default:
        return Activity;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="w-12 h-12 animate-spin text-primary-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading system status...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center mb-2">
                <Server className="w-8 h-8 text-cyan-400 mr-3" />
                <h1 className="text-3xl font-bold">Maintenance Admin</h1>
              </div>
              <p className="text-gray-400">
                System health & technical operations
              </p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <p className="text-sm text-gray-400">System Uptime</p>
              <p className="text-2xl font-bold text-green-400">
                {metrics.uptime}%
              </p>
            </div>
          </div>
        </div>

        {/* System Health Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          {healthStatus.map((item) => {
            const Icon = item.icon;
            const StatusIcon = getStatusIcon(item.status);
            const statusColor = getStatusColor(item.status);

            return (
              <div
                key={item.name}
                className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 hover:border-white/40 transition-all"
              >
                <div className="flex items-center justify-between mb-4">
                  <Icon className="w-6 h-6 text-cyan-400" />
                  <StatusIcon
                    className={`w-5 h-5 text-${statusColor}-400`}
                  />
                </div>
                <h3 className="font-semibold mb-1">{item.name}</h3>
                <p className="text-sm text-gray-400 mb-3">{item.details}</p>
                <button className="text-xs text-cyan-400 hover:text-cyan-300 font-medium">
                  {item.action} →
                </button>
              </div>
            );
          })}
        </div>

        {/* Performance Metrics */}
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 mb-8">
          <h2 className="text-xl font-bold mb-6">Performance Metrics</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {performanceMetrics.map((metric) => (
              <div key={metric.label}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-400">{metric.label}</span>
                  <span className="text-lg font-bold">{metric.value}%</span>
                </div>
                <div className="w-full bg-white/10 rounded-full h-2">
                  <div
                    className={`bg-${metric.color}-400 h-2 rounded-full transition-all`}
                    style={{ width: `${metric.value}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Maintenance Tasks */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
              <h2 className="text-xl font-bold mb-6">Maintenance Tasks</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {maintenanceTasks.map((task) => {
                  const Icon = task.icon;
                  return (
                    <div
                      key={task.title}
                      className="bg-white/5 rounded-lg p-4 hover:bg-white/10 transition-colors"
                    >
                      <div className={`p-3 bg-${task.color}-500/20 rounded-lg w-fit mb-3`}>
                        <Icon className={`w-6 h-6 text-${task.color}-400`} />
                      </div>
                      <h3 className="font-semibold mb-1">{task.title}</h3>
                      <p className="text-sm text-gray-400 mb-3">
                        {task.description}
                      </p>
                      <button className="text-sm text-cyan-400 hover:text-cyan-300 font-medium">
                        {task.action}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Recent Logs */}
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold">Recent System Logs</h2>
                <button className="text-sm text-cyan-400 hover:text-cyan-300 font-medium">
                  View All →
                </button>
              </div>
              <div className="space-y-3">
                {recentLogs.map((log, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-3 p-3 bg-white/5 rounded-lg"
                  >
                    <div
                      className={`mt-1 ${
                        log.type === 'error'
                          ? 'text-red-400'
                          : log.type === 'warning'
                          ? 'text-yellow-400'
                          : 'text-green-400'
                      }`}
                    >
                      {log.type === 'error' ? (
                        <AlertCircle className="w-4 h-4" />
                      ) : log.type === 'warning' ? (
                        <AlertCircle className="w-4 h-4" />
                      ) : (
                        <CheckCircle className="w-4 h-4" />
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm">{log.message}</p>
                      <p className="text-xs text-gray-400 mt-1">{log.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Stats */}
            <div className="bg-gradient-to-br from-cyan-500/20 to-purple-500/20 backdrop-blur-sm rounded-xl p-6 border border-white/20">
              <h3 className="text-lg font-bold mb-4">Quick Stats</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-300">DB Size</span>
                    <span className="font-bold">2.4 GB</span>
                  </div>
                  <div className="w-full bg-white/10 rounded-full h-1">
                    <div className="bg-cyan-400 h-1 rounded-full w-3/4"></div>
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-300">Backup Size</span>
                    <span className="font-bold">1.8 GB</span>
                  </div>
                  <div className="w-full bg-white/10 rounded-full h-1">
                    <div className="bg-purple-400 h-1 rounded-full w-2/3"></div>
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-300">Cache Size</span>
                    <span className="font-bold">245 MB</span>
                  </div>
                  <div className="w-full bg-white/10 rounded-full h-1">
                    <div className="bg-green-400 h-1 rounded-full w-1/4"></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
              <h3 className="text-lg font-bold mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button className="w-full bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/50 rounded-lg p-3 text-left transition-colors">
                  <Download className="w-5 h-5 mb-1" />
                  <p className="font-medium">Backup Database</p>
                  <p className="text-xs text-gray-400">Create full backup</p>
                </button>
                <button className="w-full bg-orange-500/20 hover:bg-orange-500/30 border border-orange-500/50 rounded-lg p-3 text-left transition-colors">
                  <Trash2 className="w-5 h-5 mb-1" />
                  <p className="font-medium">Clear All Cache</p>
                  <p className="text-xs text-gray-400">Optimize performance</p>
                </button>
                <button className="w-full bg-purple-500/20 hover:bg-purple-500/30 border border-purple-500/50 rounded-lg p-3 text-left transition-colors">
                  <Activity className="w-5 h-5 mb-1" />
                  <p className="font-medium">View Error Logs</p>
                  <p className="text-xs text-gray-400">Debug issues</p>
                </button>
              </div>
            </div>

            {/* System Info */}
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
              <h3 className="text-lg font-bold mb-4">System Info</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">Node Version</span>
                  <span className="font-medium">v20.10.0</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Database</span>
                  <span className="font-medium">PostgreSQL 15</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Cache</span>
                  <span className="font-medium">Redis 7.2</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Last Restart</span>
                  <span className="font-medium">2 days ago</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

