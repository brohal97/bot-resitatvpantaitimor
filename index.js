require('dotenv').config();
const express = require('express');
const TelegramBot = require('node-telegram-bot-api');

const app = express();
app.use(express.json());

const bot = new TelegramBot(process.env.BOT_TOKEN, { polling: true });
console.log("🤖 BOT AKTIF – Versi Ringkas");

app.post('/hantar-caption', async (req, res) => {
  const { text, groupId } = req.body;

  if (!text || !groupId) {
    return res.status(400).send("❌ 'text' dan 'groupId' diperlukan");
  }

  try {
    await bot.sendMessage(groupId, text, {
      reply_markup: {
        inline_keyboard: [[{ text: '📸 Upload Resit', callback_data: 'upload_produk' }]]
      }
    });
    res.status(200).send("✅ Caption dihantar ke Telegram");
  } catch (err) {
    console.error("❌ Telegram Error:", err.message);
    res.status(500).send("❌ Gagal hantar ke Telegram");
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server mula di port ${PORT}`);
});
