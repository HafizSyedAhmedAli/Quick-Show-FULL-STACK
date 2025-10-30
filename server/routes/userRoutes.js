import express from "express";
import {
  getFavorites,
  getUserBookings,
  updateFavorite,
} from "../controllers/userController.js";

const userRouter = express.Router();

userRouter.get("/bookings", getUserBookings);
userRouter.post("/my-favorite", updateFavorite);
userRouter.get("/favorites", getFavorites);

export default userRouter;
