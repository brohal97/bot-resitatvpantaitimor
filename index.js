require('dotenv').config();
const express = require('express');
const TelegramBot = require('node-telegram-bot-api');

const app = express();
app.use(express.json());

const bot = new TelegramBot(process.env.BOT_TOKEN); // 🚫 TIADA polling
console.log("🤖 BOT Railway AKTIF – Uji Cuba Caption");

app.post('/hantar-caption', async (req, res) => {
  const { text, groupId } = req.body;

  if (!text || !groupId) {
    return res.status(400).send("❌ 'text' atau 'groupId' tidak lengkap");
  }

  try {
    await bot.sendMessage(groupId, text, {
      reply_markup: {
        inline_keyboard: [[{ text: '📸 Upload Resit (ujian)', callback_data: 'dummy' }]]
      }
    });
    console.log("✅ Caption berjaya dihantar ke Telegram");
    res.status(200).send("✅ Caption berjaya dihantar ke Telegram");
  } catch (err) {
    console.error("❌ Gagal hantar caption:", err.message);
    res.status(500).send("❌ Gagal hantar ke Telegram");
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Express server aktif di port ${PORT}`);
});
