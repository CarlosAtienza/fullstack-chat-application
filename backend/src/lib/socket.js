import {Server} from "socket.io";
import http from "http";
import express from "express";

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: ["http://localhost:5173"]
    }
});


export function getReceiverSocketId(userId) {
    return socketMap[userId];
}

const socketMap = {};


//listen for coonnections from clients
io.on("connection", (socket) => {
    //callback function

    console.log("User connected", socket.id);

    //gets the query when user connects (see authStore)
    const userId = socket.handshake.query.userId
    if (userId){ 
        //Remove old socket if it exists
        if (socketMap[userId]){
            delete socketMap[userId]
        }
        socketMap[userId] = socket.id;
    }

    //send events to all connected clients
    io.emit("getOnlineUsers", Object.keys(socketMap));


    socket.on("disconnect", () => {
        console.log("A user disconnected", socket.id)
        delete socketMap[userId];
        io.emit("getOnlineUsers", Object.keys(socketMap));
    });
})

export {io, app, server};