import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from '@/components/ui/theme-provider'
import { Toaster } from "@/components/ui/toaster"
import { getServerSession } from 'next-auth'
import { SocketProvider } from '@/context/SocketProvider'
import SessionProvider from '@/context/SessionProvider'
import { fetchFriends } from './actions/friend-action'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'ChatterBox',
  description: 'Chat & Video Call Functionality'
}

export default async function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  const session = await getServerSession();
  return (
    <html lang='en' suppressHydrationWarning>
      <body className={inter.className}>

        <ThemeProvider
          attribute='class'
          defaultTheme='system'
          enableSystem
          disableTransitionOnChange
        >
          <SocketProvider>
            <SessionProvider session={session}>
              {children}
              <Toaster />
            </SessionProvider>
          </SocketProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
