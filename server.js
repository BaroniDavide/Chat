const fs = require('fs');
const express = require("express");
const http = require("http");
const path = require("path");
const bodyParser = require("body-parser");
const { Server } = require('socket.io');

const app = express();
const conf = JSON.parse(fs.readFileSync("./conf.json"));
const server = http.createServer(app);
const io = new Server(server);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/", express.static(path.join(__dirname, "public")));

let userList = []; // Lista utenti con nome e socketId

io.on('connection', (socket) => {
    console.log("socket connected: " + socket.id);

    socket.on("setName", (name) => {
        userList.push({ socketId: socket.id, name });
        io.emit("chat", `✅ ${name} si è unito alla chat`);
        io.emit("list", userList); // aggiorna la lista per tutti
    });

    socket.on('message', (message) => {
        const user = userList.find(u => u.socketId === socket.id);
        const name = user ? user.name : "Anonimo";
        const response = `${name}: ${message}`;
        console.log(response);
        io.emit("chat", response);
    });

    socket.on("list", () => {
        socket.emit("list", userList); // risponde solo al richiedente
    });

    socket.on("disconnect", () => {
        const user = userList.find(u => u.socketId === socket.id);
        if (user) {
            io.emit("chat", `❌ ${user.name} ha lasciato la chat`);
        }
        userList = userList.filter(u => u.socketId !== socket.id);
        io.emit("list", userList); // aggiorna lista per tutti
    });
});

server.listen(conf.port, () => {
    console.log("server running on port: " + conf.port);
});
