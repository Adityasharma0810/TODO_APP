import { motion } from 'motion/react';
import { Sun, Moon, Monitor } from 'lucide-react';
import { useSettingsStore } from '../../state/useSettingsStore';
import { cn } from '../../utils/cn';

const themeOptions = [
  { value: 'dark' as const, label: 'Dark', icon: Moon },
  { value: 'light' as const, label: 'Light', icon: Sun },
  { value: 'system' as const, label: 'System', icon: Monitor },
];

const presetColors = [
  { name: 'Indigo', color: '#6366F1' },
  { name: 'Emerald', color: '#10B981' },
  { name: 'Rose', color: '#F43F5E' },
  { name: 'Amber', color: '#F59E0B' },
  { name: 'Sky', color: '#0EA5E9' },
  { name: 'Fuchsia', color: '#D946EF' },
  { name: 'Teal', color: '#14B8A6' },
  { name: 'Orange', color: '#F97316' },
];

export function ThemeSection() {
  const { settings, updateSettings } = useSettingsStore();

  return (
    <div className="space-y-6">
      <div>
        <label className="mb-3 block text-sm font-medium text-text-primary">Theme</label>
        <div className="grid grid-cols-3 gap-3">
          {themeOptions.map(({ value, label, icon: Icon }) => (
            <button
              key={value}
              onClick={() => updateSettings({ theme: value })}
              className={cn(
                'flex flex-col items-center gap-2 rounded-xl p-4 transition-colors',
                settings.theme === value
                  ? 'bg-accent/20 ring-2 ring-accent'
                  : 'bg-surface hover:bg-surface-hover',
              )}
            >
              <Icon
                className={cn(
                  'h-5 w-5',
                  settings.theme === value ? 'text-accent' : 'text-text-secondary',
                )}
              />
              <span
                className={cn(
                  'text-xs font-medium',
                  settings.theme === value ? 'text-accent' : 'text-text-primary',
                )}
              >
                {label}
              </span>
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="mb-3 block text-sm font-medium text-text-primary">Accent Color</label>
        <div className="flex flex-wrap gap-3">
          {presetColors.map(({ name, color }) => (
            <motion.button
              key={color}
              whileHover={{ scale: 1.15 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => updateSettings({ accentColor: color })}
              title={name}
              className={cn(
                'h-8 w-8 rounded-full ring-2 ring-offset-2 ring-offset-bg transition-colors',
                settings.accentColor === color
                  ? 'ring-white'
                  : 'ring-transparent hover:ring-white/30',
              )}
              style={{ backgroundColor: color }}
            />
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div>
          <label className="block text-sm font-medium text-text-primary">Lock Past Days</label>
          <p className="text-xs text-text-secondary">Prevent edits to days before today</p>
        </div>
        <button
          onClick={() => updateSettings({ lockPastDays: !settings.lockPastDays })}
          className={cn(
            'relative h-6 w-11 rounded-full transition-colors',
            settings.lockPastDays ? 'bg-accent' : 'bg-surface-hover',
          )}
        >
          <motion.div
            layout
            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
            className={cn(
              'absolute top-0.5 h-5 w-5 rounded-full bg-white shadow',
              settings.lockPastDays ? 'left-[22px]' : 'left-0.5',
            )}
          />
        </button>
      </div>
    </div>
  );
}
