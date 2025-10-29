import express from "express";
import http from "http";
import { Server } from "socket.io";

const app = express();
const server = http.createServer(app);

const io = new Server(server,{
    cors: {
        origin: "http://localhost:5173"
    },
});


export function getReceiverSocketId(userId) {
    return userSocketData[userId];
}
//use to store the online users
const userSocketData = {}

io.on("connection", (socket) => {
    console.log( "User is connected: ", socket.id );
    const userId = socket.handshake.query.userId;
    if(userId) userSocketData[userId]=socket.id;

    io.emit("getOnlineUsers", Object.keys(userSocketData)); //used to send evnets to all conneted clients
    
    socket.on("disconnect" ,() => {
        console.log( "User is diconnected: " ,socket.id );
        delete userSocketData[userId];
        io.emit("getOnlineUsers", Object.keys(userSocketData));
    })
})


export { io, app, server };