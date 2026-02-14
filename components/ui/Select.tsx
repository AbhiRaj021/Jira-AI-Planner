
import React from 'react';
import { cn } from '../../lib/utils';
import { ChevronDown } from 'lucide-react';

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
    label?: string;
    error?: string;
    options: { value: string; label: string }[];
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
    ({ className, label, error, options, ...props }, ref) => {
        return (
            <div className="space-y-2">
                {label && (
                    <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                        {label}
                    </label>
                )}
                <div className="relative">
                    <select
                        ref={ref}
                        className={cn(
                            'flex h-10 w-full appearance-none rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900/50 px-3 py-2 text-sm ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/50 focus-visible:border-blue-500 disabled:cursor-not-allowed disabled:opacity-50 transition-all shadow-sm pr-10',
                            error && 'border-red-500 focus-visible:ring-red-500/50',
                            className
                        )}
                        {...props}
                    >
                        {options.map((option) => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-2.5 h-4 w-4 text-zinc-500 pointer-events-none" />
                </div>
                {error && <p className="text-xs text-red-500">{error}</p>}
            </div>
        );
    }
);

Select.displayName = 'Select';
