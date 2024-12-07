import {
  LogOut,
  MessageSquareDiffIcon,
  MoreVertical,
  Search,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useDispatch, useSelector } from "react-redux";
import { addMessage } from "@/slices/messageSlice";
import { useState } from "react";
import { useLogoutMutation } from "@/slices/userApiSlice";
import { useNavigate } from "react-router-dom";
import { logoutReducer } from "@/slices/authSlice";

const ChatScreen = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [message, setMessage] = useState("");
  const { messages } = useSelector((state) => state.messages);

  const [logout] = useLogoutMutation();

  const handleMessage = (e) => {
    e.preventDefault();

    dispatch(addMessage({ message, role: "user" }));
  };

  const handleLogout = async () => {
    try {
      const res = await logout();
      dispatch(logoutReducer());
      navigate("/");
    } catch (err) {
      console.log(err?.data?.message || err.error);
    }
  };
  return (
    <div className="flex h-screen overflow-y-hidden">
      {/* Left Pane */}
      <div className="flex-[0.2] w-full p-2 bg-gray-800 text-white overflow-y-auto">
        <div className="flex justify-between items-center">
          <h1 className="font-bold text-xl">Chats</h1>
          <div className="flex space-x-2">
            <MessageSquareDiffIcon />
            <LogOut onClick={handleLogout} className="cursor-pointer" />
          </div>
        </div>

        <div className="flex items-center mt-4 bg-gray-400 px-2 py-1 rounded-md">
          <Search color="black" />
          <input
            type="text"
            placeholder="Search"
            className="w-full bg-transparent outline-none ml-2 text-black"
          />
        </div>

        <div>
          <div className="flex mt-5 items-center border-b border-b-gray-600 py-2 cursor-pointer hover:bg-gray-700">
            <div className="flex items-center justify-center bg-gray-600 text-white h-12 w-12 font-bold text-xl rounded-full">
              M
            </div>
            <h1 className="ml-2">0349 9519620</h1>
          </div>
        </div>
      </div>

      {/* Right Pane (Messages Box) */}
      <div className="flex-[0.8]  bg-gray-700">
        {/* Header */}
        <div className="backdrop-brightness-125 p-2 flex items-center justify-between ">
          <Dialog>
            <DialogTrigger>
              <div className="flex items-center">
                <div className="flex items-center justify-center bg-gray-800 text-white h-12 w-12 font-bold text-xl rounded-full">
                  M
                </div>

                <h1 className="ml-2 text-white">Amir Mansoor</h1>
              </div>
            </DialogTrigger>
            <DialogContent className="bg-gray-800 text-white">
              <DialogHeader>
                <DialogTitle>
                  <div className="flex items-center">
                    <div className="flex items-center justify-center bg-gray-700 text-white h-12 w-12 font-bold text-xl rounded-full">
                      M
                    </div>
                    <div className="ml-2">
                      <h1>Amir Mansoor</h1>
                      <p className="mt-2 font-thin text-sm">0349 9519620</p>
                    </div>
                  </div>
                </DialogTitle>
                <DialogDescription>
                  This action cannot be undone. This will permanently delete
                  your account and remove your data from our servers.
                </DialogDescription>
              </DialogHeader>
            </DialogContent>
          </Dialog>

          <DropdownMenu>
            <DropdownMenuTrigger className="outline-none">
              <MoreVertical color="white" />
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-gray-800 text-white w-[200px]">
              <DropdownMenuItem>Contact Info</DropdownMenuItem>
              <DropdownMenuItem>Close Chat</DropdownMenuItem>
              <DropdownMenuItem>Delete Chat</DropdownMenuItem>
              <DropdownMenuItem>Report Chat</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="pt-15 pb-36 overflow-y-auto h-screen ">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${
                message.role === "user" ? "justify-end" : "justify-start"
              } p-2`}
            >
              <div
                className={`bg-gray-600 text-white p-3 rounded-lg max-w-[30%] h-auto break-words ${
                  message.role === "user" ? "bg-blue-600" : "bg-gray-500"
                }`}
              >
                {message.message}
              </div>
            </div>
          ))}
        </div>

        {/* Input Section */}
        <div className="fixed bottom-0 w-full  bg-gray-600 p-4">
          <form onSubmit={handleMessage}>
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type a message..."
              className=" bg-gray-700 text-white w-[70%] px-4 py-2 rounded-md outline-none"
            />
          </form>
        </div>
      </div>
    </div>
  );
};

export default ChatScreen;
