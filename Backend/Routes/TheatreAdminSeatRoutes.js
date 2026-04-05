import express from "express";
import {
  createSeats,
  getSeats,
  bookSeat,
} from "../Controllers/TheaterAdminSeatController.js";

const router = express.Router();

router.post("/create", createSeats);
router.get("/", getSeats);
router.put("/book/:seatId", bookSeat);

export default router;
