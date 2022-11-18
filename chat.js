//const msgSend = document.getElementById("msgSend");
const msgSend = document.getElementById(userSingleStrr._id + "msgSend");
//const msgInput = document.getElementById("msgInput");
const msgInput = document.getElementById(userSingleStrr._id + "msgInput");
const chatHistory = document.querySelector(".msg_history");
const typeMsg = document.querySelector(".type_msg");
const roomElement = document.querySelector(".chat_list");
const addContact = document.querySelector("#add-contact");
const modal = document.querySelector(".modal");

let otherUser = "Other";
let image = null;
let file = null;
let fileName = null;
let imageName = null;
let imageType = null;
let fileType = null;
let currentChat;
let uplImg;
let types = null;



//console.log("chatDataString", chatDataString);
//let room;
//console.log("username", username, "room", room);
console.log(userSingleStrr);
const socket = io();

socket.on("connect_error", (err) => {
  socket.on("redirect", function (destination) {
    window.location.href = destination;
  });
  location.replace("/");
  //console.log(err.message); // prints the message associated with the error
});

// Join Chatroom
//socket.emit("joinRoomChat", { username, room });

$("#chatImg").submit(function (e) {
  e.preventDefault();
});

let imgFile;
async function imageUploaded1() {

  imgFile = document.querySelector("#imageFile")["files"];
  //[0];
  console.log("imgFile", imgFile);
  let isFile = true;
  if (imgFile[0].size > 1240000) {
    isFile = false;
    $.popupWindow({
      //"alert","confirm", or"prompt"
      type: "alert",
      title: "Dosya Yüklerken Hata",
      content: "Dosya 1mb`dan fazla olamaz !",
      // "hint", , "error", or "correct"
      icon: "error",
      width: 400,
      top: 150,
      transition: 300,
    });
    imgFile = null;
  }
  //image = await file[0].name;

  // FileReader support
  if (FileReader && imgFile && imgFile.length) {
    const fr = new FileReader();
    fr.onload = async function () {
      $("#imgBox").css("display", "block");
      const orgType = imgFile[0].type.slice(0, imgFile[0].type.search("/"));
      if (orgType == "image") {
        const imgAvatar = document.getElementById("imgAvatar");
        imgAvatar.style.display = "block";
        imgAvatar.src = fr.result;
        //uplImg = fr.result;
        msgInput.focus();
      } else if (orgType == "video") {
        const videoAvatar = document.getElementById("videoAvatar");
        videoAvatar.style.display = "block";
        videoAvatar.src = fr.result;
      } else if (orgType == "audio") {
        const audioAvatar = document.getElementById("audioAvatar");
        audioAvatar.style.display = "block";
        audioAvatar.src = fr.result;
      }
      //console.log("orgType",orgType);
    };
    fr.readAsDataURL(imgFile[0]);
  }
  socket.emit("fileChat", imgFile[0], imgFile[0].name, imgFile[0].type);
  msgInput.focus();
}

socket.on("mediaName", async (media, mediaNames, extName) => {
  /*   if(img.includes(".png") || img.includes(".jpeg") || img.includes(".jpg") || img.includes(".gif")){
} */
/*   console.log(
    "media: ",
    media,
    "mediaNames: ",
    mediaNames,
    "extName: ",
    extName
  ); */
  types = await extName.slice(0, 5);
  image = await media;
  imageName = await mediaNames;
  imageType = await extName;
});

async function fileUploaded() {
  const chatFile = await document.querySelector("#chatFile")["files"];

  console.log("chatFile[0].size", chatFile[0]);
  let isFile = true;
  if (chatFile[0].size > 1240000) {
    isFile = false;
    $.popupWindow({
      //"alert","confirm", or"prompt"
      type: "alert",
      title: "Dosya Yüklerken Hata",
      content: "Dosya 1mb`dan fazla olamaz !",
      // "hint", , "error", or "correct"
      icon: "error",
      width: 400,
      top: 150,
      transition: 300,
    });
    chatFile = null;
  }
  //[0];
  document.querySelector("#fileName").innerText =
    chatFile[0].name + "(" + chatFile[0].size + "  bayt )";
  document.querySelector("#fileName").setAttribute("data", chatFile[0].name);
  document.querySelector("#fileName").setAttribute("type", chatFile[0].type);
  //console.log("isFile", isFile);
  if (FileReader && chatFile && chatFile.length && isFile) {
    const fr = new FileReader();
    fr.onload = function () {
      const fileObj = document.getElementById("fileObj");
      $("#imgBox").css("display", "block");
      fileObj.style.display = "block";
      fileObj.dataset = fr.result;
    };
    fr.readAsDataURL(chatFile[0]);
  }
  //image = await file[0].name;
  //console.log("chatFile[0]",chatFile[0]);
  await socket.emit(
    "fileChat",
    chatFile[0],
    chatFile[0].name,
    chatFile[0].type
  );
  msgInput.focus();
}

socket.on("fileName", async (files, fileNames, extName) => {
  file = await files;
  fileName = await fileNames;
  fileType = await extName;
  document.querySelector(
    "#fileName"
  ).innerHTML += `<a href="${file}">View File</a>`;
});

const mediaFile = () => {
  const mediaBody = document.querySelector("#mediaBody");
  const emojiMenu = document.querySelector("#emojiMenu");
  if (document.querySelector("#mediaBox")) {
    document.querySelector("#mediaBox").addEventListener("click", () => {
      mediaBody.classList.toggle("d-none");
      emojiMenu.classList.add("d-none");
    });
  }
  if (document.querySelector("#smile")) {
    document.querySelector(
      "#smile"
    ).innerHTML = `<i class="fa-sharp fa-solid fa-face-smile" id="emoji" style="transition: transform .3s;"></i> <style>#emoji:hover {transform: scale(1.2);}</style>`;
  }
};

mediaFile();

function SubForm(e) {
  e.preventDefault();
  var url = $(this).closest("imgForm").attr("action"),
    data = $(this).closest("imgForm").serialize();
  $.ajax({
    url: url,
    type: "post",
    data: data,
    success: function () {
      // Whatever you want to do after the form is successfully submitted
    },
  });
}

function getAudio() {
  new Audio(
    "/ChatFile/get.wav"
  ).play();
}

function sendAudio() {
  new Audio(
    "/ChatFile/send.wav"
  ).play();
}

let type;
//Message Submit
if (msgSend) {
  msgSend.addEventListener("click", async () => {
    // Get Message Text
    const mediaBody = document.querySelector("#mediaBody");
    mediaBody.classList.add("d-none");
    const emojiMenu = document.querySelector("#emojiMenu");
    emojiMenu.classList.add("d-none");
    const imgAvatar = document.getElementById("imgAvatar").style.display;
    const videoAvatar = document.getElementById("videoAvatar").style.display;
    const audioAvatar = document.getElementById("audioAvatar").style.display;
    if (imgAvatar == "none" && videoAvatar == "none" && audioAvatar == "none") {
      image = null;
    }
    const fileObj = document.getElementById("fileObj");

    if (fileObj.style.display == "none") {
      file = null;
    }
    const msg = msgInput.value.trim();
    if (!msg && !image && !file) {
      return false;
    }

    sendAudio();

    if (imageType) {
      type = imageType;
    } else if (fileType) {
      type = fileType;
    }

    //Emit Message to Server
    await socket.emit(
      "chatMessage",
      otherUser,
      msg,
      image,
      file,
      fileName,
      imageName,
      type
    );

    // Clear Input
    file = null;
    image = null;
    imageName = null;
    fileName = null;
    type = null;
    document.querySelector("#imgBox").style.display = "none";
    document.querySelector("#imgAvatar").style.display = "none";
    document.querySelector("#videoAvatar").style.display = "none";
    document.querySelector("#audioAvatar").style.display = "none";
    fileObj.style.display = "none";
    msgInput.value = "";
    msgInput.focus();

    roomList();
  });
}

var isPressed = false;

var keydown = function (e) {
  isPressed = true;
};

var keyup = function (e) {
  isPressed = false;
};

if (msgInput) {
  msgInput.addEventListener("keypress", function (event) {
    // If the user presses the "Enter" key on the keyboard

    if (event.key === "Enter") {
      // Cancel the default action, if needed

      // Trigger the button element with a click
      msgSend.click();
      event.preventDefault();
    }
  });
  msgInput.addEventListener("keydown", keydown, false);
  msgInput.addEventListener("keyup", keyup, false);
}

setInterval(async function () {
  if (isPressed) {
    await socket.emit("typing", msgInput.value);
    //console.log("pressed");
  }
}, 100);

// Message from server
socket.on("messageChat", (message) => {
  //socket.emit("getData", message);

  outputMessage(message);
  //console.log(message);

  // Scroll down
  chatHistory.scrollTop = chatHistory.scrollHeight;
});
let newNotif = false;
socket.on("newMessage", (data) => {
  newNotif = true;
  $(".inbox_chat").empty();
  getUserList();
  //console.log("data", data);
});

// !!
const outputMessage = (message) => {
  console.log("message", message);
  // My message
  const outgoingDiv = document.createElement("div");
  outgoingDiv.classList.add("outgoing_msg"); //background: rgb(5 114 143) none repeat scroll 0 0; <p></p>
  outgoingDiv.setAttribute("data-id", message.uuid);
  msgInput.setAttribute("room-id", message.room);

  outgoingDiv.style.cssText +=
    "display:flex; justify-content: flex-end; margin-right: 10px;";
  //incomingDiv.style.cssText += "margin-bottom: 10px;";

  const sentOut = document.createElement("div");
  sentOut.className = "sent_msg mb-0 pb-0 d-flex flex-column";
  sentOut.style.cssText += "height:auto;";

  const outImg = `
<div style="width: 90%; height: 90%; float:right; position:relative;">
  <p style="background-color: rgb(27, 172, 27, 1.651); !important; border: 1px solid rgb(0,0,0, 0.750); padding:2px !important;" >
  <img class="img" id="avatar" src=${message.image} style="max-width:100%; max-height:100%; z-index:99; background-color:white; bottom:0;  border-radius:4px;" />
  </p>
</div>
`;

  const outVideo = `
<div style="width: 90%; height: 90%; float:right; position:relative;">
  <p style="background-color: rgb(27, 172, 27, 1.651); !important; border: 1px solid rgb(0,0,0, 0.750); padding:2px !important;" >
  <video controls  class="video" id="video" width="100%" height="100%" src=${message.image} style="max-width:100%; max-height:100%; z-index:99; background-color:white; bottom:0;  border-radius:4px;" />
  </p>
</div>
`;

  const outAudio = `
<div style="width: 90%; height: 90%; float:right; position:relative;">
  <p style="background-color: rgb(27, 172, 27, 1.651); !important; border: 1px solid rgb(0,0,0, 0.750); padding:2px !important;" >
  <audio  class="audio" id="audio" controls width="100%" height="100%" src=${message.image} style="max-width:100%; max-height:100%; z-index:99; background-color:white; bottom:0;  border-radius:4px;" />
  </p>
</div>
`;

  if (message.image) {
    const orgType = message.type.slice(0, message.type.search("/"));

    const imgAvatar = document.getElementById("imgAvatar").style.display;
    const videoAvatar = document.getElementById("videoAvatar").style.display;
    const audioAvatar = document.getElementById("audioAvatar").style.display;
    /*     if (imgAvatar == "none" && videoAvatar == "none" && audioAvatar == "none") {
      message.type = null;
    }
   */

    if (orgType == "image") {
      sentOut.innerHTML += outImg;
    } else if (orgType == "video") {
      sentOut.innerHTML += outVideo;
    } else if (orgType == "audio") {
      sentOut.innerHTML += outAudio;
    }
  }

  const outFile = `
<div style="width: 90%; height: 90%; float:right;">
   <p style="display: flex; justify-content:center; align-items: center; gap:10px; background-color: rgb(27, 172, 27, 1.651); !important; border: 1px solid rgb(0,0,0, 0.750); padding:2px !important; !important"><i class="fa-sharp fa-solid fa-file" style="font-size:32px;color:red;"></i> <a href=${message.file} data-size="2 MB" style="color:white; text-decoration:none;" target="_blank">${message.fileName}</a></p>
</div>
`;

  if (message.file) {
    sentOut.innerHTML += outFile;
  }

  const outgoingMsg = `
          <p style="background-color: rgb(27, 172, 27); !important" >${message.text}</p>
  `;
  const msg = msgInput.value.trim();
  if (message.text) {
    sentOut.innerHTML += outgoingMsg;
  }

  const time = `<div><span class="time_date" style="">${message.date} @ ${message.time}</span></div>`;
  sentOut.innerHTML += time;

  const delBtn = `
  <div id="${message.uuid}" class="d-none" style="margin-top:-2px; position:relative;">
  <form action="/deletemsg" name="msgform-${message.uuid}" id="msgform-${message.uuid}" method="post" >
  <button id="delBtn" onclick="document.getElementById('msgform-${message.uuid}').submit(e => e.preventDefault()); return false;" style=" width:32px; height:auto;">
  <input type="hidden" name="uuid" value="${message.uuid}">
    <i style="color: red; width:30px; height:20px;  margin-right: 1em; cursor:pointer; display:block" class="fa-solid fa-trash"></i>
    </button>
  </form>
  </div>
  `;

  outgoingDiv.innerHTML += delBtn;

  outgoingDiv.appendChild(sentOut);

  // Other message
  const incomingDiv = document.createElement("div");
  incomingDiv.classList.add("incoming_msg"); //background: rgb(5 114 143) none repeat scroll 0 0; <p></p>
  outgoingDiv.style.cssText +=
    "display:flex; justify-content: flex-end; margin-right: 10px;";
  //incomingDiv.lastElementChild.style.cssText = "margin-bottom: 1.2em;";

  const sentIn = document.createElement("div");
  sentIn.className = "received_msg mr-2 mb-0 pb-0 d-flex flex-column";
  sentIn.style.cssText += "height:auto;";

  const inImg = `
          <div style="width: 80%; height: 80%; float:right; position:relative;">
          <div class="received_withd_msg " style="">
            <p style="background-color: rgb(5 114 143); !important; border: 1px solid rgb(0,0,0, 0.750); padding:2px !important;" >
            <img class="img" id="avatar" src=${message.image} style="max-width:100%; max-height:100%; z-index:99; background-color:white; bottom:0;  border-radius:4px;" />
            </p>
          </div>
          </div>
          `;

  const inVideo = `
          <div style="width: 80%; height: 80%; float:right; position:relative;">
          <div class="received_withd_msg " style="">
            <p style="background-color: rgb(5 114 143); !important; border: 1px solid rgb(0,0,0, 0.750); padding:2px !important; " >
            <video controls  class="video" id="video" width="100%" height="100%" src=${message.image} style="max-width:100%; max-height:100%; z-index:99; background-color:white; bottom:0;  border-radius:4px;" />
            </p>
          </div>
          </div>
          `;

  const inAudio = `
          <div style="width: 80%; height: 80%; float:right; position:relative;">
          <div class="received_withd_msg  " style="">
            <p style="background-color: rgb(5 114 143); !important; border: 1px solid rgb(0,0,0, 0.750); padding:2px !important;" >
            <audio  class="audio" id="audio" controls width="100%" height="100%" src=${message.image} style="max-width:100%; max-height:100%; z-index:99; background-color:white; bottom:0;  border-radius:4px; " />
            </p>
            </div>
          </div>
          `;

  if (message.image) {
    const orgType = message.type.slice(0, message.type.search("/"));
    if (orgType == "image") {
      sentIn.innerHTML += inImg;
    }
    if (orgType == "video") {
      sentIn.innerHTML += inVideo;
    }
    if (orgType == "audio") {
      sentIn.innerHTML += inAudio;
    }
  }

  const inFile = `
            <div style="width: 80%; height: 80%; float:right;">
            <div class="received_withd_msg  " style="">
               <p style="display: flex; justify-content:center; align-items: center; gap:10px; background-color: rgb(5 114 143); !important; border: 1px solid rgb(0,0,0, 0.750); padding:2px !important; !important"><i class="fa-sharp fa-solid fa-file" style="font-size:32px;color:red;"></i> <a href=${message.file} data-size="2 MB" style="color:white; text-decoration:none;" target="_blank">${message.fileName}</a></p>
            </div>
            </div>
          `;
  if (message.file) {
    sentIn.innerHTML += inFile;
  }

  const inMsg = `
            <div class="received_withd_msg " style="">
              <p style="max-width: 80%; width: 100%; word-break: break-all; hyphens: auto; background: rgb(5 114 143); ">${message.text}</p>
            </div>
  
    `;
  if (message.text) {
    sentIn.innerHTML += inMsg;
  }

  const inTime = `<div><span class="time_date">${message.date} @ ${message.time}</span></div>`;
  sentIn.innerHTML += inTime;

  incomingDiv.appendChild(sentIn);
  incomingDiv.lastElementChild.style.cssText +=
    "margin-bottom: 1.2em !important;";

  if (message.username == userSingleStrr.fullname) {
    chatHistory.appendChild(outgoingDiv);
  } else {
    chatHistory.appendChild(incomingDiv);
  }

  sentOut.onclick = () => {
    const msgDel = document.getElementById(`${message.uuid}`);
    msgDel.classList.toggle("d-none");
    //console.log("sentOut",sentOut);
  };
};

if ((room = "undefined")) {
  if (chatHistory) {
    chatHistory.style.setProperty("display", "none", "important");
  }
  if (typeMsg) {
    typeMsg.style.setProperty("display", "none", "important");
  }
}

let My;
//console.log("usersList",usersList);
const inboxChat = document.querySelector(".inbox_chat");

const getUserList = () => {
  usersList.map((users, i) => {
    const getSingleChat = (event, id, i) => {
      if (id) {
        document.querySelector(".chat_list").display = "none";
        chatHistory.style.setProperty("display", "block", "important");
        typeMsg.style.setProperty("display", "block", "important");

        const chatListAll = document.querySelectorAll(".chat_list");
        if (chatList) {
          chatListAll.forEach(function (el) {
            el.classList.remove("active_chat");
          });
          chatList.classList.add("active_chat");
        }
      } else {
      }
      //console.log(isRoom);
      //console.log("roomId: ",roomId);
    };

    const chatList = document.createElement("div");
    //console.log(users);
    chatList.setAttribute("id", users._id);
    chatList.setAttribute("list-id", users._id);
    chatList.setAttribute("list-name", users.fullname);

    // Output message to DOM
    const getChatList = () => {
      //console.log("aaaaa",chatList.getAttribute("list-id"));

      if (modal.classList == "modal fade show") {
        //console.log(inboxChat);
        if (chatList.getAttribute("list-id")) {
          inboxChat.appendChild(chatList);
          document.querySelector("#searchMsg").value = "";
          document.querySelector("#searchMsg2").value = "";
          //console.log(document.querySelector("#searchMsg").value);
        }
      }
      chatList.setAttribute("data-dismiss", "modal");

      socket.emit("chatData");

      socket.on("getData", ({ dat }) => {
        socket.off("getData");
        const chatData = dat;
        //console.log("chatData", chatData);
        //console.log("roomID", roomId);
        const singleChatData = chatData.filter(
          (item) =>
            item.room ==
              userSingleStrr._id + chatList.getAttribute("list-id") ||
            item.room == chatList.getAttribute("list-id") + userSingleStrr._id
        );
        //console.log("singleChatData", singleChatData);

        singleChatData.map(async (item) => {
          //console.log(item);
          // My message
          const outgoingDiv = document.createElement("div");
          outgoingDiv.classList.add("outgoing_msg"); //background: rgb(5 114 143) none repeat scroll 0 0; <p></p>
          outgoingDiv.setAttribute("data-id", item._id);
          msgInput.setAttribute("room-id", item.room);

          outgoingDiv.style.cssText +=
            "display:flex; justify-content: flex-end; margin-right: 10px; ";
          //incomingDiv.style.cssText += "margin-bottom: 10px;";

          const sentOut = document.createElement("div");
          sentOut.className = "sent_msg mb-0 pb-0 d-flex flex-column";
          sentOut.style.cssText += "height:auto;";

          const outImg = `
        <div style="width: 90%; height: 90%; float:right; position:relative;">
          <p style="background-color: rgb(27, 172, 27, 1.651); !important; border: 1px solid rgb(0,0,0, 0.750); padding:2px !important; " >
          <img class="img" id="avatar" src=${item.image} style="max-width:100%; max-height:100%; z-index:99; background-color:white; bottom:0;  border-radius:4px;" />
          </p>
        </div>
        `;

          const outVideo = `
        <div style="width: 90%; height: 90%; float:right; position:relative;">
          <p style="background-color: rgb(27, 172, 27, 1.651); !important; border: 1px solid rgb(0,0,0, 0.750); padding:2px !important;" >
          <video controls  class="video" id="video" width="100%" height="100%" src=${item.image} style="max-width:100%; max-height:100%; z-index:99; background-color:white; bottom:0;  border-radius:4px;" />
          </p>
        </div>
        `;

          const outAudio = `
        <div style="width: 90%; height: 90%; float:right; position:relative;">
          <p style="background-color: rgb(27, 172, 27, 1.651); !important; border: 1px solid rgb(0,0,0, 0.750); padding:2px !important;" >
          <audio  class="audio" id="audio" controls width="100%" height="100%" src=${item.image} style="max-width:100%; max-height:100%; z-index:99; background-color:white; bottom:0;  border-radius:4px;" />
          </p>
        </div>
        `;

          if (item.image) {
            const orgType = item.type.slice(0, item.type.search("/"));
            //console.log("orgType",orgType);
            if (orgType == "image") {
              sentOut.innerHTML += outImg;
            }
            if (orgType == "video") {
              sentOut.innerHTML += outVideo;
            }
            if (orgType == "audio") {
              sentOut.innerHTML += outAudio;
            }
          }

          const outFile = `
          <div style="width: 90%; height: 90%; float:right;">
             <p style="display: flex; justify-content:center; align-items: center; gap:10px; background-color: rgb(27, 172, 27, 1.651); !important; border: 1px solid rgb(0,0,0, 0.750); padding:2px !important; !important"><i class="fa-sharp fa-solid fa-file" style="font-size:32px;color:red;"></i> <a href=${item.file} data-size="2 MB" style="color:white; text-decoration:none;" target="_blank">${item.fileName}</a></p>
          </div>
        `;
          if (item.file) {
            sentOut.innerHTML += outFile;
          }

          const outgoingMsg = `
          <p style="background-color: rgb(27, 172, 27); !important" >${item.text}</p>
  `;
          const msg = msgInput.value.trim();
          if (item.text) {
            sentOut.innerHTML += outgoingMsg;
          }

          const time = `<div><span class="time_date" style="">${item.date}</span></div>`;
          sentOut.innerHTML += time;

          const delBtn = `
          <div id="${item.uuid}" class="d-none" style="margin-top:-2px; position:relative;">
          <form action="/deletemsg" name="msgform-${item.uuid}" id="msgform-${item.uuid}" method="post" >
          <button id="delBtn" onclick="document.getElementById('msgform-${item.uuid}').submit(e => e.preventDefault()); return false;" style=" width:32px; height:auto;">
          <input type="hidden" name="uuid" value="${item.uuid}">
            <i style="color: red; width:30px; height:20px;  margin-right: 1em; cursor:pointer; display:block" class="fa-solid fa-trash"></i>
            </button>
          </form>
          </div>
          `;

          outgoingDiv.innerHTML += delBtn;

          outgoingDiv.appendChild(sentOut);

          outgoingDiv.lastElementChild.style.cssText = "margin-bottom: 1.2em;";

          // Other message
          const incomingDiv = document.createElement("div");
          incomingDiv.classList.add("incoming_msg"); //background: rgb(5 114 143) none repeat scroll 0 0; <p></p>
          outgoingDiv.style.cssText +=
            "display:flex; justify-content: flex-end; margin-right: 10px;";
          //incomingDiv.lastElementChild.style.cssText = "margin-bottom: 1.2em;";

          const sentIn = document.createElement("div");
          sentIn.className = "received_msg mr-2 mb-0 pb-0 d-flex flex-column";
          sentIn.style.cssText += "height:auto;";

          const inImg = `
        <div style="width: 80%; height: 80%; float:right; position:relative;">
        <div class="received_withd_msg " style="">
          <p style="background-color: rgb(5 114 143); !important; border: 1px solid rgb(0,0,0, 0.750); padding:2px !important;" >
          <img class="img" id="avatar" src=${item.image} style="max-width:100%; max-height:100%; z-index:99; background-color:white; bottom:0;  border-radius:4px;" />
          </p>
        </div>
        </div>
        `;

          const inVideo = `
        <div style="width: 80%; height: 80%; float:right; position:relative;">
        <div class="received_withd_msg " style="">
          <p style="background-color: rgb(5 114 143); !important; border: 1px solid rgb(0,0,0, 0.750); padding:2px !important; " >
          <video controls  class="video" id="video" width="100%" height="100%" src=${item.image} style="max-width:100%; max-height:100%; z-index:99; background-color:white; bottom:0;  border-radius:4px;" />
          </p>
        </div>
        </div>
        `;

          const inAudio = `
        <div style="width: 80%; height: 80%; float:right; position:relative;">
        <div class="received_withd_msg  " style="">
          <p style="background-color: rgb(5 114 143); !important; border: 1px solid rgb(0,0,0, 0.750); padding:2px !important;" >
          <audio  class="audio" id="audio" controls width="100%" height="100%" src=${item.image} style="max-width:100%; max-height:100%; z-index:99; background-color:white; bottom:0;  border-radius:4px; " />
          </p>
          </div>
        </div>
        `;

          if (item.image) {
            const orgType = item.type.slice(0, item.type.search("/"));
            if (orgType == "image") {
              sentIn.innerHTML += inImg;
            }
            if (orgType == "video") {
              sentIn.innerHTML += inVideo;
            }
            if (orgType == "audio") {
              sentIn.innerHTML += inAudio;
            }
          }

          const inFile = `
          <div style="width: 80%; height: 80%; float:right;">
          <div class="received_withd_msg  " style="">
             <p style="display: flex; justify-content:center; align-items: center; gap:10px; background-color: rgb(5 114 143); !important; border: 1px solid rgb(0,0,0, 0.750); padding:2px !important; !important"><i class="fa-sharp fa-solid fa-file" style="font-size:32px;color:red;"></i> <a href=${item.file} data-size="2 MB" style="color:white; text-decoration:none;" target="_blank">${item.fileName}</a></p>
          </div>
          </div>
        `;
          if (item.file) {
            sentIn.innerHTML += inFile;
          }

          const inMsg = `
          <div class="received_withd_msg " style="">
            <p style="max-width: 80%; width: 100%; word-break: break-all; hyphens: auto; background: rgb(5 114 143); ">${item.text}</p>
          </div>

  `;
          if (item.text) {
            sentIn.innerHTML += inMsg;
          }

          const inTime = `<div><span class="time_date">${item.date}</span></div>`;
          sentIn.innerHTML += inTime;

          incomingDiv.appendChild(sentIn);

          if (item.username == userSingleStrr.fullname) {
            chatHistory.appendChild(outgoingDiv);
          } else {
            chatHistory.appendChild(incomingDiv);
          }

          incomingDiv.lastElementChild.style.cssText +=
            "margin-bottom: 1.2em !important;";

          //console.log(incomingDiv.lastChild)

          //console.log(h5.getAttribute('list-fullname') ,item);
          const info = document.querySelector("#info");
          info.setAttribute("name", userSingleStrr.fullname);
          socket.on("typingg", (data) => {
            //console.log(inboxChat);
            if (data != "") {
              info.style.display = "";
              info.innerText = `yazıyor...`;
            } else {
              info.style.display = "none";
            }
          });

          sentOut.onclick = () => {
            const msgDel = document.getElementById(`${item.uuid}`);
            msgDel.classList.toggle("d-none");
          };

          chatHistory.scrollTop = chatHistory.scrollHeight;
        });
      });
      //console.log("chatdataArr",chatdataArr);
    };

    socket.on("getData", ({ dat }) => {

      socket.off("getData");
      const chatData2 = dat;
      const singleChatData2 = chatData2.filter(
        (item) =>
          item.room == userSingleStrr._id + chatList.getAttribute("list-id") ||
          item.room == chatList.getAttribute("list-id") + userSingleStrr._id
      );
      singleChatData2.map((item) => {
        //console.log("item",item);
        const day = item.date.slice(0, 6);
        //console.log(day);
        span.innerText = day;
        p.innerHTML = item.text || `<i class="fa-solid fa-file"></i> file`;

        if (item.username == userSingleStrr.fullname) {
          h5.setAttribute("list-othername", item.username);
        }

        // Chat Menu Notification Display
        const notif = document.createElement("span");
        notif.className = item.isVisit;
        notif.setAttribute("id", item.otherUser);
        notif.setAttribute("username", item.username);


        if (chatList.className == "chat_list active_chat") {
          socket.emit(
            "isVisited",
            chatList.getAttribute("list-name"),
            notif.getAttribute("id")
          );
        }
        if (
          item.isVisit == "unvisited" &&
          item.username == h5.getAttribute("list-fullname") &&
          chatList.className != "chat_list active_chat"
        ) {
          if(chatList.lastElementChild.className == "unvisited"){
            setTimeout(() => {
            chatList.lastElementChild.style.cssText +=
          "width:20px; height:20px; border-radius:50%; background-color:blue; position:absolute; right:0; margin-right:35px; margin-top:-55px; color: red; font-weight:bolder; font-size:16px; text-align:center; display:flex; justify-content:center; align-items:center; z-index:99;";
            }, 300)
          }
          chatList.appendChild(notif);
          $(".msgNotif").css("display", "block");
          if (newNotif) {
            getAudio();
            chatList.appendChild(notif);
            $(".msgNotif").css("display", "block");
          }
        }
        //console.log(users);
      });

      /* 
      // Messages Menu Notification Display
      const msgCount = document.querySelector("#msgCount");
      const msgNum = document.createElement("span");
      const notiftAll2 = document.querySelectorAll(".unvisited");
      msgNum.className = "msgNum";
      if (notiftAll2.length > 0) {
        $(".msgNum").empty();
        msgNum.innerText = notiftAll2.length;
        msgCount.appendChild(msgNum);
      } */

    });

    // chatRoomList Select          // Scrollbar Warning !!!s
    chatList.onclick = async (event) => {
      currentChat = chatList.getAttribute("id");
      const room = userSingleStrr._id + chatList.getAttribute("list-id");

      let id1 = room.slice(0, 24);
      let id2 = room.slice(24, 48);
      //console.log(id1, "id2",id2);
      const firstId = id1 + id2;
      [id1, id2] = [id2, id1];
      const newRoom = id1 + id2;

      let newIds;
      if (id1 > id2) {
        let deee = id2;
        id2 = id1;
        id1 = deee;
        newIds = id1 + id2;
      }
      if (!newIds) {
        newIds = newRoom;
      }
      const username = await userSingleStrr.fullname;

      otherUser = h5.getAttribute("list-fullname");

      socket.emit("joinRoomChat", { username, otherUser, room });

      getSingleChat(event, users._id, i);

      // Chat list clear
      $(".msg_history").empty();

      //socket.removeListener("getData");
      socket.off("getData");
      if (chatHistory.childNodes.length < 2) {
        getChatList();
      } else {
        getSingleChat(event, users._id, i);
      }

      if (document.querySelector(".unvisited")) {
        const notif = document.querySelector(".unvisited");
        socket.emit(
          "isVisited",
          chatList.getAttribute("list-name"),
          notif.getAttribute("id")
        );
        const notiftAll = document.querySelectorAll(
          `[username="${chatList.getAttribute("list-name")}"]`
        );

        /*         const diff = (a, b) => {
          return (a > b) ? (a - b) : (b - a);

      } */
        notiftAll.forEach(function (el) {
          const msgCount = document.querySelector("#msgCount");

          if (
            chatList.getAttribute("list-name") == notif.getAttribute("username")
          ) {
            el.className = "visited d-none";
            $(".msgNotif").css("display", "none");
            // Messages List Count Calculator
          }
          /*           let msgCountContent = msgCount.lastChild.textContent
          let notifAllContent = notiftAll.length
          msgCount.innerText =diff(msgCountContent, notifAllContent) */
        });
      }

      chatHistory.scrollTop =
        chatHistory.scrollHeight - chatHistory.clientHeight;
    };

    //Chat User List
    chatList.className = "chat_list";
    chatList.setAttribute("data-dismiss", "modal");
    chatList.style.cssText += "cursor:pointer;";

    const div1 = document.createElement("div");
    const div2 = document.createElement("div");
    const div3 = document.createElement("div");
    div1.className = "chat_people";
    div2.className = "chat_img";
    const img = document.createElement("img");
    img.src =
      users.user_image || "https://ptetutorials.com/images/user-profile.png";
    img.alt = "User";
    div3.className = "chat_ib";
    const h5 = document.createElement("h5");
    h5.className = "msgUserName";
    h5.setAttribute("list-fullname", users.fullname);
    const span = document.createElement("span");
    const p = document.createElement("p");
    h5.innerText = users.fullname;
    span.innerText = "";
    span.className = "chat_date";
    span.style.cssText += "margin-top:25px;";
    h5.appendChild(span);
    p.innerText = "";
    div3.appendChild(h5);
    div3.appendChild(p);
    div2.appendChild(img);
    div1.appendChild(div2);
    div1.appendChild(div3);
    chatList.appendChild(div1);

    //console.log(chatDataString);

    // modal add contacts
    if (document.querySelector(".inbox_chat2")) {
      document.querySelector(".inbox_chat2").appendChild(chatList);
    }

    // My hidden.
    if (userSingleStrr.fullname == h5.getAttribute("list-fullname")) {
      My = chatList;
      chatList.style.display = "none";
    }

    socket.emit("chatData");
    socket.on("getData", ({ dat }) => {
      socket.off("getData");
      const chatData2 = dat;
      //console.log("chatDataaaa",chatData2);

      const singleChatData2 = chatData2.filter(
        (item) =>
          item.room == userSingleStrr._id + chatList.getAttribute("list-id") ||
          item.room == chatList.getAttribute("list-id") + userSingleStrr._id
      );

      //console.log("chatData2",chatData2);
      //console.log("singleChatData2",singleChatData2);

      const changeContact = () => {
        singleChatData2.map((item) => {
          if (
            item.otherUser == h5.getAttribute("list-fullname") ||
            item.username == h5.getAttribute("list-fullname")
          ) {
            h5.classList.add("msgUser");

            inboxChat.appendChild(chatList);
          }
        });
        document.querySelector("#searchMsg").value = "";
        document.querySelector("#searchMsg2").value = "";
      };
      changeContact();
    });
    if (otherUser) {
      if (otherUser == chatList.getAttribute("list-name")) {
        chatList.className = "chat_list active_chat";
      }
    }
  });
};

getUserList();

if (document.querySelector("#refBtn")) {
  document.querySelector("#refBtn").addEventListener("click", () => {
    // Chat list clear

    $(".inbox_chat").empty();
    $(".inbox_chat2").empty();
    getUserList();
  });
}

// Block List Search
const blockArr = [];
setTimeout(() => {
  if (inboxChat) {
    inboxChat.childNodes.forEach((item) => blockArr.push(item));
  }
  blockArr.splice(0, 1);
  const prodInput = document.querySelector("#searchMsg");
  if (prodInput) {
    prodInput.onkeyup = function () {
      myFunction();
    };
  }
  function myFunction() {
    var filter, i, txtValue;
    filter = prodInput.value.toLowerCase();
    const ul = blockArr;
    pArr = [];
    blockArr.map((item) =>{
      pArr.push(item.getElementsByClassName("msgUserName")[0])
    }
    );
    let p = [];
    pArr.map((a) => {
      if (a.className == "msgUserName msgUser") {
        p.push(a);
      }
    });

    for (i = 0; i < p.length; i++) {
      txtValue = p[i].textContent.toLowerCase();;
/*       const span = document.querySelector(".chat_date").innerText;
      txtValue = txtValue.slice(0, txtValue.search(span)).toLowerCase(); */

      if (txtValue.indexOf(filter) > -1) {
        ul[i].style.display = "";
      } else {
        ul[i].style.setProperty("display", "none", "important");
      }
    }
  }
}, 1000);

// Modal List Search

const blockList = document.querySelector(".inbox_chat2");
const noneArr = [];

const neArr = [];

if (blockList) {
  blockList.childNodes.forEach((item) => {
    //console.log("item",item);
    noneArr.push(item);
  });
}

noneArr.splice(0, 1);
noneArr.splice(noneArr.indexOf(My), 1);


//console.log(blockList.childNodes);
const prodInput2 = document.querySelector("#searchMsg2");
if (prodInput2) {
  prodInput2.onkeyup = function () {
    myFunction2();
  };
}

function myFunction2() {
  var filter2, i2, txtValue2;
  filter2 = prodInput2.value.toLowerCase();
  pArr2 = [];

  noneArr.map((item) => {
    pArr2.push(item.getElementsByClassName("msgUserName")[0]);

    blockList.childNodes.forEach((element) => {
      if (element === item) {
        neArr.push(element);
      }
    });
  });
  //console.log("neArr",neArr);

  //console.log("pArr2",pArr2);

  let p = [];
  pArr2.map((a) => {
    if (a.className == "msgUserName") {
      p.push(a);
    }
  });
  //console.log("pArr2",pArr2);
  //p= pArr2;


  for (i2 = 0; i2 < p.length; i2++) {
    txtValue2 = p[i2].textContent.toLowerCase();
    //const span2 = document.querySelector(".chat_date").innerText;
    //console.log("span",span2);
    //txtValue2 = txtValue2.slice(0, txtValue2.search(span2)).toLowerCase();
    //console.log("txtValue2",txtValue2);
    if (txtValue2.indexOf(filter2) > -1) {
      neArr[i2].style.display = "";
    } else {
      neArr[i2].style.setProperty("display", "none", "important");
    }
  }
}

const roomList = () => {
  socket.emit("chatList", () => {});
};

// Get room and users
socket.on("roomUsersChat", ({ room, users }) => {
  outputRoomName(room);
  outputUsers(users);
});

// Add room name to Dom
const outputRoomName = (room) => {
  //roomName.innerText = room;
  //console.log("outputRoom", room);
};

// Add users to Dom
const outputUsers = (users) => {
  //usersName.innerText = users
  users.map((item) => {
    console.log("outputUsers", item);
  });
};
