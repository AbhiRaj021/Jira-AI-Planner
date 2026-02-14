
import React from 'react';
import { useSortable, SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { Plus } from 'lucide-react';
import { Task } from '../../types/plan';
import { SortableTaskItem } from './SortableTaskItem';

interface SortableTaskColumnProps {
    id: string;
    title: string;
    icon: React.ReactNode;
    tasks: Task[];
    color: 'blue' | 'green' | 'amber';
    onAddTask: () => void;
    onDeleteTask: (id: string) => void;
    onEditTask: (id: string, field: string, value: string) => void;
}

export function SortableTaskColumn({ id, title, icon, tasks, color, onAddTask, onDeleteTask, onEditTask }: SortableTaskColumnProps) {
    const { setNodeRef } = useSortable({ id, data: { type: 'Container' } });

    const colorStyles = {
        blue: { bg: 'bg-blue-50 dark:bg-blue-900/10', text: 'text-blue-700 dark:text-blue-300', border: 'border-blue-100 dark:border-blue-900/20' },
        green: { bg: 'bg-green-50 dark:bg-green-900/10', text: 'text-green-700 dark:text-green-300', border: 'border-green-100 dark:border-green-900/20' },
        amber: { bg: 'bg-amber-50 dark:bg-amber-900/10', text: 'text-amber-700 dark:text-amber-300', border: 'border-amber-100 dark:border-amber-900/20' },
    };

    const style = colorStyles[color as keyof typeof colorStyles];

    return (
        <div ref={setNodeRef} className={`space-y-4 rounded-2xl p-4 ${style.bg} border ${style.border} flex flex-col h-full min-h-[500px]`}>
            <div className={`flex items-center gap-2 text-sm font-bold uppercase tracking-wider ${style.text}`}>
                {icon} {title}
                <span className="ml-auto text-xs opacity-60 bg-white/50 px-2 py-0.5 rounded-full">{tasks.length}</span>
            </div>

            <SortableContext items={tasks.map((t) => t.id)} strategy={verticalListSortingStrategy}>
                <div className="space-y-3 flex-1">
                    {tasks.map((task) => (
                        <SortableTaskItem key={task.id} task={task} onDelete={onDeleteTask} onEdit={onEditTask} />
                    ))}
                </div>
            </SortableContext>

            <button
                onClick={onAddTask}
                className="w-full flex items-center justify-center gap-2 p-2 rounded-xl border border-dashed border-zinc-300 dark:border-zinc-700 text-zinc-500 hover:text-blue-500 hover:border-blue-300 transition-colors text-sm font-medium"
            >
                <Plus className="w-4 h-4" /> Add Task
            </button>
        </div>
    );
}
