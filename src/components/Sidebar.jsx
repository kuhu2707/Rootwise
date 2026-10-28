import { Activity, Home, PanelLeft, Plus, Settings, TableProperties } from 'lucide-react';
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
      <button className="rail-workspace" aria-label="GVC AI Platform workspace" onClick={() => onNavigate('01')}>
        <BrandMark compact />
      </button>
      <nav className="rail-nav">
        {navigation.map(({ id, label, icon: Icon }) => {
          const active = id === activeScreen || (id === '02a' && activeScreen === '02a') || (id === '03a.1' && activeScreen.startsWith('03a')) || (id === 'results' && ['04a', '04b', '05a', '05b'].includes(activeScreen));
          return (
            <button
              key={id}
              className={`rail-item ${active ? 'rail-active' : ''}`}
              title={label}
              aria-label={label}
              onClick={() => onNavigate(id)}
            >
              <Icon size={20} strokeWidth={1.75} />
            </button>
          );
        })}
      </nav>
      <div className="rail-spacer" />
      <button className="rail-item" title="Toggle panel" aria-label="Toggle panel"><PanelLeft size={19} strokeWidth={1.75} /></button>
      <button className="rail-item" title="Settings" aria-label="Settings"><Settings size={19} strokeWidth={1.75} /></button>
    </aside>
  );
}
