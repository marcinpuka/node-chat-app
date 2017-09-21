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
    
    // here as 2. argument we can send data i.e. object
    
    console.log("message sent...");
    socket.emit("newMessage", {
        from: "Eva", 
        text: "whats up, baby?", 
        createdAt: 125
    });
    

    socket.on("disconnect", () => {
        console.log("User disconnected");
    });
    
    socket.on("createMessage", (message) => {
        console.log("Create message...", message);       
    });

});



// server listen 
server.listen(port, () => {
    console.log(`Server up on port ${port}`);
});