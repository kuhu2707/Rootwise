import { Activity, Database, Home, Plus, Settings, TableProperties } from 'lucide-react';
import { BrandMark } from './ui';

const navigation = [
  { id: '01', label: 'Start', icon: Home },
  { id: '02a', label: 'New comparison', icon: Plus },
  { id: '03a.1', label: 'Agent run', icon: Activity },
  { id: 'results', label: 'Results', icon: TableProperties },
];

export function Sidebar({ onNavigate, activeScreen }) {
  return (
    <aside className="sidebar" aria-label="Workspace navigation">
      <button className="rail-workspace" aria-label="GVC AI Platform workspace"><BrandMark compact /><span>GVC AI Platform</span></button>
      <nav className="rail-nav">
        {navigation.map(({ id, label, icon: Icon }) => {
          const active = id === activeScreen || (id === '03a.1' && activeScreen.startsWith('03a')) || (id === 'results' && ['04a', '04b', '05a', '05b'].includes(activeScreen));
          return <button key={id} className={`rail-item ${active ? 'rail-active' : ''}`} title={label} aria-label={label} onClick={() => onNavigate(id)}><Icon size={18} strokeWidth={1.8} /></button>;
        })}
      </nav>
      <div className="rail-spacer" />
      <button className="rail-item" title="Data sources" aria-label="Data sources"><Database size={17} /></button>
      <button className="rail-item" title="Settings" aria-label="Settings"><Settings size={17} /></button>
      <div className="rail-profile" title="GVC Analyst">GA</div>
    </aside>
  );
}
