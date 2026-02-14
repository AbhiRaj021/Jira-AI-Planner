'use client';

import Link from 'next/link';
import { FileQuestion, Home } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { FullPageMessage } from '../components/shared/FullPageMessage';

export default function NotFound() {
    return (
        <FullPageMessage
            icon={FileQuestion}
            title="Page Not Found"
            description="The page you are looking for doesn't exist or has been moved."
        >
            <Link href="/">
                <Button variant="primary" leftIcon={<Home className="w-4 h-4" />}>
                    Back to Home
                </Button>
            </Link>
        </FullPageMessage>
    );
}
