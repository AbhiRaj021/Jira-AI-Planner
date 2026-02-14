
export interface Task {
    id: string;
    title: string;
    description: string;
    type: string;
    complexity: string;
}

export interface InputTask {
    id?: string;
    title: string;
    description: string;
    type: string;
    complexity: string;
}

export interface UserStory {
    title: string;
    acceptanceCriteria: string[];
}

export interface Plan {
    _id?: string;
    featureName: string;
    goal: string;
    userStories: UserStory[];
    tasks: {
        frontend: Task[];
        backend: Task[];
        database: Task[];
    };
    risks: string[];
    assumptions: string[];
}

export interface InputPlan {
    _id?: string;
    featureName: string;
    goal: string;
    userStories: UserStory[];
    tasks: {
        frontend: InputTask[];
        backend: InputTask[];
        database: InputTask[];
    };
    risks: string[];
    assumptions: string[];
}
