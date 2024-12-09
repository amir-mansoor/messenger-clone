import express from "express";
import dotenv from "dotenv";
dotenv.config();
import connectDB from "./config/db.js";
import { notFound, errorHandler } from "./middleware/errorMiddleware.js";
import userRoutes from "./routes/userRoutes.js";
import conversationRoutes from "./routes/conversationRoutes.js";
import cors from "cors";
import cookieParser from "cookie-parser";
import messageRoutes from "./routes/messageRoutes.js";
import { Server } from "socket.io";
import http from "http";

connectDB();
const app = express();

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    credentials: true,
  },
});

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(cookieParser());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Api is running");
});

app.use("/api/users", userRoutes);
app.use("/api/conversations", conversationRoutes);
app.use("/api/messages", messageRoutes);

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

// *************** SOCKET.IO CODE STARTS FROM HERE ************************

let users = [];

const addUser = (userId, socketId) => {
  !users.some((user) => user.userId === userId) &&
    users.push({ userId, socketId });
};

const removeUser = (socketId) => {
  users = users.filter((user) => user.socketId !== socketId);
};

const getUser = (userId) => {
  return users.find((user) => user.userId === userId);
};

io.on("connection", (socket) => {
  socket.on("addUser", (userId) => {
    addUser(userId, socket.id);
  });

  socket.on("sendMessage", (data) => {
    const user = getUser(data.receiverId);
    if (user) {
      io.to(user.socketId).emit("getMessage", {
        sender: data.senderId,
        text: data.text,
        conversationId: data.conversationId,
      });
    }
  });

  socket.on("disconnect", () => {
    removeUser(socket.id);
  });
});

// *************** SOCKET.IO CODE ENDS HERE

server.listen(PORT, () => {
  console.log(`server listening on port ${PORT}`);
});
