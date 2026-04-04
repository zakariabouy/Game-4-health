import { Home, User, Gamepad2, TrendingUp, Trophy, Settings, Pill } from 'lucide-react';

const NAV = [
  { id: 'dashboard',  label: 'Home',       icon: Home       },
  { id: 'users',      label: 'My Child',   icon: User       },
  { id: 'games',      label: 'Activities', icon: Gamepad2   },
  { id: 'analytics',  label: 'Progress',   icon: TrendingUp },
  { id: 'rewards',    label: 'Rewards',    icon: Trophy     },
  { id: 'settings',   label: 'Settings',   icon: Settings   },
];

export default function Sidebar({ currentPage, onNavigate }) {
  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <div className="logo-icon">G4</div>
        <div>
          <div className="logo-text">G4Health</div>
          <div className="logo-subtitle">Parent Portal</div>
        </div>
      </div>

      <nav className="sidebar-nav">
        {NAV.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            className={`nav-item${currentPage === id ? ' active' : ''}`}
            onClick={() => onNavigate(id)}
          >
            <Icon size={15} />
            <span>{label}</span>
          </button>
        ))}
      </nav>

      <div className="sidebar-promo">
        <div className="promo-icon"><Pill size={22} color="#c4b5fd" /></div>
        <p className="promo-title">Alex's Pill Hero streak is active! Keep it going.</p>
        <button className="promo-btn" onClick={() => onNavigate('users')}>View Meds</button>
      </div>
    </aside>
  );
}
