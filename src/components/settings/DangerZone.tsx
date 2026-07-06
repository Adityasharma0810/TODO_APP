import { useState } from 'react';
import { AlertTriangle, Download } from 'lucide-react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { useSettingsStore } from '../../state/useSettingsStore';
import { useUIStore } from '../../state/useUIStore';

export function DangerZone() {
  const { resetAllStatistics, exportJson } = useSettingsStore();
  const showToast = useUIStore((s) => s.showToast);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [confirmText, setConfirmText] = useState('');

  const handleReset = async () => {
    try {
      await resetAllStatistics();
      showToast('All statistics have been reset', 'success');
    } catch {
      showToast('Failed to reset statistics', 'error');
    }
    setDialogOpen(false);
    setConfirmText('');
  };

  const handleExportFirst = async () => {
    try {
      await exportJson();
      showToast('Backup exported. You can now proceed with reset.', 'success');
    } catch {
      showToast('Failed to export backup', 'error');
    }
  };

  const canConfirm = confirmText.toUpperCase() === 'RESET';

  return (
    <>
      <div className="rounded-xl border border-red-500/30 bg-red-500/5 p-5">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-500/10">
            <AlertTriangle className="h-5 w-5 text-red-400" />
          </div>
          <div className="flex-1">
            <h3 className="text-sm font-medium text-text-primary">Danger Zone</h3>
            <p className="text-xs text-text-secondary">
              Irreversibly delete all daily records and completion history
            </p>
          </div>
          <Button variant="danger" size="sm" onClick={() => setDialogOpen(true)}>
            Reset All Statistics
          </Button>
        </div>
      </div>

      <Modal isOpen={dialogOpen} onClose={() => { setDialogOpen(false); setConfirmText(''); }} title="Reset All Statistics">
        <div className="space-y-4">
          <div className="rounded-lg bg-red-500/10 px-4 py-3">
            <p className="text-sm text-red-300">
              This action cannot be undone. All daily records, completion history, and streak data
              will be permanently deleted.
            </p>
          </div>

          <div className="flex items-center justify-center rounded-lg bg-bg px-4 py-3">
            <Button variant="ghost" size="sm" onClick={handleExportFirst}>
              <Download className="h-4 w-4" />
              Export a backup first
            </Button>
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-medium text-text-secondary">
              Type <span className="font-mono text-text-primary">RESET</span> to confirm
            </label>
            <input
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              placeholder="Type RESET"
              className="w-full rounded-lg bg-bg px-4 py-2.5 text-sm text-text-primary placeholder-text-secondary outline-none ring-1 ring-white/10 focus:ring-red-500"
            />
          </div>

          <div className="flex justify-end gap-3">
            <Button variant="ghost" size="sm" onClick={() => { setDialogOpen(false); setConfirmText(''); }}>
              Cancel
            </Button>
            <Button
              variant="danger"
              size="sm"
              onClick={handleReset}
              disabled={!canConfirm}
            >
              Reset Everything
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
}
