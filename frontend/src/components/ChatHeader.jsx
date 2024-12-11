import { MoreVertical } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useContext, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { updateConversation } from "@/slices/messageSlice";
import { SocketContext } from "@/context/SocketContext";

const ChatHeader = ({ currentChat, loginUser }) => {
  const [user, setUser] = useState(null);
  const dispatch = useDispatch();

  const { onlineUsers } = useContext(SocketContext);

  useEffect(() => {
    if (currentChat) {
      const user = currentChat.members.find((user) => user._id !== loginUser);
      setUser(user);
    }
  }, [currentChat]);

  const isOnline = onlineUsers?.some((u) => u.userId === user?._id);

  return (
    <div className="backdrop-brightness-125 p-2 flex items-center justify-between">
      <Dialog>
        <DialogTrigger>
          <div className="flex items-center">
            <div className="flex items-center justify-center uppercase bg-gray-800 text-white h-12 w-12 font-bold text-xl rounded-full">
              {user?.name[0]}
            </div>
            <h1 className="ml-2 text-white capitalize">{user?.name}</h1>
            {isOnline && (
              <span className="bg-green-400 w-3 h-3 rounded-full ml-2"></span>
            )}
          </div>
        </DialogTrigger>
        <DialogContent className="bg-gray-800 text-white">
          <DialogHeader>
            <DialogTitle>
              <div className="flex items-center">
                <div className="bg-gray-700 uppercase text-white h-12 w-12 rounded-full flex items-center justify-center">
                  {user?.name[0]}
                </div>
                <div className="ml-2 capitalize">
                  <h1>{user?.name}</h1>

                  <p className="mt-2 text-sm">{user?.phoneNumber}</p>
                </div>
              </div>
            </DialogTitle>
            <DialogDescription>
              This action cannot be undone. This will permanently delete your
              account and remove your data.
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>

      <DropdownMenu>
        <DropdownMenuTrigger className="outline-none">
          <MoreVertical color="white" />
        </DropdownMenuTrigger>
        <DropdownMenuContent className="bg-gray-800 text-white w-[200px]">
          <DropdownMenuItem onClick={() => dispatch(updateConversation(""))}>
            Close Chat
          </DropdownMenuItem>
          <DropdownMenuItem>Delete Chat</DropdownMenuItem>
          <DropdownMenuItem>Report Chat</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default ChatHeader;
