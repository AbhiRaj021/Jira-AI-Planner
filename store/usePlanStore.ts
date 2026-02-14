
import { create } from 'zustand';
import { Plan, Task, InputPlan } from '../types/plan';
import { arrayMove } from '@dnd-kit/sortable';

interface PlanState {
    formData: {
        featureName: string;
        goal: string;
        targetUsers: string;
        constraints: string;
        type: string;
        risks: string;
    };
    generatedPlan: Plan | null;
    history: any[];
    isLoading: boolean;
    isSaving: boolean;
    error: string | null;
    currentStep: number;

    // Actions
    setFormData: (data: any) => void;
    resetForm: () => void;
    setCurrentStep: (step: number) => void;

    // API Actions
    generatePlan: () => Promise<void>;
    fetchHistory: () => Promise<void>;
    selectPlan: (id: string) => Promise<void>;
    savePlanUpdates: (extraUpdates?: any) => Promise<void>;

    // local plan manipulation
    updateLocalPlan: (updates: Partial<Plan>) => void;
    editTask: (taskId: string, field: string, value: string) => void;
    deleteTask: (taskId: string) => void;
    addTask: (column: 'frontend' | 'backend' | 'database') => void;
    reorderTasks: (container: string, activeIndex: number, overIndex: number) => void;
    moveTask: (activeId: string, overId: string, activeContainer: string, overContainer: string, newIndex: number) => void;
}

const initialFormData = {
    featureName: '',
    goal: '',
    targetUsers: '',
    constraints: '',
    type: 'web',
    risks: '',
};

export const usePlanStore = create<PlanState>((set, get) => ({
    formData: initialFormData,
    generatedPlan: null,
    history: [],
    isLoading: false,
    isSaving: false,
    error: null,
    currentStep: 1,

    setFormData: (data) => set((state) => ({
        formData: { ...state.formData, ...data }
    })),

    resetForm: () => set({
        formData: initialFormData,
        generatedPlan: null,
        currentStep: 1,
        error: null
    }),

    setCurrentStep: (step) => set({ currentStep: step }),

    generatePlan: async () => {
        const { formData } = get();
        set({ isLoading: true, error: null, generatedPlan: null });
        try {
            const response = await fetch('/api/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            if (!response.ok) throw new Error('Failed to generate plan');

            const data = await response.json();
            set({ generatedPlan: data, currentStep: 2 });
        } catch (err) {
            set({ error: 'Something went wrong. Please try again.' });
            console.error(err);
        } finally {
            set({ isLoading: false });
        }
    },

    fetchHistory: async () => {
        set({ isLoading: true, error: null });
        try {
            const res = await fetch('/api/specs/recent');
            if (res.ok) {
                const data = await res.json();
                set({ history: data });
            } else {
                set({ error: 'Failed to fetch history' });
            }
        } catch (err) {
            set({ error: 'Network error' });
        } finally {
            set({ isLoading: false });
        }
    },

    selectPlan: async (id: string) => {
        set({ isLoading: true });
        try {
            const res = await fetch(`/api/specs/${id}`);
            if (res.ok) {
                const fullSpec = await res.json();
                const formattedPlan: Plan = {
                    _id: fullSpec._id,
                    featureName: fullSpec.title,
                    goal: fullSpec.goal,
                    userStories: fullSpec.userStories || [],
                    tasks: {
                        frontend: (fullSpec.tasks?.frontend || []).map((t: any) => ({ ...t, id: t.id || Math.random().toString(36).substr(2, 9) })),
                        backend: (fullSpec.tasks?.backend || []).map((t: any) => ({ ...t, id: t.id || Math.random().toString(36).substr(2, 9) })),
                        database: (fullSpec.tasks?.database || []).map((t: any) => ({ ...t, id: t.id || Math.random().toString(36).substr(2, 9) })),
                    },
                    risks: fullSpec.risks || [],
                    assumptions: fullSpec.assumptions || []
                };
                set({ generatedPlan: formattedPlan, currentStep: 2 });
            }
        } catch (err) {
            console.error("Failed to load spec", err);
        } finally {
            set({ isLoading: false });
        }
    },

    savePlanUpdates: async (extraUpdates = {}) => {
        const { generatedPlan } = get();
        if (!generatedPlan?._id) return;
        set({ isSaving: true });
        try {
            await fetch(`/api/specs/${generatedPlan._id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    title: generatedPlan.featureName,
                    goal: generatedPlan.goal,
                    tasks: generatedPlan.tasks,
                    ...extraUpdates
                })
            });
        } catch (error) {
            console.error("Failed to save plan", error);
        } finally {
            set({ isSaving: false });
        }
    },

    updateLocalPlan: (updates) => set((state) => ({
        generatedPlan: state.generatedPlan ? { ...state.generatedPlan, ...updates } : null
    })),

    editTask: (taskId, field, value) => set((state) => {
        if (!state.generatedPlan) return state;
        const updateTasks = (tasks: Task[]) => tasks.map(t => t.id === taskId ? { ...t, [field]: value } : t);
        return {
            generatedPlan: {
                ...state.generatedPlan,
                tasks: {
                    frontend: updateTasks(state.generatedPlan.tasks.frontend),
                    backend: updateTasks(state.generatedPlan.tasks.backend),
                    database: updateTasks(state.generatedPlan.tasks.database),
                }
            }
        };
    }),

    deleteTask: (taskId) => set((state) => {
        if (!state.generatedPlan) return state;
        const filterTasks = (tasks: Task[]) => tasks.filter(t => t.id !== taskId);
        return {
            generatedPlan: {
                ...state.generatedPlan,
                tasks: {
                    frontend: filterTasks(state.generatedPlan.tasks.frontend),
                    backend: filterTasks(state.generatedPlan.tasks.backend),
                    database: filterTasks(state.generatedPlan.tasks.database),
                }
            }
        };
    }),

    addTask: (column) => set((state) => {
        if (!state.generatedPlan) return state;
        const newTask: Task = {
            id: Math.random().toString(36).substr(2, 9),
            title: 'New Task',
            description: 'Description here...',
            type: column,
            complexity: 'low'
        };
        return {
            generatedPlan: {
                ...state.generatedPlan,
                tasks: {
                    ...state.generatedPlan.tasks,
                    [column]: [...state.generatedPlan.tasks[column], newTask]
                }
            }
        };
    }),

    reorderTasks: (container, activeIndex, overIndex) => set((state) => {
        if (!state.generatedPlan) return state;
        const tasks = (state.generatedPlan.tasks as any)[container];
        return {
            generatedPlan: {
                ...state.generatedPlan,
                tasks: {
                    ...state.generatedPlan.tasks,
                    [container]: arrayMove(tasks, activeIndex, overIndex)
                }
            }
        };
    }),

    moveTask: (activeId, overId, activeContainer, overContainer, newIndex) => set((state) => {
        if (!state.generatedPlan) return state;
        const activeItems = (state.generatedPlan.tasks as any)[activeContainer];
        const activeItem = activeItems.find((t: Task) => t.id === activeId);

        return {
            generatedPlan: {
                ...state.generatedPlan,
                tasks: {
                    ...state.generatedPlan.tasks,
                    [activeContainer]: activeItems.filter((item: Task) => item.id !== activeId),
                    [overContainer]: [
                        ...(state.generatedPlan.tasks as any)[overContainer].slice(0, newIndex),
                        activeItem,
                        ...(state.generatedPlan.tasks as any)[overContainer].slice(newIndex)
                    ]
                }
            }
        };
    })
}));
