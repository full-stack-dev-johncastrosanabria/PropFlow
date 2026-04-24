import { useQuery } from '@tanstack/react-query';
import { dashboardApi } from '../../shared/api/dashboard';

export default function DashboardPage() {
  const { data: dashboard, isLoading, error } = useQuery({
    queryKey: ['dashboard'],
    queryFn: dashboardApi.getDashboard,
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-16">
        <div className="text-center">
          <div className="spinner mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-danger">
        <strong>Error:</strong> {error instanceof Error ? error.message : 'Failed to load dashboard'}
      </div>
    );
  }

  const stats = [
    { 
      label: 'Properties', 
      value: dashboard?.totalProperties || 0, 
      icon: '🏠',
      color: 'text-blue-600',
      bg: 'bg-blue-50'
    },
    { 
      label: 'Total Units', 
      value: dashboard?.totalUnits || 0, 
      icon: '🏢',
      color: 'text-gray-600',
      bg: 'bg-gray-50'
    },
    { 
      label: 'Occupied', 
      value: dashboard?.occupiedUnits || 0, 
      icon: '✅',
      color: 'text-green-600',
      bg: 'bg-green-50'
    },
    { 
      label: 'Pending', 
      value: dashboard?.pendingPayments || 0, 
      icon: '⏳',
      color: 'text-yellow-600',
      bg: 'bg-yellow-50'
    },
    { 
      label: 'Late', 
      value: dashboard?.latePayments || 0, 
      icon: '⚠️',
      color: 'text-red-600',
      bg: 'bg-red-50'
    },
    { 
      label: 'Maintenance', 
      value: dashboard?.openMaintenanceRequests || 0, 
      icon: '🔧',
      color: 'text-orange-600',
      bg: 'bg-orange-50'
    },
  ];

  return (
    <div className="mobile-space-y-6 md:space-y-8">
      {/* Header */}
      <div className="text-center md:text-left px-2 md:px-0">
        <h1 className="mb-3">Dashboard</h1>
        <p className="text-base md:text-lg text-gray-600">
          Welcome back! Here's an overview of your properties.
        </p>
      </div>

      {/* Stats Grid - Mobile Optimized */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-4 px-2 md:px-0">
        {stats.map((stat) => (
          <div 
            key={stat.label} 
            className={`mobile-stat-card card ${stat.bg} border-2 hover:shadow-lg transition-all`}
          >
            <div className="mobile-stat-icon">{stat.icon}</div>
            <div className={`mobile-stat-value ${stat.color}`}>
              {stat.value}
            </div>
            <div className="mobile-stat-label text-gray-700">
              {stat.label}
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions - Mobile Optimized */}
      <div className="card mx-2 md:mx-0">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
            <span className="text-white text-xl">⚡</span>
          </div>
          <h2 className="text-lg md:text-2xl">Quick Actions</h2>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
          <button className="btn btn-primary btn-lg">
            <span className="text-xl">🏠</span>
            Add Property
          </button>
          <button className="btn btn-secondary btn-lg">
            <span className="text-xl">👥</span>
            Add Tenant
          </button>
          <button className="btn btn-secondary btn-lg">
            <span className="text-xl">💰</span>
            Record Payment
          </button>
          <button className="btn btn-secondary btn-lg">
            <span className="text-xl">🔧</span>
            New Request
          </button>
        </div>
      </div>

      {/* Recent Activity - Mobile Optimized */}
      <div className="card mx-2 md:mx-0">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-green-600 rounded-xl flex items-center justify-center">
            <span className="text-white text-xl">📈</span>
          </div>
          <h2 className="text-lg md:text-2xl">Recent Activity</h2>
        </div>
        
        <div className="mobile-space-y-4">
          <div className="mobile-activity-card bg-blue-50 border border-blue-200">
            <div className="mobile-activity-icon bg-blue-600 text-white">
              🏠
            </div>
            <div className="mobile-activity-content">
              <p className="mobile-activity-title">New property added</p>
              <p className="mobile-activity-subtitle">2 hours ago • Downtown Property</p>
            </div>
          </div>
          
          <div className="mobile-activity-card bg-green-50 border border-green-200">
            <div className="mobile-activity-icon bg-green-600 text-white">
              💰
            </div>
            <div className="mobile-activity-content">
              <p className="mobile-activity-title">Payment received</p>
              <p className="mobile-activity-subtitle">1 day ago • $1,200 rent payment</p>
            </div>
          </div>
          
          <div className="text-center py-6 md:py-8">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="text-2xl text-gray-400">📋</span>
            </div>
            <p className="font-semibold text-gray-700">All caught up!</p>
            <p className="text-sm text-gray-500">No more recent activity to show</p>
          </div>
        </div>
      </div>

      {/* Mobile bottom padding */}
      <div className="h-20 md:hidden"></div>
    </div>
  );
}