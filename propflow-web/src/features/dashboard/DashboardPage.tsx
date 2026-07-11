import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { dashboardApi } from '../../shared/api/dashboard';
import { useAuth } from '../../app/contexts/AuthContext';
import { money, shortDate, relativeTime, todayLabel } from './dashboardUtils';
import RevenueChart from './components/RevenueChart';
import OccupancyDonut from './components/OccupancyDonut';

const STAGE_COLORS = ['#6366f1', '#0ea5e9', '#14b8a6', '#f59e0b', '#f97316', '#22c55e', '#94a3b8'];

const activityIcon: Record<string, string> = {
  payment: '💰',
  lead: '🎯',
  maintenance: '🔧',
  contract: '📄',
};

export default function DashboardPage() {
  const { user } = useAuth();
  const { data: d, isLoading, error } = useQuery({
    queryKey: ['dashboard'],
    queryFn: dashboardApi.getDashboard,
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-16">
        <div className="text-center">
          <div className="spinner mb-4" />
          <p className="text-gray-600">Loading dashboard…</p>
        </div>
      </div>
    );
  }

  if (error || !d) {
    return (
      <div className="alert alert-danger">
        <strong>Error:</strong> {error instanceof Error ? error.message : 'Failed to load dashboard'}
      </div>
    );
  }

  const firstName = user?.fullName?.split(' ')[0] || 'there';
  const cur = d.currency || 'USD';
  const funnelMax = Math.max(1, ...d.leadsByStage.map((s) => s.count));
  const attention =
    d.overdueAmount > 0 || d.expiringContracts > 0 || d.highPriorityMaintenance > 0;

  return (
    <div className="dash">
      {/* Header */}
      <div className="dash-header">
        <div>
          <div className="dash-eyebrow">{todayLabel()}</div>
          <h1 className="dash-title">Good day, {firstName} 👋</h1>
          <p className="dash-sub">Here's what's happening across your portfolio today.</p>
        </div>
        <div className="dash-header-badge">
          <div className="dash-badge-value">{d.collectionRate}%</div>
          <div className="dash-badge-label">Collected this month</div>
        </div>
      </div>

      {/* Hero KPIs */}
      <div className="kpi-row">
        <div className="kpi-card kpi-accent-green">
          <div className="kpi-top">
            <span className="kpi-icon">💵</span>
            <span className="kpi-pill">{d.collectionRate}% collected</span>
          </div>
          <div className="kpi-value">{money(d.collectedThisMonth, cur)}</div>
          <div className="kpi-label">Revenue this month</div>
          <div className="kpi-foot">of {money(d.expectedThisMonth, cur)} expected</div>
        </div>

        <div className="kpi-card kpi-accent-blue">
          <div className="kpi-top">
            <span className="kpi-icon">🏢</span>
            <span className="kpi-pill">{d.occupiedUnits}/{d.totalUnits} units</span>
          </div>
          <div className="kpi-value">{d.occupancyRate}%</div>
          <div className="kpi-label">Occupancy rate</div>
          <div className="kpi-foot">{money(d.monthlyRecurringRevenue, cur)} recurring / mo</div>
        </div>

        <div className={`kpi-card ${d.overdueAmount > 0 ? 'kpi-accent-red' : 'kpi-accent-slate'}`}>
          <div className="kpi-top">
            <span className="kpi-icon">{d.overdueAmount > 0 ? '⚠️' : '✅'}</span>
            <span className="kpi-pill">{d.latePayments} late</span>
          </div>
          <div className="kpi-value">{money(d.overdueAmount, cur)}</div>
          <div className="kpi-label">Overdue rent</div>
          <div className="kpi-foot">{money(d.outstandingAmount, cur)} outstanding total</div>
        </div>

        <div className="kpi-card kpi-accent-indigo">
          <div className="kpi-top">
            <span className="kpi-icon">🎯</span>
            <span className="kpi-pill">{d.wonLeads} won</span>
          </div>
          <div className="kpi-value">{money(d.pipelineValue, cur, true)}</div>
          <div className="kpi-label">Pipeline value / mo</div>
          <div className="kpi-foot">{d.activeLeads} active leads</div>
        </div>
      </div>

      {/* Charts row */}
      <div className="dash-grid-2">
        <div className="card dash-panel">
          <div className="panel-head">
            <h3 className="panel-title">Revenue trend</h3>
            <span className="panel-hint">Collected vs expected · 6 months</span>
          </div>
          <RevenueChart data={d.revenueTrend} currency={cur} />
        </div>

        <div className="card dash-panel">
          <div className="panel-head">
            <h3 className="panel-title">Occupancy</h3>
            <Link to="/units" className="panel-link">Manage →</Link>
          </div>
          <OccupancyDonut
            occupied={d.occupiedUnits}
            available={d.availableUnits}
            maintenance={d.maintenanceUnits}
            rate={d.occupancyRate}
          />
        </div>
      </div>

      {/* Collection progress + Funnel */}
      <div className="dash-grid-2">
        <div className="card dash-panel">
          <div className="panel-head">
            <h3 className="panel-title">Rent collection</h3>
            <span className="panel-hint">{d.paidPaymentsThisMonth} paid · {d.pendingPayments} pending · {d.latePayments} late</span>
          </div>
          <div className="collect-amounts">
            <span className="collect-strong">{money(d.collectedThisMonth, cur)}</span>
            <span className="collect-muted">/ {money(d.expectedThisMonth, cur)}</span>
          </div>
          <div className="progress-track">
            <div
              className="progress-fill"
              style={{ width: `${Math.min(100, d.collectionRate)}%` }}
            />
          </div>
          <div className="collect-foot">
            <span>{d.collectionRate}% collected</span>
            <span>{money(Math.max(0, d.expectedThisMonth - d.collectedThisMonth), cur)} remaining</span>
          </div>
        </div>

        <div className="card dash-panel">
          <div className="panel-head">
            <h3 className="panel-title">Sales funnel</h3>
            <Link to="/leads" className="panel-link">Open →</Link>
          </div>
          <div className="funnel-mini">
            {d.leadsByStage.map((s) => (
              <div key={s.stage} className="funnel-mini-row">
                <span className="funnel-mini-label">{s.label}</span>
                <div className="funnel-mini-bar-track">
                  <div
                    className="funnel-mini-bar"
                    style={{ width: `${(s.count / funnelMax) * 100}%`, background: STAGE_COLORS[s.stage] }}
                  />
                </div>
                <span className="funnel-mini-count">{s.count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Needs attention */}
      {attention && (
        <div className="card dash-panel attention-panel">
          <div className="panel-head">
            <h3 className="panel-title">⚡ Needs attention today</h3>
          </div>
          <div className="attention-grid">
            {d.overdueAmount > 0 && (
              <Link to="/payments" className="attention-item attention-red">
                <div className="attention-num">{d.latePayments}</div>
                <div className="attention-text">
                  <div className="attention-h">Overdue payments</div>
                  <div className="attention-s">{money(d.overdueAmount, cur)} to collect</div>
                </div>
              </Link>
            )}
            {d.expiringContracts > 0 && (
              <Link to="/contracts" className="attention-item attention-amber">
                <div className="attention-num">{d.expiringContracts}</div>
                <div className="attention-text">
                  <div className="attention-h">Contracts expiring</div>
                  <div className="attention-s">within 45 days</div>
                </div>
              </Link>
            )}
            {d.highPriorityMaintenance > 0 && (
              <Link to="/maintenance" className="attention-item attention-orange">
                <div className="attention-num">{d.highPriorityMaintenance}</div>
                <div className="attention-text">
                  <div className="attention-h">Urgent maintenance</div>
                  <div className="attention-s">high priority open</div>
                </div>
              </Link>
            )}
          </div>
        </div>
      )}

      {/* Lists row */}
      <div className="dash-grid-2">
        {/* Upcoming payments */}
        <div className="card dash-panel">
          <div className="panel-head">
            <h3 className="panel-title">Upcoming & overdue rent</h3>
            <Link to="/payments" className="panel-link">All →</Link>
          </div>
          {d.upcomingPayments.length === 0 ? (
            <div className="empty-mini">🎉 No outstanding payments</div>
          ) : (
            <div className="list-rows">
              {d.upcomingPayments.map((p) => (
                <div key={p.id} className="list-row">
                  <div className="list-avatar" style={{ background: p.isOverdue ? 'var(--red-500)' : 'var(--blue-500)' }}>
                    {p.tenantName.slice(0, 1)}
                  </div>
                  <div className="list-main">
                    <div className="list-title">{p.tenantName}</div>
                    <div className="list-sub">{p.unitName}</div>
                  </div>
                  <div className="list-right">
                    <div className="list-amount">{money(p.amount, p.currency)}</div>
                    <div className={`list-tag ${p.isOverdue ? 'tag-red' : 'tag-blue'}`}>
                      {p.isOverdue ? `${Math.abs(p.daysUntilDue)}d overdue` : `due ${shortDate(p.dueDate)}`}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent activity */}
        <div className="card dash-panel">
          <div className="panel-head">
            <h3 className="panel-title">Recent activity</h3>
          </div>
          {d.recentActivity.length === 0 ? (
            <div className="empty-mini">All caught up!</div>
          ) : (
            <div className="list-rows">
              {d.recentActivity.map((a, i) => (
                <div key={i} className="activity-row">
                  <div className={`activity-dot activity-${a.type}`}>{activityIcon[a.type] || '•'}</div>
                  <div className="list-main">
                    <div className="list-title">{a.title}</div>
                    <div className="list-sub">{a.subtitle}</div>
                  </div>
                  <div className="activity-time">{relativeTime(a.when)}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Expiring contracts (only if any) */}
      {d.expiringContractsList.length > 0 && (
        <div className="card dash-panel">
          <div className="panel-head">
            <h3 className="panel-title">Contracts expiring soon</h3>
            <Link to="/contracts" className="panel-link">Manage →</Link>
          </div>
          <div className="list-rows">
            {d.expiringContractsList.map((c) => (
              <div key={c.id} className="list-row">
                <div className="list-avatar" style={{ background: 'var(--orange-500)' }}>📄</div>
                <div className="list-main">
                  <div className="list-title">{c.tenantName}</div>
                  <div className="list-sub">{c.unitName} · {money(c.monthlyRent, c.currency)}/mo</div>
                </div>
                <div className="list-right">
                  <div className="list-amount">{shortDate(c.endDate)}</div>
                  <div className={`list-tag ${c.daysLeft <= 15 ? 'tag-red' : 'tag-amber'}`}>{c.daysLeft}d left</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Quick actions */}
      <div className="card dash-panel">
        <div className="panel-head">
          <h3 className="panel-title">⚡ Quick actions</h3>
        </div>
        <div className="quick-grid">
          <Link to="/properties" className="quick-btn"><span>🏠</span> Add Property</Link>
          <Link to="/tenants" className="quick-btn"><span>👥</span> Add Tenant</Link>
          <Link to="/payments" className="quick-btn"><span>💰</span> Record Payment</Link>
          <Link to="/leads" className="quick-btn"><span>🎯</span> New Lead</Link>
        </div>
      </div>

      <div className="h-20 md:hidden" />
    </div>
  );
}
