import { useState } from 'react';
import { User, Bell, Shield, Heart, MessageCircle } from 'lucide-react';
import { childProfile } from '../data/mockData';

const SECTIONS = [
  { id: 'profile',       label: 'My Profile',    icon: User          },
  { id: 'child',         label: 'Child Info',     icon: Heart         },
  { id: 'notifications', label: 'Notifications',  icon: Bell          },
  { id: 'security',      label: 'Security',       icon: Shield        },
  { id: 'therapist',     label: 'Therapist',      icon: MessageCircle },
];

function Toggle({ defaultChecked = false }) {
  const [on, setOn] = useState(defaultChecked);
  return (
    <label className="toggle">
      <input type="checkbox" checked={on} onChange={() => setOn(!on)} />
      <span className="toggle-slider" />
    </label>
  );
}

function ProfileSection() {
  return (
    <div className="s-section">
      <div className="s-section-title">Parent / Guardian Information</div>
      <div className="form-row">
        <div className="form-group">
          <label className="form-label">First Name</label>
          <input className="form-input" defaultValue="Sarah" />
        </div>
        <div className="form-group">
          <label className="form-label">Last Name</label>
          <input className="form-input" defaultValue="Chen" />
        </div>
      </div>
      <div className="form-row">
        <div className="form-group">
          <label className="form-label">Email Address</label>
          <input className="form-input" defaultValue="sarah.chen@email.com" type="email" />
        </div>
        <div className="form-group">
          <label className="form-label">Phone Number</label>
          <input className="form-input" defaultValue="+1 (555) 123-4567" type="tel" />
        </div>
      </div>
      <div className="form-row">
        <div className="form-group">
          <label className="form-label">Relationship to Child</label>
          <select className="form-select">
            <option>Mother</option>
            <option>Father</option>
            <option>Guardian</option>
            <option>Other</option>
          </select>
        </div>
        <div className="form-group">
          <label className="form-label">Timezone</label>
          <select className="form-select">
            <option>UTC-5 (Eastern Time)</option>
            <option>UTC-8 (Pacific Time)</option>
            <option>UTC+0 (GMT)</option>
            <option>UTC+1 (CET)</option>
          </select>
        </div>
      </div>
      <div className="btn-row">
        <button className="btn-save">Save Changes</button>
        <button className="btn-secondary">Cancel</button>
      </div>
    </div>
  );
}

function ChildSection() {
  return (
    <div className="s-section">
      <div className="s-section-title">Child Information</div>
      <div style={{ background:'rgba(124,58,237,0.06)', border:'2px solid #2a1a5e', borderLeft:'3px solid #7c3aed', padding:'10px 14px', marginBottom:16, fontSize:11, color:'#6060a0', lineHeight:1.5 }}>
        To update medical information or therapy assignments, please contact {childProfile.therapist} directly.
      </div>
      <div className="form-row">
        <div className="form-group">
          <label className="form-label">Child's Name</label>
          <input className="form-input" defaultValue={childProfile.name} readOnly style={{ opacity:0.6 }} />
        </div>
        <div className="form-group">
          <label className="form-label">Age</label>
          <input className="form-input" defaultValue={`${childProfile.age} years old`} readOnly style={{ opacity:0.6 }} />
        </div>
      </div>
      <div className="form-row">
        <div className="form-group">
          <label className="form-label">Condition</label>
          <input className="form-input" defaultValue={childProfile.condition} readOnly style={{ opacity:0.6 }} />
        </div>
        <div className="form-group">
          <label className="form-label">Therapist</label>
          <input className="form-input" defaultValue={childProfile.therapist} readOnly style={{ opacity:0.6 }} />
        </div>
      </div>
      <div className="form-row">
        <div className="form-group">
          <label className="form-label">Joined</label>
          <input className="form-input" defaultValue={childProfile.joinedDate} readOnly style={{ opacity:0.6 }} />
        </div>
        <div className="form-group">
          <label className="form-label">Next Session</label>
          <input className="form-input" defaultValue={childProfile.nextSession} readOnly style={{ opacity:0.6 }} />
        </div>
      </div>
    </div>
  );
}

function NotificationsSection() {
  const notifs = [
    { label:'Daily activity summary',  desc:"Get a daily recap of Ahmed's sessions and medication",   on:true  },
    { label:'Missed medication alert', desc:'Notify when Ahmed misses a scheduled medication dose',    on:true  },
    { label:'Streak milestones',       desc:"Celebrate when Ahmed hits streak milestones",             on:true  },
    { label:'Therapist messages',      desc:`Notify when ${childProfile.therapist} sends a message`,  on:true  },
    { label:'Weekly progress report',  desc:"Weekly summary of Ahmed's development and progress",     on:false },
    { label:'Reward unlocks',          desc:"Notify when Ahmed earns or unlocks a reward",            on:false },
  ];
  return (
    <div className="s-section">
      <div className="s-section-title">Notification Preferences</div>
      {notifs.map(n => (
        <div className="toggle-row" key={n.label}>
          <div>
            <div className="toggle-label">{n.label}</div>
            <div className="toggle-desc">{n.desc}</div>
          </div>
          <Toggle defaultChecked={n.on} />
        </div>
      ))}
      <div className="btn-row" style={{ marginTop:16 }}>
        <button className="btn-save">Save Preferences</button>
      </div>
    </div>
  );
}

function SecuritySection() {
  return (
    <>
      <div className="s-section">
        <div className="s-section-title">Change Password</div>
        <div style={{ display:'flex', flexDirection:'column', gap:12, maxWidth:420 }}>
          <div className="form-group">
            <label className="form-label">Current Password</label>
            <input className="form-input" type="password" placeholder="••••••••" />
          </div>
          <div className="form-group">
            <label className="form-label">New Password</label>
            <input className="form-input" type="password" placeholder="••••••••" />
          </div>
          <div className="form-group">
            <label className="form-label">Confirm New Password</label>
            <input className="form-input" type="password" placeholder="••••••••" />
          </div>
        </div>
        <div className="btn-row"><button className="btn-save">Update Password</button></div>
      </div>
      <div className="s-section">
        <div className="s-section-title">Security Options</div>
        <div className="toggle-row">
          <div>
            <div className="toggle-label">Two-Factor Authentication</div>
            <div className="toggle-desc">Extra layer of security for your parent account</div>
          </div>
          <Toggle defaultChecked={false} />
        </div>
        <div className="toggle-row">
          <div>
            <div className="toggle-label">Login Alerts</div>
            <div className="toggle-desc">Get notified when a new device signs in</div>
          </div>
          <Toggle defaultChecked={true} />
        </div>
      </div>
    </>
  );
}

function TherapistSection() {
  return (
    <div className="s-section">
      <div className="s-section-title">Therapist Contact</div>
      <div style={{ background:'rgba(124,58,237,0.06)', border:'2px solid #2a1a5e', boxShadow:'4px 4px 0 rgba(0,0,0,0.4)', padding:20, marginBottom:20 }}>
        <div style={{ display:'flex', alignItems:'center', gap:14 }}>
          <div style={{ width:48, height:48, background:'#7c3aed', boxShadow:'3px 3px 0 rgba(0,0,0,0.5)', display:'flex', alignItems:'center', justifyContent:'center', fontFamily:"'Press Start 2P',monospace", fontSize:12, color:'#fff', flexShrink:0 }}>
            ML
          </div>
          <div>
            <div style={{ fontFamily:"'Press Start 2P',monospace", fontSize:10, color:'#c4b5fd', marginBottom:4 }}>Dr. Martin Lee</div>
            <div style={{ fontSize:11, color:'#6060a0' }}>Child & Adolescent Therapist</div>
            <div style={{ fontSize:11, color:'#6060a0' }}>martin.lee@g4health.com</div>
          </div>
        </div>
      </div>

      <div className="s-section-title">Send Message</div>
      <div className="form-group" style={{ marginBottom:12 }}>
        <label className="form-label">Subject</label>
        <input className="form-input" placeholder="e.g. Question about Ahmed's progress" />
      </div>
      <div className="form-group" style={{ marginBottom:16 }}>
        <label className="form-label">Message</label>
        <textarea
          className="form-input"
          rows={4}
          placeholder="Write your message to Dr. Martin Lee..."
          style={{ resize:'vertical', fontFamily:'Montserrat,sans-serif', height:'auto' }}
        />
      </div>
      <button className="btn-save" style={{ display:'flex', alignItems:'center', gap:6 }}>
        <MessageCircle size={13} /> Send Message
      </button>
    </div>
  );
}

const CONTENT = {
  profile:       <ProfileSection />,
  child:         <ChildSection />,
  notifications: <NotificationsSection />,
  security:      <SecuritySection />,
  therapist:     <TherapistSection />,
};

export default function Settings() {
  const [active, setActive] = useState('profile');

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title">Settings</div>
          <div className="page-subtitle">Manage your parent account, child info and notification preferences</div>
        </div>
      </div>

      <div className="settings-grid">
        <nav className="settings-nav-panel">
          {SECTIONS.map(({ id, label, icon:Icon }) => (
            <button key={id} className={`sn-item${active === id ? ' active' : ''}`} onClick={() => setActive(id)}>
              <Icon size={15} />{label}
            </button>
          ))}
        </nav>
        <div className="settings-panel">
          {CONTENT[active]}
        </div>
      </div>
    </div>
  );
}
