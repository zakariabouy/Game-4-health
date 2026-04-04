import { useState } from 'react';
import { Search, Plus, Users, Zap, Star, MoreVertical, BookOpen, Leaf, Pill, TreePine } from 'lucide-react';
import { allGames } from '../data/mockData';

const PACK_ICONS = { BookOpen, Zap, Star, Leaf, Pill, TreePine };
function PackIcon({ name, size = 38, color = '#fff' }) {
  const Icon = PACK_ICONS[name] || Pill;
  return <Icon size={size} color={color} />;
}

const FILTER_LABELS = {
  adhd:     { label: 'ADHD',     color: '#fcd34d' },
  dyslexia: { label: 'Dyslexia', color: '#67e8f9' },
  autism:   { label: 'Autism',   color: '#f9a8d4' },
  anxiety:  { label: 'Anxiety',  color: '#86efac' },
  all:      { label: 'All Packs', color: '#c4b5fd' },
};

const conditionMap = {
  'Dyslexia Pack': 'dyslexia',
  'ADHD Pack':     'adhd',
  'Autism Pack':   'autism',
  'Anxiety Pack':  'anxiety',
  'Medication Pack': 'all',
  'Mystic Woods':  'anxiety',
};

export default function Games() {
  const [search, setSearch] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');

  const filtered = allGames.filter(g => {
    const matchSearch = g.title.toLowerCase().includes(search.toLowerCase());
    const matchFilter = activeFilter === 'all' || conditionMap[g.title] === activeFilter;
    return matchSearch && matchFilter;
  });

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title">Therapy Packs</div>
          <div className="page-subtitle">
            All available therapy game packs — Dyslexia, ADHD, Autism, Anxiety, Medication
          </div>
        </div>
        <button className="add-game-btn">
          <Plus size={13} />
          New Pack
        </button>
      </div>

      <div className="games-toolbar">
        <div className="games-search" style={{ position: 'relative' }}>
          <Search size={13} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: '#3c3c68', pointerEvents: 'none' }} />
          <input
            type="text"
            placeholder="Search therapy packs..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <div style={{ display: 'flex', gap: 6 }}>
          {Object.entries(FILTER_LABELS).map(([key, { label, color }]) => (
            <button key={key} onClick={() => setActiveFilter(key)} style={{
              padding: '6px 12px', fontSize: 10, fontWeight: 800, cursor: 'pointer',
              fontFamily: 'Montserrat,sans-serif', textTransform: 'uppercase', letterSpacing: 0.6,
              background: activeFilter === key ? color + '22' : 'rgba(255,255,255,0.04)',
              border: `2px solid ${activeFilter === key ? color : '#2a1a5e'}`,
              color: activeFilter === key ? color : '#6060a0',
              boxShadow: activeFilter === key ? `3px 3px 0 rgba(0,0,0,0.5)` : 'none',
            }}>{label}</button>
          ))}
        </div>
      </div>

      <div className="games-grid">
        {filtered.map(g => (
          <div className="game-card" key={g.id}>
            <div className="game-card-cover" style={{ background: g.bg }}>
              <PackIcon name={g.iconName} size={38} color={g.color} />
            </div>
            <div className="game-card-body">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 2 }}>
                <div className="game-card-title">{g.title}</div>
                <button style={{ background: 'none', border: 'none', color: '#3c3c68', cursor: 'pointer', padding: 2, flexShrink: 0 }}>
                  <MoreVertical size={13} />
                </button>
              </div>
              <div className="game-card-pub" style={{ color: g.color }}>{g.subtitle}</div>
              <div style={{ fontSize: 10, color: '#3c3c68', marginBottom: 10, lineHeight: 1.5,
                display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                {g.desc}
              </div>

              {/* rating */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginBottom: 8 }}>
                {[1,2,3,4,5].map(s => (
                  <Star key={s} size={10} style={{ color: s <= Math.round(g.rating) ? '#fbbf24' : '#2a1a5e', fill: s <= Math.round(g.rating) ? '#fbbf24' : 'transparent' }} />
                ))}
                <span style={{ fontFamily: "'Press Start 2P',monospace", fontSize: 7, color: '#fbbf24', marginLeft: 3 }}>
                  {g.rating}
                </span>
              </div>

              <div className="game-card-stats">
                <span className="game-card-stat"><Users size={10} /> {g.patients}</span>
                <span className="game-card-stat"><Zap size={10} /> {g.sessions.toLocaleString()}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
