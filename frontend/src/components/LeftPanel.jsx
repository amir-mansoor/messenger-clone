import { LogOut, MessageSquareDiffIcon, Search } from "lucide-react";
import ChatList from "@/components/ChatList";
import Loader from "./Loader";

const LeftPanel = ({
  handleLogout,
  searchQuery,
  setSearchQuery,
  filteredChats,
  userInfo,
  updateChat,
  chatId,
  isLoading,
  isError,
}) => {
  return (
    <div className="flex-[0.2] w-full p-2 bg-gray-800 text-white overflow-y-auto h-screen">
      {isLoading ? (
        <Loader />
      ) : isError ? (
        <p className=" text-xl">
          Unable to load chats please check your internet or try again later
        </p>
      ) : (
        <>
          <div className="flex justify-between items-center">
            <h1 className="font-bold text-xl">Chats</h1>
            <div className="flex space-x-2">
              <MessageSquareDiffIcon />
              <LogOut
                onClick={() => handleLogout()}
                className="cursor-pointer"
              />
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
        </>
      )}
    </div>
  );
};

export default LeftPanel;
