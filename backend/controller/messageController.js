import asyncHandler from "../middleware/asyncHandler.js";
import Message from "../models/messageModel.js";

const sendMessage = asyncHandler(async (req, res) => {
  const { text, conversationId } = req.body;

  const message = new Message({
    conversationId: conversationId,
    text: text,
    sender: req.user._id,
  });

  await message.save();
  res.status(201).json(message);
});

const getMessagesByConversation = asyncHandler(async (req, res) => {
  const messages = await Message.find({
    conversationId: req.body.conversationId,
  });
  res.json(messages);
});

export { sendMessage, getMessagesByConversation };
