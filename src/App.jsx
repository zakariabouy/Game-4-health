import { useState } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Dashboard from './pages/Dashboard';
import Users from './pages/Users';
import Games from './pages/Games';
import Analytics from './pages/Analytics';
import Rewards from './pages/Rewards';
import Settings from './pages/Settings';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import './App.css';

const PAGES = {
  dashboard: <Dashboard />,
  users:     <Users />,
  games:     <Games />,
  analytics: <Analytics />,
  rewards:   <Rewards />,
  settings:  <Settings />,
};

function AppInner() {
  const [page, setPage] = useState('dashboard');
  const { dark } = useTheme();

  return (
    <div className="app-layout" data-theme={dark ? 'dark' : 'light'}>
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

export default function App() {
  return (
    <ThemeProvider>
      <AppInner />
    </ThemeProvider>
  );
}
