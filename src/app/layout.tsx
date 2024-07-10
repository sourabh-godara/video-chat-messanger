import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from '@/components/ui/theme-provider'
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup
} from '@/components/ui/resizable'
import Sidebar from '@/components/sidebar'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'ChatterBox',
  description: 'Chat & Video Call Functionality'
}

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang='en' suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute='class'
          defaultTheme='system'
          enableSystem
          disableTransitionOnChange
        >
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
        </ThemeProvider>
      </body>
    </html>
  )
}
