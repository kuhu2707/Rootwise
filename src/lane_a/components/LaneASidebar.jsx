import React from 'react';
import { Home, Plus, GitFork, TableProperties, Film, Settings } from 'lucide-react';

export function LaneASidebar({ onNavigate }) {
  return (
    <aside className="lane-a-sidebar" aria-label="Rootwise Sidebar">
      <div 
        className="lane-a-logo-mark" 
        title="Rootwise Home"
        onClick={() => onNavigate && onNavigate('01')}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="5" r="2" fill="currentColor" />
          <path d="M12 7v6" />
          <path d="M12 13a4 4 0 0 0-4 4v2" />
          <path d="M12 13a4 4 0 0 1 4 4v2" />
        </svg>
      </div>

      <div className="lane-a-nav-group">
        <button 
          className="lane-a-nav-item" 
          title="Home"
          onClick={() => onNavigate && onNavigate('01')}
        >
          <Home size={19} />
        </button>

        <button 
          className="lane-a-nav-item" 
          title="New Comparison"
          onClick={() => onNavigate && onNavigate('02a')}
        >
          <Plus size={20} />
        </button>

        <button 
          className="lane-a-nav-item" 
          title="Pipelines & Runs"
          onClick={() => onNavigate && onNavigate('03a.4')}
        >
          <GitFork size={19} />
        </button>

        <button 
          className="lane-a-nav-item active" 
          title="Results Table"
        >
          <TableProperties size={19} />
        </button>

        <button 
          className="lane-a-nav-item" 
          title="Replays & Recordings"
        >
          <Film size={19} />
        </button>
      </div>

      <div className="lane-a-nav-bottom">
        <button className="lane-a-nav-item" title="Settings">
          <Settings size={19} />
        </button>
      </div>
    </aside>
  );
}
