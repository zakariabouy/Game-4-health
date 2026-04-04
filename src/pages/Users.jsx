import { Zap, Pill, BookOpen, Star, Leaf, TreePine, CheckCircle, XCircle, Calendar, User, Activity } from 'lucide-react';
import { childProfile, childMedications, assignedPacks, sessionHistory } from '../data/mockData';

const PACK_ICONS = { BookOpen, Zap, Star, Leaf, Pill, TreePine };
function PackIcon({ name, size = 18, color = '#fff' }) {
  const Icon = PACK_ICONS[name] || Pill;
  return <Icon size={size} color={color} />;
}

export default function Users() {
  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title">My Child</div>
          <div className="page-subtitle">Ahmed's profile — condition, medications, assigned therapy packs and session log</div>
        </div>
      </div>

      {/* Profile + medications */}
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14, marginBottom:14 }}>

        {/* Profile card */}
        <div style={{ background:'#0f0f22', border:'2px solid #2a1a5e', boxShadow:'4px 4px 0 rgba(0,0,0,0.5)' }}>
          <div style={{ padding:'12px 16px', borderBottom:'2px solid #2a1a5e', background:'#0d0d20' }}>
            <span style={{ fontFamily:"'Press Start 2P',monospace", fontSize:8, color:'#c4b5fd' }}>Child Profile</span>
          </div>
          <div style={{ padding:20 }}>
            <div style={{ display:'flex', alignItems:'flex-start', gap:16, marginBottom:20 }}>
              <div style={{
                width:60, height:60, background:childProfile.avatarBg,
                boxShadow:'4px 4px 0 rgba(0,0,0,0.5)',
                display:'flex', alignItems:'center', justifyContent:'center',
                fontFamily:"'Press Start 2P',monospace", fontSize:16, color:'#fff', flexShrink:0,
              }}>{childProfile.avatar}</div>
              <div>
                <div style={{ fontFamily:"'Press Start 2P',monospace", fontSize:13, color:'#fff', marginBottom:6 }}>{childProfile.name}</div>
                <div style={{ display:'flex', gap:6, flexWrap:'wrap' }}>
                  <span className="cond-badge cond-adhd">{childProfile.condition}</span>
                  <span style={{ fontSize:9, fontWeight:800, color:'#fbbf24', background:'rgba(251,191,36,0.1)', border:'1px solid rgba(251,191,36,0.3)', padding:'3px 7px', boxShadow:'2px 2px 0 rgba(0,0,0,0.4)' }}>
                    Lv.{childProfile.level} {childProfile.heroStage}
                  </span>
                </div>
              </div>
            </div>

            {/* HP bar */}
            <div style={{ marginBottom:16 }}>
              <div className="bar-label" style={{ marginBottom:4 }}>
                <span className="bar-label-text">HP (Adherence)</span>
                <span className="bar-label-val">{childProfile.hp}/100</span>
              </div>
              <div className="bar-track" style={{ height:10 }}>
                <div className="bar-fill bar-fill-hp-hi" style={{ width:`${childProfile.hp}%` }} />
              </div>
            </div>

            <div style={{ display:'flex', flexDirection:'column', gap:0 }}>
              {[
                { icon:User,     label:'Age',          value:`${childProfile.age} years old`  },
                { icon:Calendar, label:'Joined',        value:childProfile.joinedDate           },
                { icon:Activity, label:'Therapist',     value:childProfile.therapist            },
                { icon:Calendar, label:'Next Session',  value:childProfile.nextSession          },
              ].map(({ icon:Icon, label, value }) => (
                <div key={label} style={{ display:'flex', alignItems:'center', gap:10, padding:'9px 0', borderBottom:'1px solid rgba(255,255,255,0.04)' }}>
                  <Icon size={13} color="#3c3c68" style={{ flexShrink:0 }} />
                  <span style={{ fontSize:10, fontWeight:700, color:'#6060a0', width:96, flexShrink:0, textTransform:'uppercase', letterSpacing:0.5 }}>{label}</span>
                  <span style={{ fontSize:12, fontWeight:600, color:'#b0b0d8' }}>{value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Medications */}
        <div style={{ background:'#0f0f22', border:'2px solid #2a1a5e', boxShadow:'4px 4px 0 rgba(0,0,0,0.5)' }}>
          <div style={{ padding:'12px 16px', borderBottom:'2px solid #2a1a5e', background:'#0d0d20' }}>
            <span style={{ fontFamily:"'Press Start 2P',monospace", fontSize:8, color:'#c4b5fd' }}>Medications Today</span>
          </div>
          <div style={{ padding:20 }}>
            {childMedications.map((med, i) => (
              <div key={i} style={{
                background:'rgba(255,255,255,0.02)',
                border:`2px solid ${med.takenToday ? '#05966922' : '#dc262622'}`,
                boxShadow:'3px 3px 0 rgba(0,0,0,0.4)',
                padding:16, marginBottom:12,
                display:'flex', alignItems:'center', gap:14,
              }}>
                <div style={{ width:40, height:40, background:med.color+'22', border:`2px solid ${med.color}44`, boxShadow:'2px 2px 0 rgba(0,0,0,0.4)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                  <Pill size={18} color={med.color} />
                </div>
                <div style={{ flex:1 }}>
                  <div style={{ fontFamily:"'Press Start 2P',monospace", fontSize:10, color:'#fff', marginBottom:3 }}>{med.name}</div>
                  <div style={{ fontSize:11, color:'#6060a0', marginBottom:8 }}>{med.dose} · {med.time}</div>
                  <div className="bar-label" style={{ marginBottom:3 }}>
                    <span style={{ fontSize:8, fontWeight:800, color:'#3c3c68', textTransform:'uppercase', letterSpacing:0.8 }}>Adherence</span>
                    <span style={{ fontFamily:"'Press Start 2P',monospace", fontSize:7, color:med.color }}>{med.adherence}%</span>
                  </div>
                  <div className="bar-track" style={{ height:6 }}>
                    <div className="bar-fill" style={{ width:`${med.adherence}%`, background:med.color }} />
                  </div>
                </div>
                <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:3, flexShrink:0 }}>
                  {med.takenToday
                    ? <><CheckCircle size={18} color="#34d399" /><span style={{ fontSize:9, fontWeight:800, color:'#34d399' }}>Taken</span></>
                    : <><XCircle size={18} color="#f87171" /><span style={{ fontSize:9, fontWeight:800, color:'#f87171' }}>Missed</span></>
                  }
                </div>
              </div>
            ))}

            <div style={{ background:'rgba(124,58,237,0.08)', border:'2px solid #2a1a5e', borderLeft:'3px solid #7c3aed', padding:'10px 14px', fontSize:11, color:'#6060a0', lineHeight:1.5 }}>
              💡 <strong style={{ color:'#c4b5fd' }}>Tip:</strong> Every dose taken earns Ahmed HP for his hero. High HP unlocks better rewards!
            </div>
          </div>
        </div>
      </div>

      {/* Assigned packs */}
      <div style={{ background:'#0f0f22', border:'2px solid #2a1a5e', boxShadow:'4px 4px 0 rgba(0,0,0,0.5)', marginBottom:14 }}>
        <div style={{ padding:'12px 16px', borderBottom:'2px solid #2a1a5e', background:'#0d0d20' }}>
          <span style={{ fontFamily:"'Press Start 2P',monospace", fontSize:8, color:'#c4b5fd' }}>Assigned Therapy Packs</span>
        </div>
        <div style={{ padding:16, display:'grid', gridTemplateColumns:'repeat(2,1fr)', gap:12 }}>
          {assignedPacks.map(pack => (
            <div key={pack.id} style={{ background:'rgba(255,255,255,0.02)', border:`2px solid ${pack.color}33`, boxShadow:'3px 3px 0 rgba(0,0,0,0.4)', padding:16 }}>
              <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:10 }}>
                <div style={{ width:40, height:40, background:pack.bg, border:`2px solid ${pack.color}44`, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                  <PackIcon name={pack.iconName} size={18} color={pack.color} />
                </div>
                <div>
                  <div style={{ fontSize:12, fontWeight:800, color:'#d8d8f8' }}>{pack.title}</div>
                  <div style={{ fontSize:9, fontWeight:700, color:pack.color, textTransform:'uppercase', letterSpacing:0.5 }}>{pack.subtitle}</div>
                </div>
              </div>
              <div style={{ fontSize:10, color:'#3c3c68', marginBottom:12, lineHeight:1.4 }}>{pack.desc}</div>
              <div className="bar-label">
                <span className="bar-label-text">Progress</span>
                <span className="bar-label-val" style={{ color:pack.color }}>{pack.sessionsCompleted}/{pack.totalSessions} sessions</span>
              </div>
              <div className="bar-track" style={{ height:8 }}>
                <div className="bar-fill" style={{ width:`${(pack.sessionsCompleted/pack.totalSessions)*100}%`, background:pack.color }} />
              </div>
              <div style={{ marginTop:8, fontSize:10, fontWeight:600, color:'#3c3c68' }}>Last played: {pack.lastPlayed}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Session history */}
      <div style={{ background:'#0f0f22', border:'2px solid #2a1a5e', boxShadow:'4px 4px 0 rgba(0,0,0,0.5)' }}>
        <div style={{ padding:'12px 16px', borderBottom:'2px solid #2a1a5e', background:'#0d0d20' }}>
          <span style={{ fontFamily:"'Press Start 2P',monospace", fontSize:8, color:'#c4b5fd' }}>Session History</span>
        </div>
        <table className="data-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Time</th>
              <th>Pack</th>
              <th>Duration</th>
              <th>Score</th>
              <th>XP Earned</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {sessionHistory.map((s, i) => (
              <tr key={i}>
                <td style={{ fontWeight:700, color:'#d8d8f8' }}>{s.date}</td>
                <td style={{ color:'#6060a0', fontSize:11 }}>{s.time}</td>
                <td style={{ fontWeight:600, color:'#c4b5fd' }}>{s.pack}</td>
                <td style={{ color:'#b0b0d8' }}>{s.duration}</td>
                <td>
                  {s.completed
                    ? <span style={{ fontFamily:"'Press Start 2P',monospace", fontSize:8, color:'#a78bfa' }}>{s.score}</span>
                    : <span style={{ color:'#3c3c68' }}>—</span>}
                </td>
                <td>
                  <span style={{ fontFamily:"'Press Start 2P',monospace", fontSize:8, color: s.xpEarned > 0 ? '#fbbf24' : '#3c3c68' }}>
                    {s.xpEarned > 0 ? `+${s.xpEarned}` : '0'} XP
                  </span>
                </td>
                <td>
                  <span className={`status-badge${s.completed ? '' : ' inactive'}`}>
                    <span className="status-dot" />
                    {s.completed ? 'Done' : 'Missed'}
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
