import express from "express";
import { register, login, createAdmin, createTheatreAdmin } from "../Controllers/UserController.js";
import { protect } from "../Middlewares/AuthMiddleware.js";
import { getTheatreAdmins } from "../Controllers/UserController.js";
import { changeTheatreAdminPassword } from "../Controllers/UserController.js";
const userRouter = express.Router();

// ========== USER ROUTES ==========
userRouter.post("/register", register);
userRouter.post("/login", login);

// ========== ADMIN ROUTES ==========
userRouter.post("/create-admin", createAdmin); // Admin create via Postman

// ========== THEATRE ADMIN ROUTE ==========
userRouter.post(
  "/create-theatre-admin",
                  // only logged-in
  protect(["admin"]),      // only Main Admin
  createTheatreAdmin
);
userRouter.get("/get-theatre-admins", protect(["admin"]), getTheatreAdmins);

userRouter.put(
  "/theatre-admin/change-password",
  protect(["theatreAdmin"]),
  changeTheatreAdminPassword
);
export default userRouter;
