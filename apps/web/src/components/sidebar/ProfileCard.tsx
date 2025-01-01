'use client'
import React from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { signOut, useSession } from 'next-auth/react';
export default function ProfileCard() {
    const { status, data } = useSession();
    if (status === "loading") {
        return null;
    }
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="ghost" className="flex-1 justify-start text-left font-normal">
                    <div className="flex items-center">
                        <Avatar className=' size-9'>
                            <AvatarImage src={data?.user?.image as string} />
                            <AvatarFallback delayMs={600}>{data?.user?.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div className="ml-2">
                            <p className="text-sm font-medium leading-none">{data?.user?.name}</p>
                            <p className="text-xs text-muted-foreground">{data?.user?.email}</p>
                        </div>
                    </div>
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>User Profile</DialogTitle>
                </DialogHeader>
                <div className="flex items-center space-x-4">
                    <Avatar className="h-20 w-20">
                        <AvatarImage src={data?.user?.image as string} alt={'profile'} />
                        <AvatarFallback>{'SG'}</AvatarFallback>
                    </Avatar>
                    <div>
                        <h2 className="text-xl font-bold">{data?.user?.name}</h2>
                        <p className="text-sm text-muted-foreground">{data?.user?.email}</p>
                    </div>
                    <div>
                        <Button onClick={async () => await signOut()}>
                            Log Out
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}
