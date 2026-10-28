import { useState } from 'react';
import { Sidebar } from '../components/Sidebar';
import { TopBar } from '../components/TopBar';
import { AgentRunPage } from '../features/workspace/AgentRunPage';
import { EntryPage } from '../features/workspace/EntryPage';
import { ResultsPage } from '../features/workspace/ResultsPage';
import { VarianceDetailPage } from '../features/workspace/VarianceDetailPage';
import { SetupPage } from '../features/workspace/SetupPage';
import { LaneAResultsPage } from '../lane_a';
import { LaneBResultsPage, LaneBDetailPage } from '../lane_b';
import { LaneCWorkflowPage, LaneCEmptyResultsScreen } from '../lane_c';
import { getFlaggedRows } from '../data/mockResults';

const runScreens = ['03a.1', '03a.2', '03a.3', '03a.4', '03a.5'];

function journeyIndex(screen) {
  if (screen === '01') return 0;
  if (screen === '02a') return 1;
  if (screen.startsWith('03a')) return 2;
  return 3;
}

export default function App() {
  const [screen, setScreen] = useState(() => {
    const params = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null;
    const screenParam = params ? params.get('screen') : null;
    const laneParam = params ? params.get('lane') : null;
    if (laneParam === 'a') return 'lane_a';
    if (laneParam === 'b') return 'lane_b';
    if (laneParam === 'c') return 'lane_c';
    return screenParam || '01';
  });
  const [angle, setAngle] = useState(() => {
    const param = typeof window !== 'undefined' ? new URLSearchParams(window.location.search).get('angle') : null;
    return param || 'GVC Analyst';
  });
  const [selectedRowId, setSelectedRowId] = useState('A-100245');
  const [settings, setSettings] = useState({
    baseline: 'GCC April 2027',
    comparison: 'GCC May 2027',
    comparisonType: 'Same-year cycles',
    measure: 'Total group cost',
    threshold: 10,
  });

  const resultScreen = angle === 'GVC Analyst' ? '04a' : '04b';
  const selectAngle = (nextAngle) => {
    setAngle(nextAngle);
    if (screen === '04a' || screen === '04b') setScreen(nextAngle === 'GVC Analyst' ? '04a' : '04b');
    if (screen === '05a' || screen === '05b') setScreen(nextAngle === 'GVC Analyst' ? '05a' : '05b');
  };
  const updateSettings = (nextSettings) => setSettings((current) => ({ ...current, ...nextSettings }));
  const advanceRun = () => {
    const current = runScreens.indexOf(screen);
    setScreen(current >= runScreens.length - 1 ? resultScreen : runScreens[current + 1]);
  };
  const backFromRun = () => {
    const current = runScreens.indexOf(screen);
    setScreen(current <= 0 ? '02a' : runScreens[current - 1]);
  };
  const navigate = (nextScreen) => setScreen(nextScreen === 'results' ? resultScreen : nextScreen);
  const openRow = (row) => {
    setSelectedRowId(row.id);
    setScreen(angle === 'GVC Analyst' ? '05a' : '05b');
  };
  const detailRows = getFlaggedRows(settings.threshold, settings.measure);
  const selectedRow = detailRows.find((row) => row.id === selectedRowId) || detailRows[0];
  const moveDetail = (row) => row && setSelectedRowId(row.id);

  // Optional Lane testing routes from Gunwant branch
  if (screen === 'lane_a') {
    return (
      <LaneAResultsPage
        angle={angle}
        onAngleChange={selectAngle}
        settings={settings}
        onAdjustThreshold={() => setScreen('empty_results')}
        onSelectRow={openRow}
        onNavigate={navigate}
      />
    );
  }

  if (screen === 'empty_results') {
    return (
      <LaneCEmptyResultsScreen
        angle={angle}
        onAngleChange={selectAngle}
        comparisonText={`${settings.baseline} → ${settings.comparison}`}
        comparisonType={settings.comparisonType}
        measure={settings.measure}
        threshold={settings.threshold || 10}
        onReRunAt8={() => {
          setSettings((prev) => ({ ...prev, threshold: 8 }));
          setScreen('04a');
        }}
        onEditThreshold={() => setScreen('02a')}
        onNavigate={navigate}
      />
    );
  }

  if (screen === 'lane_b') {
    return (
      <LaneBResultsPage
        angle={angle}
        onAngleChange={selectAngle}
        settings={settings}
        onAdjustThreshold={() => setScreen('empty_results')}
        onSelectRow={openRow}
        onNavigate={navigate}
      />
    );
  }

  if (screen === 'lane_b_detail') {
    return (
      <LaneBDetailPage
        productId={selectedRowId}
        row={selectedRow}
        rows={detailRows}
        settings={settings}
        angle={angle}
        onAngleChange={selectAngle}
        onBack={() => setScreen('lane_b')}
        onSelectRow={moveDetail}
        onNavigate={navigate}
      />
    );
  }

  if (screen === 'lane_c' || screen === '02c') {
    return (
      <LaneCWorkflowPage
        angle={angle}
        onAngleChange={selectAngle}
        onNavigate={navigate}
      />
    );
  }

  return (
    <div className="app-shell">
      <Sidebar activeScreen={screen} onNavigate={navigate} />
      <div className="panel-wrap">
        <div className="panel-frame">
          <TopBar screen={screen} angle={angle} onAngleChange={selectAngle} settings={settings} selectedProduct={selectedRow?.product} />
          <main className={`main-content ${screen === '01' ? 'main-entry' : ''}`}>
            {screen === '01' && <EntryPage angle={angle} onAngleChange={selectAngle} onContinue={() => setScreen('02a')} />}
            {screen === '02a' && <SetupPage settings={settings} onSettingsChange={updateSettings} onRun={() => setScreen('03a.1')} />}
            {runScreens.includes(screen) && (
              <AgentRunPage
                screen={screen}
                settings={settings}
                onAdvance={advanceRun}
                onBack={backFromRun}
                onViewReadyRows={() => {
                  setAngle('GVC Analyst');
                  setScreen('04a');
                }}
              />
            )}
            {(screen === '04a' || screen === '04b') && <ResultsPage angle={angle} settings={settings} onAdjustThreshold={() => setScreen('02a')} onSelectRow={openRow} />}
            {(screen === '05a' || screen === '05b') && selectedRow && <VarianceDetailPage row={selectedRow} rows={detailRows} angle={angle} settings={settings} onBack={() => setScreen(resultScreen)} onSelectRow={moveDetail} />}
          </main>
        </div>
      </div>
    </div>
  );
}
