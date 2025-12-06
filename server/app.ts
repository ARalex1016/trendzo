import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import morgan from "morgan";

import { env } from "./Config/env.config.ts";
import router from "./Routes/index.ts";

const app = express();

// Middlewares
app.use(
  cors({
    origin: "http://localhost:5173", // your frontend domain
    credentials: true,
  })
);
app.use(cookieParser());
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
if (env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

app.use("/api", router);

export default app;
