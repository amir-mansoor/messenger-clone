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
import ChatHeader from "@/components/ChatHeader";

const ChatScreen = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [logout] = useLogoutMutation();

  const { data: chats } = useGetChatsQuery();

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
  const [searchQuery, setSearchQuery] = useState("");

  const filteredChats = chats?.filter((chat) => {
    const user = chat.members.find((member) => member._id !== userInfo.id);
    return user?.phoneNumber.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const {
    data: messagesData,
    refetch,
    isFetching,
  } = useGetMessagesQuery(
    { chatId },
    { skip: !chatId } // Only fetch if chatId exists
  );

  useEffect(() => {
    if (messagesData) {
      dispatch(setMessages(messagesData));
    }
  }, [messagesData, dispatch]);

  const updateChat = async (conversationId) => {
    if (chatId == conversationId) {
      return;
    }
    dispatch(clearMessages());

    dispatch(updateConversation(conversationId));
    refetch();
  };

  useEffect(() => {
    socket.on("getMessage", (data) => {
      setArivalMessage(data);
      scrollToBottom();
    });
  }, []);

  const currentChat = chats?.find((chat) => chat._id === chatId);

  useEffect(() => {
    if (arivalMessage) {
      const userExists = currentChat.members.find(
        (user) => user._id === arivalMessage.sender
      );
      if (userExists) {
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
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* <ChatList
          userInfo={userInfo}
          chats={chats}
          updateChat={updateChat}
          chatId={chatId}
        /> */}

        {filteredChats?.length === 0 && searchQuery ? (
          <p className="text-gray-500 text-center mt-4">No chats found</p>
        ) : (
          <ChatList
            userInfo={userInfo}
            chats={filteredChats}
            updateChat={updateChat}
            chatId={chatId}
          />
        )}
      </div>

      {/* Right Pane (Messages Box) */}
      <div className="flex-[0.8] bg-gray-700 flex flex-col h-screen">
        {chatId ? (
          <>
            {/* Header */}
            <ChatHeader currentChat={currentChat} loginUser={userInfo.id} />

            {/* Scrollable Messages */}
            {isFetching ? (
              <div className="flex-1 overflow-y-auto p-4">
                <div role="status" className="flex justify-center mt-10">
                  <svg
                    aria-hidden="true"
                    className="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
                    viewBox="0 0 100 101"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                      fill="currentColor"
                    />
                    <path
                      d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                      fill="currentFill"
                    />
                  </svg>
                  <span className="sr-only">Loading...</span>
                </div>
              </div>
            ) : (
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
                      className={`text-white p-3 rounded-lg max-w-[30%] h-auto break-words bg-blue-600`}
                    >
                      {message.text}
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
            )}

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
          <h1 className="text-5xl font-extrabold flex justify-center items-center mt-44 ml-10 select-none text-gray-600">
            Select A Chat To Start Conversation
          </h1>
        )}
      </div>
    </div>
  );
};

export default ChatScreen;
