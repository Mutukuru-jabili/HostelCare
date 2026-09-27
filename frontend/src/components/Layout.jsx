import { NavLink, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const studentNav = [
  { label: 'Dashboard', path: '/student/dashboard' },
  { label: 'My Complaints', path: '/student/complaints' },
  { label: 'New Complaint', path: '/student/complaints/new' },
  { label: 'Profile', path: '/student/profile' },
];

const adminNav = [
  { label: 'Dashboard', path: '/admin/dashboard' },
  { label: 'All Complaints', path: '/admin/complaints' },
];

export default function Layout() {
  const { user, setUser } = useAuth();

  const navItems = user?.role === 'ADMIN' ? adminNav : studentNav;

  const handleLogout = () => {
    setUser(null);
    window.location.href = '/login';
  };

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand-block">
          <div className="brand-mark">HC</div>
          <div>
            <h2>HostelCare</h2>
          </div>
        </div>
        <nav className="nav-menu">
          {navItems.map((item) => (
            <NavLink key={item.path} to={item.path} className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
              {item.label}
            </NavLink>
          ))}
          <button className="logout-button" onClick={handleLogout}>Logout</button>
        </nav>
      </aside>
      <main className="content-area">
        <header className="topbar">
          <div>
            <p className="eyebrow">Welcome back</p>
            <h1>{user?.fullName || 'HostelCare'}</h1>
          </div>
          <div className="topbar-meta">
            <span className="role-pill">{user?.role}</span>
          </div>
        </header>
        <Outlet />
      </main>
    </div>
  );
}
