import { Modal } from './Modal';
import { Button } from './Button';
import { cn } from '../../utils/cn';

type ConfirmVariant = 'danger' | 'primary';

interface ExtraAction {
  label: string;
  onClick: () => void;
}

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  confirmVariant?: ConfirmVariant;
  extraAction?: ExtraAction;
}

export function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirm',
  confirmVariant = 'primary',
  extraAction,
}: ConfirmDialogProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title}>
      <p className="mb-6 text-sm text-text-secondary">{message}</p>
      <div className="flex items-center justify-end gap-3">
        {extraAction && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              extraAction.onClick();
              onClose();
            }}
            className="mr-auto"
          >
            {extraAction.label}
          </Button>
        )}
        <Button variant="ghost" size="sm" onClick={onClose}>
          Cancel
        </Button>
        <Button
          variant={confirmVariant === 'danger' ? 'danger' : 'primary'}
          size="sm"
          onClick={() => {
            onConfirm();
            onClose();
          }}
        >
          {confirmText}
        </Button>
      </div>
    </Modal>
  );
}
