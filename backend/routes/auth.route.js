//signup, login and logout

import express from "express";
import {login, logout, signup} from "../controllers/auth.controller.js";

const router = express.Router();

// run signup, login and logout controllers
router.post("/signup", signup)
router.post("/login", login)
router.post("/logout", logout)

export default router;