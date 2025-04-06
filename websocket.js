const socket = io();
let username = "";

// Funzione per entrare in chat dopo aver inserito il nome
function enterChat() {
  username = document.getElementById("usernameInput").value.trim();
  if (username) {
    socket.emit("setName", username);
    document.getElementById("modal").classList.add("hidden");
    document.getElementById("chatArea").classList.remove("hidden");
  }
}

// Funzione per inviare un messaggio
function sendMessage() {
  const msgInput = document.getElementById("messageInput");
  const msg = msgInput.value.trim();
  if (msg) {
    socket.emit("message", msg);
    msgInput.value = "";
  }
}

// Gestire l'evento di messaggio
socket.on("chat", (msg) => {
  const li = document.createElement("li");
  li.textContent = msg;
  document.getElementById("chat").appendChild(li);
});

// Gestire l'evento della lista utenti
socket.on("list", (list) => {
  const ul = document.getElementById("userList");
  ul.innerHTML = ""; // svuota lista
  list.forEach(user => {
    const li = document.createElement("li");
    li.textContent = user.name;
    ul.appendChild(li);
  });
});

// Richiede la lista utenti all'avvio
socket.emit("list");
