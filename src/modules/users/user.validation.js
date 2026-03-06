import Joi from "joi";
import { GenderEnum } from "../../common/enum/user.enum.js";

export const SignUpSchema = {
  body: Joi.object()
    .keys({
      userName: Joi.string().required(),
      email: Joi.string().email().required(),
      password: Joi.string().required(),
      cPassword: Joi.string().valid(Joi.ref("password")).required(),
      age: Joi.number().required(),
      gender: Joi.string.valid(...Object.values(GenderEnum)).required(),
      phone: Joi.string().required(),
    })
    .required(),

  query: Joi.object().keys({}).required(),
};

export const SignInSchema = {
  body: Joi.object()
    .keys({
      email: Joi.string().email().required(),
      password: Joi.string().required(),
    })
    .required(),
};
