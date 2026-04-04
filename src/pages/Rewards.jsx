import { Shield, Flame, Zap, Star, TrendingUp, Crown, Trophy, Lock } from 'lucide-react';
import { childProfile, childRewards } from '../data/mockData';

const REWARD_ICONS = { Shield, Flame, Zap, Star, TrendingUp, Crown, Trophy };
function RewardIcon({ name, size = 18, color = '#fff' }) {
  const Icon = REWARD_ICONS[name] || Trophy;
  return <Icon size={size} color={color} />;
}

export default function Rewards() {
  const earnedRewards = childRewards.filter(r => r.earned);
  const lockedRewards = childRewards.filter(r => !r.earned);

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title">Rewards</div>
          <div className="page-subtitle">Alex's earned badges and rewards available to unlock with XP</div>
        </div>
      </div>

      {/* Summary */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:14, marginBottom:18 }}>
        {[
          { label:'XP Balance',        value:childProfile.xp.toLocaleString(), icon:Zap,    color:'#f59e0b' },
          { label:'Badges Earned',     value:earnedRewards.length,             icon:Trophy, color:'#7c3aed' },
          { label:'Rewards Available', value:lockedRewards.length,             icon:Star,   color:'#ec4899' },
        ].map(({ label, value, icon:Icon, color }) => (
          <div key={label} style={{ background:'#0f0f22', border:'2px solid #2a1a5e', boxShadow:'4px 4px 0 rgba(0,0,0,0.5)', padding:16, display:'flex', alignItems:'center', gap:14, position:'relative' }}>
            <div style={{ position:'absolute', top:0, left:0, right:0, height:2, background:color }} />
            <div style={{ width:40, height:40, background:color+'22', border:`2px solid ${color}44`, boxShadow:'2px 2px 0 rgba(0,0,0,0.4)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
              <Icon size={18} color={color} />
            </div>
            <div>
              <div style={{ fontFamily:"'Press Start 2P',monospace", fontSize:18, color:'#fff', marginBottom:4, textShadow:'2px 2px 0 rgba(0,0,0,0.4)' }}>{value}</div>
              <div style={{ fontSize:9, fontWeight:800, color:'#3c3c68', textTransform:'uppercase', letterSpacing:1 }}>{label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Earned badges */}
      <div className="chart-card" style={{ marginBottom:16 }}>
        <div className="chart-title">Earned Badges</div>
        <div className="chart-sub">Rewards Alex has unlocked through play and medication adherence</div>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:12, marginTop:14 }}>
          {earnedRewards.map(r => (
            <div key={r.name} style={{
              background:'rgba(255,255,255,0.02)',
              border:`2px solid ${r.color}55`,
              boxShadow:`3px 3px 0 rgba(0,0,0,0.5), inset 0 0 20px ${r.color}08`,
              padding:16, display:'flex', alignItems:'center', gap:12,
            }}>
              <div style={{ width:40, height:40, background:r.color+'22', border:`2px solid ${r.color}44`, flexShrink:0, display:'flex', alignItems:'center', justifyContent:'center', boxShadow:'2px 2px 0 rgba(0,0,0,0.4)' }}>
                <RewardIcon name={r.iconName} size={18} color={r.color} />
              </div>
              <div style={{ flex:1 }}>
                <div style={{ fontFamily:"'Press Start 2P',monospace", fontSize:8, color:r.color, marginBottom:3 }}>{r.name}</div>
                <div style={{ fontSize:10, color:'#6060a0', lineHeight:1.4, marginBottom:3 }}>{r.desc}</div>
                <div style={{ fontSize:9, fontWeight:700, color:'#3c3c68' }}>Earned: {r.earnedDate}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Locked rewards */}
      <div className="chart-card">
        <div className="chart-title">Unlock with XP</div>
        <div className="chart-sub">
          Spend Alex's XP to unlock these rewards — current balance:{' '}
          <span style={{ fontFamily:"'Press Start 2P',monospace", fontSize:9, color:'#f59e0b' }}>{childProfile.xp.toLocaleString()} XP</span>
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:12, marginTop:14 }}>
          {lockedRewards.map(r => {
            const canAfford = childProfile.xp >= r.xpCost;
            return (
              <div key={r.name} style={{ background:'rgba(0,0,0,0.3)', border:'2px solid #2a1a5e', boxShadow:'3px 3px 0 rgba(0,0,0,0.5)', padding:16, opacity: canAfford ? 1 : 0.6 }}>
                <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:12 }}>
                  <div style={{ width:36, height:36, background:r.color+'11', border:`2px solid ${r.color}33`, flexShrink:0, display:'flex', alignItems:'center', justifyContent:'center' }}>
                    <RewardIcon name={r.iconName} size={16} color={canAfford ? r.color : '#3c3c68'} />
                  </div>
                  <div>
                    <div style={{ fontFamily:"'Press Start 2P',monospace", fontSize:8, color: canAfford ? r.color : '#3c3c68', marginBottom:2 }}>{r.name}</div>
                    <div style={{ fontSize:10, color:'#3c3c68' }}>{r.desc}</div>
                  </div>
                </div>
                <button style={{
                  width:'100%', padding:'8px 0', border:'0',
                  background: canAfford ? '#7c3aed' : 'rgba(255,255,255,0.04)',
                  boxShadow: canAfford ? 'inset -2px -3px 0 rgba(0,0,0,0.4), 3px 3px 0 rgba(0,0,0,0.5)' : 'none',
                  color: canAfford ? '#fff' : '#3c3c68',
                  cursor: canAfford ? 'pointer' : 'not-allowed',
                  fontFamily:'Montserrat,sans-serif', fontSize:10, fontWeight:800,
                  textTransform:'uppercase', letterSpacing:0.8,
                  display:'flex', alignItems:'center', justifyContent:'center', gap:6,
                }}>
                  {!canAfford && <Lock size={10} />}
                  {r.xpCost} XP {canAfford ? '— Unlock' : '— Need more XP'}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
