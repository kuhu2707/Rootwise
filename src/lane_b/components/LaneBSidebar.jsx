import React from 'react';
import { Home, Plus, GitFork, TableProperties, Presentation, Settings } from 'lucide-react';

/**
 * LaneBSidebar Component
 * Sidebar navigation rail matching the screenshot
 */
export function LaneBSidebar({ activeItem = 'results', onNavigate }) {
  return (
    <aside className="lane-b-sidebar" aria-label="Rootwise main navigation">
      {/* Rootwise Brand Mark */}
      <button
        type="button"
        className="lane-b-sidebar-logo"
        onClick={() => onNavigate && onNavigate('01')}
        title="Rootwise Workspace"
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 20h16" />
          <path d="M8 20V10c0-2.2 1.8-4 4-4s4 1.8 4 4v10" />
          <path d="M12 6V2" />
        </svg>
      </button>

      {/* Primary Navigation Icons */}
      <nav className="lane-b-sidebar-nav">
        <button
          type="button"
          className={`lane-b-nav-item ${activeItem === 'home' ? 'active' : ''}`}
          onClick={() => onNavigate && onNavigate('01')}
          title="Home"
          aria-label="Home"
        >
          <Home size={19} />
        </button>

        <button
          type="button"
          className={`lane-b-nav-item ${activeItem === 'new' ? 'active' : ''}`}
          onClick={() => onNavigate && onNavigate('02a')}
          title="New Comparison"
          aria-label="New Comparison"
        >
          <Plus size={19} />
        </button>

        <button
          type="button"
          className={`lane-b-nav-item ${activeItem === 'pipeline' ? 'active' : ''}`}
          onClick={() => onNavigate && onNavigate('03a.1')}
          title="Agent Pipeline"
          aria-label="Agent Pipeline"
        >
          <GitFork size={19} />
        </button>

        <button
          type="button"
          className={`lane-b-nav-item ${activeItem === 'results' ? 'active' : ''}`}
          onClick={() => onNavigate && onNavigate('results')}
          title="Results"
          aria-label="Results"
        >
          <TableProperties size={19} />
        </button>
      </nav>

      {/* Bottom Actions */}
      <div className="lane-b-sidebar-bottom">
        <button
          type="button"
          className={`lane-b-nav-item ${activeItem === 'presentation' ? 'active' : ''}`}
          title="Executive Presentation"
          aria-label="Executive Presentation"
        >
          <Presentation size={19} />
        </button>

        <button
          type="button"
          className={`lane-b-nav-item ${activeItem === 'settings' ? 'active' : ''}`}
          title="Settings"
          aria-label="Settings"
        >
          <Settings size={19} />
        </button>
      </div>
    </aside>
  );
}
