
'use client';

import { useEffect } from 'react';
import { AlertCircle, RefreshCcw, Home } from 'lucide-react';
import { Button } from '../components/ui/Button';
import Link from 'next/link';
import { FullPageMessage } from '../components/shared/FullPageMessage';

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error(error);
    }, [error]);

    return (
        <FullPageMessage
            icon={AlertCircle}
            title="Something went wrong!"
            description="We encountered an unexpected error. Please try again later."
            iconColorClass="text-red-500"
            iconBgClass="bg-red-50 dark:bg-red-900/10"
        >
            <div className="flex gap-4">
                <Button variant="outline" onClick={() => reset()} leftIcon={<RefreshCcw className="w-4 h-4" />}>
                    Try again
                </Button>
                <Link href="/">
                    <Button variant="primary" leftIcon={<Home className="w-4 h-4" />}>
                        Go Home
                    </Button>
                </Link>
            </div>
        </FullPageMessage>
    );
}
