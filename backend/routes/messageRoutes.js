import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  getMessagesByConversation,
  sendMessage,
} from "../controller/messageController.js";
const router = express.Router();

router.route("/").post(protect, sendMessage);
router.route("/").get(protect, getMessagesByConversation);

export default router;
