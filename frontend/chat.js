let socket = io("http://localhost:4500", { transports: ["websocket"] });

const urlparams = new URLSearchParams(window.location.search);
const username = urlparams.get("q");
const room = 101;

socket.emit("setUsername", { username, room });

socket.on("userSet", (data) => {
  message(data);
});

socket.on("allusers", ({ room, users }) => {
  allusers(room, users);
});

function message(message) {
  const div = document.getElementById("container");
  const p = document.createElement("p");
  const random = Math.random();
  p.innerHTML = `
  <div class="message" id= "${random}" >
  <p class=text>${message.text}</p>
  <p class="meta">${message.username} <span class="time">${message.time}</span></p>
  </div>`;
  div.appendChild(p);

  const msg = document.getElementById(random);

  if (message.username == username) msg.classList.add("right");
}

function sendMessage() {
  var msgbox = document.getElementById("message");
  const msg = msgbox.value;
  msgbox.value = "";
  msgbox.focus();
  if (msg) {
    socket.emit("msg", { message: msg });
  }
}

function allusers(room, users) {
  const allusers = document.getElementById("allusers");
  const usersroom = document.getElementById("room");
  allusers.innerHTML = "";
  usersroom.innerHTML += room;
  let x = users
    .map((user) => {
      return `<div class="allusers">${user.username}</div>`;
      // allusers.innerHTML += user.username + " | | ";
    })
    .join("");

  allusers.innerHTML = x;
}

function leaveroom() {
  const msg = prompt("Are you sure", " 1 | | 0");
  if (msg == 1) {
    window.location.href = "./index.html";
  }
  // socket = io("http://localhost:4500/my-namespace", {
  //   transports: ["websocket"],
  // });
}
