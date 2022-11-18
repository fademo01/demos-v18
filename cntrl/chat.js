const { Chat, Parent, Child } = require("../dbmodels/Mongoose");

let users = [];

// Join user to chat
const userJoin = (id, username, otherUser, room) => {
  const user = { id, username, otherUser, room };
  users.push(user);

  function essizKayitlar(arr, comp) {
    const essiz = arr
      .map((e) => e[comp])
      .map((e, i, final) => final.indexOf(e) === i && i)
      .filter((e) => arr[e])
      .map((e) => arr[e]);
    return essiz;
  }
  users = essizKayitlar(users.reverse(), "id");

  return user;
};

// Get current user
const getCurrentUser = (id) => {
  return users.find((user) => user.id === id);
};

// User leaves chat
const userLeave = (id) => {
  const index = users.findIndex((user) => user.id === id);

  if (index !== -1) {
    return users.splice(index, 1)[0];
  }
};

// Get room users
const getRoomUsers = (room) => {
  return users.filter((user) => userJoin.room === room);
};

// Get Format Date
const formatMessage = (
  username,
  otherUser,
  text,
  room,
  image,
  file,
  fileName,
  imageName,
  type,
  uuid
) => {
  return {
    username,
    otherUser,
    text,
    room,
    image,
    file,
    fileName,
    imageName,
    type,
    uuid,
    time: Date().slice(16, 21),
    date: Date().slice(0, 3) + " " + Date().slice(8, 10),
  };
};

const postData = async (msg) => {
  const date = msg.date + " @ " + msg.time;
  await Chat.create({
    username: msg.username,
    otherUser: msg.otherUser,
    text: msg.text,
    room: msg.room,
    image: msg.image || null,
    file: msg.file || null,
    fileName: msg.fileName || null,
    imageName: msg.imageName || null,
    type: msg.type,
    uuid: msg.uuid,
    isVisit: "unvisited",
    date: date,
  });
  return msg;
};

module.exports = {
  userJoin,
  getCurrentUser,
  userLeave,
  getRoomUsers,
  formatMessage,
  postData,
};
