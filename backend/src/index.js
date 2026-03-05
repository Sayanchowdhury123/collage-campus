import dotenv from "dotenv";
dotenv.config();
import express from "express";
import { dbConnect } from "./config/db.js";
import cors from "cors";
import authroutes from "./routes/userRoutes.js";
import proflieRoutes from "./routes/profileRoutes.js";
import postRoutes from "./routes/PostRoutes.js";
import homeroutes from "./routes/Homeroutes.js";
import grouproutes from "./routes/GroupRoutes.js";
import ResourceRoutes from "./routes/ResourceRoutes.js";
import http from "http";
import { Server } from "socket.io";
import Notification from "./models/Notification.js";

const app = express();
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));

app.use("/auth", authroutes);
app.use("/profile", proflieRoutes);
app.use("/post", postRoutes);
app.use("/home", homeroutes);
app.use("/group", grouproutes);
app.use("/resource", ResourceRoutes);

dbConnect();

const PORT = process.env.PORT || 9000;

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "https://collage-campus.vercel.app",
    methods: ["GET", "POST"],
  },
});

const OnlineUsers = new Map();

io.on("connection", (socket) => {
  console.log("socket connected");

  socket.on("addUser", (userid) => {
    OnlineUsers.set(userid, socket.id);
    console.log(`${userid} connected`);
  });

  socket.on("sendNotification", async (data) => {
    const { senderid, receiver, message } = data;
    const reciverSocket = OnlineUsers.get(receiver);

    const newNotification = await Notification.create({
      sender: senderid,
      receiver,
      message,
    });

    if (reciverSocket) {
      io.to(reciverSocket).emit("newNotification", {
        message,
        receiver,
        senderid,
        createdAt: new Date(),
      });
    }
  });

  socket.on("disconnect", () => {
    for (const [userId, socketId] of OnlineUsers.entries()) {
      if (socketId === socket.id) OnlineUsers.delete(userId);
    }
  });
});

server.listen(PORT, () => {
  console.info(`server runnig on ${process.env.PORT} port`);
});
