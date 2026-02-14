
'use client';

import React, { useEffect } from 'react';
import { StatusCard } from '../../components/status/StatusCard';
import { useSystemStore } from '../../store/useSystemStore';

export default function StatusPage() {
    const { status, loading, checkStatus } = useSystemStore();

    useEffect(() => {
        checkStatus();
    }, []);

    return (
        <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex items-center justify-center p-4">
            <StatusCard
                status={status as any}
                loading={loading}
                onRefresh={checkStatus}
            />
        </div>
    );
}
