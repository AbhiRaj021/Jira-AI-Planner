'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';

interface FullPageMessageProps {
    icon: LucideIcon;
    title: string;
    description: string;
    children?: React.ReactNode;
    iconColorClass?: string;
    iconBgClass?: string;
}

export function FullPageMessage({
    icon: Icon,
    title,
    description,
    children,
    iconColorClass = "text-blue-500",
    iconBgClass = "bg-blue-50 dark:bg-blue-900/10"
}: FullPageMessageProps) {
    return (
        <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex flex-col items-center justify-center p-4 text-center">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center"
            >
                <div className={`h-24 w-24 ${iconBgClass} rounded-3xl flex items-center justify-center mb-6 ${iconColorClass}`}>
                    <Icon className="w-12 h-12" />
                </div>
                <h1 className="text-4xl font-bold text-zinc-900 dark:text-zinc-100 mb-2">{title}</h1>
                <p className="text-zinc-500 mb-8 max-w-md">
                    {description}
                </p>
                {children}
            </motion.div>
        </div>
    );
}
