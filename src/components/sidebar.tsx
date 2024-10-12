import { Input } from './ui/input'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { IoIosNotificationsOutline } from 'react-icons/io'
import { ThemeToggle } from './ThemeToogle'
import Link from 'next/link'

const chats = [
  {
    id: '1',
    username: 'Sahil',
    image: 'https://picsum.photos/200',
    message: 'Hey there!',
    timestamp: '12:00 PM',
    unread: true
  },
  {
    id: '2',
    username: 'Ajay',
    image: 'https://picsum.photos/200',
    message: 'Hello!',
    timestamp: '11:59 PM',
    unread: false
  },
  {
    id: '3',
    username: 'Suresh',
    image: 'https://picsum.photos/200',
    message: 'Hi!',
    timestamp: '11:58 PM',
    unread: true
  },
  {
    id: '4',
    username: 'Raina Suresh Ji Cricket',
    image: 'https://picsum.photos/200',
    message: 'Hey there, I have a new message',
    timestamp: '11:57 PM',
    unread: false
  }
]
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


      {chats.map((chat, index) => {
        return <Link href={`/chat/${chat.id}`} key={index} className='duration-2200 mt-3 flex gap-3 rounded-md p-2 px-2 transition-colors hover:bg-accent'>
          <Avatar>
            <AvatarImage src={`https://randomuser.me/api/portraits/thumb/men/${index}.jpg`} />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>

          <div>
            <h3>{chat.username}</h3>
            <div className='text-xs font-light dark:text-zinc-300'>{chat.message}</div>
          </div>
        </Link>
      })}
    </section>
  )
}
