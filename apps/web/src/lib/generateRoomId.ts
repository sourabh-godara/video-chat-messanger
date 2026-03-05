export function generateRoomId(userId: string, receiverId: string): string {
  return [userId, receiverId].sort().join("_");
}
