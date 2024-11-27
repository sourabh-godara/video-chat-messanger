import React from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { ChatType } from '@/types'
import { IoIosArrowBack } from "react-icons/io";
import Link from 'next/link'

interface ChatHeaderProps {
    user: ChatType['user']
}

export default function ChatHeader({ user }: ChatHeaderProps) {
    return (
        <header className="border-b border-border p-4 flex items-center justify-between">
            <div className="flex items-center space-x-4">
                <div className='flex items-center justify-center gap-2'>
                    <Link href={'/'} className='block md:hidden'>
                        <IoIosArrowBack size={26} />
                    </Link>

                    <Avatar className="h-9 w-9">
                        <AvatarImage src={'/avatar.png'} alt={'user-image'} />
                        <AvatarFallback>{'SS'}</AvatarFallback>
                    </Avatar>
                </div>

                <div>
                    <h2 className="text-sm font-medium">{user?.name}</h2>
                    <p className="text-sm text-muted-foreground">{user?.email}</p>
                </div>
            </div>
        </header>
    )
}
