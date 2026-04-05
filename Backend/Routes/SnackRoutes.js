import express from "express";
import {
  addSnack,
  getSnacks,
  updateSnack,
  deleteSnack,
} from "../Controllers/SnackController.js"

const snackRouter = express.Router();

snackRouter.post("/add-snack", addSnack);
snackRouter.get("/get-snack", getSnacks);
snackRouter.put("/update-snack/:id", updateSnack);
snackRouter.delete("/delete-snack/:id", deleteSnack);

export default snackRouter;