
'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
    DndContext,
    closestCorners,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragOverlay,
    DragStartEvent,
    DragOverEvent,
    DragEndEvent,
} from '@dnd-kit/core';
import {
    arrayMove,
    sortableKeyboardCoordinates,
} from '@dnd-kit/sortable';

import { Plan, Task, InputPlan, InputTask } from '../../types/plan';
import { PlanHeader } from './PlanHeader';
import { KanbanBoard } from './KanbanBoard';
import { ExportPreview } from './ExportPreview';

import { usePlanStore } from '../../store/usePlanStore';

interface PlanViewerProps {
    plan: Plan;
    onBack: () => void;
    onViewModeChange?: (mode: 'kanban' | 'export') => void;
}

export function PlanViewer({ plan: propPlan, onBack, onViewModeChange }: PlanViewerProps) {
    const {
        generatedPlan: storePlan,
        isSaving,
        savePlanUpdates: handleSave,
        addTask: handleAddTask,
        deleteTask: handleDeleteTask,
        editTask: handleEditTask,
        reorderTasks,
        moveTask,
        updateLocalPlan
    } = usePlanStore();

    const plan = storePlan || propPlan;

    const [activeId, setActiveId] = useState<string | null>(null);
    const [activeTask, setActiveTask] = useState<Task | null>(null);
    const [viewMode, setViewMode] = useState<'kanban' | 'export'>('kanban');

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const generateMarkdown = () => {
        let md = `# Feature: ${plan.featureName}\n\n`;
        md += `**Goal**: ${plan.goal}\n\n`;

        md += `## User Stories\n`;
        plan.userStories.forEach(story => {
            md += `- ${story.title}\n`;
            story.acceptanceCriteria?.forEach(ac => {
                md += `  - ${ac}\n`;
            });
        });
        md += `\n`;

        md += `## Implementation Logic\n`;
        ['frontend', 'backend', 'database'].forEach(type => {
            const tasks = (plan.tasks as any)[type] as Task[];
            if (tasks.length > 0) {
                md += `### ${type.charAt(0).toUpperCase() + type.slice(1)}\n`;
                tasks.forEach(task => {
                    md += `- [ ] **${task.title}** (${task.complexity})\n`;
                    if (task.description) md += `  - ${task.description}\n`;
                });
                md += `\n`;
            }
        });

        if (plan.risks.length > 0) {
            md += `## Risks\n`;
            plan.risks.forEach(risk => md += `- ${risk}\n`);
            md += `\n`;
        }

        return md;
    };

    const handleCopyMarkdown = async () => {
        const md = generateMarkdown();
        await handleSave({ isExported: true });
        await navigator.clipboard.writeText(md);
        alert('Copied to clipboard and saved to history!');
    };

    const handleDownloadMarkdown = async () => {
        const md = generateMarkdown();
        await handleSave({ isExported: true });
        const blob = new Blob([md], { type: 'text/markdown' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${plan.featureName.replace(/\s+/g, '_').toLowerCase()}_spec.md`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        alert('Plan downloaded and saved to history!');
    };

    const handleSetViewMode = (mode: 'kanban' | 'export') => {
        setViewMode(mode);
        onViewModeChange?.(mode);
    };

    const findContainer = (id: string) => {
        if (id in plan.tasks) return id;
        if (plan.tasks.frontend.find(t => t.id === id)) return 'frontend';
        if (plan.tasks.backend.find(t => t.id === id)) return 'backend';
        if (plan.tasks.database.find(t => t.id === id)) return 'database';
        return null;
    };

    const handleDragStart = (event: DragStartEvent) => {
        const { active } = event;
        const id = active.id as string;
        const container = findContainer(id);
        if (container) {
            const task = (plan.tasks as any)[container].find((t: Task) => t.id === id);
            setActiveId(id);
            setActiveTask(task);
        }
    };

    const handleDragOver = (event: DragOverEvent) => {
        const { active, over } = event;
        if (!over) return;

        const activeId = active.id as string;
        const overId = over.id as string;

        const activeContainer = findContainer(activeId);
        const overContainer = findContainer(overId);

        if (!activeContainer || !overContainer || activeContainer === overContainer) {
            return;
        }

        let newIndex;
        const overItems = (plan.tasks as any)[overContainer];
        const overIndex = overItems.findIndex((t: Task) => t.id === overId);

        if (overId in plan.tasks) {
            newIndex = overItems.length + 1;
        } else {
            const isBelowOverItem =
                over &&
                active.rect.current.translated &&
                active.rect.current.translated.top >
                over.rect.top + over.rect.height;

            const modifier = isBelowOverItem ? 1 : 0;
            newIndex = overIndex >= 0 ? overIndex + modifier : overItems.length + 1;
        }

        moveTask(activeId, overId, activeContainer, overContainer, newIndex);
    };

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        const activeId = active.id as string;
        const overId = over ? over.id as string : null;

        if (!overId) {
            setActiveId(null);
            setActiveTask(null);
            return;
        }

        const activeContainer = findContainer(activeId);
        const overContainer = findContainer(overId);

        if (activeContainer && overContainer && activeContainer === overContainer) {
            const activeIndex = (plan.tasks as any)[activeContainer].findIndex((t: Task) => t.id === activeId);
            const overIndex = (plan.tasks as any)[overContainer].findIndex((t: Task) => t.id === overId);

            if (activeIndex !== overIndex) {
                reorderTasks(activeContainer, activeIndex, overIndex);
            }
        }

        setActiveId(null);
        setActiveTask(null);
    };

    if (!plan) return null;

    return (
        <DndContext
            sensors={sensors}
            collisionDetection={closestCorners}
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDragEnd={handleDragEnd}
        >
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-8"
            >
                <div className="bg-white dark:bg-zinc-900/50 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/20 space-y-8">
                    <PlanHeader
                        plan={plan}
                        setPlan={(updater: any) => {
                            if (typeof updater === 'function') {
                                updateLocalPlan(updater(plan));
                            } else {
                                updateLocalPlan(updater);
                            }
                        }}
                        viewMode={viewMode}
                        onBack={onBack}
                        handleSave={handleSave}
                        isSaving={isSaving}
                        handleSetViewMode={handleSetViewMode}
                        handleCopyMarkdown={handleCopyMarkdown}
                        handleDownloadMarkdown={handleDownloadMarkdown}
                    />

                    {viewMode === 'kanban' ? (
                        <KanbanBoard
                            plan={plan}
                            handleAddTask={handleAddTask}
                            handleDeleteTask={handleDeleteTask}
                            handleEditTask={handleEditTask}
                        />
                    ) : (
                        <ExportPreview markdown={generateMarkdown()} />
                    )}
                </div>
            </motion.div>

            <DragOverlay>
                {activeTask ? (
                    <div className="p-3 rounded-xl bg-white dark:bg-zinc-800 shadow-xl border border-blue-500 rotate-2 cursor-grabbing w-[300px]">
                        <div className="font-semibold text-sm">{activeTask.title}</div>
                        <div className="text-xs text-zinc-500">{activeTask.description}</div>
                    </div>
                ) : null}
            </DragOverlay>
        </DndContext>
    );
}
