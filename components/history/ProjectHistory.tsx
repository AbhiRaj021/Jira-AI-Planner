
'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Clock, ArrowRight, FileText, Loader2, CheckCircle2, Trash2 } from 'lucide-react';

import { Plan } from '../../types/plan';

import { usePlanStore } from '../../store/usePlanStore';

interface HistoryItem {
    _id: string;
    title: string;
    description: string;
    createdAt: string;
    type: 'web' | 'mobile' | 'internal' | 'service';
    goal: string;
    isExported?: boolean;
}

export function ProjectHistory({ onSelect }: { onSelect?: (item: HistoryItem) => void }) {
    const { history: specs, isLoading: loading, error, fetchHistory, deleteHistoryItem } = usePlanStore();

    useEffect(() => {
        fetchHistory();
    }, []);

    const handleDelete = async (e: React.MouseEvent, id: string) => {
        e.stopPropagation();
        if (confirm('Are you sure you want to delete this plan?')) {
            await deleteHistoryItem(id);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12"
        >
            <div className="flex items-center justify-between mb-4 px-2">
                <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-zinc-400" />
                    <h3 className="text-sm font-semibold text-zinc-500 uppercase tracking-wider">Project History</h3>
                </div>
                <button
                    onClick={fetchHistory}
                    disabled={loading}
                    className="text-xs text-blue-500 hover:text-blue-600 transition-colors disabled:opacity-50 flex items-center gap-1"
                >
                    {loading && <Loader2 className="w-3 h-3 animate-spin" />}
                    {loading ? 'Refreshing...' : 'Refresh'}
                </button>
            </div>

            {error ? (
                <div className="p-4 rounded-xl bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/20 text-red-600 dark:text-red-400 text-xs text-center">
                    {error}. Click refresh to try again.
                </div>
            ) : (specs || []).length === 0 && !loading ? (
                <div className="p-8 rounded-2xl border border-dashed border-zinc-200 dark:border-zinc-800 text-center">
                    <FileText className="w-8 h-8 text-zinc-300 mx-auto mb-2" />
                    <p className="text-sm text-zinc-500 font-medium">No previous projects found</p>
                    <p className="text-xs text-zinc-400 mt-1">Generated plans will appear here</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                    {(specs || []).map((spec) => (
                        <div
                            key={spec._id}
                            onClick={() => onSelect?.(spec)}
                            className="group p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 hover:border-blue-500/30 hover:shadow-lg hover:shadow-blue-500/10 transition-all cursor-pointer relative"
                        >
                            <div className="flex justify-between items-start mb-2">
                                <div className="h-8 w-8 rounded-lg bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-500 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
                                    {spec.isExported ? <CheckCircle2 className="w-4 h-4" /> : <FileText className="w-4 h-4" />}
                                </div>
                                <div className="flex gap-2 items-center">
                                    <div className="flex flex-col items-end gap-1">
                                        <span className="text-[10px] font-medium text-zinc-400 bg-zinc-50 dark:bg-zinc-800/50 px-2 py-1 rounded-full text-nowrap">
                                            {new Date(spec.createdAt).toLocaleDateString()}
                                        </span>
                                        {spec.isExported && (
                                            <span className="text-[9px] font-bold text-green-600 bg-green-50 dark:bg-green-900/20 px-1.5 py-0.5 rounded uppercase tracking-tighter">
                                                Exported
                                            </span>
                                        )}
                                    </div>
                                    <button
                                        onClick={(e) => handleDelete(e, spec._id)}
                                        className="p-1.5 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-400 hover:bg-red-50 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100"
                                    >
                                        <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                </div>
                            </div>

                            <h4 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1 group-hover:text-blue-600 transition-colors line-clamp-1">
                                {spec.title}
                            </h4>
                            <p className="text-xs text-zinc-500 line-clamp-2 mb-3 h-8 text-wrap overflow-hidden">
                                {spec.goal}
                            </p>

                            <div className="flex items-center justify-between">
                                <div className="flex items-center text-xs font-medium text-blue-600 opacity-0 group-hover:opacity-100 transition-all transform translate-x-[-10px] group-hover:translate-x-0">
                                    View Plan <ArrowRight className="w-3 h-3 ml-1" />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </motion.div>
    );
}
