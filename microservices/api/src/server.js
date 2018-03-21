const express = require("express");
const http = require("http");
const app = express();
const server = http.Server(app);

const bodyParser = require('body-parser');

app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
}));

const customRoutes = require("./custom-logic/routes");
const pushNotifRoutes = require("./push-notif/routes");

const socketClient = require("socket.io");
const io = socketClient(server);

app.use(customRoutes);
app.use(pushNotifRoutes);

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", req.get("origin"));
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

io.on("connection", socket => {
  socket.emit('connected', 'Welcome to the socket server');
  socket.on("message", (msg) => {
    socket.emit('message', ('The message you sent is: ' + msg));
  })
  socket.on("disconnect", () => console.log("Client disconnected"));
});

server.listen(8080, () =>{
  console.log(`Listening on port 8080`);
});
