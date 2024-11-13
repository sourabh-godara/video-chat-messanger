import { respondToFriendRequest } from '@/actions/friend-action'
import { FriendRequestsType, FriendType } from '@/types'
import { FriendRequestStatus } from '@prisma/client'
import { create } from 'zustand'

interface RequestsState {
  friendRequests: FriendRequestsType
  isLoading: boolean
  error: string | null
  handleRequest: (
    requestId: string,
    status: FriendRequestStatus
  ) => Promise<void>
}
const useRequestsStore = create<RequestsState>()((set, get) => ({
  friendRequests: { receivedRequests: [], sentRequests: [] },
  isLoading: false,
  error: null,
  setRequests: (requests: FriendRequestsType) =>
    set({ friendRequests: requests }),
  handleRequest: async (requestId: string, status: FriendRequestStatus) => {
    const currentState = get()
    try {
      if (status === FriendRequestStatus.ACCEPTED) {
        const request = currentState.friendRequests.receivedRequests.find(
          request => request.id === requestId
        )

        if (request) {
          const newFriend: FriendType = {
            id: request.sender.id,
            name: request.sender.name,
            email: request.sender.email,
            image: request.sender.image
          }

          /* set(state => ({
            friends: [...state.friends, newFriend],
            friendRequests: {
              ...state.friendRequests,
              receivedRequests: state.friendRequests.receivedRequests.filter(
                r => r.id !== requestId
              )
            }
          })) */
        }
      } else {
        set(state => ({
          friendRequests: {
            ...state.friendRequests,
            receivedRequests: state.friendRequests.receivedRequests.filter(
              r => r.id !== requestId
            )
          }
        }))
      }

      await respondToFriendRequest(requestId, status)
    } catch (error) {
      set({
        ...currentState,
        error:
          error instanceof Error
            ? error.message
            : 'Failed to respond to friend request'
      })
    }
  }
}))
export default useRequestsStore
