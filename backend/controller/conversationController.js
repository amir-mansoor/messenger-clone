import asyncHandler from "../middleware/asyncHandler.js";
import Conversation from "../models/conversationModel.js";

const createConversation = asyncHandler(async (req, res) => {
  const conversation = new Conversation({
    members: [req.user._id, req.body.id],
  });

  await conversation.save();
  res.status(201).json(conversation);
});

const getMyConversations = asyncHandler(async (req, res) => {
  const conversations = await Conversation.find({
    members: { $in: [req.user._id] },
  }).populate("members", "name phoneNumber _id");

  res.json(conversations);
});

export { createConversation, getMyConversations };
