import { Zap, Pill, BookOpen, Star, Leaf, TreePine, CheckCircle, XCircle, Clock } from 'lucide-react';
import { assignedPacks, sessionHistory, weeklyActivity } from '../data/mockData';
import { BarChart, Bar, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

const PACK_ICONS = { BookOpen, Zap, Star, Leaf, Pill, TreePine };
function PackIcon({ name, size = 24, color = '#fff' }) {
  const Icon = PACK_ICONS[name] || Pill;
  return <Icon size={size} color={color} />;
}

const PixTip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background:'#0d0d20', border:'2px solid #2a1a5e', boxShadow:'4px 4px 0 rgba(0,0,0,0.5)', padding:'8px 12px', fontFamily:'Montserrat,sans-serif' }}>
      <div style={{ fontSize:10, fontWeight:800, color:'#3c3c68', textTransform:'uppercase', letterSpacing:1, marginBottom:5 }}>{label}</div>
      {payload.map((p, i) => (
        <div key={i} style={{ fontSize:11, fontWeight:700, color: p.color || '#e8e8f8' }}>{p.name}: {p.value}</div>
      ))}
    </div>
  );
};

export default function Games() {
  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title">Activities</div>
          <div className="page-subtitle">Ahmed's assigned therapy packs, weekly activity and session log</div>
        </div>
      </div>

      {/* Assigned packs */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(2,1fr)', gap:14, marginBottom:14 }}>
        {assignedPacks.map(pack => (
          <div key={pack.id} style={{
            background:'#0f0f22', border:`2px solid ${pack.color}44`,
            boxShadow:'4px 4px 0 rgba(0,0,0,0.5)', overflow:'hidden', position:'relative',
          }}>
            <div style={{ position:'absolute', top:0, left:0, right:0, height:3, background:pack.color }} />
            <div style={{ padding:20, display:'flex', gap:16 }}>
              <div style={{ width:56, height:56, background:pack.bg, border:`2px solid ${pack.color}44`, flexShrink:0, display:'flex', alignItems:'center', justifyContent:'center' }}>
                <PackIcon name={pack.iconName} size={24} color={pack.color} />
              </div>
              <div style={{ flex:1 }}>
                <div style={{ fontFamily:"'Press Start 2P',monospace", fontSize:11, color:'#fff', marginBottom:3 }}>{pack.title}</div>
                <div style={{ fontSize:10, fontWeight:700, color:pack.color, textTransform:'uppercase', letterSpacing:0.5, marginBottom:8 }}>{pack.subtitle}</div>
                <div style={{ fontSize:10, color:'#3c3c68', lineHeight:1.5, marginBottom:12 }}>{pack.desc}</div>
                <div className="bar-label">
                  <span className="bar-label-text">Course Progress</span>
                  <span style={{ fontFamily:"'Press Start 2P',monospace", fontSize:7, color:pack.color }}>{pack.sessionsCompleted}/{pack.totalSessions}</span>
                </div>
                <div className="bar-track" style={{ height:10 }}>
                  <div className="bar-fill" style={{ width:`${(pack.sessionsCompleted/pack.totalSessions)*100}%`, background:pack.color }} />
                </div>
              </div>
            </div>
            <div style={{ padding:'10px 20px', borderTop:'2px solid #2a1a5e', background:'rgba(0,0,0,0.2)', display:'flex', gap:20 }}>
              <span style={{ fontSize:10, fontWeight:700, color:'#6060a0', display:'flex', alignItems:'center', gap:4 }}>
                <Clock size={10} /> Last: {pack.lastPlayed}
              </span>
              <span style={{ fontSize:10, fontWeight:700, color:'#6060a0' }}>{pack.progress}% adherence</span>
            </div>
          </div>
        ))}
      </div>

      {/* Weekly activity chart */}
      <div className="chart-card" style={{ marginBottom:14 }}>
        <div className="chart-title">Weekly Activity</div>
        <div className="chart-sub">Sessions and minutes played each day this week</div>
        <ResponsiveContainer width="100%" height={180}>
          <BarChart data={weeklyActivity} margin={{ top:5,right:10,bottom:0,left:-25 }}>
            <CartesianGrid stroke="rgba(255,255,255,0.04)" strokeDasharray="2 4" />
            <XAxis dataKey="day" tick={{ fill:'#3c3c68', fontSize:10, fontFamily:'Montserrat', fontWeight:600 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill:'#3c3c68', fontSize:10, fontFamily:'Montserrat', fontWeight:600 }} axisLine={false} tickLine={false} />
            <Tooltip content={<PixTip />} />
            <Bar dataKey="sessions" name="Sessions" fill="#7c3aed" radius={[2,2,0,0]} />
            <Bar dataKey="minutes"  name="Minutes"  fill="#06b6d4" radius={[2,2,0,0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Session log */}
      <div style={{ background:'#0f0f22', border:'2px solid #2a1a5e', boxShadow:'4px 4px 0 rgba(0,0,0,0.5)' }}>
        <div style={{ padding:'12px 16px', borderBottom:'2px solid #2a1a5e', background:'#0d0d20' }}>
          <span style={{ fontFamily:"'Press Start 2P',monospace", fontSize:8, color:'#c4b5fd' }}>Recent Sessions</span>
        </div>
        <table className="data-table">
          <thead>
            <tr>
              <th>Status</th>
              <th>Date · Time</th>
              <th>Pack</th>
              <th>Duration</th>
              <th>Score</th>
              <th>XP</th>
            </tr>
          </thead>
          <tbody>
            {sessionHistory.map((s, i) => (
              <tr key={i}>
                <td>
                  {s.completed
                    ? <CheckCircle size={13} color="#34d399" />
                    : <XCircle size={13} color="#f87171" />}
                </td>
                <td style={{ color:'#6060a0', fontSize:11 }}>{s.date} · {s.time}</td>
                <td style={{ fontWeight:700, color:'#c4b5fd' }}>{s.pack}</td>
                <td style={{ color:'#b0b0d8' }}>{s.duration}</td>
                <td>
                  {s.completed
                    ? <span style={{ fontFamily:"'Press Start 2P',monospace", fontSize:8, color:'#a78bfa' }}>{s.score}</span>
                    : <span style={{ color:'#3c3c68' }}>—</span>}
                </td>
                <td>
                  <span style={{ fontFamily:"'Press Start 2P',monospace", fontSize:8, color: s.xpEarned > 0 ? '#fbbf24' : '#3c3c68' }}>
                    {s.xpEarned > 0 ? `+${s.xpEarned}` : '—'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
