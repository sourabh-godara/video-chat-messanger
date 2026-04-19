import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import UserItem from "../ui/user-item";

export default function ChatList() {
  const friends = [{ id: "1", name: "John Doe", image: "https://placehold.co/64x64", email: "john.doe@example.com" }];
  return (
    <>
      <Suspense fallback={<LoadingSkeleton />}>
        {friends?.map((friend) => (
          <UserItem key={friend.id} friend={friend} />
        ))}
        {friends.length === 0 && (
          <div className="text-sm text-center text-gray-600">
            No Friends {`:(`}
          </div>
        )}
      </Suspense>
    </>
  );
}

function LoadingSkeleton() {
  return (
    <div className="space-y-2">
      {[...Array(3)].map((_, index) => (
        <div
          key={index}
          className="w-full rounded-lg p-4 flex items-center space-x-4"
        >
          <Skeleton className="h-10 w-10 rounded-full" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-[200px]" />
            <Skeleton className="h-4 w-[150px]" />
          </div>
        </div>
      ))}
    </div>
  );
}
