
'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Activity, Server, Database, Cpu, RefreshCw, ArrowLeft } from 'lucide-react';
import { Button } from '../ui/Button';
import { StatusItem } from './StatusItem';
import { useRouter } from 'next/navigation';

interface SystemStatus {
    backend: 'operational' | 'degraded' | 'error';
    database: 'operational' | 'degraded' | 'error';
    llm: 'operational' | 'not_configured' | 'error';
    timestamp: string;
}

interface StatusCardProps {
    status: SystemStatus | null;
    loading: boolean;
    onRefresh: () => void;
}

export function StatusCard({ status, loading, onRefresh }: StatusCardProps) {
    const router = useRouter();

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-lg bg-white dark:bg-zinc-900 rounded-3xl shadow-xl border border-zinc-200 dark:border-zinc-800 p-8"
        >
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-2xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600">
                        <Activity className="w-6 h-6" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">System Status</h1>
                        <p className="text-sm text-zinc-500">Real-time system health check</p>
                    </div>
                </div>
                <Button variant="ghost" size="sm" onClick={() => router.push('/')} className="text-zinc-500">
                    <ArrowLeft className="w-4 h-4" />
                </Button>
            </div>

            <div className="space-y-4">
                <StatusItem
                    label="Backend API"
                    icon={<Server className="w-5 h-5" />}
                    status={status?.backend}
                    loading={loading}
                />
                <StatusItem
                    label="Database (MongoDB)"
                    icon={<Database className="w-5 h-5" />}
                    status={status?.database}
                    loading={loading}
                />
                <StatusItem
                    label="AI Engine (SambaNova)"
                    icon={<Cpu className="w-5 h-5" />}
                    status={status?.llm}
                    loading={loading}
                />
            </div>

            <div className="mt-8 flex justify-center">
                <Button
                    variant="outline"
                    onClick={onRefresh}
                    isLoading={loading}
                    leftIcon={!loading && <RefreshCw className="w-4 h-4" />}
                >
                    Refresh Status
                </Button>
            </div>

            <div className="mt-6 text-center">
                <p className="text-xs text-zinc-400">
                    Last updated: {status?.timestamp ? new Date(status.timestamp).toLocaleTimeString() : '-'}
                </p>
            </div>
        </motion.div>
    );
}
