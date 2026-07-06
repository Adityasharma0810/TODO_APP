import { type ReactNode } from 'react';
import { motion } from 'motion/react';
import { cn } from '../../utils/cn';

interface CardProps {
  children?: ReactNode;
  className?: string;
  onClick?: () => void;
  accent?: 'left' | 'header';
}

export function Card({ children, className, onClick, accent }: CardProps) {
  const isInteractive = !!onClick;

  return (
    <motion.div
      whileHover={isInteractive ? { y: -2 } : undefined}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      onClick={onClick}
      className={cn(
        'relative rounded-xl bg-surface p-5',
        accent === 'left' && 'border-l-[3px] border-l-accent',
        isInteractive && 'cursor-pointer',
        className,
      )}
    >
      {accent === 'header' && (
        <div className="absolute left-0 right-0 top-0 h-1 rounded-t-xl bg-accent" />
      )}
      {children}
    </motion.div>
  );
}
