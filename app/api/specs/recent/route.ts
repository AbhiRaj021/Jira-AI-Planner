
import { NextResponse } from 'next/server';
import dbConnect from '../../../../lib/db';
import Spec from '../../../../models/Spec';

export async function GET() {
    try {
        await dbConnect();

        const specs = await Spec.find({})
            .sort({ createdAt: -1 })
            .limit(5)
            .select('title goal createdAt type isExported');

        return NextResponse.json(specs);
    } catch (error) {
        console.error('Database Error:', error);
        return NextResponse.json(
            { error: 'Failed to fetch recent specs' },
            { status: 500 }
        );
    }
}
