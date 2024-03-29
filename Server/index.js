const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const authRoute = require("./Routes/authroute");
const chatsRoute = require("./Routes/chatsroute");
const messagesroute = require("./Routes/messagesroute");
const cookieParser = require("cookie-parser");
const bodyparser = require("body-parser");
const http = require("http");
const socketIo = require("socket.io");
const dotenv = require("dotenv");
const path = require("path");

dotenv.config();

mongoose
  .connect(process.env.DATABASE_URL)
  .then(() => {
    console.log("Database connected!");
  })
  .catch((err) => {
    console.log("Database connection error: " + err);
  });

const app = express();
app.use(
  cors({
    credentials: true,
    origin: "http://localhost:5173",
  })
);

app.use(bodyparser.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

const __dirname1 = path.resolve();

app.use(express.static(path.join(__dirname1, "/client/dist")));

app.get("*", (req, res) =>
  res.sendFile(path.resolve(__dirname1, "client", "dist", "index.html"))
);

const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

io.on("connection", (socket) => {
  socket.on("joinRoom", ({ roomId }) => {
    socket.join(roomId);
  });

  socket.on("sendMessage", ({ roomId, data }) => {
    io.to(roomId).emit("receiveMessage", data);
  });

  socket.on("disconnect", () => {});
});

app.use("/chats", chatsRoute);
app.use("/auth", authRoute);
app.use("/messages", messagesroute);

server.listen(5000, () => {
  console.log("Server is running on port 5000");
});
