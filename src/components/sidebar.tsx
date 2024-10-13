import { Input } from './ui/input'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { FiUserPlus } from "react-icons/fi";
import { ThemeToggle } from './ThemeToogle'
import Link from 'next/link'
import { getServerSession } from 'next-auth'

const users = [
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
export default async function Sidebar() {
  const session = await getServerSession();
  return (
    <section className='h-[97vh] bg-zinc-50'>
      <div className='flex items-center justify-between p-4 gap-2'>
        <div className='flex cursor-pointer items-center justify-center gap-2 rounded-lg p-2 px-1'>
          <Avatar className=' size-10'>
            <AvatarImage src={session?.user?.image as string} />
            <AvatarFallback delayMs={600}>CN</AvatarFallback>
          </Avatar>
          <div className='flex-col text-sm'>
            <h2>{session?.user?.name}</h2>
            <span className='text-xs font-light dark:text-zinc-300'>
              {session?.user?.email}
            </span>
          </div>
        </div>
        <div className='flex items-center'>
          <div className='rounded-full p-2 hover:bg-accent'>
            <FiUserPlus size={21} />
          </div>
          <div>
            <ThemeToggle />
          </div>
        </div>
      </div>

      <div className='px-2'>
        <Input placeholder='Search' />
      </div>

      {!users && <h1 className='text-center font-normal p-2 mt-14 opacity-85 h-full'>No Friends!</h1>}

      {users?.map((user, index) => {
        return <Link href={`/chat/${user.id}`} key={user.id} className='duration-2200 mt-3 flex gap-3 rounded-md p-2 px-2 transition-colors hover:bg-accent'>
          <Avatar>
            <AvatarImage src={`https://randomuser.me/api/portraits/thumb/men/${index}.jpg`} />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>

          <div>
            <h3>{user.username}</h3>
            <div className='text-xs font-light dark:text-zinc-300'>{user.message}</div>
          </div>
        </Link>
      })}
    </section>
  )
}
