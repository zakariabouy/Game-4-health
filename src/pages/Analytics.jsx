import {
  AreaChart, Area, BarChart, Bar,
  Tooltip, XAxis, YAxis, CartesianGrid, ResponsiveContainer,
} from 'recharts';
import { TrendingUp, Zap, Shield, Pill } from 'lucide-react';
import { childProfile, childProgressData, weeklyActivity, childMedications } from '../data/mockData';

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

const heroTiers = [
  { name:'Sprout',   range:[0,19],   color:'#6b7280' },
  { name:'Seedling', range:[20,44],  color:'#4ade80' },
  { name:'Warrior',  range:[45,69],  color:'#fbbf24' },
  { name:'Champion', range:[70,89],  color:'#60a5fa' },
  { name:'Legend',   range:[90,100], color:'#f9a8d4' },
];

export default function Analytics() {
  const currentTier = heroTiers.find(t => childProfile.hp >= t.range[0] && childProfile.hp <= t.range[1]);

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title">Progress</div>
          <div className="page-subtitle">Alex's development — HP trend, XP growth, activity and medication adherence</div>
        </div>
        <div style={{ display:'flex', gap:6 }}>
          {['7D','30D','3M','All'].map(t => (
            <button key={t} style={{
              padding:'6px 12px', fontSize:10, fontWeight:800, cursor:'pointer',
              fontFamily:'Montserrat,sans-serif', textTransform:'uppercase', letterSpacing:0.8,
              background: t === '3M' ? '#7c3aed' : 'rgba(255,255,255,0.04)',
              border: `2px solid ${t === '3M' ? '#7c3aed' : '#2a1a5e'}`,
              color: t === '3M' ? '#fff' : '#6060a0',
              boxShadow: t === '3M' ? '3px 3px 0 rgba(0,0,0,0.5)' : 'none',
            }}>{t}</button>
          ))}
        </div>
      </div>

      {/* KPI row */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:14, marginBottom:16 }}>
        {[
          { label:'Current HP',    value:`${childProfile.hp}%`,              icon:Shield,     color:'#34d399', accent:'#34d399' },
          { label:'Hero Stage',    value:childProfile.heroStage,             icon:TrendingUp, color:'#60a5fa', accent:'#60a5fa' },
          { label:'Total XP',      value:`${(childProfile.xp/1000).toFixed(1)}k`, icon:Zap, color:'#f59e0b', accent:'#f59e0b' },
          { label:'Avg Adherence', value:'87%',                              icon:Pill,       color:'#7c3aed', accent:'#7c3aed' },
        ].map(({ label, value, icon:Icon, color, accent }) => (
          <div key={label} className="kpi-card" style={{ '--kpi-accent': accent }}>
            <div className="kpi-label">
              {label}
              <div style={{ width:28, height:28, background:color+'22', border:`2px solid ${color}44`, boxShadow:'2px 2px 0 rgba(0,0,0,0.4)', display:'flex', alignItems:'center', justifyContent:'center' }}>
                <Icon size={13} color={color} />
              </div>
            </div>
            <div className="kpi-value">{value}</div>
            <div className="kpi-change up">▲ Improving</div>
          </div>
        ))}
      </div>

      {/* HP + XP charts */}
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14, marginBottom:14 }}>
        <div className="chart-card">
          <div className="chart-title">HP Trend</div>
          <div className="chart-sub">Alex's adherence score since joining</div>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={childProgressData} margin={{ top:5,right:10,bottom:0,left:-25 }}>
              <defs>
                <linearGradient id="hpPG" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#34d399" stopOpacity={0.35} />
                  <stop offset="95%" stopColor="#34d399" stopOpacity={0}    />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="rgba(255,255,255,0.04)" strokeDasharray="2 4" />
              <XAxis dataKey="month" tick={{ fill:'#3c3c68', fontSize:10, fontFamily:'Montserrat', fontWeight:600 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill:'#3c3c68', fontSize:10, fontFamily:'Montserrat', fontWeight:600 }} axisLine={false} tickLine={false} domain={[30,100]} />
              <Tooltip content={<PixTip />} />
              <Area type="monotone" dataKey="hp" name="HP" stroke="#34d399" strokeWidth={2.5} fill="url(#hpPG)" dot={{ fill:'#34d399', r:3, strokeWidth:0 }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-card">
          <div className="chart-title">XP Growth</div>
          <div className="chart-sub">Cumulative experience points earned over time</div>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={childProgressData} margin={{ top:5,right:10,bottom:0,left:-25 }}>
              <defs>
                <linearGradient id="xpPG" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#f59e0b" stopOpacity={0.35} />
                  <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}    />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="rgba(255,255,255,0.04)" strokeDasharray="2 4" />
              <XAxis dataKey="month" tick={{ fill:'#3c3c68', fontSize:10, fontFamily:'Montserrat', fontWeight:600 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill:'#3c3c68', fontSize:10, fontFamily:'Montserrat', fontWeight:600 }} axisLine={false} tickLine={false} />
              <Tooltip content={<PixTip />} />
              <Area type="monotone" dataKey="xp" name="XP" stroke="#f59e0b" strokeWidth={2.5} fill="url(#xpPG)" dot={{ fill:'#f59e0b', r:3, strokeWidth:0 }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Weekly activity + medication adherence */}
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14 }}>
        <div className="chart-card">
          <div className="chart-title">Weekly Activity</div>
          <div className="chart-sub">Sessions this week per day</div>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={weeklyActivity} margin={{ top:5,right:10,bottom:0,left:-25 }}>
              <CartesianGrid stroke="rgba(255,255,255,0.04)" strokeDasharray="2 4" />
              <XAxis dataKey="day" tick={{ fill:'#3c3c68', fontSize:10, fontFamily:'Montserrat', fontWeight:600 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill:'#3c3c68', fontSize:10, fontFamily:'Montserrat', fontWeight:600 }} axisLine={false} tickLine={false} />
              <Tooltip content={<PixTip />} />
              <Bar dataKey="sessions" name="Sessions" fill="#7c3aed" radius={[2,2,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-card">
          <div className="chart-title">Medication Adherence</div>
          <div className="chart-sub">Per-medication adherence rates for Alex</div>
          <div style={{ marginTop:20, display:'flex', flexDirection:'column', gap:16 }}>
            {childMedications.map(med => (
              <div key={med.name}>
                <div className="bar-label">
                  <div style={{ display:'flex', alignItems:'center', gap:6 }}>
                    <div style={{ width:6, height:6, background:med.color, flexShrink:0 }} />
                    <span style={{ fontSize:11, fontWeight:700, color:'#b0b0d8' }}>
                      {med.name}
                      <span style={{ fontSize:9, color:'#3c3c68', marginLeft:6 }}>({med.dose} · {med.time})</span>
                    </span>
                  </div>
                  <span style={{ fontFamily:"'Press Start 2P',monospace", fontSize:8, color:med.color }}>{med.adherence}%</span>
                </div>
                <div className="bar-track" style={{ height:10, marginTop:4 }}>
                  <div className="bar-fill" style={{ width:`${med.adherence}%`, background:med.color }} />
                </div>
              </div>
            ))}
          </div>

          {/* Hero stage ladder */}
          <div style={{ marginTop:24 }}>
            <div style={{ fontFamily:"'Press Start 2P',monospace", fontSize:8, color:'#c4b5fd', marginBottom:10 }}>Hero Stage</div>
            <div style={{ display:'flex', gap:4 }}>
              {heroTiers.map(t => {
                const isCurrent = t.name === currentTier?.name;
                return (
                  <div key={t.name} style={{ flex:1, textAlign:'center' }}>
                    <div style={{ height:6, background: isCurrent ? t.color : t.color+'33', border: isCurrent ? `1px solid ${t.color}` : 'none', marginBottom:4 }} />
                    <div style={{ fontSize:6, fontFamily:"'Press Start 2P',monospace", color: isCurrent ? t.color : '#3c3c68', lineHeight:1.5 }}>{t.name}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
