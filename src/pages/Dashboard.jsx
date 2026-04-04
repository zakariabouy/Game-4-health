import {
  AreaChart, Area, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid,
} from 'recharts';
import { Shield, Flame, Zap, Clock, Pill, CheckCircle, XCircle, MessageCircle } from 'lucide-react';
import {
  childProfile, childMedications, sessionHistory, therapistMessages,
  weeklyActivity, childProgressData,
} from '../data/mockData';

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

export default function Dashboard() {
  const todaySessions = sessionHistory.filter(s => s.date === 'Today');
  const recentXp = sessionHistory.filter(s => ['Today','Yesterday'].includes(s.date)).reduce((sum, s) => sum + s.xpEarned, 0);
  const thisWeekSessions = weeklyActivity.reduce((sum, d) => sum + d.sessions, 0);
  const medTakenToday = childMedications.filter(m => m.takenToday).length;

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title">Home</div>
          <div className="page-subtitle">Welcome back, Sarah — here's how Alex is doing today</div>
        </div>
      </div>

      {/* Hero Profile Card */}
      <div style={{
        background:'linear-gradient(145deg,#1a0a40,#2e1b6e,#3730a3)',
        border:'2px solid #4338ca', boxShadow:'6px 6px 0 rgba(0,0,0,0.6)',
        padding:24, marginBottom:16,
        display:'grid', gridTemplateColumns:'auto 1fr auto',
        gap:24, alignItems:'center', position:'relative', overflow:'hidden',
      }}>
        <div style={{ position:'absolute', inset:0, background:'repeating-linear-gradient(0deg,transparent 0,transparent 3px,rgba(0,0,0,0.04) 3px,rgba(0,0,0,0.04) 4px)', pointerEvents:'none' }} />
        <div style={{ position:'absolute', top:0, left:0, right:0, height:3, background:'linear-gradient(90deg,#818cf8,#c4b5fd,transparent)' }} />

        {/* Avatar + stage */}
        <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:8 }}>
          <div style={{
            width:72, height:72, background:childProfile.avatarBg,
            boxShadow:'4px 4px 0 rgba(0,0,0,0.6), inset -3px -4px 0 rgba(0,0,0,0.3), inset 3px 3px 0 rgba(255,255,255,0.15)',
            display:'flex', alignItems:'center', justifyContent:'center',
            fontFamily:"'Press Start 2P',monospace", fontSize:20, color:'#fff',
          }}>{childProfile.avatar}</div>
          <div style={{
            background:'rgba(96,165,250,0.15)', border:'1px solid rgba(96,165,250,0.4)',
            boxShadow:'2px 2px 0 rgba(0,0,0,0.4)',
            padding:'3px 9px', fontSize:8, fontWeight:800, color:'#60a5fa',
            fontFamily:"'Press Start 2P',monospace", display:'flex', alignItems:'center', gap:4,
          }}><Shield size={8} />{childProfile.heroStage}</div>
        </div>

        {/* Name + bars */}
        <div>
          <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:6 }}>
            <div style={{ fontFamily:"'Press Start 2P',monospace", fontSize:16, color:'#fff', textShadow:'2px 2px 0 rgba(0,0,0,0.5)' }}>
              {childProfile.name}
            </div>
            <span style={{ fontSize:10, fontWeight:800, color:'#fbbf24', background:'rgba(251,191,36,0.1)', border:'1px solid rgba(251,191,36,0.3)', padding:'2px 7px', boxShadow:'2px 2px 0 rgba(0,0,0,0.4)' }}>
              Lv.{childProfile.level}
            </span>
            <span className="cond-badge cond-adhd">{childProfile.condition}</span>
          </div>
          <div style={{ fontSize:11, color:'#6060a0', marginBottom:14 }}>
            Age {childProfile.age} · Therapist: {childProfile.therapist} · Joined {childProfile.joinedDate}
          </div>

          {/* HP bar */}
          <div style={{ marginBottom:10 }}>
            <div className="bar-label" style={{ marginBottom:4 }}>
              <span className="bar-label-text">❤ HP (Adherence)</span>
              <span className="bar-label-val">{childProfile.hp}/100</span>
            </div>
            <div className="bar-track" style={{ height:12 }}>
              <div className="bar-fill bar-fill-hp-hi" style={{ width:`${childProfile.hp}%` }} />
            </div>
          </div>

          {/* XP bar */}
          <div>
            <div className="bar-label" style={{ marginBottom:4 }}>
              <span className="bar-label-text">⚡ XP to next level</span>
              <span className="bar-label-val">{childProfile.xp.toLocaleString()} / {childProfile.xpToNext.toLocaleString()}</span>
            </div>
            <div className="bar-track" style={{ height:8 }}>
              <div className="bar-fill bar-fill-xp" style={{ width:`${Math.round((childProfile.xp/childProfile.xpToNext)*100)}%` }} />
            </div>
          </div>
        </div>

        {/* Streak + next session */}
        <div style={{ display:'flex', flexDirection:'column', gap:12, alignItems:'flex-end' }}>
          <div style={{
            display:'flex', flexDirection:'column', alignItems:'center', gap:4,
            background:'rgba(251,191,36,0.08)', border:'2px solid rgba(251,191,36,0.25)',
            boxShadow:'3px 3px 0 rgba(0,0,0,0.5)', padding:'12px 18px',
          }}>
            <Flame size={24} color="#fbbf24" />
            <div style={{ fontFamily:"'Press Start 2P',monospace", fontSize:18, color:'#fbbf24' }}>{childProfile.streak}</div>
            <div style={{ fontSize:8, fontWeight:800, color:'#6060a0', textTransform:'uppercase', letterSpacing:0.8 }}>Day Streak</div>
          </div>
          <div style={{ background:'rgba(255,255,255,0.04)', border:'2px solid #2a1a5e', boxShadow:'3px 3px 0 rgba(0,0,0,0.4)', padding:'8px 14px', textAlign:'center' }}>
            <div style={{ fontSize:9, fontWeight:800, color:'#3c3c68', textTransform:'uppercase', letterSpacing:0.8, marginBottom:3 }}>Next Session</div>
            <div style={{ fontSize:11, fontWeight:700, color:'#c4b5fd' }}>{childProfile.nextSession}</div>
          </div>
        </div>
      </div>

      {/* Quick stats */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:14, marginBottom:16 }}>
        {[
          { label:'Sessions This Week', value:thisWeekSessions, icon:Clock, color:'#7c3aed', sub:'Total play sessions'     },
          { label:'XP Earned (2 days)', value:`+${recentXp}`,  icon:Zap,   color:'#f59e0b', sub:'Experience points'       },
          { label:'Meds Taken Today',   value:`${medTakenToday}/${childMedications.length}`, icon:Pill, color:'#10b981', sub:'Medication adherence' },
        ].map(({ label, value, icon:Icon, color, sub }) => (
          <div key={label} style={{ background:'#0f0f22', border:'2px solid #2a1a5e', boxShadow:'4px 4px 0 rgba(0,0,0,0.5)', padding:16, display:'flex', alignItems:'center', gap:14, position:'relative' }}>
            <div style={{ position:'absolute', top:0, left:0, right:0, height:2, background:color }} />
            <div style={{ width:40, height:40, background:color+'22', border:`2px solid ${color}44`, boxShadow:'2px 2px 0 rgba(0,0,0,0.4)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
              <Icon size={18} color={color} />
            </div>
            <div>
              <div style={{ fontFamily:"'Press Start 2P',monospace", fontSize:18, color:'#fff', marginBottom:4, textShadow:'2px 2px 0 rgba(0,0,0,0.4)' }}>{value}</div>
              <div style={{ fontSize:9, fontWeight:800, color:'#3c3c68', textTransform:'uppercase', letterSpacing:1 }}>{label}</div>
              <div style={{ fontSize:9, fontWeight:500, color:'#3c3c5a', marginTop:1 }}>{sub}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom row */}
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:14 }}>

        {/* Today's Activity */}
        <div style={{ background:'#0f0f22', border:'2px solid #2a1a5e', boxShadow:'4px 4px 0 rgba(0,0,0,0.5)', overflow:'hidden' }}>
          <div style={{ padding:'12px 16px', borderBottom:'2px solid #2a1a5e', background:'#0d0d20', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
            <span style={{ fontFamily:"'Press Start 2P',monospace", fontSize:8, color:'#c4b5fd' }}>Today's Activity</span>
            <span style={{ fontSize:9, fontWeight:800, color:'#3c3c68', textTransform:'uppercase' }}>{todaySessions.length} sessions</span>
          </div>
          {todaySessions.length === 0 ? (
            <div style={{ padding:24, textAlign:'center', color:'#3c3c68', fontSize:11 }}>No sessions yet today</div>
          ) : (
            todaySessions.map((s, i) => (
              <div key={i} style={{ padding:'12px 16px', borderBottom:'1px solid rgba(255,255,255,0.03)', display:'flex', alignItems:'center', gap:10 }}>
                {s.completed ? <CheckCircle size={14} color="#34d399" /> : <XCircle size={14} color="#f87171" />}
                <div style={{ flex:1 }}>
                  <div style={{ fontSize:12, fontWeight:700, color:'#d8d8f8' }}>{s.pack}</div>
                  <div style={{ fontSize:9, fontWeight:600, color:'#3c3c68' }}>{s.time} · {s.duration}</div>
                </div>
                <div style={{ textAlign:'right' }}>
                  {s.completed ? (
                    <>
                      <div style={{ fontFamily:"'Press Start 2P',monospace", fontSize:8, color:'#fbbf24' }}>+{s.xpEarned} XP</div>
                      <div style={{ fontSize:9, fontWeight:700, color:'#6060a0' }}>Score: {s.score}</div>
                    </>
                  ) : (
                    <div style={{ fontSize:9, fontWeight:700, color:'#f87171' }}>Missed</div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        {/* HP Trend chart */}
        <div className="chart-card">
          <div className="chart-title">HP Trend</div>
          <div className="chart-sub">Alex's adherence score over 8 months</div>
          <ResponsiveContainer width="100%" height={160}>
            <AreaChart data={childProgressData} margin={{ top:5,right:10,bottom:0,left:-25 }}>
              <defs>
                <linearGradient id="hpGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#34d399" stopOpacity={0.35} />
                  <stop offset="95%" stopColor="#34d399" stopOpacity={0}    />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="rgba(255,255,255,0.04)" strokeDasharray="2 4" />
              <XAxis dataKey="month" tick={{ fill:'#3c3c68', fontSize:9, fontFamily:'Montserrat', fontWeight:600 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill:'#3c3c68', fontSize:9, fontFamily:'Montserrat', fontWeight:600 }} axisLine={false} tickLine={false} domain={[30,100]} />
              <Tooltip content={<PixTip />} />
              <Area type="monotone" dataKey="hp" name="HP" stroke="#34d399" strokeWidth={2.5} fill="url(#hpGrad)" dot={{ fill:'#34d399', r:3, strokeWidth:0 }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Therapist messages */}
        <div style={{ background:'#0f0f22', border:'2px solid #2a1a5e', boxShadow:'4px 4px 0 rgba(0,0,0,0.5)', overflow:'hidden' }}>
          <div style={{ padding:'12px 16px', borderBottom:'2px solid #2a1a5e', background:'#0d0d20', display:'flex', alignItems:'center', gap:6 }}>
            <MessageCircle size={12} color="#c4b5fd" />
            <span style={{ fontFamily:"'Press Start 2P',monospace", fontSize:8, color:'#c4b5fd' }}>Therapist</span>
          </div>
          {therapistMessages.slice(0, 2).map((m, i) => (
            <div key={i} style={{ padding:'12px 16px', borderBottom:'1px solid rgba(255,255,255,0.03)' }}>
              <div style={{ display:'flex', alignItems:'center', gap:7, marginBottom:7 }}>
                <div style={{ width:24, height:24, background:'#7c3aed', boxShadow:'2px 2px 0 rgba(0,0,0,0.4)', display:'flex', alignItems:'center', justifyContent:'center', fontFamily:"'Press Start 2P',monospace", fontSize:7, color:'#fff', flexShrink:0 }}>
                  {m.avatar}
                </div>
                <div>
                  <div style={{ fontSize:10, fontWeight:700, color:'#c4b5fd' }}>{m.from}</div>
                  <div style={{ fontSize:9, color:'#3c3c68' }}>{m.time}</div>
                </div>
              </div>
              <div style={{ fontSize:11, color:'#8080b0', lineHeight:1.5, display:'-webkit-box', WebkitLineClamp:3, WebkitBoxOrient:'vertical', overflow:'hidden' }}>
                {m.text}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
