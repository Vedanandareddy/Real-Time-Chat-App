import { create } from "zustand";
import { axiosInstance } from '../lib/axios';
import { toast } from "react-hot-toast"
import { io } from "socket.io-client"

const BASE_URL = import.meta.env.MODE === "development" ? "http://localhost:5001/" : "/"

export const useAuthStore = create((set, get) => ({  // set to change values inside and get is to access them inside file
    authUser: null,
    isSigningUp: false,
    isLoggingIn: false,
    isUpdatingProfile: false,
    isLoading: true,
    onlineUsers: [],
    socket: null,
    checkauth: async () => {
        try {
            console.log(BASE_URL)
            set({ isLoading: true })
            const response = await axiosInstance.get("/auth/check");
            set({ authUser: response.data.user });
            // console.log("authcheck succesfull")
            get().connectSocket()   // connecting to socket when authenicated or logged in
            // console.log("authUser set to", response.data.user);
        } catch (error) {
            set({ authUser: null });
            console.log("Error while checking auth:", error);
        } finally {
            set({ isLoading: false });
        }
    },

    signup: async (fullname, email, password) => {
        try {
            set({ isSigningUp: true })
            const response = await axiosInstance.post("/auth/signup", {
                email,
                fullname,
                password
            })
            toast.success('Signup Successfull!')
            set({ authUser: response.data })
            get().connectSocket()   // connecting to socket to the server whenever we login
            console.log("Signup Successfull")
            return true
        } catch (error) {
            toast.error(`Error Signing up! ${error?.response?.data?.message}`)
            set({ authUser: null })
            console.log("Error while signing up", error.response)
            return false
        } finally {
            set({ isSigningUp: false })
        }

    },

    login: async (email, password) => {
        try {
            set({ isLoggingIn: true })
            const response = await axiosInstance.post("/auth/login", { email, password })
            set({ authUser: response.data })
            get().connectSocket()   // connecting to socket to the server whenever we login
            toast.success("Login Succesfull")
        } catch (error) {
            set({ authUser: null })
            toast.error(error.response.data.message)
        } finally {
            set({ isLoggingIn: false })
        }
    },

    logout: async () => {
        try {
            const response = await axiosInstance.post("/auth/logout")
            set({ authUser: null })
            get().disconnectSocket()   // disconnect socket when user logs out
            toast.success("Logged Out Succesfully")
        } catch (error) {
            toast.error(error.response.data.message)
        }
    },
    updateProfilePic: async (profilepic) => {
        try {
            set({ isUpdatingProfile: true })
            const response = await axiosInstance.put("/auth/update-profile", { profilepic })
            set({ authUser: response.data.updatedUser })
            toast.success("Upadated Profile Pic")
            return
        } catch (error) {
            console.log(error)
            toast.error(`${error.response.data.statusText}`)
        } finally {
            set({ isUpdatingProfile: false })
        }
    },
    connectSocket: () => {
        const { authUser } = get()
        if (!authUser || get().socket?.connected) return console.log("No authUser");   // donot connect if user is not authorized and already connected
        const socket = io(BASE_URL, {  // handshake used to pass headers and information 
            query: {
                userid: get().authUser._id
            }
        })  // connect to server socket from client
        set({ socket: socket })
        socket.connect()   // connects explicitly if not already connected 

        // after connecting to the socket we can listen to events

        socket.on("getOnlineUsers", (userids) => {  // listens to the event named getOnlineUsers and sent data can be accessed 
            set({ onlineUsers: userids })
        })

    },

    disconnectSocket: () => {
        const { socket } = get()
        if (socket && socket.connected) {
            socket.disconnect()
            console.log("Socket Disconnected")
        }
        set({ socket: null })
    },

}))


// it takes a set function as input and return as json 