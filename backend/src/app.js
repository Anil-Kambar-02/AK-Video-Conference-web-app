import express from "express";
import { createServer } from "node:http";
import dns from "node:dns";
import { Server } from "socket.io";
import mongoose from "mongoose";
import cors from "cors";
import "dotenv/config";
import { connectToSocket } from "./controllers/socketManager.controller.js";
import userRoutes from "./routes/user.routes.js";

dns.setServers(["8.8.8.8", "1.1.1.1"]);

const app = express();
const server = createServer(app);
const io = connectToSocket(server);

app.set("port", process.env.PORT || 8000);
app.use(cors());
app.use(express.json({ limit: "40kb" }));
app.use(express.urlencoded({ limit: "40kb", extended: true }));

app.use("/api/v1/users", userRoutes);

app.get("/", (req, res) => {
  res.json({ Hello: "World" });
});

const start = async () => {
  try {
    const connectionDB = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`MONGO Connected DB Host: ${connectionDB.connection.host}`);

    app.listen(app.get("port"), () => {
      console.log(
        `SERVER LISTING ON http://localhost:${process.env.PORT || 8000}`,
      );
    });
  } catch (error) {
    console.error(
      "MongoDB connection failed. Check DNS, the Atlas IP access list, and MONGODB_URI.",
      error,
    );
    process.exitCode = 1;
  }
};

start();
