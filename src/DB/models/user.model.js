import mongoose from "mongoose";
import { GenderEnum, ProviderEnum } from "../../common/enum/user.enum.js";

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      minlength: 3,
      maxlength: 5,
      trim: true,
    },
    lastName: {
      type: String,
      required: true,
      minlength: 3,
      maxlength: 5,
      trim: true,
    },
    email: {
      type: String,
      unique: true,
      required: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      trim: true,
      minlength: 8,
    },
    phone: {
      type: String,
      required: true,
    },
    age: Number,
    gender: {
      type: String,
      enum: Object.values(GenderEnum),
      default: GenderEnum.male,
    },
    phone: {
      type: String,
      required: true,
    },
    profilePicture: String,
    confirmed: Boolean,
    provider: {
      type: String,
      enum: Object.values(ProviderEnum),
      default: ProviderEnum.system,
    },
  },
  {
    timestamps: true,
    strictQuery: true,
    toJSON: {
      virtuals: true,
    },
    toJSON: {
      virtuals: true,
    },
  },
);

userSchema
  .virtual("userName")
  .get(function () {
    return `${this.firstName}  ${this.lastName}`.trim();
  })
  .set(function (name) {
    const [firstName, lastName] = name.split(" ");
    this.set({
      firstName,
      lastName,
    });
  });

const UserModel = mongoose.models.user || mongoose.model("User", userSchema);

export default UserModel;
