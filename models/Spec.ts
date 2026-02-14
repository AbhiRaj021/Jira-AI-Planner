
import mongoose from 'mongoose';

const TaskSchema = new mongoose.Schema({
    title: String,
    description: String,
    type: { type: String, enum: ['frontend', 'backend', 'database'] },
    complexity: { type: String, enum: ['low', 'medium', 'high'] },
});

const SpecSchema = new mongoose.Schema({
    title: { type: String, required: true },
    goal: { type: String, required: true },
    users: String,
    constraints: String,
    type: { type: String, enum: ['web', 'mobile', 'internal', 'service'], default: 'web' },
    userStories: [
        {
            title: String,
            acceptanceCriteria: [String]
        }
    ],
    tasks: {
        frontend: [TaskSchema],
        backend: [TaskSchema],
        database: [TaskSchema],
    },
    risks: [String],
    assumptions: [String],
    isExported: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Spec || mongoose.model('Spec', SpecSchema);
