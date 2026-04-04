import {
  LayoutDashboard, Users, Gamepad2, Gift, Radio,
  Trophy, HelpCircle, DollarSign, Share2, Wallet, Settings,
  Pill, BarChart2,
} from 'lucide-react';

const NAV = [
  { id: 'dashboard', label: 'Dashboard',     icon: LayoutDashboard },
  { id: 'users',      label: 'Patients',      icon: Users           },
  { id: 'games',      label: 'Therapy Packs', icon: Gamepad2        },
  { id: 'analytics',  label: 'Analytics',     icon: BarChart2       },
  { id: 'rewards',    label: 'Rewards',       icon: Trophy          },
  { id: 'settings',   label: 'Settings',     icon: Settings        },
];

export default function Sidebar({ currentPage, onNavigate }) {
  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <div className="logo-icon">G4</div>
        <div>
          <div className="logo-text">G4Health</div>
          <div className="logo-subtitle">Admin Console</div>
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
        <p className="promo-title">Pill Hero streak active! Keep taking your meds.</p>
        <button className="promo-btn">View Progress</button>
      </div>
    </aside>
  );
}
