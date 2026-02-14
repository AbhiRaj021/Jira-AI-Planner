
'use client';

import React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import { cn } from '../../lib/utils';
import { Loader2 } from 'lucide-react';

interface ButtonProps extends HTMLMotionProps<"button"> {
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
    size?: 'sm' | 'md' | 'lg';
    isLoading?: boolean;
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant = 'primary', size = 'md', isLoading, leftIcon, rightIcon, children, disabled, ...props }, ref) => {

        const variants = {
            primary: 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-500/30 border border-transparent',
            secondary: 'bg-zinc-800 text-zinc-100 hover:bg-zinc-700 border border-zinc-700',
            outline: 'bg-transparent text-zinc-700 dark:text-zinc-300 border border-zinc-300 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800',
            ghost: 'bg-transparent text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 border border-transparent',
            danger: 'bg-red-600 text-white hover:bg-red-700 shadow-lg shadow-red-500/30 border border-transparent',
        };

        const sizes = {
            sm: 'h-8 px-3 text-xs',
            md: 'h-10 px-4 text-sm',
            lg: 'h-12 px-6 text-base',
        };

        return (
            <motion.button
                ref={ref}
                whileTap={{ scale: 0.98 }}
                className={cn(
                    'inline-flex items-center justify-center rounded-xl font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500/50 disabled:opacity-50 disabled:pointer-events-none gap-2',
                    variants[variant],
                    sizes[size],
                    className
                )}
                disabled={disabled || isLoading}
                {...props}
            >

                {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                {!isLoading && leftIcon}
                {children as React.ReactNode}
                {!isLoading && rightIcon}
            </motion.button>
        );
    }
);

Button.displayName = 'Button';
