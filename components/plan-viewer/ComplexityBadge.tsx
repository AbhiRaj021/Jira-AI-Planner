
import React from 'react';

interface ComplexityBadgeProps {
    level: 'low' | 'medium' | 'high';
}

export function ComplexityBadge({ level }: ComplexityBadgeProps) {
    const colors = {
        low: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
        medium: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
        high: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
    };

    return (
        <span className={`text-[10px] px-1.5 py-0.5 rounded-full uppercase font-bold tracking-wide ${colors[level] || colors.low}`}>
            {level}
        </span>
    );
}
