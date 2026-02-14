
import { NextResponse } from 'next/server';
import dbConnect from '../../../../lib/db';
import Spec from '../../../../models/Spec';

export async function PATCH(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await dbConnect();
        const { id } = await params;
        const updates = await req.json();

        const updatedSpec = await Spec.findByIdAndUpdate(
            id,
            { $set: updates },
            { new: true }
        );

        if (!updatedSpec) {
            return NextResponse.json(
                { error: 'Spec not found' },
                { status: 404 }
            );
        }

        return NextResponse.json(updatedSpec);
    } catch (error) {
        console.error('Database Error:', error);
        return NextResponse.json(
            { error: 'Failed to update spec' },
            { status: 500 }
        );
    }
}

export async function GET(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await dbConnect();
        const { id } = await params;
        const spec = await Spec.findById(id);

        if (!spec) {
            return NextResponse.json(
                { error: 'Spec not found' },
                { status: 404 }
            );
        }

        return NextResponse.json(spec);
    } catch (error) {
        console.error('Database Error:', error);
        return NextResponse.json(
            { error: 'Failed to fetch spec' },
            { status: 500 }
        );
    }
}
