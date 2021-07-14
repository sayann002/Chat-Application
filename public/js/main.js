const chatform = document.getElementById("chat-form");
const chatMessages = document.querySelector(".chat-messages");
const roomName = document.getElementById("room-name");
const userList = document.getElementById("users");
// GET USERNAME AND ROOM FROM URL
const { username, room } = Qs.parse(location.search, {
  ignoreQueryPrefix: true,
});
const socket = io();

// JOIN CHAT ROOM
socket.emit("joinRoom", { username, room });

// GET ROOM & USERS
socket.on("roomUsers", ({ room, users }) => {
  outputRoomName(room), outputUsers(users);
});

// MESSAGE FROM SERVER
socket.on("message", (message) => {
  console.log(message);
  outputMessage(message);

  // SCROLL MESSAGES DOWN
  chatMessages.scrollTop = chatMessages.scrollHeight;
});

// MESSAGE SUBMIT
chatform.addEventListener("submit", (e) => {
  e.preventDefault();
  // GET MESSAGE TEXT
  const msg = e.target.elements.msg.value;
  // EMIT MESSAGE TO SERVER
  socket.emit("chatMessage", msg);

  // CLEAR INPUT
  e.target.elements.msg.value = "";
  e.target.elements.msg.focus();
});

//  OUTPUT MESSAGE TO DOM
function outputMessage(message) {
  const div = document.createElement("div");
  div.classList.add("message");
  div.innerHTML = `<p class='meta'>${message.username} <span>${message.time}</span></p>
  <p class="text">
    ${message.text}
  </p>`;
  document.querySelector(".chat-messages").appendChild(div);
}

// ADD ROOM NAME TO DOM
function outputRoomName(room) {
  roomName.innerText = room;
}

// ADD USERS TO DOM
function outputUsers(users) {
  userList.innerHTML = `${users
    .map((user) => `<li>${user.username}</li>`)
    .join("")}`;
}
