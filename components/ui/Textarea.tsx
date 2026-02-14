
import React from 'react';
import { cn } from '../../lib/utils';

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
    label?: string;
    error?: string;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
    ({ className, label, error, ...props }, ref) => {
        return (
            <div className="space-y-2">
                {label && (
                    <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                        {label}
                    </label>
                )}
                <textarea
                    ref={ref}
                    className={cn(
                        'flex min-h-[80px] w-full rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900/50 px-3 py-2 text-sm ring-offset-white placeholder:text-zinc-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/50 focus-visible:border-blue-500 disabled:cursor-not-allowed disabled:opacity-50 transition-all shadow-sm resize-y',
                        error && 'border-red-500 focus-visible:ring-red-500/50',
                        className
                    )}
                    {...props}
                />
                {error && <p className="text-xs text-red-500">{error}</p>}
            </div>
        );
    }
);

Textarea.displayName = 'Textarea';
