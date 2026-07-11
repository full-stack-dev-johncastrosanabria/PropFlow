import { Outlet, Link, useLocation } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from './contexts/AuthContext';

export default function Layout() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isActive = (path: string) => location.pathname === path;

  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: '📊' },
    { path: '/leads', label: 'Leads', icon: '🎯' },
    { path: '/productivity', label: 'Productivity', icon: '🔥' },
    { path: '/properties', label: 'Properties', icon: '🏠' },
    { path: '/units', label: 'Units', icon: '🏢' },
    { path: '/tenants', label: 'Tenants', icon: '👥' },
    { path: '/contracts', label: 'Contracts', icon: '📄' },
    { path: '/payments', label: 'Payments', icon: '💰' },
    { path: '/maintenance', label: 'Maintenance', icon: '🔧' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow border-b border-gray-200 sticky top-0 z-50">
        <div className="container">
          <div className="flex items-center justify-between py-3 md:py-4">
            {/* Logo */}
            <Link 
              to="/dashboard" 
              className="text-xl md:text-2xl font-bold text-blue-600 flex items-center gap-2 hover:text-blue-700 transition-colors"
            >
              <span className="text-xl md:text-2xl">🏠</span>
              PropFlow
            </Link>

            {/* Desktop Navigation */}
            <div className="nav-desktop">
              <div className="flex items-center gap-2">
                {navItems.slice(0, 5).map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      isActive(item.path)
                        ? 'bg-blue-100 text-blue-700'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                    }`}
                  >
                    <span className="mr-2">{item.icon}</span>
                    {item.label}
                  </Link>
                ))}
                
                {/* User Menu */}
                <div className="flex items-center gap-4 ml-6 pl-6 border-l border-gray-200">
                  <div className="text-right">
                    <div className="text-sm font-semibold text-gray-900">
                      {user?.fullName}
                    </div>
                    <div className="text-xs text-gray-500">Landlord</div>
                  </div>
                  <button 
                    onClick={logout} 
                    className="btn btn-secondary"
                  >
                    Logout
                  </button>
                </div>
              </div>
            </div>

            {/* Mobile Menu Button */}
            <div className="nav-mobile">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {isMobileMenuOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {isMobileMenuOpen && (
            <div className="nav-mobile border-t border-gray-200 py-4 bg-white">
              <div className="grid grid-cols-2 gap-2 mb-6">
                {navItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`mobile-nav-item rounded-xl text-sm font-medium transition-colors ${
                      isActive(item.path)
                        ? 'bg-blue-100 text-blue-700'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                    }`}
                  >
                    <span className="mobile-nav-icon">{item.icon}</span>
                    <span className="mobile-nav-label">{item.label}</span>
                  </Link>
                ))}
              </div>
              
              {/* Mobile User Section */}
              <div className="border-t border-gray-200 pt-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-semibold text-gray-900">
                      {user?.fullName}
                    </div>
                    <div className="text-xs text-gray-500">Landlord Account</div>
                  </div>
                  <button onClick={logout} className="btn btn-secondary">
                    Logout
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1">
        <div className="container py-4 md:py-8">
          <Outlet />
        </div>
      </main>

      {/* Mobile Bottom Navigation */}
      <div className="mobile-bottom-nav nav-mobile">
        <div className="mobile-bottom-nav-grid">
          {navItems.slice(0, 4).map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`mobile-bottom-nav-item ${
                isActive(item.path) ? 'active' : ''
              }`}
            >
              <span className="text-lg mb-1">{item.icon}</span>
              <span className="text-xs font-medium truncate">{item.label}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* Bottom padding for mobile nav */}
      <div className="h-16 nav-mobile"></div>
    </div>
  );
}