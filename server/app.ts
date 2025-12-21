import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import morgan from "morgan";

import { env } from "./Config/env.config.ts";
import router from "./Routes/index.route.ts";
import { globalErrorHandler } from "./Controllers/errorController.ts";

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

app.use((req, res) => {
  res.status(404).json({
    status: "fail",
    message: `Cannot find ${req.originalUrl} on this server!`,
  });
});

// Global error handling middleware
app.use(globalErrorHandler);

export default app;
