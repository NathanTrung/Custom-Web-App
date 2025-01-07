const express = require("express");
const { queryHuggingFace } = require("../services/huggingfaceService");
const router = express.Router();

const chats = {};

// Create a new chat
router.post("/", (req, res) => {
    const chatId = Date.now().toString();
    chats[chatId] = { id: chatId, messages: [], createdAt: new Date() };
    res.status(201).json(chats[chatId]);
});

// Send a message
router.post("/:chatId/message", async (req, res) => {
    const { chatId } = req.params;
    const { role, content } = req.body;

    if (!chats[chatId]) {
        return res.status(404).json({ error: "Chat not found" });
    }

    chats[chatId].messages.push({ role, content });

    if (role === "user") {
        try {
            const response = await queryHuggingFace({ inputs: content });

            const botMessage = {
                role: "assistant",
                content: response.generated_text || "I'm sorry, I couldn't process your message.",
            };

            chats[chatId].messages.push(botMessage);
            return res.status(200).json(botMessage);
        } catch (error) {
            console.error("Error communicating with Hugging Face:", error.message);
            return res.status(500).json({ error: "Error communicating with Hugging Face" });
        }
    }

    res.status(200).json({ message: "Message received" });
});

module.exports = router;
