const { Chat, Notification } = require("./dbmodels/Mongoose");
let socketIO = require("./socket.io").io();
const { io } = require("socket.io-client");
const fs = require("fs-extra");
const { v4: uuidv4 } = require("uuid");
const path = require("path");
const { extname } = require("path");

const {
  userJoin,
  getCurrentUser,
  formatMessage,
  userLeave,
  getRoomUsers,
  postData,
} = require("./controllers/chat");

// Run when client connects
socketIO.on("connection", (socket) => {
  var destination = "/";
  socketIO.emit("redirect", destination);
  //console.log("adapter",socketIO.of("/").adapter);

  socket.on("joinRoomChat", ({ username, otherUser, room }) => {
    let id1 = room.slice(0, 24);
    let id2 = room.slice(24, 48);
    const firstId = id1 + id2;
    [id1, id2] = [id2, id1];
    const newId = id1 + id2;
    // console.log("newId",newId);

    let newIds;
    if (id1 > id2) {
      let deee = id2;
      id2 = id1;
      id1 = deee;
      newIds = id1 + id2;
    }
    if (!newIds) {
      newIds = newId;
    }
    const user = userJoin(socket.id, username, otherUser, newIds);
    //console.log("userJoinUSER", user);

    const botName = user.username;
    socket.join(user.room);

    //send users and room info
    socketIO.to(user.room).emit("roomUsersChat", {
      room: user.room,
      users: getRoomUsers(user.room),
    });
  });

  //:LEAVE:Client Supplied Room
  socket.on("leaveRoom", ({ username, otherUser, room }) => {
    socket.leave(room);
    console.log("rooms ", room);
    socketIO.emit("roomUsersChat", {
      room: room,
      users: getRoomUsers(room),
    });
    console.log("socketList", socketIO.sockets.adapter.rooms);
  });

  socket.on("chatData", async () => {
    let data;
    await Chat.find().then((item) => {
      return (data = item);
    });
    //console.log("data", data);
    socketIO.emit("getData", { dat: data });
  });

  socket.on("getCurrent", async () => {
    let user = await getCurrentUser(socket.id);

    console.log("user", user);
    socketIO.emit("getCurrentData", user);
  });

  // Listen for chatMessage
  socket.on(
    "chatMessage",
    (otherUser, msg, image, file, fileName, imageName, type) => {
      const user = getCurrentUser(socket.id);
      //console.log("getCurrUser", user);
      const uuid = uuidv4(user.room);
      socketIO
        .to(user.room)
        .emit(
          "messageChat",
          formatMessage(
            user.username,
            otherUser,
            msg,
            user.room,
            image,
            file,
            fileName,
            imageName,
            type,
            uuid
          )
        );

      socket.broadcast.emit(
        "newMessage",
        (user.username, otherUser, msg, user.room)
      );

      const message = formatMessage(
        user.username,
        otherUser,
        msg,
        user.room,
        image,
        file,
        fileName,
        imageName,
        type,
        uuid
      );
      postData(message);
    }
  );

  // File for Chat
  socket.on("fileChat", (file, fileName, type) => {
    const user = getCurrentUser(socket.id); // !
    let uuid = uuidv4(fileName);
    let extN = path.extname(fileName);
    const fileNames = uuid + extN;
    console.log("fillllle",file)

    let filePath;

    if (
      type == "image/png" ||
      type == "image/jpg" ||
      type == "image/jpeg" ||
      type == "image/gif" ||
      type == "audio/mpeg" ||
      type == "audio/mp3" ||
      type == "audio/mp4" ||
      type == "audio/aac" ||
      type == "audio/wav" ||
      type == "video/mp4" ||
      type == "video/webm" ||
      type == "video/mpeg" ||
      type == "video/avi" ||
      type == "video/flv"
    ) {
      filePath = __dirname + "public/ChatFile/media/" + fileNames;
    } else {
      filePath = __dirname + "public/ChatFile/files/" + fileNames;
    }

    var binImage = new Buffer(file, "base64").toString("binary");
    fs.outputFile(filePath, binImage, "binary", function (err) {
      if (err) console.log(err);
    });

    const orgType = type.slice(0, type.search("/"));
    console.log("orgType", orgType);

    if (orgType == "image" || orgType == "audio" || orgType == "video") {
      socketIO
        .to(user.room)
        .emit("mediaName", "/ChatFile/media/" + fileNames, fileName, type);
    } else if (orgType == "application" || orgType == "text") {
      socketIO
        .to(user.room)
        .emit("fileName", "/ChatFile/files/" + fileNames, fileName, type);
    }
  });

  socket.on("typing", (data) => {
    const user = getCurrentUser(socket.id);
    socket.broadcast.to(user.room).emit("typingg", data);
  });

  // Notification isVisited Socket Service
  socket.on("isNotif", (visited) => {
    Notification.findOneAndUpdate(
      { _id: visited },
      { isNotif: "visitNotif" },
      (err, result) => {
        if (err) {
          console.log(err);
        } else {
        }
      }
    );
  });

  // Chat isVisited Socket Service
  socket.on("isVisited", async (username, otherUser) => {
    const user = getCurrentUser(socket.id);

    let updateVisit = {
      $set: {
        isVisit: "visited",
      },
    };

    await Chat.updateMany(
      { username: username, otherUser: otherUser },
      updateVisit,
      function (err, data) {
        if (!err) {
        } else {
          throw err;
        }
      }
    )
      .clone()
      .catch(function (err) {
        console.log(err);
      });

    /*     Chat.updateMany({otherUser: visited}, {isVisit: "visited"}, (err,result) => {
      if(err) {
        console.log(err);
      }else {
      }
    }) */
    // socket.broadcast.to(user.room).emit('isVisit')
  });

  // User disconnect
  socket.on("disconnect", () => {
    const user = userLeave(socket.id);
    //getUserRooms(socket)
    //console.log("discUser", user);
    if (user) {
      //send users and room info
      socketIO.to(user.room).emit("roomUsersChat", {
        room: user.room,
        users: getRoomUsers(user.room),
      });
    }
  });
});

// server-side
socketIO.use((socket, next) => {
  next();
});
