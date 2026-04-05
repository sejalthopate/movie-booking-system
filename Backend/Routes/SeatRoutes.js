import express from "express";
import {
  getSeatsByShow,
  bookSeats,
} from "../Controllers/SeatController.js";

const seatRouter = express.Router();

// GET seats (movie + theatre + date + time)
seatRouter.get("/", getSeatsByShow);

// BOOK seats
seatRouter.post("/book", bookSeats);

export default seatRouter;
