
import React from 'react';
import { CheckCircle2, XCircle, AlertTriangle } from 'lucide-react';

interface StatusItemProps {
    label: string;
    icon: React.ReactNode;
    status?: 'operational' | 'degraded' | 'error' | 'not_configured';
    loading: boolean;
}

export function StatusItem({ label, icon, status, loading }: StatusItemProps) {
    if (loading) {
        return (
            <div className="flex items-center justify-between p-4 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-100 dark:border-zinc-800 animate-pulse">
                <div className="flex items-center gap-3 opacity-50">
                    {icon}
                    <span className="font-medium">{label}</span>
                </div>
                <div className="h-2 w-20 bg-zinc-200 dark:bg-zinc-700 rounded-full" />
            </div>
        );
    }

    let statusColor = "bg-zinc-100 text-zinc-500";
    let StatusIcon = AlertTriangle;
    let statusText = "Unknown";

    if (status === 'operational') {
        statusColor = "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400";
        StatusIcon = CheckCircle2;
        statusText = "Operational";
    } else if (status === 'error') {
        statusColor = "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400";
        StatusIcon = XCircle;
        statusText = "Outage";
    } else if (status === 'not_configured') {
        statusColor = "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400";
        StatusIcon = AlertTriangle;
        statusText = "Not Configured";
    }

    return (
        <div className="flex items-center justify-between p-4 rounded-xl bg-zinc-50 dark:bg-zinc-800/30 border border-zinc-100 dark:border-zinc-800/50">
            <div className="flex items-center gap-3 text-zinc-700 dark:text-zinc-300">
                {icon}
                <span className="font-medium">{label}</span>
            </div>
            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wide ${statusColor}`}>
                <StatusIcon className="w-3.5 h-3.5" />
                {statusText}
            </div>
        </div>
    );
}
