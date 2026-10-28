import { Bell } from 'lucide-react';
import { screenMap } from '../data/screenMap';
import { Breadcrumb } from './ui';

function getTrail(screen, settings, selectedProduct) {
  if (screen === '01') return ['Rootwise', 'Start'];
  if (screen === '02a') return ['Comparisons', 'New comparison'];
  if (screen.startsWith('03a')) return ['Comparisons', `${settings.baseline} → ${settings.comparison}`];
  if (screen.startsWith('04')) return ['Comparisons', `${settings.baseline} → ${settings.comparison.replace('GCC ', '')}`, 'Results'];
  if (screen.startsWith('05')) return ['Comparisons', `${settings.baseline} → ${settings.comparison.replace('GCC ', '')} / Results`, selectedProduct || 'Product A'];
  const label = screenMap.find((item) => item.id === screen)?.label.split(' · ')[0] || 'Workspace';
  return ['Comparisons', label];
}

export function TopBar({ screen, angle, onAngleChange, settings, selectedProduct }) {
  const trail = getTrail(screen, settings, selectedProduct);

  return (
    <header className="topbar">
      <Breadcrumb items={trail} />
      <div className="topbar-actions">
        <span className="sync-pill"><i /> SAP BDC · GVC outputs synced 09:12</span>
        <div className="angle-switch" aria-label="Analyst perspective">
          <span>Viewing as</span>
          <div className="angle-switch-group">
            {['GVC Analyst', 'Cost Analyst'].map((item) => (
              <button
                key={item}
                className={angle === item ? 'angle-switch-active' : ''}
                onClick={() => onAngleChange(item)}
              >
                <i />
                {item}
              </button>
            ))}
          </div>
        </div>
        <button className="icon-button" aria-label="Notifications"><Bell size={16} /></button>
        <div className="profile-button" aria-label="User profile">GA</div>
      </div>
    </header>
  );
}
