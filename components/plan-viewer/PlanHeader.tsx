
import React from 'react';
import { CheckCircle2, ArrowLeft, Save, FileText, Download, Plus } from 'lucide-react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Plan } from '../../types/plan';

interface PlanHeaderProps {
    plan: Plan;
    setPlan: React.Dispatch<React.SetStateAction<Plan>>;
    viewMode: 'kanban' | 'export';
    onBack: () => void;
    handleSave: (extraUpdates?: any) => Promise<void>;
    isSaving: boolean;
    handleSetViewMode: (mode: 'kanban' | 'export') => void;
    handleCopyMarkdown: () => void;
    handleDownloadMarkdown: () => void;
}

export function PlanHeader({
    plan,
    setPlan,
    viewMode,
    onBack,
    handleSave,
    isSaving,
    handleSetViewMode,
    handleCopyMarkdown,
    handleDownloadMarkdown
}: PlanHeaderProps) {
    return (
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between border-b border-zinc-100 dark:border-zinc-800/50 pb-6 gap-4">
            <div>
                <div className="flex items-center gap-3 mb-2">
                    <div className="h-10 w-10 rounded-xl bg-green-500/10 flex items-center justify-center text-green-600">
                        <CheckCircle2 className="w-5 h-5" />
                    </div>
                    <Input
                        value={plan.featureName}
                        onChange={(e) => setPlan(p => ({ ...p, featureName: e.target.value }))}
                        className="text-2xl font-bold bg-transparent border-transparent hover:border-zinc-200 focus:border-blue-500 px-0 h-auto py-0 w-auto min-w-[300px]"
                    />
                </div>
                <Input
                    value={plan.goal}
                    onChange={(e) => setPlan(p => ({ ...p, goal: e.target.value }))}
                    className="text-zinc-500 bg-transparent border-transparent hover:border-zinc-200 focus:border-blue-500 px-0 h-auto py-0 w-full"
                />
            </div>

            <div className="flex flex-wrap items-center gap-3 w-full md:w-auto mt-4 md:mt-0 justify-end">
                {viewMode === 'kanban' ? (
                    <>
                        <Button variant="outline" onClick={onBack} leftIcon={<ArrowLeft className="w-4 h-4" />} className="whitespace-nowrap">
                            Back
                        </Button>
                        <Button variant="outline" onClick={() => handleSave()} isLoading={isSaving} leftIcon={<Save className="w-4 h-4" />} className="whitespace-nowrap">
                            Save Changes
                        </Button>
                        <Button variant="primary" onClick={() => handleSetViewMode('export')} rightIcon={<ArrowLeft className="w-4 h-4 rotate-180" />} className="whitespace-nowrap">
                            Next: Export
                        </Button>
                    </>
                ) : (
                    <>
                        <Button variant="outline" onClick={() => handleSetViewMode('kanban')} leftIcon={<ArrowLeft className="w-4 h-4" />} className="whitespace-nowrap">
                            Back to Edit
                        </Button>
                        <div className="flex flex-wrap gap-2">
                            <Button variant="outline" onClick={handleCopyMarkdown} leftIcon={<FileText className="w-4 h-4" />} className="whitespace-nowrap">
                                Copy MD
                            </Button>
                            <Button variant="secondary" onClick={handleDownloadMarkdown} leftIcon={<Download className="w-4 h-4" />} className="whitespace-nowrap">
                                Download
                            </Button>
                            <Button variant="primary" onClick={onBack} leftIcon={<Plus className="w-4 h-4" />} className="whitespace-nowrap">
                                Build New
                            </Button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
