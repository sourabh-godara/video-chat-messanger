import React from 'react'
import { ResizablePanel, ResizablePanelGroup } from './ui/resizable'
import Sidebar from './sidebar'

export default function AppLayout({ children }: { children: React.ReactNode }) {
    return (
        <>
            <main className='m-auto max-w-[80rem] p-3'>
                <ResizablePanelGroup
                    direction='horizontal'
                    className='min-h-[200px] min-w-48 rounded-lg border-stone-200 bg-white text-stone-950 shadow-sm dark:border-stone-800 dark:bg-stone-950 dark:text-stone-50'
                >
                    <ResizablePanel className='hidden  md:inline' defaultSize={25}>
                        <Sidebar />
                    </ResizablePanel>
                    {/*  <ResizableHandle /> */}
                    <ResizablePanel defaultSize={75}>
                        <section className='h-[97vh]'>{children}</section>
                    </ResizablePanel>
                </ResizablePanelGroup>
            </main>
        </>
    )
}
