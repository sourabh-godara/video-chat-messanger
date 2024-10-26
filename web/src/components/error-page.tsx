'use client'
import React from 'react'
import { Button } from "./ui/button";

interface Props {
    error: Error
    reset: () => void
}
export default function ErrorPage({ error, reset }: Props) {
    return (
        <>
            <Button onClick={reset}>Retry</Button>
        </>

    )
}
