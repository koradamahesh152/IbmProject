import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Cloud,
  LayoutDashboard,
  FilePlus2,
  List,
  Users,
  ScrollText,
  User,
  LogOut,
  Menu,
  X,
  GraduationCap,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export function Sidebar() {
  const { profile, signOut } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navItems = [
    { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/scenarios', label: 'Scenarios', icon: List },
    { to: '/scenarios/create', label: 'Create Scenario', icon: FilePlus2 },
    { to: '/learn', label: 'Learn Cloud', icon: GraduationCap },
  ];

  const adminItems = [
    { to: '/admin/users', label: 'User Management', icon: Users },
    { to: '/admin/audit-logs', label: 'Audit Logs', icon: ScrollText },
  ];

  function handleSignOut() {
    signOut();
    navigate('/');
  }

  const sidebarContent = (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-2 px-6 py-5 border-b border-slate-700">
        <Cloud className="w-8 h-8 text-sky-400" />
        <div>
          <p className="text-white font-semibold text-sm">Cloud Advisor</p>
          <p className="text-slate-400 text-xs">Service Model Decision</p>
        </div>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.to;
          return (
            <Link
              key={item.to}
              to={item.to}
              onClick={() => setMobileOpen(false)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                isActive
                  ? 'bg-sky-600 text-white'
                  : 'text-slate-300 hover:bg-slate-700 hover:text-white'
              }`}
            >
              <Icon className="w-5 h-5" />
              {item.label}
            </Link>
          );
        })}

        {profile?.role === 'admin' && (
          <>
            <div className="pt-4 pb-2 px-3">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Admin</p>
            </div>
            {adminItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.to;
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                    isActive
                      ? 'bg-sky-600 text-white'
                      : 'text-slate-300 hover:bg-slate-700 hover:text-white'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  {item.label}
                </Link>
              );
            })}
          </>
        )}
      </nav>

      <div className="px-3 py-4 border-t border-slate-700">
        <Link
          to="/profile"
          onClick={() => setMobileOpen(false)}
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-slate-300 hover:bg-slate-700 hover:text-white transition-colors mb-1"
        >
          <User className="w-5 h-5" />
          <div className="flex-1 min-w-0">
            <p className="truncate">{profile?.full_name || profile?.email || 'User'}</p>
            <p className="text-xs text-slate-500 capitalize">{profile?.role}</p>
          </div>
        </Link>
        <button
          onClick={handleSignOut}
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-slate-300 hover:bg-red-600 hover:text-white transition-colors w-full"
        >
          <LogOut className="w-5 h-5" />
          Sign Out
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 bg-slate-900 z-40 flex items-center justify-between px-4 py-3 border-b border-slate-700">
        <div className="flex items-center gap-2">
          <Cloud className="w-6 h-6 text-sky-400" />
          <span className="text-white font-semibold text-sm">Cloud Advisor</span>
        </div>
        <button onClick={() => setMobileOpen(!mobileOpen)} className="text-slate-300">
          {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Desktop sidebar */}
      <aside className="hidden lg:flex w-64 fixed top-0 left-0 bottom-0 bg-slate-900 flex-col z-30">
        {sidebarContent}
      </aside>

      {/* Mobile sidebar overlay */}
      {mobileOpen && (
        <>
          <div
            className="lg:hidden fixed inset-0 bg-black/50 z-40"
            onClick={() => setMobileOpen(false)}
          />
          <aside className="lg:hidden fixed top-0 left-0 bottom-0 w-64 bg-slate-900 z-50">
            {sidebarContent}
          </aside>
        </>
      )}
    </>
  );
}
