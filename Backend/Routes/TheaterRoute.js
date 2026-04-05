import express from "express";
import { getTheatres, addTheatre, deleteTheatre, updateTheatre } from "../Controllers/TheaterController.js";

const theatreRouter = express.Router();

theatreRouter.post("/add-theatre", addTheatre);
theatreRouter.get("/get-theatre", getTheatres);
theatreRouter.put("/update-theatre/:id", updateTheatre); // Added this
theatreRouter.delete("/delete-theatre/:id", deleteTheatre);

export default theatreRouter;