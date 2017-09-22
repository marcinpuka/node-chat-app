const {generateMessage, generateLocationMessage} = require("./utils/message");
const path = require("path");
const publicPath = path.join(__dirname, "../public");
const express = require("express");
var app = express();
const socketIO = require("socket.io");
// to be able to work with sockets.io we need to use http module 
const http = require("http");
// we will be using http server now 
var server = http.createServer(app);
// in io we get back web server with sockets
var io = socketIO(server);



const port = process.env.PORT || 3001;

app.use(express.static(publicPath));

//--- register event(connection) listener
io.on("connection", (socket) => {
    console.log("New user connected ");
    
    // socket.emit from Admin 
    socket.emit("newMessage", generateMessage("Admin", "Welcome to the chat app"));
    
    socket.broadcast.emit("newMessage", generateMessage("Admin", "New user joined"));
    

    socket.on("disconnect", () => {
        console.log("User disconnected");
    });
    
    socket.on("createMessage", (message, callback) => {
        console.log("Create message...", message); 
        //emits event to every single connection 
        io.emit("newMessage", generateMessage(message.from, message.text));
        callback();
    });
    
    socket.on("createLocationMessage", (coords) => {
        
       io.emit("newLocationMessage", generateLocationMessage("Admin", coords.latitude, coords.longitude));
    });
});



// server listen 
server.listen(port, () => {
    console.log(`Server up on port ${port}`);
});