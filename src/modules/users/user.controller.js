import { Router } from "express";
import * as US from "./user.service.js";
import isAuthenticated from "../../common/middleware/authentication.js";

const userRouter = Router();

userRouter.post("/SignUp", US.SignUp);
userRouter.post("/SignUp/Gmail", US.SignUpWithGmail);
userRouter.post("/SignIn", US.SignIn);
userRouter.get("/profile/:id", isAuthenticated, US.getProfile);
