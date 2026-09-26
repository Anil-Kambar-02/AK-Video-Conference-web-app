import { Router } from "express";
import multer from "multer";
import { register, login } from "../controllers/user.controller.js";

const router = Router();
const upload = multer();

router.route("/register").post(upload.none(), register);
router.route("/login").post(upload.none(), login);
router.route("/add_to_activity");
router.route("/get_all_activity");

export default router;
