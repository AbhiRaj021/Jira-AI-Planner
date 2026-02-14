
import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, Trash2 } from 'lucide-react';
import { Task } from '../../types/plan';
import { ComplexityBadge } from './ComplexityBadge';

interface SortableTaskItemProps {
    task: Task;
    onDelete: (id: string) => void;
    onEdit: (id: string, field: string, value: string) => void;
}

export function SortableTaskItem({ task, onDelete, onEdit }: SortableTaskItemProps) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: task.id, data: { type: 'Task', task } });

    const style = {
        transform: CSS.Translate.toString(transform),
        transition,
        opacity: isDragging ? 0.3 : 1,
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            className="group p-3 rounded-xl bg-white dark:bg-zinc-800 shadow-sm border border-zinc-100 dark:border-zinc-700/50 hover:shadow-md transition-all duration-200"
        >
            <div className="flex gap-2 items-start">
                <button {...attributes} {...listeners} className="mt-1 cursor-grab active:cursor-grabbing text-zinc-400 hover:text-zinc-600">
                    <GripVertical className="w-4 h-4" />
                </button>
                <div className="flex-1 space-y-2">
                    <input
                        className="w-full bg-transparent font-semibold text-zinc-800 dark:text-zinc-200 text-sm focus:outline-none focus:border-b border-blue-500"
                        value={task.title}
                        onChange={(e) => onEdit(task.id, 'title', e.target.value)}
                    />
                    <textarea
                        className="w-full bg-transparent text-xs text-zinc-500 leading-relaxed resize-none focus:outline-none focus:border-b border-blue-500 min-h-[40px]"
                        value={task.description}
                        onChange={(e) => onEdit(task.id, 'description', e.target.value)}
                    />
                    <div className="flex justify-between items-center">
                        <ComplexityBadge level={task.complexity as any} />
                        <button
                            onClick={() => onDelete(task.id)}
                            className="p-1 hover:bg-red-50 text-zinc-400 hover:text-red-500 rounded transition-colors"
                        >
                            <Trash2 className="w-3 h-3" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
