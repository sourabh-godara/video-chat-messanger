import React from 'react'
import Sidebar from './sidebar'

export default function AppLayout({ children }: { children: React.ReactNode }) {

    return (
        <>
            <main className='m-auto max-w-[80rem] p-3 flex h-screen bg-background'>
                <Sidebar />
                {children}
            </main>
        </>
    )
}
