// index.ts
import express, { Request, Response } from "express";
import http from "http";
import dotenv from "dotenv";
import { initializeWebSocketServer } from "./lib/websocket.js";
import ImageRouter from "./routes/arduino.js";
import AuthRouter from "./routes/auth.js";
import ReportRouter from "./routes/reports.js";
import cors from "cors";
import { logger } from "./utils/middlewares.js";

dotenv.config({ path: ".env" });

const PORT = Number(process.env.PORT) || 3000;
const HOST = process.env.HOSTNAME || "localhost";
const app = express();
const server = http.createServer(app);

const io = initializeWebSocketServer(server);
app.set("socketio", io);

app.use(cors({ origin: "*" }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use((_, res, next) => {res.header("Access-Control-Expose-Headers", "Authorization");next();});
app.use(logger);
app.get("/", (_: Request, res: Response) => {res.send("IETP Group 98, Website Backend")});

app.use("/auth", AuthRouter);
app.use("/reports", ReportRouter);
app.use("/arduino", ImageRouter);

server.listen(PORT, HOST, () => console.log(`Server is running at http://${HOST}:${PORT}`));