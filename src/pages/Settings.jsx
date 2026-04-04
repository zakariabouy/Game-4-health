import { useState } from 'react';
import { User, Bell, Shield, Palette, Globe, CreditCard } from 'lucide-react';

const SECTIONS = [
  { id: 'profile',       label: 'Profile',         icon: User     },
  { id: 'notifications', label: 'Notifications',   icon: Bell     },
  { id: 'security',      label: 'Security',        icon: Shield   },
  { id: 'appearance',    label: 'Appearance',      icon: Palette  },
  { id: 'localization',  label: 'Localization',    icon: Globe    },
  { id: 'billing',       label: 'Billing',         icon: CreditCard },
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
    <>
      <div className="s-section">
        <div className="s-section-title">Personal Information</div>
        <div className="form-row">
          <div className="form-group">
            <label className="form-label">First Name</label>
            <input className="form-input" defaultValue="Martin" />
          </div>
          <div className="form-group">
            <label className="form-label">Last Name</label>
            <input className="form-input" defaultValue="Lee" />
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input className="form-input" defaultValue="martin.lee@winsphere.io" type="email" />
          </div>
          <div className="form-group">
            <label className="form-label">Phone Number</label>
            <input className="form-input" defaultValue="+1 (555) 000-0000" type="tel" />
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Role</label>
            <select className="form-select">
              <option>Admin</option>
              <option>Moderator</option>
              <option>Viewer</option>
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
    </>
  );
}

function NotificationsSection() {
  const notifs = [
    { label: 'New user registration',  desc: 'Get notified when a new user signs up',             on: true  },
    { label: 'Game activity alerts',   desc: 'Alerts when unusual game activity is detected',     on: true  },
    { label: 'Weekly reports',         desc: 'Receive weekly analytics summary via email',        on: false },
    { label: 'Withdrawal requests',    desc: 'Notify when a user submits a withdrawal request',   on: true  },
    { label: 'System maintenance',     desc: 'Scheduled downtime and maintenance notifications',  on: true  },
    { label: 'Marketing updates',      desc: 'Product updates and promotional notifications',     on: false },
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
      <div className="btn-row" style={{ marginTop: 16 }}>
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
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, maxWidth: 420 }}>
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
        <div className="s-section-title">Two-Factor Authentication</div>
        <div className="toggle-row">
          <div>
            <div className="toggle-label">Enable 2FA</div>
            <div className="toggle-desc">Add an extra layer of security to your account</div>
          </div>
          <Toggle defaultChecked={false} />
        </div>
        <div className="toggle-row">
          <div>
            <div className="toggle-label">Login Alerts</div>
            <div className="toggle-desc">Get notified when a new device logs into your account</div>
          </div>
          <Toggle defaultChecked={true} />
        </div>
      </div>
    </>
  );
}

const CONTENT = {
  profile:       <ProfileSection />,
  notifications: <NotificationsSection />,
  security:      <SecuritySection />,
  appearance:    <div style={{ color: '#55557a', padding: '20px 0' }}>Appearance settings coming soon.</div>,
  localization:  <div style={{ color: '#55557a', padding: '20px 0' }}>Localization settings coming soon.</div>,
  billing:       <div style={{ color: '#55557a', padding: '20px 0' }}>Billing settings coming soon.</div>,
};

export default function Settings() {
  const [active, setActive] = useState('profile');

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title">Settings</div>
          <div className="page-subtitle">Manage your account and platform preferences</div>
        </div>
      </div>

      <div className="settings-grid">
        <nav className="settings-nav-panel">
          {SECTIONS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              className={`sn-item${active === id ? ' active' : ''}`}
              onClick={() => setActive(id)}
            >
              <Icon size={15} />
              {label}
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
