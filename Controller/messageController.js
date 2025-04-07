import Message from "../Models/messageModel.js";

// GET all messages
export const getMessages = async (req, res) => {
  try {
    const messages = await Message.find()
      .sort({ createdAt: 1 })
      .populate("sender", "name")
      .populate("receiver", "name");
    res.json(messages);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch messages" });
  }
};

// POST a new message
export const createMessage = async (req, res) => {
  try {
    const { sender, receiver, content } = req.body;

    if (!sender || !receiver || !content) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const newMessage = new Message({ sender, receiver, content });
    await newMessage.save();

    res.status(201).json(newMessage);
  } catch (error) {
    console.error("Message creation error:", error);
    res.status(500).json({ error: "Failed to create message" });
  }
};
