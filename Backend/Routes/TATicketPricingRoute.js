import express from "express";
import {
  getTickets,
  addTicket,
  updateTicket,
  deleteTicket,
} from "../Controllers/TATicketController.js";

const router = express.Router();

router.get("/", getTickets);
router.post("/", addTicket);
router.put("/:id", updateTicket);
router.delete("/:id", deleteTicket);

export default router;
