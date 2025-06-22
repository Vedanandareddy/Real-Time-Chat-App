import { create } from "zustand";
import { axiosInstance } from '../lib/axios';
import { toast } from 'react-hot-toast';
import { useAuthStore } from "./authStore";


export const useChatStore = create((set, get) => ({
    users: [],
    messages: [],
    selectedUser: null,
    isLoadingMessages: false,
    isLoadingUsers: false,
    isSendingMessage: false,

    getUsers: async () => {
        try {
            set({ isLoadingUsers: true })
            const response = await axiosInstance.get("/messages/users")
            set({ users: response.data })
            // console.log(get().users)

        } catch (error) {
            console.log("Error Loading Users", error)
            toast.error("Error Loading Users")
        } finally {
            set({ isLoadingUsers: false })
        }
    },
    getMessages: async (userId) => {
        try {
            set({ isLoadingMessages: true })
            const response = await axiosInstance.get(`/messages/${userId}`)
            // console.log("This is from get messages",response.data)
            set({ messages: response.data })
        } catch (error) {
            console.log("Error Loading Messages", error)
            toast.error("Error Loading Messages")
        } finally {
            set({ isLoadingMessages: false })
        }
    },
    sendMessage: async (text, image) => {
        try {
            set({ isSendingMessage: true })
            const { selectedUser, messages } = get()  // getting data from the store
            const response = await axiosInstance.post(`/messages/send/${selectedUser._id}`, { text, image })
            set({ messages: [...messages, response.data] }) // update the current message to ui

        } catch (error) {
            console.log(error)
            toast.error("Error while sending message")

        } finally {
            set({ isSendingMessage: false })
        }
    },

    subscribeToMessages: () => {
        const socket = useAuthStore.getState().socket
        if (!socket) {
            return
        }
        socket.on("newMessage", (newMessage) => {
            const { selectedUser, messages } = get()  // get current values when the event is tiggered
            if (!selectedUser || selectedUser._id !== newMessage.senderId) return;
            set({ messages: [...messages, newMessage] })
        }
        )
    },

    unsubscribeToMessages: () => {
        const socket = useAuthStore.getState().socket
        socket.off("newMessage");
    },

    setSelectedUser: (selectedUser) => {
        set({ selectedUser })
    }
}))