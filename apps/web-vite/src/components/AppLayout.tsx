import { Outlet } from "react-router-dom";
import ProfileCard from "./sidebar/ProfileCard";
import AddFriendModal from "./sidebar/modal/AddFriendModal";
import SearchUser from "./sidebar/SearchUser";
import { Input } from "./ui/input";
import { ScrollArea } from "./ui/scroll-area";
import ChatList from "./sidebar/UserList";

export default function AppLayout() {
  return (
    <main className="m-auto max-w-[80rem] flex h-screen bg-background overflow-hidden">
      <div className="hidden md:flex">
        <Sidebar />
      </div>
      <div className="flex-1 flex flex-col min-w-0">
        <Outlet />
      </div>
    </main>
  );
}
export const Sidebar = () => (
  <div className="md:w-80 w-screen border-r border-border">
    <div className="p-4 space-y-4">
      <div className="flex items-center justify-between mr-4 md:mr-1">
        <ProfileCard />
        <AddFriendModal />
      </div>
      <div className="relative">
        <SearchUser />
        <Input placeholder="Search" className="pl-8" />
      </div>
    </div>
    <ScrollArea className="h-[calc(100vh-8rem)]">
      <ChatList />
    </ScrollArea>
  </div>
);
