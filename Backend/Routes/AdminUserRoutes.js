import express from "express";
import {
  getAllUsers,
  toggleBlockUser
} from "../Controllers/AdminUserController.js"

const AdminUserRouter = express.Router();

AdminUserRouter.get("/get-users", getAllUsers);
AdminUserRouter.put("/block-user/:id", toggleBlockUser);

export default AdminUserRouter;
