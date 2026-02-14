
import { create } from 'zustand';

interface SystemStatus {
    backend: 'operational' | 'degraded' | 'error';
    database: 'operational' | 'degraded' | 'error';
    llm: 'operational' | 'not_configured' | 'error';
    timestamp: string;
}

interface SystemState {
    status: SystemStatus | null;
    loading: boolean;
    error: string | null;
    checkStatus: () => Promise<void>;
}

export const useSystemStore = create<SystemState>((set) => ({
    status: null,
    loading: false,
    error: null,

    checkStatus: async () => {
        set({ loading: true, error: null });
        try {
            const res = await fetch('/api/status');
            if (res.ok) {
                const data = await res.json();
                set({ status: data });
            } else {
                set({
                    error: 'Failed to fetch status', status: {
                        backend: 'error',
                        database: 'error',
                        llm: 'error',
                        timestamp: new Date().toISOString()
                    }
                });
            }
        } catch (err) {
            console.error('Failed to fetch status', err);
            set({
                error: 'Network error',
                status: {
                    backend: 'error',
                    database: 'error',
                    llm: 'error',
                    timestamp: new Date().toISOString()
                }
            });
        } finally {
            set({ loading: false });
        }
    }
}));
