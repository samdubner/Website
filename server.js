"use strict";

const express = require("express");
const app = express();
const io = require("socket.io");

app.use(express.static(__dirname + "/public"));

const PORT = process.env.PORT || 8080;

var server = app.listen(PORT);
var socket = io.listen(server);

app.get('/about', function(req, res){
  res.sendFile('./public/about/about.html', { root: __dirname })
});

app.get('/chat', function(req, res){
  res.sendFile('./public/chat/chat.html', { root: __dirname })
});

//var users = 0;
var chatRooms = [
  {
    creator: "DEFAULT",
    name: "HOME",
    displayName: "home",
    private: false
  }
];

var users = [
  {
    username: "announcer"
  }
];

socket.on("connection", socket => {
  //sends message saying socket.io is responding
  socket.emit("socket", "");

  //logs in console that a user connected
  socket.on("UC", data => {
    // console.log(data);
    socket.emit("getRoomList", "");
  });

  //logs in console that a user disconnected
  // socket.on("disconnect", () => {
    // console.log("user disconnected");
  // });

  //sends message to everyone
  socket.on("message", data => {
    //sends everyone but sender message
    socket.broadcast.emit("message", {
      mt: data.text,
      ms: data.username,
      rm: data.room
    });
  });

  //checks if room already exists and if not creates it
  socket.on("roomAttempt", (data) => {
    var user = data.user;
    var roomName = data.crn;
    var upper = roomName.toUpperCase();
    var privacy = data.privacy;

    for (var room in chatRooms) {
      if (room.name == upper) {
        socket.emit("roomFailure", {
          message: "Room already exists."
        });
        return;
      }
    }

    socket.emit("roomSuccess", {
      message: "Chat room has been successfully created!",
      user: user,
      crn: roomName
    });

    if (!privacy) {
      socket.emit("addRoomToList", {
        crn: roomName
      });
    }

    var roomObj = {
      creator: user,
      name: upper,
      displayName: roomName,
      private: privacy
    };

    // console.log(`room: ${roomName} was created. isPrivate: ${privacy}`);

    //puts the room into the beginning of the array
    chatRooms.unshift(roomObj);
  });

  socket.on("joinRoomAttempt", data => {
    var user = data.user;
    var roomName = data.crn;
    var upper = roomName.toUpperCase();

    for (var room of chatRooms) {
      if (upper == room.name) {
        // console.log(`${user} has joined room ${roomName}`);
        socket.emit("joinSuccess", {
          message: `You have joined room: ${roomName}`,
          jr: roomName
        });
        socket.emit("message", {
          mt: `You have joined room: ${roomName}`,
          ms: "Announcer",
          rm: roomName
        });
        return;
      }
    }

    socket.emit("joinFailure", {
      message: "Room does not exist"
    });
  });

  socket.on("getRooms", data => {
    for (var room of chatRooms) {
      if (!room.private) {
        socket.emit("addRoomToList", {
          crn: room.displayName
        });
      }
    }
  });

  socket.on("attemptName", data => {
    var name = data.toLowerCase();
    for (var user of users) {
      if (user.username == name) {
        socket.emit("setName", {
          isValid: false,
          name: data
        });
        return;
      }
    }
    socket.emit("setName", {
      isValid: true,
      name: data
    });
    users.push({ username: data });
  });
});
