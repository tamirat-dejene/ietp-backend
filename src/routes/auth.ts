import { login, resetPassword } from "../data/actions";
import express from "express";
import jwt from "jsonwebtoken";
import dotenv from 'dotenv';
dotenv.config({
  path: '.env'
});

const router = express.Router();

const token_secret = process.env.AUTH_REFRESH_TOKEN_SECRET;
const token_expiry = process.env.AUTH_REFRESH_TOKEN_EXPIRY;

router.post("/", (_, res) => {res.send("Register route");});
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await login(email, password);
    const token = jwt.sign(user, token_secret!, { expiresIn: token_expiry });
    res.header('Authorization', `Bearer ${token}`);
    res.status(200).json({...user, password: '****'});
  } catch (error) {
    res.status(401).json({ message: "Invalid username/password." });
  }
});

router.post("/resetpassword", async(req, res) => {
  const { email, old_password, new_password } = req.body;

  try {
    await resetPassword(email, old_password, new_password)
    res
      .status(200)
      .json({ message: "Password has been reset successfully." });
  } catch (error) {
    res.status(401).json({ message: (error as Error).message });
  }
});

router.post("/logout", (_, res) => {
  res.send("Logout route");
});

export default router;
