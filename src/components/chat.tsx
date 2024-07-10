'use client'
import * as React from 'react'
import { Check, Plus, Send } from 'lucide-react'

import { cn } from '@/lib/utils'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { Input } from '@/components/ui/input'

export function Chat() {
  const [messages, setMessages] = React.useState([
    {
      role: 'agent',
      content: 'Hi, how can I help you today?'
    },
    {
      role: 'user',
      content: "Hey, I'm having trouble with my account."
    },
    {
      role: 'agent',
      content: 'What seems to be the problem?'
    },
    {
      role: 'user',
      content: "I can't log in."
    }
  ])
  const [input, setInput] = React.useState('')
  const inputLength = input.trim().length

  return (
    <>
      <Card className='relative flex h-full w-full flex-col justify-between '>
        <CardHeader className='flex h-16 flex-row items-center border'>
          <div className='flex items-center space-x-4'>
            <Avatar>
              <AvatarImage src='/avatars/01.png' alt='Image' />
              <AvatarFallback>OM</AvatarFallback>
            </Avatar>
            <div>
              <p className='text-sm font-medium leading-none'>Sofia Davis</p>
              <p className='text-sm text-muted-foreground'>m@example.com</p>
            </div>
          </div>
        </CardHeader>
        <CardContent className='flex-1 py-1'>
          <div className='space-y-4'>
            {messages.map((message, index) => (
              <div
                key={index}
                className={cn(
                  'flex w-max max-w-[75%] flex-col gap-2 rounded-lg px-3 py-2 text-sm',
                  message.role === 'user'
                    ? 'ml-auto bg-primary text-primary-foreground'
                    : 'bg-muted'
                )}
              >
                {message.content}
              </div>
            ))}
          </div>
        </CardContent>
        <CardFooter className='p-3'>
          <form className='flex w-full items-center space-x-2'>
            <Input
              id='message'
              placeholder='Type your message...'
              className='w-full'
              onChange={e => setInput(e.target.value)}
              autoComplete='off'
            />
            <Button type='submit' size='icon' disabled={inputLength === 0}>
              <Send className='h-4 w-4' />
              <span className='sr-only'>Send</span>
            </Button>
          </form>
        </CardFooter>
      </Card>
    </>
  )
}
