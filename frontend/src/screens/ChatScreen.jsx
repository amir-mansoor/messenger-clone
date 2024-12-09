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
import {
  setMessages,
  clearMessages,
  updateConversation,
  appendMessage,
} from "@/slices/messageSlice";
import { useContext, useEffect, useRef, useState } from "react";
import { useLogoutMutation } from "@/slices/userApiSlice";
import { useNavigate } from "react-router-dom";
import { logoutReducer } from "@/slices/authSlice";
import { useGetChatsQuery } from "@/slices/chatApiSlice";
import {
  useGetMessagesQuery,
  useSendMessageMutation,
} from "@/slices/messageApiSlice";
import { toast } from "react-toastify";
import ChatList from "@/components/ChatList";
import { SocketContext } from "@/context/SocketContext";

const ChatScreen = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { socket } = useContext(SocketContext);

  const { messages, chatId } = useSelector((state) => state.messages);
  const { userInfo } = useSelector((state) => state.auth);

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (messages.length > 0) {
      scrollToBottom();
    }
  }, [messages, chatId]);

  const [sendMessage] = useSendMessageMutation();
  const [text, setText] = useState("");
  const [arivalMessage, setArivalMessage] = useState(null);

  const [logout] = useLogoutMutation();

  const { data: chats } = useGetChatsQuery();

  const { data: messagesData, refetch } = useGetMessagesQuery(
    { chatId },
    { skip: !chatId, refetchOnMountOrArgChange: true } // Only fetch if chatId exists
  );

  useEffect(() => {
    if (messagesData) {
      dispatch(setMessages(messagesData));
    }
  }, [messagesData, dispatch]);

  const updateChat = async (conversationId) => {
    dispatch(clearMessages());

    dispatch(updateConversation(conversationId));
    refetch();
  };

  useEffect(() => {
    socket.on("getMessage", (data) => {
      setArivalMessage(data);
    });
  }, []);

  const currentChat = chats?.find((chat) => chat._id === chatId);

  useEffect(() => {
    if (arivalMessage) {
      const userExists = currentChat.members.find(
        (user) => user._id === arivalMessage.sender
      );
      if (userExists) {
        console.log(arivalMessage);
        dispatch(appendMessage(arivalMessage));
      }
    }
  }, [arivalMessage, currentChat]);

  const handleMessage = async (e) => {
    e.preventDefault();

    const receiverId = currentChat?.members.filter(
      (member) => member._id !== userInfo.id
    );

    try {
      const res = await sendMessage({ text, conversationId: chatId }).unwrap();
      dispatch(appendMessage({ ...res }));

      socket.emit("sendMessage", {
        receiverId: receiverId[0]._id,
        senderId: userInfo.id,
        text,
      });

      setText("");
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  const handleLogout = async () => {
    try {
      const res = await logout();
      dispatch(logoutReducer());
      dispatch(clearMessages());
      navigate("/");
    } catch (err) {
      console.log(err?.data?.message || err.error);
    }
  };

  return (
    <div className="flex overflow-y-hidden">
      {/* Left Pane */}
      <div className="flex-[0.2] w-full p-2 bg-gray-800 text-white overflow-y-auto h-screen">
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

        <ChatList
          userInfo={userInfo}
          chats={chats}
          updateChat={updateChat}
          chatId={chatId}
        />
      </div>

      {/* Right Pane (Messages Box) */}
      <div className="flex-[0.8] bg-gray-700 flex flex-col h-screen">
        {chatId ? (
          <>
            {/* Header */}
            <div className="backdrop-brightness-125 p-2 flex items-center justify-between">
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

            {/* Scrollable Messages */}
            <div
              className="flex-1 overflow-y-auto p-4"
              style={{ minHeight: 0 }} // Ensures flex behavior works properly
            >
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex ${
                    message.sender === userInfo.id
                      ? "justify-end"
                      : "justify-start"
                  } p-2`}
                >
                  <div
                    className={`bg-gray-600 text-white p-3 rounded-lg max-w-[30%] h-auto break-words ${
                      message.role === "user" ? "bg-blue-600" : "bg-gray-500"
                    }`}
                  >
                    {message.text}
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Section */}
            <div className="w-full bg-gray-600 p-4">
              <form onSubmit={handleMessage} className="flex">
                <input
                  type="text"
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="Type a message..."
                  className="flex-1 bg-gray-700 text-white px-4 py-2 rounded-md outline-none"
                />
              </form>
            </div>
          </>
        ) : (
          <h1 className="text-5xl font-extrabold flex justify-center items-center mt-44 select-none text-gray-600">
            Select A Chat To Start Conversation
          </h1>
        )}
      </div>
    </div>
  );
};

export default ChatScreen;
