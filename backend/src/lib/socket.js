import { Server } from "socket.io"
import http from "http"
import express from "express"


const app = express()

const server = http.createServer(app)
// wraps express app in http server instance so socket io can connect to the websockets can be done through raw http server only as express hides underlying complexity

const io = new Server(server, {
    cors: {
        origin: ["http://localhost:5173"],
    }
}) // Attaches Socket.IO to the HTTP server.

const getReceiverSocketId=(receiverid)=>{
    return userSocketMap[receiverid]
}


// used to store online users 
const userSocketMap = {} // user._id to socket.id

io.on("connection", (socket) => {  // listens for connection event
    console.log("A user connected to socket", socket.id)


    const userid = socket.handshake.query.userid; 
    if(userid){
        userSocketMap[userid]=socket.id;  // set online users
    }
    // socket.handshake in Socket.IO refers to the initial handshake information between the client and server when a WebSocket (or fallback transport) connection is first established.


    // used to send events to all connected clients
    io.emit("getOnlineUsers",Object.keys(userSocketMap))  // sends ids of current online users to every connected users


    socket.on("disconnect", () => {
        // The disconnect listener is inside connection because it listens for disconnection of that specific client.
        // The disconnect event does not pass the socket as an argument — just use the one from the connection callback.
        console.log("A user disconnected", socket.id)

        // when a users disconnect we want remove them from the online users
        delete userSocketMap[userid]
        io.emit("getOnlineUsers",Object.keys(userSocketMap))  // let connected clients know the user is offline
    })

})


export { io, app, server,getReceiverSocketId }