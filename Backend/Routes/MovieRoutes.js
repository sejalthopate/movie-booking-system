import express from "express";
import { addMovie, getMovies, updateMovie, deleteMovie } from "../Controllers/MovieController.js";

const movieRouter = express.Router();

movieRouter.post("/add-movie", addMovie);
movieRouter.get("/get-movie", getMovies);
movieRouter.put("/update-movie/:id", updateMovie);
movieRouter.delete("/delete-movie/:id", deleteMovie);

export default movieRouter;
