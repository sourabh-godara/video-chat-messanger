import { fetchFriends } from '@/actions/friend-action'
import { FriendType } from '@/types'
import { create } from 'zustand'

interface FriendState {
  friends: FriendType[]
  error: string | null
  isLoading: boolean
  setFriends: (friends: FriendType[]) => void
  removeFriend: (friendId: string) => Promise<void>
  hydrate: () => Promise<void>
}

const useFriendsStore = create<FriendState>()((set, get) => ({
  friends: [],
  isLoading: true,
  friendRequests: { receivedRequests: [], sentRequests: [] },
  error: null,
  //Not Working Error:Invariant: missing action dispatcher
  hydrate: async () => {
    try {
      const res = await fetchFriends()
      set(state => ({
        ...state,
        friends: res,
        isLoading: false,
        error: null
      }))
    } catch (error) {
      set({
        error:
          error instanceof Error ? error.message : 'Failed to fetch friends',
        isLoading: false
      })
    } finally {
      set({ isLoading: false })
    }
  },
  setFriends: friends => {
    set({ friends: friends })
    set({ isLoading: false })
  },
  removeFriend: async friendId => {
    const currentState = get()
    try {
      set(state => ({
        friends: state.friends.filter(f => f.id !== friendId)
      }))
      //await removeFriendAPI(friendId)
    } catch (error) {
      // Rollback on failure
      set({
        ...currentState,
        error:
          error instanceof Error ? error.message : 'Failed to remove friend'
      })
    }
  }
}))

//Not Working Error:Invariant: missing action dispatcher Resolved using setTimeout

setTimeout(() => {
  useFriendsStore.getState().hydrate()
}, 100)

useFriendsStore.subscribe(state => {
  console.log('Friends Store Updated:', state)
})
export default useFriendsStore
