import { app, server } from "./lib/socket.js"
import dotenv from "dotenv"
import cookieparser from "cookie-parser"
import cors from "cors"
import express from "express";
import path from "path"


import authRoutes from "./routes/auth.route.js"
import messageRoutes from "./routes/message.route.js"
import { connectDB } from "./lib/db.js"

dotenv.config()// access environment variables

const __dirname = path.resolve();  // gets path for current directory  

const PORT = process.env.PORT

if (process.env.NODE_ENV !== "production"){
    app.use(cors({
        origin: "http://localhost:5173",
        credentials: true
        // this say to Allow the browser to send cookies (or HTTP authentication headers like Authorization) along with cross-origin requests.
    }))
}
app.use(express.json()) // allows to parse requests with json bodies
app.use(cookieparser()) // allows to access cookies

app.use("/api/auth", authRoutes)
app.use("/api/messages", messageRoutes)


if (process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname,"../frontend/dist")))  // serve static files from the dist folder


     app.get(/^\/(?!api).*/, (req, res) =>{   // for any route that doesnot match above ones use this route
        res.sendFile(path.join(__dirname,"../frontend","dist","index.html")) 
    })
}


server.listen(PORT, () => {
    console.log("server listening on port :", PORT)
    connectDB()
})  // we use http server to listen which underhood uses express to handle routes and middleware and connects socket io to the websockets