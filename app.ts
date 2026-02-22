import express from "express";
import cors from "cors";
import helmet from "helmet";
import { authRouter } from "./modules/auth/routes";
import { projectRouter } from "./modules/projects/routes";
import { aiRouter } from "./modules/ai/routes";
import { billingRouter } from "./modules/billing/routes";
import { deploymentRouter } from "./modules/deployment/routes";
import { rateLimiter } from "./middleware/rateLimiter";

export const app = express();

app.use(cors());
app.use(helmet());
app.use(express.json());
app.use(rateLimiter);

app.use("/api/auth", authRouter);
app.use("/api/projects", projectRouter);
app.use("/api/ai", aiRouter);
app.use("/api/billing", billingRouter);
app.use("/api/deployment", deploymentRouter);
