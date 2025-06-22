import { useEffect, useRef } from 'react'
import { useChatStore } from '../store/useChatStore';
import ChatHeader from './ChatHeader';
import ChatInput from './ChatInput';
import MessageSkeleton from './Skeletons/MessageSkeleton';
import { useAuthStore } from '../store/authStore';


const ChatContainer = () => {
  const bottomref = useRef(null)
  const { authUser } = useAuthStore()
  const { selectedUser, getMessages, messages, isLoadingMessages, subscribeToMessages, unsubscribeToMessages } = useChatStore()

  useEffect(() => {
    if (!selectedUser) return;

    getMessages(selectedUser._id);
    subscribeToMessages();

    return () => {
      unsubscribeToMessages();
    };
  }, [selectedUser]);




  useEffect(() => {
    if (bottomref.current) {
      bottomref.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);  // scrolls new messages into view 
  // A ref created via useRef() holds a reference to one DOM element only — the last one it's attached to. So, if you try this:



  return (
    <div className='w-full flex-1 flex flex-col bg-base-300 rounded-md '>
      <ChatHeader />

      {/* Messages  */}
      {/* Messages Scrollable Area */}
      <div className='flex-1 flex flex-col items-center gap-4 bg-base-100 w-full overflow-y-auto'>

        {isLoadingMessages ? (
          <MessageSkeleton />
        ) : (
          messages?.map((message) => (
            <div
              key={message._id}
              ref={bottomref}
              className={`w-full flex p-4 ${message.senderId === selectedUser._id ? "justify-start" : "justify-end"}`}
            >
              <div className="flex flex-col items-start gap-1 max-w-[75%]">
                <div className="flex items-end gap-2">
                  <img
                    src={
                      (message.senderId === selectedUser._id
                        ? selectedUser.profilepic
                        : authUser.profilepic) || "/avatar.png"
                    }
                    alt="avatar"
                    className="w-8 h-8 rounded-full object-cover"
                  />
                  <div
                    className={`${message.senderId === selectedUser._id
                      ? "bg-base-200 text-black"
                      : "bg-primary text-white"
                      } px-4 py-2 rounded-xl shadow-md break-words w-fit max-w-[100%] space-y-2`}
                  >
                    {message.image && (
                      <img
                        src={message.image}
                        alt="sent media"
                        className="rounded-lg max-w-xs object-cover"
                      />
                    )}
                    {message.text && <p className="whitespace-pre-wrap">{message.text}</p>}
                  </div>
                </div>
                <span className="text-xs text-gray-500 pl-10">
                  {new Date(message.createdAt).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
            </div>
          ))

        )}
      </div>



      <ChatInput />
    </div>
  )
}

export default ChatContainer


