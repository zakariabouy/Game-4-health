import { Bell, ChevronDown, Flame, MessageCircle } from 'lucide-react';
import { childProfile } from '../data/mockData';

export default function Header() {
  return (
    <header className="header">
      <div style={{ display:'flex', alignItems:'center', gap:8 }}>
        <div style={{
          width:32, height:32, background:childProfile.avatarBg,
          boxShadow:'2px 2px 0 rgba(0,0,0,0.5)',
          display:'flex', alignItems:'center', justifyContent:'center',
          fontFamily:"'Press Start 2P',monospace", fontSize:9, color:'#fff',
        }}>{childProfile.avatar}</div>
        <div>
          <div style={{ fontSize:12, fontWeight:700, color:'#e8e8f8', lineHeight:1.2 }}>{childProfile.name}</div>
          <div style={{ fontSize:10, fontWeight:600, color:'#6060a0', textTransform:'uppercase', letterSpacing:0.5 }}>
            Lv.{childProfile.level} · {childProfile.heroStage}
          </div>
        </div>
      </div>

      <div className="header-spacer" />

      <div className="header-actions">
        <div style={{
          display:'flex', alignItems:'center', gap:5,
          background:'rgba(251,191,36,0.1)',
          border:'2px solid rgba(251,191,36,0.25)',
          boxShadow:'2px 2px 0 rgba(0,0,0,0.4)',
          padding:'5px 10px',
          fontFamily:'Montserrat,sans-serif',
          fontSize:11, fontWeight:800, color:'#fbbf24',
        }}>
          <Flame size={11} color="#fbbf24" /> {childProfile.streak}-Day Streak
        </div>

        <button className="header-icon-btn" title="Therapist messages">
          <MessageCircle size={15} />
          <span className="notif-badge" />
        </button>

        <button className="header-icon-btn" title="Notifications">
          <Bell size={15} />
        </button>

        <div className="header-user">
          <div className="user-avatar-hdr" style={{ background:'#059669' }}>SC</div>
          <div className="user-info-hdr">
            <span className="user-name-hdr">Sarah Chen</span>
            <span className="user-role-hdr">Parent</span>
          </div>
          <ChevronDown size={13} style={{ color:'#3c3c68' }} />
        </div>
      </div>
    </header>
  );
}
