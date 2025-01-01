'use client'

import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { useEffect } from 'react'

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string }
    reset: () => void
}) {
    useEffect(() => {
        console.error(error)
    }, [error])

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8 text-center">
                <div>
                    <svg
                        className="mx-auto h-24 w-24 text-gray-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        aria-hidden="true"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                    </svg>
                    <h2 className="mt-6 text-3xl font-extrabold text-gray-900">Oops! Something went wrong</h2>
                    <p className="mt-2 text-sm text-gray-600">Return to <Link href="/" className="font-medium text-indigo-600 hover:text-indigo-500">
                        Home
                    </Link> </p>
                </div>
                <div className="mt-8 space-y-6">
                    <Button onClick={() => reset()} className="w-full">
                        Try Again
                    </Button>
                    <p className="mt-2 text-sm text-gray-500">
                        Report this to owner {" "}
                        <Link href="/contact" className="font-medium text-indigo-600 hover:text-indigo-500">
                            contact support
                        </Link>
                        .
                    </p>
                </div>
            </div>
        </div>
    )
}