
import { z } from 'zod';

export const TaskSchema = z.object({
    title: z.string().describe("Concise title of the engineering task"),
    description: z.string().describe("Detailed description of what needs to be done"),
    type: z.enum(['frontend', 'backend', 'database']).describe("The domain of the task"),
    complexity: z.enum(['low', 'medium', 'high']).describe("Estimated complexity"),
});

export const UserStorySchema = z.object({
    title: z.string().describe("As a [user], I want [feature], so that [benefit]"),
    acceptanceCriteria: z.array(z.string()).describe("List of criteria to verify the story"),
});

export const PlanSchema = z.object({
    featureName: z.string(),
    goal: z.string(),
    userStories: z.array(UserStorySchema).describe("List of user stories for the feature"),
    tasks: z.object({
        frontend: z.array(TaskSchema).describe("List of frontend tasks"),
        backend: z.array(TaskSchema).describe("List of backend tasks"),
        database: z.array(TaskSchema).describe("List of database tasks"),
    }),
    risks: z.array(z.string()).describe("Potential risks and unknowns"),
    assumptions: z.array(z.string()).describe("Assumptions made during planning"),
});

export type Plan = z.infer<typeof PlanSchema>;
