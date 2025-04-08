import express from "express";
import {
    getMessages,
    getMessagesBetweenUsers,
    createMessage,
    deleteMessage,
} from "../controllers/messageController.js";

const router = express.Router();

router.get("/", getMessages);
router.get("/:user1/:user2", getMessagesBetweenUsers);
router.post("/", createMessage);
router.delete("/:id", deleteMessage);
export default router;
