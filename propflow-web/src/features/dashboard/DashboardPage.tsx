import { useQuery } from '@tanstack/react-query';
import { dashboardApi } from '../../shared/api/dashboard';

export default function DashboardPage() {
  const { data: dashboard, isLoading, error } = useQuery({
    queryKey: ['dashboard'],
    queryFn: dashboardApi.getDashboard,
  });

  if (isLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: '3rem' }}>
        <div className="spinner" />
      </div>
    );
  }

  if (error) {
    return (
      <div style={{
        padding: '1rem',
        backgroundColor: '#fee2e2',
        color: 'var(--danger)',
        borderRadius: 'var(--border-radius)',
      }}>
        Error loading dashboard: {error instanceof Error ? error.message : 'Unknown error'}
      </div>
    );
  }

  const stats = [
    { label: 'Total Properties', value: dashboard?.totalProperties || 0, color: 'var(--primary)' },
    { label: 'Total Units', value: dashboard?.totalUnits || 0, color: 'var(--secondary)' },
    { label: 'Occupied Units', value: dashboard?.occupiedUnits || 0, color: 'var(--secondary)' },
    { label: 'Pending Payments', value: dashboard?.pendingPayments || 0, color: 'var(--warning)' },
    { label: 'Late Payments', value: dashboard?.latePayments || 0, color: 'var(--danger)' },
    { label: 'Open Maintenance', value: dashboard?.openMaintenanceRequests || 0, color: 'var(--warning)' },
  ];

  return (
    <div>
      <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '2rem' }}>
        Dashboard
      </h1>

      <div className="grid grid-cols-2 grid-cols-3" style={{ gap: '1.5rem' }}>
        {stats.map((stat) => (
          <div key={stat.label} className="card">
            <div style={{ fontSize: '0.875rem', color: 'var(--gray-600)', marginBottom: '0.5rem' }}>
              {stat.label}
            </div>
            <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: stat.color }}>
              {stat.value}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
