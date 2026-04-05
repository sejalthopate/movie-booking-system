import express from "express";
import { createBooking, getUserBookings } from "../Controllers/UserBookingController";

const userBookingRouter = express.Router();

userBookingRouter.post("/user/book", createBooking);
userBookingRouter.get("/user/:userId", getUserBookings);

export default userBookingRouter;
