import {
  AreaChart, Area, BarChart, Bar, LineChart, Line,
  PieChart, Pie, Cell, Tooltip, XAxis, YAxis,
  CartesianGrid, ResponsiveContainer,
} from 'recharts';
import { TrendingUp, TrendingDown, Activity, Target, Zap, Heart } from 'lucide-react';
import {
  userGrowthData, adherenceData, conditionDistribution,
  retentionData, heroStageData, countryData, revenueData,
} from '../data/mockData';

const PixTip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background: '#0d0d20', border: '2px solid #2a1a5e',
      boxShadow: '4px 4px 0 rgba(0,0,0,0.5)',
      padding: '8px 12px', fontFamily: 'Montserrat,sans-serif',
    }}>
      <div style={{ fontSize: 10, fontWeight: 800, color: '#3c3c68', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 5 }}>{label}</div>
      {payload.map((p, i) => (
        <div key={i} style={{ fontSize: 11, fontWeight: 700, color: p.color || '#e8e8f8' }}>
          {p.name}: {typeof p.value === 'number' ? p.value : p.value}
          {p.unit || ''}
        </div>
      ))}
    </div>
  );
};

const kpis = [
  { label: 'Total Sessions',    value: '387',   change: '+14%',  up: true,  icon: Activity,    color: '#7c3aed', accent: '#7c3aed' },
  { label: 'Avg Session',       value: '9m 14s', change: '+1m',  up: true,  icon: Target,      color: '#ec4899', accent: '#ec4899' },
  { label: 'Avg HP (Adherence)',value: '71%',   change: '+4%',   up: true,  icon: Heart,       color: '#10b981', accent: '#10b981' },
  { label: 'Total XP Earned',   value: '82.4k', change: '+18%',  up: true,  icon: Zap,         color: '#f59e0b', accent: '#f59e0b' },
];

export default function Analytics() {
  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title">Analytics</div>
          <div className="page-subtitle">Therapy outcomes, adherence trends and hero progression data</div>
        </div>
        <div style={{ display: 'flex', gap: 6 }}>
          {['7D','30D','3M','1Y'].map(t => (
            <button key={t} style={{
              padding: '6px 12px', fontSize: 10, fontWeight: 800, cursor: 'pointer',
              fontFamily: 'Montserrat,sans-serif', textTransform: 'uppercase', letterSpacing: 0.8,
              background: t === '30D' ? '#7c3aed' : 'rgba(255,255,255,0.04)',
              border: `2px solid ${t === '30D' ? '#7c3aed' : '#2a1a5e'}`,
              color: t === '30D' ? '#fff' : '#6060a0',
              boxShadow: t === '30D' ? '3px 3px 0 rgba(0,0,0,0.5)' : 'none',
            }}>{t}</button>
          ))}
        </div>
      </div>

      {/* KPI row */}
      <div className="analytics-kpi">
        {kpis.map(({ label, value, change, up, icon: Icon, color, accent }) => (
          <div key={label} className="kpi-card" style={{ '--kpi-accent': accent }}>
            <div className="kpi-label">
              {label}
              <div style={{
                width: 28, height: 28,
                background: color + '22', border: `2px solid ${color}44`,
                boxShadow: '2px 2px 0 rgba(0,0,0,0.4)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <Icon size={13} color={color} />
              </div>
            </div>
            <div className="kpi-value">{value}</div>
            <div className={`kpi-change ${up ? 'up' : 'down'}`}>
              {up ? '▲' : '▼'} {change} vs last period
            </div>
          </div>
        ))}
      </div>

      {/* Row 1 */}
      <div className="analytics-row">
        <div className="chart-card">
          <div className="chart-title">Patient Enrollment</div>
          <div className="chart-sub">Total enrolled and new patients per month</div>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={userGrowthData} margin={{ top:5,right:10,bottom:0,left:-20 }}>
              <defs>
                <linearGradient id="aT" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#7c3aed" stopOpacity={0.35} />
                  <stop offset="95%" stopColor="#7c3aed" stopOpacity={0}    />
                </linearGradient>
                <linearGradient id="aN" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#10b981" stopOpacity={0.35} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0}    />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="rgba(255,255,255,0.04)" strokeDasharray="2 4" />
              <XAxis dataKey="month" tick={{ fill:'#3c3c68', fontSize:10, fontFamily:'Montserrat', fontWeight:600 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill:'#3c3c68', fontSize:10, fontFamily:'Montserrat', fontWeight:600 }} axisLine={false} tickLine={false} />
              <Tooltip content={<PixTip />} />
              <Area type="monotone" dataKey="total" name="Total" stroke="#7c3aed" strokeWidth={2} fill="url(#aT)" dot={false} />
              <Area type="monotone" dataKey="new"   name="New"   stroke="#10b981" strokeWidth={2} fill="url(#aN)" dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-card">
          <div className="chart-title">Condition Split</div>
          <div className="chart-sub">Patients by diagnosis</div>
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie data={conditionDistribution} cx="50%" cy="50%"
                innerRadius={48} outerRadius={72} paddingAngle={4} dataKey="value">
                {conditionDistribution.map((d, i) => <Cell key={i} fill={d.color} />)}
              </Pie>
              <Tooltip content={<PixTip />} />
            </PieChart>
          </ResponsiveContainer>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 5, marginTop: 6 }}>
            {conditionDistribution.map(d => (
              <div key={d.name} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, fontWeight: 700, color: '#b0b0d8' }}>
                  <span style={{ width: 7, height: 7, background: d.color, flexShrink: 0 }} />
                  {d.name}
                </div>
                <span style={{ fontFamily: "'Press Start 2P',monospace", fontSize: 7, color: '#6060a0' }}>{d.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Row 2 */}
      <div className="analytics-row-2">
        <div className="chart-card">
          <div className="chart-title">Medication Adherence Trend</div>
          <div className="chart-sub">Platform-wide average pill adherence rate (% HP) over time</div>
          <ResponsiveContainer width="100%" height={180}>
            <AreaChart data={adherenceData} margin={{ top:5,right:10,bottom:0,left:-20 }}>
              <defs>
                <linearGradient id="aAd" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#10b981" stopOpacity={0.35} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0}    />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="rgba(255,255,255,0.04)" strokeDasharray="2 4" />
              <XAxis dataKey="month" tick={{ fill:'#3c3c68', fontSize:10, fontFamily:'Montserrat', fontWeight:600 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill:'#3c3c68', fontSize:10, fontFamily:'Montserrat', fontWeight:600 }} axisLine={false} tickLine={false} domain={[60,100]} unit="%" />
              <Tooltip content={<PixTip />} />
              <Area type="monotone" dataKey="rate" name="Adherence" stroke="#10b981" strokeWidth={2.5} fill="url(#aAd)" dot={{ fill:'#10b981', r:3, strokeWidth:0 }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-card">
          <div className="chart-title">Patient Retention</div>
          <div className="chart-sub">% of patients still active at each day milestone</div>
          <ResponsiveContainer width="100%" height={180}>
            <LineChart data={retentionData} margin={{ top:5,right:10,bottom:0,left:-20 }}>
              <CartesianGrid stroke="rgba(255,255,255,0.04)" strokeDasharray="2 4" />
              <XAxis dataKey="day" tick={{ fill:'#3c3c68', fontSize:10, fontFamily:'Montserrat', fontWeight:600 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill:'#3c3c68', fontSize:10, fontFamily:'Montserrat', fontWeight:600 }} axisLine={false} tickLine={false} unit="%" />
              <Tooltip content={<PixTip />} />
              <Line type="monotone" dataKey="rate" name="Retention" stroke="#a78bfa" strokeWidth={2.5} dot={{ fill:'#a78bfa', r:3, strokeWidth:0 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Hero stage bar + XP */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginTop: 14 }}>
        <div className="chart-card">
          <div className="chart-title">Hero Stage Breakdown</div>
          <div className="chart-sub">Patients at each hero evolution stage</div>
          <ResponsiveContainer width="100%" height={160}>
            <BarChart data={heroStageData} margin={{ top:5,right:10,bottom:0,left:-25 }}>
              <CartesianGrid stroke="rgba(255,255,255,0.04)" strokeDasharray="2 4" />
              <XAxis dataKey="stage" tick={{ fill:'#3c3c68', fontSize:9, fontFamily:'Montserrat', fontWeight:700 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill:'#3c3c68', fontSize:10, fontFamily:'Montserrat', fontWeight:600 }} axisLine={false} tickLine={false} />
              <Tooltip content={<PixTip />} />
              <Bar dataKey="count" name="Patients" fill="#7c3aed" radius={[2,2,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-card">
          <div className="chart-title">XP Earned Per Month</div>
          <div className="chart-sub">Total experience points collected by all patients</div>
          <ResponsiveContainer width="100%" height={160}>
            <AreaChart data={revenueData} margin={{ top:5,right:10,bottom:0,left:-20 }}>
              <defs>
                <linearGradient id="aXP" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#f59e0b" stopOpacity={0.35} />
                  <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}    />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="rgba(255,255,255,0.04)" strokeDasharray="2 4" />
              <XAxis dataKey="month" tick={{ fill:'#3c3c68', fontSize:10, fontFamily:'Montserrat', fontWeight:600 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill:'#3c3c68', fontSize:10, fontFamily:'Montserrat', fontWeight:600 }} axisLine={false} tickLine={false} />
              <Tooltip content={<PixTip />} />
              <Area type="monotone" dataKey="xp" name="XP" stroke="#f59e0b" strokeWidth={2.5} fill="url(#aXP)" dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Country breakdown */}
      <div style={{ marginTop: 14 }}>
        <div className="chart-card">
          <div className="chart-title">Geographic Distribution</div>
          <div className="chart-sub">Patient locations across the world</div>
          <div style={{ marginTop: 14, display: 'flex', flexDirection: 'column', gap: 10 }}>
            {countryData.map(c => (
              <div key={c.country} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 130, fontSize: 12, fontWeight: 600, color: '#b0b0d8', flexShrink: 0 }}>{c.country}</div>
                <div style={{ flex: 1, height: 8, background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(255,255,255,0.07)', overflow: 'hidden' }}>
                  <div style={{
                    width: `${c.pct}%`, height: '100%',
                    background: 'linear-gradient(90deg,#7c3aed,#a855f7)',
                    position: 'relative',
                  }}>
                    <div style={{ position: 'absolute', inset: 0, background: 'repeating-linear-gradient(90deg,transparent 0,transparent 10px,rgba(0,0,0,0.2) 10px,rgba(0,0,0,0.2) 12px)' }} />
                  </div>
                </div>
                <div style={{ fontFamily: "'Press Start 2P',monospace", fontSize: 7, color: '#6060a0', width: 28, textAlign: 'right', flexShrink: 0 }}>{c.users}</div>
                <div style={{ fontSize: 10, fontWeight: 700, color: '#3c3c68', width: 32, textAlign: 'right', flexShrink: 0 }}>{c.pct}%</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
