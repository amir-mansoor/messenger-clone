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

import { SocketContext } from "@/context/SocketContext";
import ChatHeader from "@/components/ChatHeader";
import Loader from "@/components/Loader";
import LeftPanel from "@/components/LeftPanel";
import EmojiPicker from "emoji-picker-react";
import { Smile } from "lucide-react";

const ChatScreen = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [logout] = useLogoutMutation();

  const [sendMessage] = useSendMessageMutation();
  const [text, setText] = useState("");
  const [arivalMessage, setArivalMessage] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentChat, setCurrentChat] = useState(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const emojiPickerRef = useRef(null);
  const messagesEndRef = useRef(null);

  const handleEmoji = (emoji) => {
    setText((prev) => (prev += emoji.emoji));
  };

  // fetch chats on component load
  const { data: chats } = useGetChatsQuery();

  const { socket } = useContext(SocketContext);

  const { messages, chatId } = useSelector((state) => state.messages);
  const { userInfo } = useSelector((state) => state.auth);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (messages.length > 0) {
      scrollToBottom();
    }
  }, [messages, chatId]);

  // Search the current chats with phone number
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

  // Scroll to bottom on new message arrival
  useEffect(() => {
    socket.on("getMessage", (data) => {
      setArivalMessage(data);
      scrollToBottom();
    });
  }, []);

  // const currentChat = chats?.find((chat) => chat._id === chatId);
  // the above code is moved to the below useEffect to make the code more clear
  useEffect(() => {
    setCurrentChat(chats?.find((chat) => chat._id === chatId));
  }, [chatId, chats]);

  // check for new arival message from other users if msg arrive then append it into the message state
  useEffect(() => {
    if (arivalMessage) {
      // this ensure that the arivalmessage sender is one of the participants of the current chat it prevents unrelated messages
      const userExists = currentChat?.members.find(
        (user) => user._id === arivalMessage.sender
      );
      if (userExists) {
        dispatch(appendMessage(arivalMessage));
      }
    }
  }, [arivalMessage, currentChat]);

  // update conversation id onclick and refetch the coversation messages
  const updateChat = async (conversationId) => {
    if (chatId == conversationId) {
      return;
    }
    dispatch(clearMessages());

    dispatch(updateConversation(conversationId));
    refetch();
  };

  // send message in real time using socket.io
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

  // handle logout here onClick call to the logout api and clear states
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

      <LeftPanel
        handleLogout={handleLogout}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        filteredChats={filteredChats}
        userInfo={userInfo}
        updateChat={updateChat}
        chatId={chatId}
      />

      {/* Right Pane (Messages Box) */}
      <div className="flex-[0.8] bg-gray-700 flex flex-col h-screen">
        {chatId ? (
          <>
            {/* Header */}
            <ChatHeader currentChat={currentChat} loginUser={userInfo.id} />

            {/* Scrollable Messages */}
            {isFetching ? (
              <div className="flex-1 overflow-y-auto p-4">
                <Loader />
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
              <form onSubmit={handleMessage} className="flex items-center">
                <div className="mr-2">
                  <Smile onClick={() => setShowEmojiPicker(!showEmojiPicker)} />
                  {showEmojiPicker && (
                    <div
                      className="absolute bottom-24"
                      id="emoji-box"
                      ref={emojiPickerRef}
                    >
                      <EmojiPicker
                        onEmojiClick={(emoji) => handleEmoji(emoji)}
                        theme="dark"
                      />
                    </div>
                  )}
                </div>
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
