import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import createHttpError from "http-errors";
import cookieParser from "cookie-parser";
import * as dotenv from "dotenv";
import session from "express-session";
import memorystore from "memorystore";

import db from "./storage/index";
import registrationRouter from "./routes/registration";
import authenticationRouter from "./routes/authentication";
import passkeysRouter from "./routes/passkeys";
import { handleError } from "./middleware";

dotenv.config();
const app = express();

const MemoryStore = memorystore(session);

app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(
  session({
    secret: process.env.SESSION_SECRET || "secret123",
    saveUninitialized: true,
    resave: false,
    cookie: {
      maxAge: 86400000,
      httpOnly: true // Ensure to not expose session cookies to clientside scripts
    },
    store: new MemoryStore({
      checkPeriod: 86400000 // prune expired entries every 24h
    })
  })
);
app.use(
  cors({
    origin: ["http://localhost:5173", "https://webauthn.localhost:5173"],
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS",
    credentials: true
  })
);

// router
app.use("/api/v1/webauthn", registrationRouter, authenticationRouter, passkeysRouter);

app.use(express.static("./public"));

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createHttpError(404, "Page not found!"));
});

// 自定義的錯誤處理中介軟體
app.use(handleError);

process.on("exit", () => db.close());

export default app;

declare module "express-session" {
  interface SessionData {
    currentChallenge?: string;
    loggedInUserId?: string;
  }
}
