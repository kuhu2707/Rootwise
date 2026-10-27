import { Bell, ChevronDown } from 'lucide-react';
import { screenMap } from '../data/screenMap';
import { Breadcrumb } from './ui';

function getPageLabel(screen) {
  return screenMap.find((item) => item.id === screen)?.label.split(' · ')[0] || 'Workspace';
}

export function TopBar({ screen, angle, onAngleChange, settings }) {
  const pageLabel = getPageLabel(screen);
  const trail = screen === '01' ? ['Rootwise', 'Start'] : ['Comparisons', `${settings.baseline.replace('GCC ', '')} → ${settings.comparison.replace('GCC ', '')}`, pageLabel];

  return (
    <header className="topbar">
      <Breadcrumb items={trail} />
      <div className="topbar-actions">
        <span className="sync-pill"><i /> SAP BDC · GVC outputs synced 09:12</span>
        <div className="angle-switch" aria-label="Analyst perspective">
          <span>Viewing as</span>
          {['GVC Analyst', 'Cost Analyst'].map((item) => <button key={item} className={angle === item ? 'angle-switch-active' : ''} onClick={() => onAngleChange(item)}><i />{item}</button>)}
        </div>
        <button className="icon-button" aria-label="Notifications"><Bell size={17} /><i /></button>
        <button className="profile-button" aria-label="User profile">GA<ChevronDown size={13} /></button>
      </div>
    </header>
  );
}
