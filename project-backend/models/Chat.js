const mongoose = require('mongoose');

const chatSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  messages: [
    {
      role: { type: String, required: true }, // 'user' or 'assistant'
      content: { type: String, required: true },
    },
  ],
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Chat', chatSchema);
