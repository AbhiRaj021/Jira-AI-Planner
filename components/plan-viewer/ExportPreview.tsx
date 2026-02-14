
import React from 'react';
import { FileText } from 'lucide-react';

interface ExportPreviewProps {
    markdown: string;
}

export function ExportPreview({ markdown }: ExportPreviewProps) {
    return (
        <div className="space-y-6">
            <div className="flex items-center gap-2 mb-4">
                <FileText className="w-5 h-5 text-zinc-500" />
                <h3 className="text-xl font-bold">Export Preview</h3>
            </div>
            <div className="p-6 rounded-2xl bg-zinc-50 dark:bg-zinc-950/50 border border-zinc-200 dark:border-zinc-800 font-mono text-sm overflow-auto max-h-[600px] whitespace-pre-wrap">
                {markdown}
            </div>
        </div>
    );
}
