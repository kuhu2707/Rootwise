import React, { useState } from 'react';
import { Upload, X, FileSpreadsheet, FileText, Copy, Check } from 'lucide-react';
import './exportOverlayModal.css';

const DEFAULT_COLUMNS = [
  'Root plant',
  'SKU',
  'Group cost cycle 1',
  'Group cost cycle 2',
  'Absolute delta',
  'Delta %',
  'AI variance commentary',
  'Confidence',
];

export function ExportOverlayModal({
  isOpen = false,
  onClose,
  rows = [],
  baseline = 'GCC April',
  comparison = 'May 2027',
  measure = 'total group cost',
  threshold = 10,
  initialAngle = 'GVC Analyst',
  onExportSuccess,
}) {
  const [format, setFormat] = useState('excel'); // 'excel' | 'csv' | 'copy'
  const [commentaryAngle, setCommentaryAngle] = useState(
    initialAngle === 'Cost Analyst' ? 'Cost Analyst · management' : 'GVC Analyst · diagnostic'
  );
  const [selectedColumns, setSelectedColumns] = useState(DEFAULT_COLUMNS);
  const [isExporting, setIsExporting] = useState(false);
  const [copiedToast, setCopiedToast] = useState(false);

  if (!isOpen) return null;

  const toggleColumn = (col) => {
    if (selectedColumns.includes(col)) {
      if (selectedColumns.length > 1) {
        setSelectedColumns(selectedColumns.filter((c) => c !== col));
      }
    } else {
      setSelectedColumns([...selectedColumns, col]);
    }
  };

  const handleExport = async () => {
    setIsExporting(true);

    const exportPayload = {
      format,
      commentaryAngle,
      columns: selectedColumns,
      threshold,
      measure,
      baseline,
      comparison,
      rowCount: rows.length,
    };

    // Pre-flexible backend integration
    const API_BASE = import.meta.env?.VITE_API_URL || '';
    if (API_BASE) {
      try {
        const res = await fetch(`${API_BASE}/comparisons/export`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(exportPayload),
        });
        if (res.ok) {
          const blob = await res.blob();
          const ext = format === 'excel' ? 'xlsx' : 'csv';
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `rootwise-flagged-export-${new Date().toISOString().slice(0, 10)}.${ext}`;
          a.click();
          URL.revokeObjectURL(url);
          setIsExporting(false);
          onClose();
          return;
        }
      } catch (err) {
        console.warn('[ExportOverlayModal] Backend export endpoint offline, using client fallback:', err);
      }
    }

    // Client-side export generator
    const dataHeaders = selectedColumns;
    const dataRows = rows.map((r) => {
      const rowMap = {
        'Root plant': r.rootPlant || 'RP-01',
        'SKU': r.sku || '100245',
        'Group cost cycle 1': `$${(r.totalGroupCost?.cycle1 ?? 10.5).toFixed(2)}`,
        'Group cost cycle 2': `$${(r.totalGroupCost?.cycle2 ?? 12.8).toFixed(2)}`,
        'Absolute delta': `${r.delta > 0 ? '+' : ''}${(r.delta ?? 2.3).toFixed(2)}`,
        'Delta %': `${r.percent > 0 ? '+' : ''}${(r.percent ?? 21.9).toFixed(1)}%`,
        'AI variance commentary':
          commentaryAngle === 'Both'
            ? `[Diagnostic] ${r.commentary || r.diagnosticCommentary || ''} | [Management] ${r.managementCommentary || ''}`
            : commentaryAngle.includes('management')
            ? r.managementCommentary || r.commentary
            : r.commentary || r.diagnosticCommentary,
        'Confidence': r.confidence || 'High',
      };
      return selectedColumns.map((col) => rowMap[col] ?? '');
    });

    if (format === 'copy') {
      // TSV copy to clipboard
      const tsvContent = [
        dataHeaders.join('\t'),
        ...dataRows.map((cols) => cols.join('\t')),
      ].join('\n');

      try {
        await navigator.clipboard.writeText(tsvContent);
        setCopiedToast(true);
        setTimeout(() => {
          setCopiedToast(false);
          setIsExporting(false);
          onClose();
        }, 1200);
      } catch (e) {
        console.error('Clipboard copy failed', e);
        setIsExporting(false);
      }
      return;
    }

    // CSV / Excel File Download
    const separator = ',';
    const csvContent = [
      dataHeaders.map((h) => `"${h.replace(/"/g, '""')}"`).join(separator),
      ...dataRows.map((cols) =>
        cols.map((val) => `"${String(val).replace(/"/g, '""')}"`).join(separator)
      ),
    ].join('\n');

    const ext = format === 'excel' ? 'xlsx' : 'csv';
    const mime = format === 'excel' ? 'application/vnd.ms-excel' : 'text/csv;charset=utf-8;';
    const blob = new Blob([csvContent], { type: mime });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `rootwise-${baseline.replace(/\s+/g, '-')}-to-${comparison.replace(/\s+/g, '-')}-flagged.${ext}`;
    link.click();
    URL.revokeObjectURL(url);

    setIsExporting(false);
    if (onExportSuccess) onExportSuccess(exportPayload);
    onClose();
  };

  return (
    <div 
      className="export-overlay-backdrop"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="export-modal-title"
    >
      <div className="export-overlay-card">
        {/* Header */}
        <div className="export-header">
          <div className="export-header-left">
            <div className="export-icon-box">
              <Upload size={20} strokeWidth={2.4} />
            </div>
            <div className="export-title-block">
              <h2 id="export-modal-title">Export flagged combinations</h2>
              <p>
                {rows.length} rows · {baseline} → {comparison} · {measure.toLowerCase()} · ≥ {threshold}%
              </p>
            </div>
          </div>

          <button 
            type="button" 
            className="export-close-btn" 
            onClick={onClose}
            aria-label="Close export dialog"
          >
            <X size={16} />
          </button>
        </div>

        {/* 1. Format */}
        <div className="export-section-label">FORMAT</div>
        <div className="export-format-grid" role="radiogroup">
          {/* Excel */}
          <div
            className={`export-format-card ${format === 'excel' ? 'selected' : ''}`}
            onClick={() => setFormat('excel')}
            role="radio"
            aria-checked={format === 'excel'}
          >
            <div className="export-format-icon excel-icon">
              <FileSpreadsheet size={18} />
            </div>
            <div className="export-format-text">
              <span className="export-format-name">Excel</span>
              <span className="export-format-ext">.xlsx</span>
            </div>
          </div>

          {/* CSV */}
          <div
            className={`export-format-card ${format === 'csv' ? 'selected' : ''}`}
            onClick={() => setFormat('csv')}
            role="radio"
            aria-checked={format === 'csv'}
          >
            <div className="export-format-icon csv-icon">
              <FileText size={18} />
            </div>
            <div className="export-format-text">
              <span className="export-format-name">CSV</span>
              <span className="export-format-ext">.csv</span>
            </div>
          </div>

          {/* Copy */}
          <div
            className={`export-format-card ${format === 'copy' ? 'selected' : ''}`}
            onClick={() => setFormat('copy')}
            role="radio"
            aria-checked={format === 'copy'}
          >
            <div className="export-format-icon copy-icon">
              <Copy size={18} />
            </div>
            <div className="export-format-text">
              <span className="export-format-name">Copy</span>
              <span className="export-format-ext">Text only</span>
            </div>
          </div>
        </div>

        {/* 2. Commentary */}
        <div className="export-commentary-section">
          <div className="export-section-label">COMMENTARY</div>
          <div className="export-commentary-toggle" role="radiogroup">
            <button
              type="button"
              className={`export-commentary-btn ${
                commentaryAngle === 'GVC Analyst · diagnostic' ? 'active' : ''
              }`}
              onClick={() => setCommentaryAngle('GVC Analyst · diagnostic')}
            >
              GVC Analyst · diagnostic
            </button>
            <button
              type="button"
              className={`export-commentary-btn ${
                commentaryAngle === 'Cost Analyst · management' ? 'active' : ''
              }`}
              onClick={() => setCommentaryAngle('Cost Analyst · management')}
            >
              Cost Analyst · management
            </button>
            <button
              type="button"
              className={`export-commentary-btn ${commentaryAngle === 'Both' ? 'active' : ''}`}
              onClick={() => setCommentaryAngle('Both')}
            >
              Both
            </button>
          </div>
        </div>

        {/* 3. Columns */}
        <div className="export-columns-section">
          <div className="export-section-label">
            COLUMNS · ONE LINE PER FLAGGED ROOT PLANT / SKU
          </div>
          <div className="export-columns-wrap">
            {DEFAULT_COLUMNS.map((col) => {
              const isSelected = selectedColumns.includes(col);
              return (
                <button
                  type="button"
                  key={col}
                  className={`export-column-pill ${isSelected ? 'active' : 'disabled'}`}
                  onClick={() => toggleColumn(col)}
                >
                  {col}
                </button>
              );
            })}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="export-footer">
          {copiedToast && (
            <div className="export-toast">
              <Check size={14} /> Copied {rows.length} rows to clipboard!
            </div>
          )}

          <button 
            type="button" 
            className="export-btn-cancel" 
            onClick={onClose}
          >
            Cancel
          </button>

          <button
            type="button"
            className="export-btn-submit"
            onClick={handleExport}
            disabled={isExporting}
          >
            <Upload size={14} strokeWidth={2.4} />
            <span>Export {rows.length} rows</span>
          </button>
        </div>
      </div>
    </div>
  );
}
