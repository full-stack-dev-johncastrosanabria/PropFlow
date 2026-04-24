import { Outlet, Link, useLocation } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';

export default function Layout() {
  const { user, logout } = useAuth();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <nav style={{
        backgroundColor: 'white',
        boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1)',
        position: 'sticky',
        top: 0,
        zIndex: 10,
      }}>
        <div className="container" style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '1rem',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
            <Link to="/dashboard" style={{
              fontSize: '1.5rem',
              fontWeight: 'bold',
              color: 'var(--primary)',
              textDecoration: 'none',
            }}>
              PropFlow
            </Link>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <Link
                to="/dashboard"
                style={{
                  textDecoration: 'none',
                  color: isActive('/dashboard') ? 'var(--primary)' : 'var(--gray-600)',
                  fontWeight: isActive('/dashboard') ? '600' : '400',
                  padding: '0.5rem 1rem',
                  borderRadius: 'var(--border-radius)',
                  backgroundColor: isActive('/dashboard') ? 'var(--gray-100)' : 'transparent',
                }}
              >
                Dashboard
              </Link>
              <Link
                to="/properties"
                style={{
                  textDecoration: 'none',
                  color: isActive('/properties') ? 'var(--primary)' : 'var(--gray-600)',
                  fontWeight: isActive('/properties') ? '600' : '400',
                  padding: '0.5rem 1rem',
                  borderRadius: 'var(--border-radius)',
                  backgroundColor: isActive('/properties') ? 'var(--gray-100)' : 'transparent',
                }}
              >
                Properties
              </Link>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <span style={{ color: 'var(--gray-600)', fontSize: '0.875rem' }}>
              {user?.fullName}
            </span>
            <button onClick={logout} className="btn btn-secondary btn-sm">
              Logout
            </button>
          </div>
        </div>
      </nav>
      <main style={{ flex: 1, padding: '2rem 0' }}>
        <div className="container">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
