import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import httpStatus from "http-status";
import bcrypt, { hash } from "bcrypt";
import crypto from "crypto";

import { User } from "../models/user.model.js";
import mongoose from "mongoose";

const register = asyncHandler(async (req, res) => {
  const { name, username, password } = req.body ?? {};

  try {
    if (!name || !username || !password) {
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        "Name, username, and password are required fields.",
      );
    }

    const existedUser = await User.findOne({ username });
    if (existedUser) {
      throw new ApiError(
        httpStatus.CONFLICT,
        "User already exists with this username.",
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name: name,
      username: username,
      password: hashedPassword,
    });

    await newUser.save();

    return res
      .status(httpStatus.CREATED)
      .json(
        new ApiResponse(
          httpStatus.CREATED,
          null,
          "User registered successfully",
        ),
      );
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }

    console.error("User registration failed:", error);
    throw new ApiError(
      httpStatus.SERVICE_UNAVAILABLE,
      "Server is currently busy. Please try again later.",
    );
  }
});

const login = asyncHandler(async (req, res) => {
  const { username, password } = req.body ?? {};

  if (!username || !password) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "Username and password are required to log in.",
    );
  }
  try {
    const user = await User.findOne({ username });
    if (!user) {
      throw new ApiError(httpStatus.NOT_FOUND, "User Not Found");
    }

    let isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (isPasswordCorrect) {
      let token = crypto.randomBytes(20).toString("hex");
      user.token = token;
      await user.save();
      return res
        .status(httpStatus.OK)
        .json(
          new ApiResponse(
            httpStatus.OK,
            { username: user.username, token: user.token },
            `${user.username} logged in successfully`,
          ),
        );
    } else {
      return res
        .status(httpStatus.UNAUTHORIZED)
        .json(
          new ApiResponse(
            httpStatus.UNAUTHORIZED,
            null,
            "Invalid username or password",
          ),
        );
    }
  } catch (error) {
    throw new ApiError(
      httpStatus.INTERNAL_SERVER_ERROR,
      "Something went wrong on our end. Please try again later.",
    );
  }
});

export { register, login };
