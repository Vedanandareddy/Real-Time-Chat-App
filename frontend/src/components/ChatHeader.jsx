import React from 'react'
import { useChatStore } from '../store/useChatStore'
import { X } from "lucide-react"
import { useAuthStore } from '../store/authStore'

const ChatHeader = () => {
    const { selectedUser, setSelectedUser } = useChatStore()
    const {onlineUsers}=useAuthStore()
    const isOnline = onlineUsers?.includes(selectedUser._id);
    return (
        <div className='w-full px-3 py-8 h-20  border-2 rounded-md border-base-300 bg-base-100 flex justify-between items-center' >
            <div className="flex items-center w-full gap-3">
                <div className="w-16 h-16">
                    <img
                        className="w-full h-full object-cover rounded-full border border-base-300 shadow-sm"
                        src={selectedUser.profilepic || "/avatar.png"}
                        alt="User Avatar"
                    />
                </div>

                <div className="flex flex-col ">
                    <div className="font-medium">{selectedUser.fullname}</div>
                    <div className={`text-sm opacity-60 ${isOnline?"text-green-500":""}`}>{isOnline?"Online":"Offline"}</div>
                </div>
            </div>

            <div><X className='size-7 hover:text-slate-400' onClick={()=>setSelectedUser(null)} /></div>
        </div>
    )
}

export default ChatHeader
