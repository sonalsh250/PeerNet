//signup, login and logout

import express from "express";
import {login, logout, signup, getCurrentUser} from "../controllers/auth.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

// run signup, login and logout controllers
router.post("/signup", signup)
router.post("/login", login)
router.post("/logout", logout)

//protectRoute is a middleware function. First it is validated whether actual user is accessing or not,in order to access getCurrentUser function 
router.get("/me", protectRoute, getCurrentUser);

export default router;