import { useState } from 'react';
import { BarChart, Bar, AreaChart, Area, ResponsiveContainer } from 'recharts';
import { Search, SlidersHorizontal, MoreVertical, Users as UsersIcon, Zap, Flame, BookOpen, Star, Leaf, Pill, TreePine, Award } from 'lucide-react';
import {
  users, popularGames, avatarColors, miniBarData, miniLineData,
  getHeroStage,
} from '../data/mockData';

// ── Pack icon lookup ─────────────────────────────────────────────────────
const PACK_ICONS = { BookOpen, Zap, Star, Leaf, Pill, TreePine };
function PackIcon({ name, size = 20, color = '#fff' }) {
  const Icon = PACK_ICONS[name] || Pill;
  return <Icon size={size} color={color} />;
}

// ── Condition class helper ───────────────────────────────────────────────
function condClass(c) {
  const m = { ADHD:'cond-adhd', Dyslexia:'cond-dyslexia', Autism:'cond-autism', Anxiety:'cond-anxiety' };
  return m[c] || 'cond-med';
}

// ── HP bar ───────────────────────────────────────────────────────────────
function HpBar({ hp }) {
  const cls = hp >= 70 ? 'bar-fill-hp-hi' : hp >= 40 ? 'bar-fill-hp-mid' : 'bar-fill-hp-low';
  return (
    <div style={{ minWidth: 70 }}>
      <div className="bar-track">
        <div className={`bar-fill ${cls}`} style={{ width: `${hp}%` }} />
      </div>
      <div style={{ textAlign: 'right', marginTop: 2 }}>
        <span style={{ fontFamily: "'Press Start 2P',monospace", fontSize: 7, color: '#6060a0' }}>
          {hp}/100
        </span>
      </div>
    </div>
  );
}

// ── Speedometer gauge SVG ────────────────────────────────────────────────
function Gauge({ pct = 0.7, size = 110 }) {
  const r = 38, cx = size / 2, cy = size * 0.72;
  const toXY = a => ({ x: cx + r * Math.cos(a), y: cy - r * Math.sin(a) });
  const bgStart = toXY(Math.PI), bgEnd = toXY(0);
  const angle = Math.PI * (1 - pct);
  const fillEnd = toXY(angle);
  const tip = { x: cx + (r - 9) * Math.cos(angle), y: cy - (r - 9) * Math.sin(angle) };
  const ticks = Array.from({ length: 7 }, (_, i) => {
    const a = Math.PI - (i / 6) * Math.PI;
    return { x1: cx+(r+2)*Math.cos(a), y1: cy-(r+2)*Math.sin(a), x2: cx+(r+7)*Math.cos(a), y2: cy-(r+7)*Math.sin(a) };
  });
  const bgArc   = `M ${bgStart.x} ${bgStart.y} A ${r} ${r} 0 0 1 ${bgEnd.x} ${bgEnd.y}`;
  const fillArc = `M ${bgStart.x} ${bgStart.y} A ${r} ${r} 0 ${pct > 0.5 ? 1 : 0} 1 ${fillEnd.x} ${fillEnd.y}`;
  return (
    <svg width={size} height={cy + 12} style={{ display: 'block', margin: '0 auto' }}>
      <path d={bgArc} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="5" />
      {ticks.map((t, i) => (
        <line key={i} x1={t.x1} y1={t.y1} x2={t.x2} y2={t.y2}
          stroke="rgba(255,255,255,0.12)" strokeWidth="1.5" />
      ))}
      {pct > 0 && <path d={fillArc} fill="none" stroke="#a78bfa" strokeWidth="5" />}
      <line x1={cx} y1={cy} x2={tip.x} y2={tip.y} stroke="#fff" strokeWidth="2" />
      {/* pixel dot at centre */}
      <rect x={cx-4} y={cy-4} width={8} height={8} fill="#7c3aed" />
    </svg>
  );
}

// ── Stat Cards ───────────────────────────────────────────────────────────
function StatCards() {
  const activeCount = users.filter(u => u.status === 'Active').length;
  const avgAdherence = Math.round(users.reduce((s, u) => s + u.hp, 0) / users.length);

  return (
    <div className="stats-row">
      {/* Card 1: Active Patients */}
      <div className="stat-card stat-card-playing">
        <div className="stat-top">
          <div className="stat-value">{activeCount}</div>
          <div className="stat-label">Active Patients</div>
        </div>
        <div style={{ height: 48 }}>
          <ResponsiveContainer width="100%" height={48}>
            <BarChart data={miniBarData} margin={{ top:0,right:0,bottom:0,left:0 }}>
              <Bar dataKey="v" fill="rgba(255,255,255,0.4)" radius={[0,0,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Card 2: Sessions Today */}
      <div className="stat-card stat-card-today">
        <div className="stat-top">
          <div className="stat-value">38</div>
          <div className="stat-label">Sessions Today</div>
        </div>
        <Gauge pct={0.65} size={106} />
      </div>

      {/* Card 3: Avg Adherence */}
      <div className="stat-card stat-card-total">
        <div className="stat-total-header">
          <div className="stat-total-label">Avg HP</div>
          <div style={{ width: 8, height: 8, background: '#7c3aed', boxShadow: '2px 2px 0 rgba(0,0,0,0.5)' }} />
        </div>
        <div style={{ height: 44 }}>
          <ResponsiveContainer width="100%" height={44}>
            <AreaChart data={miniLineData} margin={{ top:2,right:0,bottom:0,left:0 }}>
              <defs>
                <linearGradient id="areaHP" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="10%" stopColor="#7c3aed" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#7c3aed" stopOpacity={0} />
                </linearGradient>
              </defs>
              <Area type="monotone" dataKey="v" stroke="#a78bfa" strokeWidth={2}
                fill="url(#areaHP)" dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div>
          <div className="stat-value" style={{ fontSize: 18 }}>{avgAdherence}%</div>
          <div className="stat-label">Avg Adherence</div>
        </div>
      </div>
    </div>
  );
}

// ── Users Table ───────────────────────────────────────────────────────────
function PatientsTable() {
  const [search, setSearch] = useState('');
  const filtered = users.filter(u => u.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="table-section">
      <div className="table-header">
        <span className="table-title">Patients</span>
        <div className="table-toolbar">
          <div className="table-search">
            <Search size={11} className="table-search-icon" />
            <input
              type="text"
              placeholder="Search patient name..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <button className="filter-btn">
            <SlidersHorizontal size={11} />
            Filter
          </button>
        </div>
      </div>

      <table className="data-table">
        <thead>
          <tr>
            <th>Rank</th>
            <th>Patient</th>
            <th>Condition</th>
            <th style={{ minWidth: 80 }}>HP / Adherence</th>
            <th>Hero</th>
            <th>XP</th>
            <th><Flame size={11} style={{ verticalAlign: 'middle' }} /> Streak</th>
            <th>Country</th>
            <th>Status</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {filtered.map((u, i) => {
            const stage = getHeroStage(u.hp);
            return (
              <tr key={u.id}>
                <td>
                  <span className={`rank-num${u.rank <= 3 ? ' top' : ''}`}>
                    {u.rank <= 3
                    ? <Award size={14} color={['#fcd34d','#94a3b8','#b45309'][u.rank-1]} />
                    : `#${u.rank}`}
                  </span>
                </td>
                <td>
                  <div className="user-cell">
                    <div
                      className="user-av-sm"
                      style={{ background: avatarColors[i % avatarColors.length] }}
                    >
                      {u.name[0]}
                    </div>
                    <div>
                      <div className="user-name-tbl">{u.name}</div>
                      <div className="hero-class">Lv.{u.level}</div>
                    </div>
                  </div>
                </td>
                <td>
                  <span className={`cond-badge ${condClass(u.condition)}`}>
                    {u.condition}
                  </span>
                </td>
                <td><HpBar hp={u.hp} /></td>
                <td style={{ fontFamily: "'Press Start 2P',monospace", fontSize: 8, color: '#c4b5fd' }}>
                  {stage}
                </td>
                <td style={{ fontFamily: "'Press Start 2P',monospace", fontSize: 8, color: '#a78bfa' }}>
                  {u.xp.toLocaleString()}
                </td>
                <td>
                  <span className="streak-cell"><Flame size={10} color="#fbbf24" /> {u.streak}d</span>
                </td>
                <td><span className="country-flag">{u.countryCode}</span></td>
                <td>
                  <span className={`status-badge${u.status === 'Inactive' ? ' inactive' : ''}`}>
                    <span className="status-dot" />
                    {u.status}
                  </span>
                </td>
                <td>
                  <button className="action-btn"><MoreVertical size={13} /></button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

// ── Therapy Packs Panel ──────────────────────────────────────────────────
function TherapyPacksPanel() {
  return (
    <div className="popular-games">
      <div className="panel-header">
        <span className="panel-title">Therapy Packs</span>
        <button className="panel-menu"><MoreVertical size={15} /></button>
      </div>
      <div className="game-list">
        {popularGames.map(g => (
          <div className="game-item" key={g.id}>
            <div className="game-thumb" style={{ background: g.bg }}>
              <PackIcon name={g.iconName} size={20} color="#fff" />
            </div>
            <div className="game-info">
              <div className="game-name">{g.title}</div>
              <div className="game-pub">{g.publisher}</div>
              <div className="game-desc">{g.desc}</div>
              <div className="game-stats-row">
                <span className="game-stat"><UsersIcon size={9} /> {g.likes}</span>
                <span className="game-stat"><Zap size={9} /> {g.plays.toLocaleString()}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Page ─────────────────────────────────────────────────────────────────
export default function Users() {
  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title">Patients</div>
          <div className="page-subtitle">
            Monitor patient heroes, adherence HP, therapy progress and streaks
          </div>
        </div>
      </div>
      <StatCards />
      <div className="users-content">
        <PatientsTable />
        <TherapyPacksPanel />
      </div>
    </div>
  );
}
