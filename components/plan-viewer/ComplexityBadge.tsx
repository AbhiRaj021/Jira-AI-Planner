
import React from 'react';

interface ComplexityBadgeProps {
    level: 'low' | 'medium' | 'high';
}

export function ComplexityBadge({ level, onClick }: { level: 'low' | 'medium' | 'high'; onClick?: () => void }) {
    const colors = {
        low: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 hover:bg-green-200',
        medium: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 hover:bg-amber-200',
        high: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 hover:bg-red-200',
    };

    const className = `text-[10px] px-1.5 py-0.5 rounded-full uppercase font-bold tracking-wide transition-colors ${colors[level] || colors.low} ${onClick ? 'cursor-pointer' : ''}`;

    if (onClick) {
        return (
            <button onClick={onClick} className={className}>
                {level}
            </button>
        );
    }

    return (
        <span className={className}>
            {level}
        </span>
    );
}
