import { VerifyToken } from "../utils/token.service.js";
import UserModel from "../DB/models/user.model.js";
import * as db_service from "../DB/db.service.js";

export const isAuthenticated = async (req, res, next) => {
  try {
    const { authorization } = req.headers;
    if (!authorization) throw new Error("Unauthorized", { cause: 401 });

    const [prefix, token] = authorization.split(" ");
    if (prefix !== "Bearer" || !token)
      throw new Error("Unauthorized", { cause: 401 });

    const decoded = VerifyToken({
      token: token,
      SECRET_KEY: "muhammad",
    });
    if (!decoded || !decoded?.id)
      throw new Error("Invalid token", { cause: 401 });

    const user = await db_service.findById({
      model: UserModel,
      id: decoded.id,
      select: "-password",
    });
    if (!user) throw new Error("User not found", { cause: 404 });

    req.user = user;
    next();
  } catch (error) {}
};
