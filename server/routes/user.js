import express from "express";
import {
  login,
  logout,
  register,
  searchUser,
  updateUserDetails,
  userDetails,
} from "../controllers/user.js";

const router = express.Router();
router.post("/register", register);
router.post("/login", login);
router.get("/user-details", userDetails);
router.get("/logout", logout);
router.post("/update-user", updateUserDetails);
router.post("/search-user", searchUser);

export default router;
