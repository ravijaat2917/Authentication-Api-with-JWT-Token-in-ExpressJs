import express from "express";
import usercontroller from "../controllers/userController.js";
import checkUserAuth from "../middlewares/authMiddleware.js";

const router = express.Router();

// route level middleware to protect Route
// router.use('/changepassword',checkUserAuth)

// Public Routes
router.post("/register", usercontroller.userRegistration);
router.post("/login", usercontroller.userLogin);
router.post(
  "/send-reset-password-email",
  usercontroller.sendUserPasswordResetEmail
);

// Protected Routes
router.post("/changepassword", checkUserAuth, usercontroller.changePassword);
router.get("/user/profile", checkUserAuth, usercontroller.loggedUser);

export default router;
