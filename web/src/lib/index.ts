import { getServerSession } from 'next-auth'
import { authOptions } from './authOptions'

export async function getUserIdFromSession() {
  const session = await getServerSession(authOptions)
  if (!session?.user.id) {
    throw new Error('User is not authenticated')
  }
  return session.user.id
}
