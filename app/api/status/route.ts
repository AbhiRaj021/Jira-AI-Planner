
import { NextResponse } from 'next/server';
import dbConnect from '../../../lib/db';
import mongoose from 'mongoose';

export async function GET() {
    try {
        await dbConnect();
        const dbStatus = mongoose.connection.readyState === 1 ? 'operational' : 'error';

        const llmStatus = process.env.SAMBANOVA_API_KEY ? 'operational' : 'not_configured';

        return NextResponse.json({
            backend: 'operational',
            database: dbStatus,
            llm: llmStatus,
            timestamp: new Date().toISOString(),
        });
    } catch (error) {
        console.error('Status Check Error:', error);
        return NextResponse.json(
            {
                backend: 'operational',
                database: 'error',
                llm: 'unknown',
                error: 'System check failed'
            },
            { status: 500 }
        );
    }
}
