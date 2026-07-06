import { useState } from 'react';
import { Download, Database, Upload } from 'lucide-react';
import { open } from '@tauri-apps/plugin-dialog';
import { Button } from '../ui/Button';
import { useSettingsStore } from '../../state/useSettingsStore';
import { useUIStore } from '../../state/useUIStore';

export function BackupSection() {
  const { exportJson, exportSqlite, importBackup } = useSettingsStore();
  const showToast = useUIStore((s) => s.showToast);
  const [importing, setImporting] = useState(false);
  const [exportingJson, setExportingJson] = useState(false);
  const [exportingDb, setExportingDb] = useState(false);

  const handleExportJson = async () => {
    setExportingJson(true);
    try {
      await exportJson();
      showToast('JSON backup exported', 'success');
    } catch {
      showToast('Failed to export JSON backup', 'error');
    }
    setExportingJson(false);
  };

  const handleExportDb = async () => {
    setExportingDb(true);
    try {
      await exportSqlite();
      showToast('Database exported', 'success');
    } catch {
      showToast('Failed to export database', 'error');
    }
    setExportingDb(false);
  };

  const handleImport = async () => {
    setImporting(true);
    try {
      const filePath = await open({
        filters: [{ name: 'JSON Backup', extensions: ['json'] }],
        multiple: false,
      });
      if (!filePath) {
        setImporting(false);
        return;
      }
      await importBackup(filePath as string);
      showToast('Backup imported successfully', 'success');
    } catch {
      showToast('Failed to import backup', 'error');
    }
    setImporting(false);
  };

  return (
    <div className="space-y-3">
      <Button
        variant="secondary"
        size="md"
        className="w-full justify-start"
        onClick={handleExportJson}
        disabled={exportingJson}
      >
        <Download className="h-4 w-4" />
        <div className="flex flex-col items-start">
          <span>Export as JSON</span>
          <span className="text-[11px] font-normal text-text-secondary">
            Human-readable task &amp; progress backup
          </span>
        </div>
      </Button>

      <Button
        variant="secondary"
        size="md"
        className="w-full justify-start"
        onClick={handleExportDb}
        disabled={exportingDb}
      >
        <Database className="h-4 w-4" />
        <div className="flex flex-col items-start">
          <span>Export Database</span>
          <span className="text-[11px] font-normal text-text-secondary">
            Full SQLite database snapshot
          </span>
        </div>
      </Button>

      <Button
        variant="secondary"
        size="md"
        className="w-full justify-start"
        onClick={handleImport}
        disabled={importing}
      >
        <Upload className="h-4 w-4" />
        <div className="flex flex-col items-start">
          <span>Import Backup</span>
          <span className="text-[11px] font-normal text-text-secondary">
            Restore from a JSON backup file
          </span>
        </div>
      </Button>
    </div>
  );
}
