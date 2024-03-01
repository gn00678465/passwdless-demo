import express from "express";
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
app.use("/api/v1/webauthn", registrationRouter);
app.use("/api/v1/webauthn", authenticationRouter);
app.use("/api/v1/webauthn", passkeysRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createHttpError(404, "Page not found!"));
});

process.on("exit", () => db.close());

export default app;

declare module "express-session" {
  interface SessionData {
    currentChallenge?: string;
    loggedInUserId?: string;
  }
}
