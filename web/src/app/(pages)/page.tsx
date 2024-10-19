'use client'
import FriendModal from '@/components/friend-modal';
import React, { useState } from 'react'

export default function Page() {

    return (
        <>
            <section className='flex h-full flex-col items-center justify-center rounded-lg border border-stone-200 dark:border-stone-800 dark:bg-stone-950'>
                <h2 className='scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0 md:text-4xl'>
                    Welcome to ChatterBox
                </h2>
                <p className='mx-4 px-6 leading-7 md:mx-14 md:px-16 [&:not(:first-child)]:mt-6'>
                    Stay connected anytime, anywhere with ChatterBox! Enjoy real-time text
                    chats, high-quality video calls, and secure communication all in one
                    easy-to-use platform. Join us and experience seamless, crystal-clear
                    conversations today!
                </p>
            </section>
        </>
    )
}
