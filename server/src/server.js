import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import { httpLogger } from "./shared/logger.js";
import { errorHandler } from "./shared/errorHandler.js";
import authRoutes from "./modules/auth/routes/auth.routes.js";
import podcastRoutes from "./modules/podcasts/routes/podcast.routes.js";
import userRoutes from "./modules/users/routes/user.routes.js";
import sequelize from "./config/database.js";
import "./modules/index.js";
import path from "path";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(
  helmet({
    crossOriginResourcePolicy: {
      policy: "cross-origin",
    },
  }),
);
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    credentials: true,
  }),
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(httpLogger);
app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 200 }));

app.get("/health", (req, res) => res.json({ status: "ok" }));
app.use("/api/auth", authRoutes);
app.use("/api/podcasts", podcastRoutes);
app.use("/api/users", userRoutes);

app.use(errorHandler);
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));
const start = async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync();
    app.listen(PORT, "0.0.0.0", () =>
      console.log(`Server running on port ${PORT}`),
    );
  } catch (error) {
    console.error("Failed to start server", error);
    process.exit(1);
  }
};

start();
