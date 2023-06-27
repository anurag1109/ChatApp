const mongoose = require("mongoose");

const express = require("express");
const app = express();
app.use(express.json());

const http = require("http");
const { Server } = require("socket.io");
const { formatemessage } = require("./messages");
const { usersjoin, getroomuser, getuser, leaveuser } = require("./users");

const server = http.createServer(app);

require("dotenv").config();
const { connection } = require("./configs/db");

const cors = require("cors");
app.use(cors());

const router = require("./routes/authRoutes");

app.use("/user", router);

server.listen(process.env.port, async (req, res) => {
  try {
    await connection;
    console.log("connected to db");
  } catch (error) {
    console.log(error);
  }
  console.log(`server running at port ${process.env.port}`);
});

//socket.io
const io = new Server(server);

io.on("connection", function (socket) {
  console.log("A user connected");

  socket.on("setUsername", function (data) {
    const user = usersjoin(socket.id, data.username, data.room);
    socket.join(user.room);
    socket.emit(
      "userSet",
      formatemessage(user.username, "welcome to the room")
    );

    socket.broadcast
      .to(user.room)
      .emit(
        "userSet",
        formatemessage(user.username, `${user.username} has joined the room`)
      );

    io.to(user.room).emit("allusers", {
      room: user.room,
      users: getroomuser(user.room),
    });
  });

  socket.on("msg", function (data) {
    const user = getuser(socket.id);
    io.to(user.room).emit(
      "userSet",
      formatemessage(user.username, data.message)
    );
  });

  socket.on("disconnect", () => {
    const user = leaveuser(socket.id);
    socket.broadcast
      .to(user.room)
      .emit(
        "userSet",
        formatemessage(user.username, `${user.username} has left the chat`)
      );
    io.to(user.room).emit("allusers", {
      room: user.room,
      users: getroomuser(user.room),
    });
  });
});

//NAMESPACE
var nsp = io.of("/my-namespace");
nsp.on("connection", function (socket) {
  console.log(`${socket.id} someone connected to my-namespace`);
  nsp.emit("hi", "Hello everyone!");

  socket.on("setUsername", function (data) {
    console.log(data);
    if (users.indexOf(data) > -1) {
      socket.emit(
        "userExists",
        data + " username is taken! Try some other username."
      );
    } else {
      users.push(data);
      socket.emit("userSet", { username: data });
    }
  });
  socket.on("msg", function (data) {
    //Send message to everyone
    nsp.emit("newmsg", data);
  });
});
