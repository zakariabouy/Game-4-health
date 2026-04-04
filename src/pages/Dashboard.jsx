import {
  AreaChart, Area, BarChart, Bar, LineChart, Line,
  ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid, ReferenceLine,
} from 'recharts';
import {
  Brain, Activity, Wind, TrendingUp, TrendingDown,
  Zap, AlertTriangle, CheckCircle, Info, ChevronRight,
  Flame, Shield, Clock,
} from 'lucide-react';
import {
  childProfile, stressPeakData, calmZoneData, bdnfData,
  breathingAdherence, llmAlerts, weeklyActivity, sessionHistory,
} from '../data/mockData';

/* ── shared tooltip ──────────────────────────────────────── */
const PixTip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background:'var(--bg-s2)', border:'2px solid var(--border)',
      boxShadow:'4px 4px 0 var(--shadow-sm)', padding:'8px 12px',
      fontFamily:'Montserrat,sans-serif',
    }}>
      <div style={{ fontSize:9, fontWeight:800, color:'var(--txt-faint)', textTransform:'uppercase', letterSpacing:1, marginBottom:5 }}>{label}</div>
      {payload.map((p, i) => (
        <div key={i} style={{ fontSize:11, fontWeight:700, color: p.color || 'var(--txt-pri)' }}>{p.name}: {p.value}{p.unit || ''}</div>
      ))}
    </div>
  );
};

/* ── metric card ─────────────────────────────────────────── */
const MetricCard = ({ label, value, unit, sub, icon: Icon, color, trend, trendVal }) => (
  <div style={{
    background:'var(--bg-surface)', border:`2px solid ${color}44`,
    boxShadow:`4px 4px 0 var(--shadow-sm), inset 0 0 40px ${color}08`,
    padding:16, position:'relative', overflow:'hidden',
  }}>
    <div style={{ position:'absolute', top:0, left:0, right:0, height:3, background:color }} />
    <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', marginBottom:10 }}>
      <div style={{ fontSize:9, fontWeight:800, color:'var(--txt-faint)', textTransform:'uppercase', letterSpacing:1 }}>{label}</div>
      <div style={{ width:30, height:30, background:`${color}18`, border:`2px solid ${color}33`, display:'flex', alignItems:'center', justifyContent:'center' }}>
        <Icon size={14} color={color} />
      </div>
    </div>
    <div style={{ display:'flex', alignItems:'baseline', gap:5, marginBottom:4 }}>
      <div style={{ fontFamily:"'Press Start 2P',monospace", fontSize:22, color:'var(--txt-heading)', textShadow:'2px 2px 0 var(--shadow-xs)' }}>{value}</div>
      {unit && <div style={{ fontSize:10, fontWeight:700, color:'var(--txt-muted)' }}>{unit}</div>}
    </div>
    <div style={{ display:'flex', alignItems:'center', gap:6 }}>
      {trend && (
        <span style={{ fontSize:9, fontWeight:800, color: trend === 'up' ? '#34d399' : '#f87171', display:'flex', alignItems:'center', gap:2 }}>
          {trend === 'up' ? <TrendingUp size={10}/> : <TrendingDown size={10}/>} {trendVal}
        </span>
      )}
      <span style={{ fontSize:9, fontWeight:600, color:'var(--txt-faintest)' }}>{sub}</span>
    </div>
  </div>
);

/* ── alert icons ─────────────────────────────────────────── */
const alertIcons  = { warning: AlertTriangle, tip: TrendingUp, info: Info };
const alertColors = { warning:'#f59e0b', tip:'#34d399', info:'#818cf8' };

/* ── main dashboard ──────────────────────────────────────── */
export default function Dashboard() {
  const totalPeaks     = stressPeakData.reduce((s,d) => s + d.peaks, 0);
  const avgIntensity   = Math.round(stressPeakData.filter(d=>d.peaks>0).reduce((s,d)=>s+d.avgIntensity,0) / stressPeakData.filter(d=>d.peaks>0).length);
  const currentCalm    = calmZoneData[calmZoneData.length-1].calmPct;
  const calmDelta      = currentCalm - calmZoneData[calmZoneData.length-2].calmPct;
  const currentBdnf    = bdnfData[bdnfData.length-1].bdnf;
  const totalSessions  = weeklyActivity.reduce((s,d) => s+d.sessions,0);
  const totalMins      = weeklyActivity.reduce((s,d) => s+d.minutes,0);
  const breathingDone  = breathingAdherence.filter(d=>d.done).length;
  const todaySessions  = sessionHistory.filter(s=>s.date==='Today');

  return (
    <div>
      {/* ── Page header ── */}
      <div className="page-header">
        <div>
          <div className="page-title">Tableau de bord parental</div>
          <div className="page-subtitle">Bonjour Sarah — voici le rapport LLM d'Ahmed pour cette semaine</div>
        </div>
        <div style={{ display:'flex', gap:10 }}>
          <div style={{
            background:'linear-gradient(135deg,#3b0fa0,#6d28d9)', border:'2px solid #7c3aed',
            boxShadow:'3px 3px 0 var(--shadow-sm)', padding:'8px 14px',
            display:'flex', alignItems:'center', gap:7,
          }}>
            <Brain size={14} color="#c4b5fd" />
            <span style={{ fontFamily:"'Press Start 2P',monospace", fontSize:7, color:'#c4b5fd' }}>LLM Analyse active</span>
          </div>
          <div style={{
            background:'rgba(16,185,129,0.08)', border:'2px solid rgba(16,185,129,0.3)',
            boxShadow:'3px 3px 0 var(--shadow-sm)', padding:'8px 14px',
            display:'flex', alignItems:'center', gap:6,
          }}>
            <div style={{ width:7, height:7, background:'#34d399', borderRadius:'50%' }} />
            <span style={{ fontSize:10, fontWeight:800, color:'#34d399' }}>EMG Sync</span>
          </div>
        </div>
      </div>

      {/* ── Hero mini-card ── */}
      <div style={{
        background:'var(--hero-grad)',
        border:'2px solid var(--hero-border)', boxShadow:'4px 4px 0 var(--shadow-sm)',
        padding:'14px 20px', marginBottom:16,
        display:'flex', alignItems:'center', gap:18,
      }}>
        <div style={{
          width:48, height:48, background:childProfile.avatarBg,
          boxShadow:'3px 3px 0 var(--shadow-sm)',
          display:'flex', alignItems:'center', justifyContent:'center',
          fontFamily:"'Press Start 2P',monospace", fontSize:14, color:'#fff',
        }}>{childProfile.avatar}</div>
        <div style={{ flex:1 }}>
          <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:4 }}>
            <span style={{ fontFamily:"'Press Start 2P',monospace", fontSize:12, color:'var(--txt-heading)' }}>{childProfile.name}</span>
            <span style={{ fontSize:9, fontWeight:800, color:'#fbbf24', background:'rgba(251,191,36,0.1)', border:'1px solid rgba(251,191,36,0.3)', padding:'2px 7px' }}>Lv.{childProfile.level}</span>
            <span className="cond-badge cond-adhd">{childProfile.condition}</span>
          </div>
          <div style={{ fontSize:10, color:'var(--txt-muted)' }}>Âge {childProfile.age} · Thérapeute: {childProfile.therapist} · Prochaine séance: {childProfile.nextSession}</div>
        </div>
        <div style={{ display:'flex', gap:20 }}>
          {[
            { icon:Flame,  val:childProfile.streak, label:'Jours consécutifs', color:'#fbbf24' },
            { icon:Clock,  val:`${totalMins}m`,      label:'Min/semaine',       color:'#818cf8' },
            { icon:Shield, val:`${childProfile.hp}%`,label:'HP Adhérence',      color:'#34d399' },
          ].map(({ icon:Ic, val, label, color }) => (
            <div key={label} style={{ textAlign:'center' }}>
              <div style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:4, marginBottom:2 }}>
                <Ic size={12} color={color} />
                <span style={{ fontFamily:"'Press Start 2P',monospace", fontSize:12, color }}>{val}</span>
              </div>
              <div style={{ fontSize:8, fontWeight:800, color:'var(--txt-faint)', textTransform:'uppercase', letterSpacing:0.8 }}>{label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── 4 key metrics ── */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:14, marginBottom:16 }}>
        <MetricCard
          label="Pics de stress · semaine"
          value={totalPeaks}
          unit="pics"
          sub={`Intensité moy. ${avgIntensity}%`}
          icon={Activity}
          color="#f87171"
          trend="down"
          trendVal="-18% vs sem. préc."
        />
        <MetricCard
          label="Zone apaisée"
          value={currentCalm}
          unit="%"
          sub="du temps de jeu"
          icon={Wind}
          color="#34d399"
          trend="up"
          trendVal={`+${calmDelta}% vs sem. préc.`}
        />
        <MetricCard
          label="BDNF estimé"
          value={currentBdnf}
          unit="pts"
          sub="Indice activité physique"
          icon={Brain}
          color="#c4b5fd"
          trend="up"
          trendVal="+9% vs sem. préc."
        />
        <MetricCard
          label="Adhérence sessions"
          value={totalSessions}
          unit={`/${breathingAdherence.filter(d=>d.sessions>0).length * 2}`}
          sub={`Respiration ${breathingDone}/7 jours`}
          icon={Zap}
          color="#fbbf24"
          trend="up"
          trendVal="+2 vs sem. préc."
        />
      </div>

      {/* ── Charts row 1: Stress peaks + Calm zone ── */}
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14, marginBottom:14 }}>

        {/* Stress peaks bar chart */}
        <div className="chart-card">
          <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', marginBottom:4 }}>
            <div>
              <div className="chart-title">Pics de stress EMG</div>
              <div className="chart-sub">Nombre · intensité moy. · durée des épisodes corrugator</div>
            </div>
            <div style={{ background:'rgba(248,113,113,0.1)', border:'1px solid rgba(248,113,113,0.3)', padding:'3px 8px', fontSize:9, fontWeight:800, color:'#f87171' }}>
              {totalPeaks} PICS
            </div>
          </div>
          <ResponsiveContainer width="100%" height={160}>
            <BarChart data={stressPeakData} margin={{ top:5, right:10, bottom:0, left:-25 }}>
              <CartesianGrid stroke="var(--grid-stroke)" strokeDasharray="2 4" vertical={false} />
              <XAxis dataKey="day" tick={{ fill:'var(--txt-faint)', fontSize:9, fontFamily:'Montserrat', fontWeight:600 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill:'var(--txt-faint)', fontSize:9, fontFamily:'Montserrat', fontWeight:600 }} axisLine={false} tickLine={false} />
              <Tooltip content={<PixTip />} />
              <Bar dataKey="peaks" name="Pics" fill="#f87171" radius={0} maxBarSize={22} />
            </BarChart>
          </ResponsiveContainer>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:6, marginTop:10, paddingTop:10, borderTop:`1px solid var(--border-hr)` }}>
            {[
              { label:'Intensité moy.', val:`${avgIntensity}%`, color:'#f87171' },
              { label:'Durée moy.',     val:`${Math.round(stressPeakData.filter(d=>d.peaks>0).reduce((s,d)=>s+d.avgDuration,0)/stressPeakData.filter(d=>d.peaks>0).length)}s`, color:'#fb923c' },
              { label:'Jour le + dur',  val:'Jeu.', color:'#fbbf24' },
            ].map(({ label, val, color }) => (
              <div key={label} style={{ textAlign:'center' }}>
                <div style={{ fontFamily:"'Press Start 2P',monospace", fontSize:10, color, marginBottom:2 }}>{val}</div>
                <div style={{ fontSize:8, fontWeight:700, color:'var(--txt-faint)', textTransform:'uppercase', letterSpacing:0.6 }}>{label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Calm zone progression */}
        <div className="chart-card">
          <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', marginBottom:4 }}>
            <div>
              <div className="chart-title">Progression du calme</div>
              <div className="chart-sub">% du temps passé en zone apaisée (EMG bas) sur 8 semaines</div>
            </div>
            <div style={{ background:'rgba(52,211,153,0.1)', border:'1px solid rgba(52,211,153,0.3)', padding:'3px 8px', fontSize:9, fontWeight:800, color:'#34d399' }}>
              +{calmDelta}% ↑
            </div>
          </div>
          <ResponsiveContainer width="100%" height={160}>
            <AreaChart data={calmZoneData} margin={{ top:5, right:10, bottom:0, left:-25 }}>
              <defs>
                <linearGradient id="calmGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#34d399" stopOpacity={0.35} />
                  <stop offset="95%" stopColor="#34d399" stopOpacity={0}    />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="var(--grid-stroke)" strokeDasharray="2 4" />
              <XAxis dataKey="week" tick={{ fill:'var(--txt-faint)', fontSize:9, fontFamily:'Montserrat', fontWeight:600 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill:'var(--txt-faint)', fontSize:9, fontFamily:'Montserrat', fontWeight:600 }} axisLine={false} tickLine={false} domain={[0,100]} unit="%" />
              <Tooltip content={<PixTip />} />
              <ReferenceLine y={50} stroke="rgba(52,211,153,0.25)" strokeDasharray="4 4" label={{ value:'Objectif 50%', fill:'#34d399', fontSize:8, fontFamily:'Montserrat' }} />
              <Area type="monotone" dataKey="calmPct" name="Calme" unit="%" stroke="#34d399" strokeWidth={2.5} fill="url(#calmGrad)" dot={{ fill:'#34d399', r:3, strokeWidth:0 }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* ── Charts row 2: BDNF + Sessions/Breathing ── */}
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14, marginBottom:14 }}>

        {/* BDNF estimate chart */}
        <div className="chart-card">
          <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', marginBottom:4 }}>
            <div>
              <div className="chart-title">BDNF estimé</div>
              <div className="chart-sub">Proxy activité physique (sauts, mouvements buddy) · plasticité cérébrale</div>
            </div>
            <div style={{ background:'rgba(196,181,253,0.1)', border:'1px solid rgba(196,181,253,0.3)', padding:'3px 8px', fontSize:9, fontWeight:800, color:'#c4b5fd' }}>
              IDX {currentBdnf}
            </div>
          </div>
          <ResponsiveContainer width="100%" height={148}>
            <LineChart data={bdnfData} margin={{ top:5, right:10, bottom:0, left:-25 }}>
              <CartesianGrid stroke="var(--grid-stroke)" strokeDasharray="2 4" />
              <XAxis dataKey="week" tick={{ fill:'var(--txt-faint)', fontSize:9, fontFamily:'Montserrat', fontWeight:600 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill:'var(--txt-faint)', fontSize:9, fontFamily:'Montserrat', fontWeight:600 }} axisLine={false} tickLine={false} />
              <Tooltip content={<PixTip />} />
              <Line type="monotone" dataKey="bdnf"     name="BDNF idx"    stroke="#c4b5fd" strokeWidth={2.5} dot={{ fill:'#c4b5fd', r:3, strokeWidth:0 }} />
              <Line type="monotone" dataKey="activity" name="Activité min" stroke="#818cf8" strokeWidth={1.5} strokeDasharray="4 3" dot={false} />
            </LineChart>
          </ResponsiveContainer>
          <div style={{ marginTop:8, padding:'8px 0', borderTop:`1px solid var(--border-hr)`, fontSize:9, color:'var(--txt-faint)', lineHeight:1.6 }}>
            <span style={{ color:'#c4b5fd', fontWeight:700 }}>BDNF</span> = neurotrophine clé pour la plasticité cérébrale et la régulation émotionnelle. Stimulé par l'exercice physique.
          </div>
        </div>

        {/* Weekly adherence + breathing grid */}
        <div className="chart-card">
          <div className="chart-title" style={{ marginBottom:4 }}>Adhérence & Respiration</div>
          <div className="chart-sub">Sessions jouées · exercices de respiration par jour</div>

          {/* day grid */}
          <div style={{ display:'grid', gridTemplateColumns:'repeat(7,1fr)', gap:5, marginBottom:14 }}>
            {breathingAdherence.map((d) => (
              <div key={d.day} style={{ textAlign:'center' }}>
                <div style={{ fontSize:8, fontWeight:700, color:'var(--txt-faint)', marginBottom:4 }}>{d.day[0]}</div>
                <div style={{
                  width:'100%', aspectRatio:'1', margin:'0 auto',
                  background: d.sessions === 0 ? 'var(--bg-overlay)'
                    : d.done ? 'rgba(52,211,153,0.15)' : 'rgba(251,191,36,0.1)',
                  border: `2px solid ${d.sessions === 0 ? 'var(--border-sub)' : d.done ? 'rgba(52,211,153,0.4)' : 'rgba(251,191,36,0.35)'}`,
                  boxShadow: d.done ? '2px 2px 0 var(--shadow-xs)' : 'none',
                  display:'flex', alignItems:'center', justifyContent:'center',
                  flexDirection:'column', gap:1,
                }}>
                  {d.sessions > 0 && (
                    <>
                      <span style={{ fontSize:11, fontWeight:800, color: d.done ? '#34d399' : '#fbbf24' }}>{d.sessions}</span>
                      {d.done ? <CheckCircle size={8} color="#34d399" /> : <Wind size={8} color="#fbbf24" />}
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* legend */}
          <div style={{ display:'flex', gap:14, marginBottom:14 }}>
            {[
              { color:'#34d399', bg:'rgba(52,211,153,0.15)', label:'Respiration ✓' },
              { color:'#fbbf24', bg:'rgba(251,191,36,0.1)',  label:'Session, respiration manquée' },
            ].map(l => (
              <div key={l.label} style={{ display:'flex', alignItems:'center', gap:5 }}>
                <div style={{ width:10, height:10, background:l.bg, border:`1px solid ${l.color}66` }} />
                <span style={{ fontSize:9, fontWeight:600, color:'var(--txt-faint)' }}>{l.label}</span>
              </div>
            ))}
          </div>

          {/* today's sessions mini-list */}
          <div style={{ borderTop:`1px solid var(--border-hr)`, paddingTop:10 }}>
            <div style={{ fontSize:8, fontWeight:800, color:'var(--txt-faint)', textTransform:'uppercase', letterSpacing:1, marginBottom:7 }}>Aujourd'hui</div>
            {todaySessions.slice(0,3).map((s,i) => (
              <div key={i} style={{ display:'flex', alignItems:'center', gap:8, padding:'5px 0', borderBottom:`1px solid var(--border-row)` }}>
                <CheckCircle size={10} color={s.completed ? '#34d399' : '#f87171'} />
                <span style={{ flex:1, fontSize:11, fontWeight:600, color:'var(--txt-body)' }}>{s.pack}</span>
                <span style={{ fontSize:9, fontWeight:700, color:'var(--txt-faint)' }}>{s.duration}</span>
                <span style={{ fontFamily:"'Press Start 2P',monospace", fontSize:8, color:'#fbbf24' }}>+{s.xpEarned}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── LLM Alerts ── */}
      <div style={{ background:'var(--bg-surface)', border:`2px solid var(--border)`, boxShadow:`4px 4px 0 var(--shadow-sm)`, overflow:'hidden' }}>
        <div style={{ padding:'12px 18px', borderBottom:`2px solid var(--border)`, background:'var(--bg-s2)', display:'flex', alignItems:'center', gap:8 }}>
          <Brain size={12} color="#c4b5fd" />
          <span style={{ fontFamily:"'Press Start 2P',monospace", fontSize:7, color:'var(--accent-txt)' }}>Alertes LLM personnalisées</span>
          <div style={{ marginLeft:'auto', background:'rgba(196,181,253,0.1)', border:'1px solid rgba(196,181,253,0.25)', padding:'2px 8px', fontSize:8, fontWeight:800, color:'var(--accent-txt)' }}>
            {llmAlerts.length} nouvelles
          </div>
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:0 }}>
          {llmAlerts.map((alert, i) => {
            const AlertIcon = alertIcons[alert.type];
            const color     = alertColors[alert.type];
            return (
              <div key={alert.id} style={{
                padding:'16px 18px',
                borderRight: i < llmAlerts.length - 1 ? `1px solid var(--border-hr2)` : 'none',
                position:'relative',
              }}>
                <div style={{ position:'absolute', top:0, left:0, right:0, height:2, background:color }} />
                <div style={{ display:'flex', alignItems:'center', gap:7, marginBottom:10 }}>
                  <div style={{ width:26, height:26, background:`${color}15`, border:`2px solid ${color}33`, display:'flex', alignItems:'center', justifyContent:'center' }}>
                    <AlertIcon size={12} color={color} />
                  </div>
                  <div>
                    <div style={{ fontSize:11, fontWeight:800, color:'var(--txt-sec)' }}>{alert.title}</div>
                    <div style={{ fontSize:8, fontWeight:600, color:'var(--txt-faint)' }}>{alert.date}</div>
                  </div>
                </div>
                <div style={{ fontSize:11, color:'var(--txt-muted)', lineHeight:1.6, marginBottom:12 }}>{alert.body}</div>
                <button style={{
                  display:'flex', alignItems:'center', gap:5,
                  background:`${color}15`, border:`1px solid ${color}44`,
                  color, fontFamily:'Montserrat,sans-serif',
                  fontSize:9, fontWeight:800, padding:'5px 10px',
                  cursor:'pointer', textTransform:'uppercase', letterSpacing:0.8,
                }}>
                  {alert.action} <ChevronRight size={10} />
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
