import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { IoIosNotificationsOutline } from 'react-icons/io'
import { ThemeToggle } from '@/components/ThemeToogle'

export default function Sidebar() {
  return (
    <section className='h-[97vh]'>
      <div className='flex items-center justify-between p-4'>
        <div className='flex cursor-pointer items-center justify-center gap-2 rounded-lg p-2 px-1'>
          <Avatar className=' size-10'>
            <AvatarImage src='https://github.com/shadcn.png' />
            <AvatarFallback delayMs={600}>CN</AvatarFallback>
          </Avatar>
          <div className='flex-col text-sm'>
            <h2>Ajay</h2>
            <span className='text-xs font-light dark:text-zinc-300'>
              @5823138
            </span>
          </div>
        </div>
        <div className='flex gap-1'>
          <div className='rounded-full p-1.5 hover:bg-accent'>
            <IoIosNotificationsOutline size={24} />
          </div>
          <div>
            <ThemeToggle />
          </div>
        </div>
      </div>

      <div className='px-2'>
        <Input placeholder='Search' />
      </div>

      <div className='duration-2200 mt-3 flex gap-3 rounded-md p-2 px-2 transition-colors hover:bg-accent'>
        <Avatar>
          <AvatarImage src='https://github.com/shadcn.png' />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>

        <div>
          <h3>Joe</h3>
          <div className='text-xs font-light dark:text-zinc-300'>Hey!!!</div>
        </div>
      </div>
    </section>
  )
}
