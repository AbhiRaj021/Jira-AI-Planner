
import { NextResponse } from 'next/server';
import { generatePlan } from '../../../lib/ai/generator';
import dbConnect from '../../../lib/db';
import Spec from '../../../models/Spec';

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { featureName, goal, targetUsers, constraints, type, risks } = body;

        if (!featureName || !goal) {
            return NextResponse.json(
                { error: 'Feature name and goal are required' },
                { status: 400 }
            );
        }


        const data = await generatePlan({
            name: featureName,
            goal,
            users: targetUsers || 'General users',
            constraints: constraints || 'None',
            type: type || 'web',
            risks,
        });


        try {
            await dbConnect();
            const newSpec = await Spec.create({
                title: data.featureName,
                goal: data.goal,
                users: targetUsers || 'General users',
                constraints: constraints,
                type: type,
                userStories: data.userStories,
                tasks: data.tasks,
                risks: data.risks,
                assumptions: data.assumptions
            });

            return NextResponse.json({ ...data, _id: newSpec._id });

        } catch (dbError) {
            console.error("Database Error:", dbError);

            return NextResponse.json({ ...data, warning: "Plan generated but failed to save to history." });
        }
    } catch (error) {
        console.error('API Error:', error);
        return NextResponse.json(
            { error: 'Failed to generate plan. Please try again.' },
            { status: 500 }
        );
    }
}
