const ChatList = ({ chats, userInfo, updateChat, chatId }) => {
  return (
    <div>
      {chats?.map((chat, ind) => {
        const otherMember = chat.members.filter(
          (member) => member._id !== userInfo.id
        );

        return (
          <div
            key={ind}
            onClick={() => updateChat(chat._id)}
            className={`flex mt-5 items-center border-b border-b-gray-600 py-2 cursor-pointer hover:bg-gray-700 ${
              chatId === chat._id && "bg-gray-500"
            }`}
          >
            <div className="flex uppercase items-center justify-center bg-gray-600 text-white h-14 w-14 text-4xl rounded-full">
              {otherMember[0].name?.[0]}
            </div>
            <h1 className="ml-2">{otherMember[0].phoneNumber}</h1>
          </div>
        );
      })}
    </div>
  );
};

export default ChatList;
