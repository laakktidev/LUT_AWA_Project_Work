import express from "express";
import cors from "cors";
import morgan from "morgan";

import userRouter from "./routes/user";
import documentRouter from "./routes/document";
import documentLockRoutes from "./routes/documentLock";
import documentPublicRouter from "./routes/documentPublic";

const app = express();

app.use(morgan("dev"));
app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get("/", (req, res) => {
  res.status(200).json({ message: "Server is running!" });
});

app.use("/api/user", userRouter);
app.use("/api/document", documentRouter);
app.use("/api/documentLock", documentLockRoutes);
app.use("/public", documentPublicRouter);

app.use("/uploads", express.static("uploads"));

export default app;
