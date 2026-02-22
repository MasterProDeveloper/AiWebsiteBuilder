import { Router } from "express";
import { generate } from "./service";

export const aiRouter = Router();

aiRouter.post("/generate", generate);
