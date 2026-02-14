
import React from 'react';
import { Users, ShieldAlert, Layers, Smartphone, Server, Database, AlertTriangle } from 'lucide-react';
import { Plan, Task } from '../../types/plan';
import { SortableTaskColumn } from './SortableTaskColumn';

interface KanbanBoardProps {
    plan: Plan;
    handleAddTask: (column: 'frontend' | 'backend' | 'database') => void;
    handleDeleteTask: (id: string) => void;
    handleEditTask: (id: string, field: string, value: string) => void;
}

export function KanbanBoard({ plan, handleAddTask, handleDeleteTask, handleEditTask }: KanbanBoardProps) {
    return (
        <>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="space-y-4">
                    <div className="flex items-center gap-2 mb-2">
                        <Users className="w-5 h-5 text-blue-500" />
                        <h3 className="text-lg font-bold">User Stories</h3>
                    </div>
                    <div className="space-y-3">
                        {plan.userStories.map((story, i) => (
                            <div key={i} className="p-4 rounded-xl bg-zinc-50 dark:bg-zinc-800/30 border border-zinc-200 dark:border-zinc-700/50">
                                <p className="font-medium text-sm text-zinc-800 dark:text-zinc-200">{story.title}</p>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="space-y-4">
                    <div className="flex items-center gap-2 mb-2">
                        <ShieldAlert className="w-5 h-5 text-amber-500" />
                        <h3 className="text-lg font-bold">Risks</h3>
                    </div>
                    <ul className="space-y-2">
                        {plan.risks.map((risk, i) => (
                            <li key={i} className="flex items-start gap-3 p-3 rounded-lg bg-amber-50/50 text-sm text-zinc-700">
                                <AlertTriangle className="w-4 h-4 text-amber-500 mt-0.5" />
                                {risk}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            <div className="pt-8 border-t border-zinc-100 dark:border-zinc-800/50">
                <div className="flex items-center gap-2 mb-6">
                    <Layers className="w-5 h-5 text-purple-600" />
                    <h3 className="text-xl font-bold">Implementation Plan - Task Board</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <SortableTaskColumn
                        id="frontend"
                        title="Frontend"
                        icon={<Smartphone className="w-4 h-4" />}
                        tasks={plan.tasks.frontend}
                        color="blue"
                        onAddTask={() => handleAddTask('frontend')}
                        onDeleteTask={handleDeleteTask}
                        onEditTask={handleEditTask}
                    />
                    <SortableTaskColumn
                        id="backend"
                        title="Backend"
                        icon={<Server className="w-4 h-4" />}
                        tasks={plan.tasks.backend}
                        color="green"
                        onAddTask={() => handleAddTask('backend')}
                        onDeleteTask={handleDeleteTask}
                        onEditTask={handleEditTask}
                    />
                    <SortableTaskColumn
                        id="database"
                        title="Database"
                        icon={<Database className="w-4 h-4" />}
                        tasks={plan.tasks.database}
                        color="amber"
                        onAddTask={() => handleAddTask('database')}
                        onDeleteTask={handleDeleteTask}
                        onEditTask={handleEditTask}
                    />
                </div>
            </div>
        </>
    );
}
