export function generatePrivateRoomId(senderId: string, receiverId: string) {
  const roomId = [senderId, receiverId].sort().join("_");
  return roomId;
}
