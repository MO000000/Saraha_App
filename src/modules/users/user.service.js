import { ProviderEnum } from "../../common/enum/user.enum.js";
import UserModel from "../../DB/models/user.model.js";
import * as db_service from "../../DB/db.service.js";
import {
  decrypt,
  encrypt,
} from "../../common/utils/security/encrypt.security.js";
import { Hash, compare } from "../../common/utils/security/hash.security.js";
import {
  GenerateToken,
  VerifyToken,
} from "../../common/utils/token.service.js";
import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";
import { OAuth2Client } from "google-auth-library";
import { SALT_ROUNDS, SECRET_KEY } from "../../config/index.js";

export const SignUp = async (req, res, next) => {
  try {
    const { userName, email, password, age, gender } = req.body;
    const { phone } = req.body;
    const EmailExists = await db_service.findOne({
      model: UserModel,
      filter: { email },
    });
    if (EmailExists) throw new Error("Email already exists");

    const user = await db_service.create({
      model: UserModel,
      data: {
        userName,
        email,
        password: Hash({
          plainText: password,
          salt_rounds: SALT_ROUNDS,
        }),
        age,
        gender,
        phone: encrypt(phone),
      },
    });
    res.status(201).json({ message: "User created successfully", data: user });
  } catch (error) {}
};

export const SignUpWithGmail = async (req, res, next) => {
  const { idToken } = req.body;
  const client = new OAuth2Client();

  const ticket = await client.verifyIdToken({
    idToken: idToken,
    audience:
      "601038225286-6lc4qj0so6gc5bbtdelv16qnmmbuvhb4.apps.googleusercontent.com",
  });

  if (!ticket) throw new Error("Invalid token", { cause: 401 });
  const payload = ticket.getPayload();
  const { email, email_verified, name, picture } = payload;
  let user = await db_service.findOne({
    model: UserModel,
    filter: { email },
  });
  if (!user) {
    user = await db_service.create({
      model: UserModel,
      data: {
        userName: name,
        email,
        confirmed: email_verified,
        profilePicture: picture,
        provider: ProviderEnum.google,
      },
    });
  }

  if (user.provider == ProviderEnum.system) {
    throw new Error("User already exists", { cause: 409 });
  }

  const access_token = GenerateToken({
    payload: { id: user._id, email: user.email },
    SECRET_KEY: "muhammad",
    options: { expiresIn: "1d" },
    jwtid: uuidv4(),
  });
  res
    .status(200)
    .json({ message: "User logged in successfully", data: { access_token } });
};

export const SignIn = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await db_service.findOne({
      model: UserModel,
      filter: { email, provider: ProviderEnum.system },
    });
    if (!user) {
      throw new Error("User not found", { cause: 404 });
    }

    if (!compare({ plainText: password, cipherText: user.password })) {
      throw new Error("Invalid password", { cause: 401 });
    }

    const access_token = GenerateToken({
      payload: { id: user._id, email: user.email },
      SECRET_KEY: SECRET_KEY,
      options: { expiresIn: "1d" },
      jwtid: uuidv4(),
    });

    res
      .status(200)
      .json({ message: "User logged in successfully", data: { access_token } });
  } catch (error) {}
};

export const getProfile = async (req, res, next) => {
  res.status(200).json({
    message: "User successfully signed in",
    data: req.user,
  });
};
