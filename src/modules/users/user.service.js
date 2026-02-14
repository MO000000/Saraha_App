import { ProviderEnum } from "../../common/enum/user.enum.js";
import UserModel from "../../DB/models/user.model.js";
import * as db_service from "../../DB/db.service.js";
import {
  decrypt,
  encrypt,
} from "../../common/utils/security/encrypt.security.js";
import { Hash, compare } from "../../common/utils/security/hash.security.js";
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
        password: Hash({ plainText: password }),
        age,
        gender,
        phone: encrypt(phone),
      },
    });
    res.status(201).json({ message: "User created successfully", data: user });
  } catch (error) {}
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
    res
      .status(200)
      .json({ message: "User logged in successfully", data: user });
  } catch (error) {}
};

export const getProfile = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await db_service.findOne({
      model: UserModel,
      filter: { _id: id },
      select: "-password",
    });
    if (!user) throw new Error("User not found", { cause: 404 });
    res.status(200).json({
      message: "User found successfully",
      data: { ...user._doc, phone: decrypt(user.phone) },
    });
  } catch (error) {}
};
