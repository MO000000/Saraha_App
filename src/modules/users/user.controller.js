import { Router } from "express";
import * as US from "./user.service.js";
import isAuthenticated from "../../common/middleware/authentication.js";
import { validation } from "../../common/middleware/validation.js";
import * as UV from "./user.validation.js";
import { multer_local } from "../../common/middleware/multer.js";
import { MulterEnum } from "../../common/enum/multer.enum.js";

export const userRouter = Router();

userRouter.post(
  "/SignUp",
  multer_local({
    custom_types: [...MulterEnum.image, ...MulterEnum.video],
  }).single("attachment"),
  US.SignUp,
);
userRouter.post("/SignUp/Gmail", US.SignUpWithGmail);
userRouter.post("/SignIn", US.SignIn);
userRouter.get("/profile/:id", isAuthenticated, US.getProfile);
