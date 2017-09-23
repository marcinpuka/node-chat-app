const {
    generateMessage,
    generateLocationMessage
} = require("./utils/message");
const {
    isRealString
} = require("./utils/validation");
const {Users} = require("./utils/users");
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
var users = new Users();





const port = process.env.PORT || 3000;

app.use(express.static(publicPath));

//--- register event(connection) listener
io.on("connection", (socket) => {
    console.log("New user connected ");
    socket.on("disconnect", () => {
        var user = users.removeUser(socket.id);
        
        if(user) {
            io.to(user.room).emit("updateUserList", users.getUserList(user.room));
            io.to(user.room).emit("newMessage", generateMessage("Admin", `${user.name} has left`));
        }
    });

    socket.on("join", (params, callback) => {
        if (!isRealString(params.name) || !isRealString(params.room)) {
            return callback("Name and room name are required");
        }

        socket.join(params.room);
        users.removeUser(socket.id);
        users.addUser(socket.id, params.name, params.room);
        
        io.to(params.room).emit("updateUserList", users.getUserList(params.room));
        
        // socket.emit from Admin 
        socket.emit("newMessage", generateMessage("Admin", "Welcome to the chat app"));

        socket.broadcast.to(params.room).emit("newMessage", generateMessage("Admin", `${params.name} has joined`));

        callback();
    });


    socket.on("createMessage", (message, callback) => {
        //console.log("Create message...", message); 
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