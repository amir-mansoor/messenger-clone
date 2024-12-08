import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  createConversation,
  getMyConversations,
} from "../controller/conversationController.js";
const router = express.Router();

router.route("/").post(protect, createConversation);
router.route("/").get(protect, getMyConversations);

export default router;
