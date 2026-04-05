import express from "express";
import {
  addShow,
  getShows,
  updateShow,
  deleteShow,
} from "../Controllers/ShowController.js"

const showRouter = express.Router();

showRouter.post("/add-show", addShow);
showRouter.get("/get-show", getShows);
showRouter.put("/update-show/:id", updateShow);
showRouter.delete("/delete-show/:id", deleteShow);

export default showRouter;