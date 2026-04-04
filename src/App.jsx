import { useState } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Dashboard from './pages/Dashboard';
import Users from './pages/Users';
import Games from './pages/Games';
import Analytics from './pages/Analytics';
import Rewards from './pages/Rewards';
import Settings from './pages/Settings';
import './App.css';

const PAGES = {
  dashboard: <Dashboard />,
  users:     <Users />,
  games:     <Games />,
  analytics: <Analytics />,
  rewards:   <Rewards />,
  settings:  <Settings />,
};

export default function App() {
  const [page, setPage] = useState('dashboard');

  return (
    <div className="app-layout">
      <Sidebar currentPage={page} onNavigate={setPage} />
      <div className="app-main">
        <Header />
        <main className="app-content">
          {PAGES[page]}
        </main>
      </div>
    </div>
  );
}
