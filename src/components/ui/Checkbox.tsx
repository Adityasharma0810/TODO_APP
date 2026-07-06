import { motion } from 'motion/react';
import { Check } from 'lucide-react';
import { cn } from '../../utils/cn';

interface CheckboxProps {
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  disabled?: boolean;
  label?: string;
}

export function Checkbox({ checked = false, onChange, disabled = false, label }: CheckboxProps) {
  const handleClick = () => {
    if (!disabled) {
      onChange?.(!checked);
    }
  };

  return (
    <label
      className={cn(
        'inline-flex items-center gap-3 select-none',
        disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer',
      )}
      onClick={handleClick}
    >
      <div
        className={cn(
          'relative flex h-[22px] w-[22px] shrink-0 items-center justify-center rounded-md border-2 transition-colors',
          checked
            ? 'border-indigo-500 bg-accent'
            : 'border-border bg-transparent hover:border-[#3A3A42]',
          disabled && 'pointer-events-none',
        )}
      >
        {checked && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          >
            <Check className="h-3.5 w-3.5 text-white" strokeWidth={3} />
          </motion.div>
        )}
      </div>
      {label && <span className="text-sm text-text-primary">{label}</span>}
    </label>
  );
}
