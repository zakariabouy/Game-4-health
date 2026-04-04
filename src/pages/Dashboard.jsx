import {
  AreaChart, Area, BarChart, Bar, LineChart, Line,
  PieChart, Pie, Cell, Tooltip, XAxis, YAxis,
  CartesianGrid, ResponsiveContainer,
} from 'recharts';
import { Users, Gamepad2, TrendingUp, Pill, Sprout, Leaf, Sword, Shield, Crown } from 'lucide-react';
import {
  userGrowthData, weeklyActiveData, conditionDistribution,
  adherenceData, heroStageData, pillData, users,
} from '../data/mockData';

const PixTip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background: '#0d0d20', border: '2px solid #2a1a5e',
      boxShadow: '4px 4px 0 rgba(0,0,0,0.5)',
      padding: '8px 12px', fontFamily: 'Montserrat, sans-serif',
    }}>
      <div style={{ fontSize: 10, fontWeight: 800, color: '#3c3c68', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 5 }}>{label}</div>
      {payload.map((p, i) => (
        <div key={i} style={{ fontSize: 11, fontWeight: 700, color: p.color || '#e8e8f8' }}>
          {p.name}: {typeof p.value === 'number' ? p.value.toLocaleString() : p.value}
        </div>
      ))}
    </div>
  );
};

const activePatients = users.filter(u => u.status === 'Active').length;
const avgHP = Math.round(users.reduce((s, u) => s + u.hp, 0) / users.length);
const totalSessions = weeklyActiveData.reduce((s, d) => s + d.sessions, 0);

const kpis = [
  { label: 'Patients',       value: users.length,    change: '+3',    up: true,  icon: Users,     color: '#7c3aed', accent: '#7c3aed' },
  { label: 'Active Today',   value: activePatients,  change: '+2',    up: true,  icon: TrendingUp, color: '#10b981', accent: '#10b981' },
  { label: 'Therapy Packs',  value: 6,               change: '+1',    up: true,  icon: Gamepad2,   color: '#06b6d4', accent: '#06b6d4' },
  { label: 'Avg Adherence',  value: `${avgHP}%`,     change: '+4%',   up: true,  icon: Pill,      color: '#f59e0b', accent: '#f59e0b' },
];

export default function Dashboard() {
  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title">Dashboard</div>
          <div className="page-subtitle">
            Game4Health platform overview — patient heroes, therapy progress & adherence
          </div>
        </div>
      </div>

      {/* KPI row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 14, marginBottom: 16 }}>
        {kpis.map(({ label, value, change, up, icon: Icon, color, accent }) => (
          <div key={label} className="kpi-card" style={{ '--kpi-accent': accent }}>
            <div className="kpi-label">
              {label}
              <div style={{
                width: 28, height: 28,
                background: color + '22',
                border: `2px solid ${color}44`,
                boxShadow: '2px 2px 0 rgba(0,0,0,0.4)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <Icon size={14} color={color} />
              </div>
            </div>
            <div className="kpi-value">{value}</div>
            <div className={`kpi-change ${up ? 'up' : 'down'}`}>
              {up ? '▲' : '▼'} {change} this month
            </div>
          </div>
        ))}
      </div>

      {/* Charts row 1 */}
      <div className="dash-charts-row">
        <div className="chart-card">
          <div className="chart-title">Patient Growth</div>
          <div className="chart-sub">Total enrolled patients and new registrations per month</div>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={userGrowthData} margin={{ top:5,right:10,bottom:0,left:-20 }}>
              <defs>
                <linearGradient id="gT" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#7c3aed" stopOpacity={0.35} />
                  <stop offset="95%" stopColor="#7c3aed" stopOpacity={0}    />
                </linearGradient>
                <linearGradient id="gN" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#10b981" stopOpacity={0.35} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0}    />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="rgba(255,255,255,0.04)" strokeDasharray="2 4" />
              <XAxis dataKey="month" tick={{ fill:'#3c3c68', fontSize:10, fontFamily:'Montserrat', fontWeight:600 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill:'#3c3c68', fontSize:10, fontFamily:'Montserrat', fontWeight:600 }} axisLine={false} tickLine={false} />
              <Tooltip content={<PixTip />} />
              <Area type="monotone" dataKey="total" name="Total" stroke="#7c3aed" strokeWidth={2} fill="url(#gT)" dot={false} />
              <Area type="monotone" dataKey="new"   name="New"   stroke="#10b981" strokeWidth={2} fill="url(#gN)" dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-card">
          <div className="chart-title">Condition Mix</div>
          <div className="chart-sub">Patients by diagnosis</div>
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie
                data={conditionDistribution}
                cx="50%" cy="50%"
                innerRadius={48} outerRadius={72}
                paddingAngle={4} dataKey="value"
              >
                {conditionDistribution.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<PixTip />} />
            </PieChart>
          </ResponsiveContainer>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 5, marginTop: 4 }}>
            {conditionDistribution.map(d => (
              <div key={d.name} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 10, fontWeight: 700, color: '#b0b0d8' }}>
                  <span style={{ width: 7, height: 7, background: d.color, flexShrink: 0 }} />
                  {d.name}
                </div>
                <span style={{ fontFamily: "'Press Start 2P',monospace", fontSize: 7, color: '#6060a0' }}>{d.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Charts row 2 */}
      <div className="dash-bottom-row">
        <div className="chart-card">
          <div className="chart-title">Weekly Sessions</div>
          <div className="chart-sub">Therapy game sessions per day this week</div>
          <ResponsiveContainer width="100%" height={155}>
            <BarChart data={weeklyActiveData} margin={{ top:5,right:10,bottom:0,left:-25 }}>
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
          <div className="chart-sub">Avg pill-taking rate across all patients (%)
          </div>
          <ResponsiveContainer width="100%" height={130}>
            <LineChart data={adherenceData} margin={{ top:5,right:10,bottom:0,left:-25 }}>
              <CartesianGrid stroke="rgba(255,255,255,0.04)" strokeDasharray="2 4" />
              <XAxis dataKey="month" tick={{ fill:'#3c3c68', fontSize:10, fontFamily:'Montserrat', fontWeight:600 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill:'#3c3c68', fontSize:10, fontFamily:'Montserrat', fontWeight:600 }} axisLine={false} tickLine={false} unit="%" domain={[60,100]} />
              <Tooltip content={<PixTip />} />
              <Line type="monotone" dataKey="rate" name="Adherence" stroke="#10b981" strokeWidth={2.5} dot={{ fill:'#10b981', r:3, strokeWidth:0 }} />
            </LineChart>
          </ResponsiveContainer>

          {/* Pill adherence breakdown */}
          <div style={{ marginTop: 12, display: 'flex', flexDirection: 'column', gap: 6 }}>
            {pillData.map(p => (
              <div key={p.name} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: 10, fontWeight: 700, color: '#6060a0', width: 70, flexShrink: 0 }}>{p.name}</span>
                <div className="bar-track" style={{ flex: 1, height: 6 }}>
                  <div className="bar-fill" style={{ width: `${p.adherence}%`, background: p.color, height: '100%' }}>
                    <div className="bar-fill" style={{ width: '100%', background: 'transparent' }} />
                  </div>
                </div>
                <span style={{ fontFamily: "'Press Start 2P',monospace", fontSize: 7, color: p.color, width: 28, textAlign: 'right', flexShrink: 0 }}>
                  {p.adherence}%
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Hero stage distribution */}
      <div style={{ marginTop: 14 }}>
        <div className="chart-card">
          <div className="chart-title">Hero Stage Distribution</div>
          <div className="chart-sub">How many patients have evolved their hero to each stage</div>
          <div style={{ display: 'flex', gap: 10, marginTop: 16, alignItems: 'flex-end' }}>
            {heroStageData.map(d => {
              const stageMeta = {
                Sprout:   { icon: Sprout, color: '#6b7280' },
                Seedling: { icon: Leaf,   color: '#4ade80' },
                Warrior:  { icon: Sword,  color: '#fbbf24' },
                Champion: { icon: Shield, color: '#60a5fa' },
                Legend:   { icon: Crown,  color: '#f9a8d4' },
              }[d.stage];
              const maxCount = Math.max(...heroStageData.map(x => x.count));
              const heightPct = (d.count / maxCount) * 100;
              return (
                <div key={d.stage} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
                  <span style={{ fontFamily: "'Press Start 2P',monospace", fontSize: 8, color: stageMeta.color }}>
                    {d.count}
                  </span>
                  <div style={{
                    width: '100%', height: 90, display: 'flex', alignItems: 'flex-end',
                    border: '1px solid rgba(255,255,255,0.04)',
                    background: 'rgba(0,0,0,0.2)',
                    position: 'relative', overflow: 'hidden',
                  }}>
                    <div style={{
                      width: '100%', height: `${heightPct}%`,
                      background: stageMeta.color,
                      opacity: 0.8,
                      boxShadow: `0 0 12px ${stageMeta.color}44`,
                      position: 'relative',
                    }}>
                      {/* bar segment lines */}
                      <div style={{
                        position: 'absolute', inset: 0,
                        background: 'repeating-linear-gradient(0deg, transparent 0, transparent 8px, rgba(0,0,0,0.2) 8px, rgba(0,0,0,0.2) 10px)',
                      }} />
                    </div>
                  </div>
                  <stageMeta.icon size={16} color={stageMeta.color} />
                  <span style={{ fontFamily: "'Press Start 2P',monospace", fontSize: 6, color: '#6060a0', textAlign: 'center', lineHeight: 1.5 }}>
                    {d.stage}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
