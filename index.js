require('dotenv').config();
const express = require('express');
const TelegramBot = require('node-telegram-bot-api');

const app = express();
app.use(express.json());

const bot = new TelegramBot(process.env.BOT_TOKEN, { polling: true });

app.post('/hantar-caption', async (req, res) => {
  const { text, groupId } = req.body;

  if (!text || !groupId) {
    return res.status(400).send("❌ 'text' atau 'groupId' tidak lengkap");
  }

  try {
    const sent = await bot.sendMessage(groupId, text, {
      parse_mode: "Markdown"
    });
    console.log("✅ Caption sent:", sent.message_id);
    res.status(200).send("✅ Caption berjaya dihantar ke Telegram");
  } catch (err) {
    console.error("❌ Gagal hantar caption:", err.message);
    res.status(500).send("❌ Gagal hantar ke Telegram");
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server aktif di port ${PORT}`);
});
