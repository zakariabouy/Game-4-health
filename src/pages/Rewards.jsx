import { useState } from 'react';
import { Trophy, Zap, Gift, Star, Shield, Sprout, Leaf, Sword, Crown, Flame, Palette } from 'lucide-react';

const heroTiers = [
  { name:'Sprout',   range:'0–19 HP',   icon: Sprout, color:'#6b7280',
    perks:['Daily check-in bonus','Bronze chest access','+5% XP boost'] },
  { name:'Seedling', range:'20–44 HP',  icon: Leaf,   color:'#4ade80',
    perks:['2× daily spins','Silver chest access','+10% XP boost'] },
  { name:'Warrior',  range:'45–69 HP',  icon: Sword,  color:'#fbbf24',
    perks:['5× daily spins','Gold chest access','+20% XP boost','Priority support'] },
  { name:'Champion', range:'70–89 HP',  icon: Shield, color:'#60a5fa',
    perks:['Unlimited spins','Champion chest access','+35% XP boost','Priority support','Early pack access'] },
  { name:'Legend',   range:'90–100 HP', icon: Crown,  color:'#f9a8d4',
    perks:['Infinite rewards','Legendary chest','+50% XP boost','VIP support','Beta pack access','Exclusive hero skins'] },
];

const recentRedemptions = [
  { patient:'Priya Singh',     reward:'Legendary Chest',   xpUsed:500, time:'2m ago',  icon: Crown   },
  { patient:'Sofia Rodriguez', reward:'XP Double Boost',   xpUsed:300, time:'18m ago', icon: Zap     },
  { patient:'Tony Stark',      reward:'Champion Chest',    xpUsed:200, time:'1h ago',  icon: Shield  },
  { patient:'Emma Fischer',    reward:'Hero Skin Unlock',  xpUsed:400, time:'2h ago',  icon: Palette },
  { patient:'Alex Chen',       reward:'Daily Streak Saver',xpUsed:100, time:'3h ago',  icon: Flame   },
];

function Toggle({ defaultChecked = false }) {
  const [on, setOn] = useState(defaultChecked);
  return (
    <label className="toggle">
      <input type="checkbox" checked={on} onChange={() => setOn(!on)} />
      <span className="toggle-slider" />
    </label>
  );
}

export default function Rewards() {
  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title">Rewards</div>
          <div className="page-subtitle">
            Hero XP tiers, pill adherence rewards and redemption history
          </div>
        </div>
        <button className="add-game-btn"><Gift size={13} /> Create Reward</button>
      </div>

      {/* Summary */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 14, marginBottom: 18 }}>
        {[
          { label:'XP Redeemed',    value:'14,820', icon: Zap,     color:'#f59e0b' },
          { label:'Active Rewards', value:'12',     icon: Trophy,  color:'#7c3aed' },
          { label:'Hero Skins',     value:'8',      icon: Star,    color:'#ec4899' },
        ].map(({ label, value, icon: Icon, color }) => (
          <div key={label} style={{
            background: '#0f0f22', border: '2px solid #2a1a5e',
            boxShadow: '4px 4px 0 rgba(0,0,0,0.5)',
            padding: 16, display: 'flex', alignItems: 'center', gap: 14,
            position: 'relative',
          }}>
            <div style={{
              width: 40, height: 40, background: color + '22',
              border: `2px solid ${color}44`,
              boxShadow: '2px 2px 0 rgba(0,0,0,0.4)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
            }}>
              <Icon size={18} color={color} />
            </div>
            <div>
              <div style={{ fontFamily: "'Press Start 2P',monospace", fontSize: 16, color: '#fff', marginBottom: 4, textShadow: '2px 2px 0 rgba(0,0,0,0.4)' }}>{value}</div>
              <div style={{ fontSize: 9, fontWeight: 800, color: '#3c3c68', textTransform: 'uppercase', letterSpacing: 1 }}>{label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Hero tiers */}
      <div className="chart-card" style={{ marginBottom: 16 }}>
        <div className="chart-title">Hero XP Tiers</div>
        <div className="chart-sub">Rewards unlock as patients keep their hero HP high through medication adherence</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5,1fr)', gap: 10, marginTop: 14 }}>
          {heroTiers.map(t => (
            <div key={t.name} style={{
              background: 'rgba(255,255,255,0.02)',
              border: `2px solid ${t.color}44`,
              boxShadow: `3px 3px 0 rgba(0,0,0,0.5), inset 0 0 20px ${t.color}08`,
              padding: 14,
            }}>
              <div style={{ marginBottom: 8 }}><t.icon size={24} color={t.color} /></div>
              <div style={{ fontFamily: "'Press Start 2P',monospace", fontSize: 9, color: t.color, marginBottom: 3, textShadow: `1px 1px 0 rgba(0,0,0,0.5)` }}>{t.name}</div>
              <div style={{ fontSize: 9, fontWeight: 700, color: '#3c3c68', marginBottom: 10, textTransform: 'uppercase', letterSpacing: 0.5 }}>{t.range}</div>
              {t.perks.map(p => (
                <div key={p} style={{ display: 'flex', alignItems: 'flex-start', gap: 5, fontSize: 10, fontWeight: 600, color: '#8080c0', marginBottom: 5, lineHeight: 1.4 }}>
                  <span style={{ width: 5, height: 5, background: t.color, flexShrink: 0, marginTop: 3 }} />
                  {p}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Recent redemptions */}
      <div className="chart-card">
        <div className="chart-title">Recent Redemptions</div>
        <div className="chart-sub">Latest reward claims by patients</div>
        <table className="data-table" style={{ marginTop: 12 }}>
          <thead>
            <tr>
              <th>Patient</th>
              <th>Reward</th>
              <th>XP Used</th>
              <th>Time</th>
            </tr>
          </thead>
          <tbody>
            {recentRedemptions.map((r, i) => (
              <tr key={i}>
                <td style={{ fontWeight: 700, color: '#d8d8f8' }}>
                  <r.icon size={12} style={{ verticalAlign: 'middle', marginRight: 5 }} /> {r.patient}
                </td>
                <td style={{ color: '#c4b5fd' }}>{r.reward}</td>
                <td style={{ fontFamily: "'Press Start 2P',monospace", fontSize: 9, color: '#f59e0b' }}>
                  −{r.xpUsed} XP
                </td>
                <td style={{ fontSize: 11, color: '#3c3c68' }}>{r.time}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
