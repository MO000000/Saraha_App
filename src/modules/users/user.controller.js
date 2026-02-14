import { Router } from "express";
import * as US from "./user.service.js";

const userRouter = Router();

userRouter.post("/SignUp", US.SignUp);
userRouter.post("/SignIn", US.SignIn);
userRouter.get("/profile/:id", US.getProfile);
