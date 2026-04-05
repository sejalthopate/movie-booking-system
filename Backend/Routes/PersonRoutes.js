import express from "express";
import {
  addPersonController,
  getAllPersonsController,
  getPersonByIdController,
  updatePersonController,
  deletePersonController
} from "../Controllers/PersonController.js";

const personRouter = express.Router();

// Admin
personRouter.post("/add-person", addPersonController);

// Common
personRouter.get("/get-persons", getAllPersonsController);
personRouter.get("/get-persons-by-id/:id", getPersonByIdController);
personRouter.put("/update-person/:id", updatePersonController);
personRouter.delete("/delete-person/:id", deletePersonController);
export default personRouter;
