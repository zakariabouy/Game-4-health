import { Search, Sun, Bell, ChevronDown, Pill, Flame } from 'lucide-react';

export default function Header() {
  return (
    <header className="header">
      <button className="header-free-spin" title="Pill Hero Daily Check-in">
        <Pill size={13} />
        Daily Check-in
      </button>

      <div className="header-search">
        <Search size={13} className="search-icon-abs" />
        <input type="text" placeholder="Search patients, packs..." />
      </div>

      <div className="header-spacer" />

      <div className="header-actions">
        {/* Streak indicator */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 5,
          background: 'rgba(251,191,36,0.1)',
          border: '2px solid rgba(251,191,36,0.25)',
          boxShadow: '2px 2px 0 rgba(0,0,0,0.4)',
          padding: '5px 10px',
          fontFamily: 'Montserrat,sans-serif',
          fontSize: 11, fontWeight: 800, color: '#fbbf24',
        }}>
          <Flame size={11} color="#fbbf24" /> 14 Day Streak
        </div>

        <button className="header-icon-btn" title="Toggle theme">
          <Sun size={15} />
        </button>

        <button className="header-icon-btn" title="Notifications">
          <Bell size={15} />
          <span className="notif-badge" />
        </button>

        <div className="header-user">
          <div className="user-avatar-hdr">ML</div>
          <div className="user-info-hdr">
            <span className="user-name-hdr">Dr. Martin Lee</span>
            <span className="user-role-hdr">Admin</span>
          </div>
          <ChevronDown size={13} style={{ color: '#3c3c68' }} />
        </div>
      </div>
    </header>
  );
}
