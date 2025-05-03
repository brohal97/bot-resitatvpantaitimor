require('dotenv').config();
const express = require('express');
const TelegramBot = require('node-telegram-bot-api');

const app = express();
app.use(express.json());

// ❗ BOT TANPA POLLING (guna webhook mode secara teknikal)
const bot = new TelegramBot(process.env.BOT_TOKEN);
console.log("🤖 BOT Railway AKTIF – Uji Cuba Caption");

// ✅ Respon manual untuk pastikan bot hidup
bot.on('message', (msg) => {
  if (msg.text === '/activate') {
    bot.sendMessage(msg.chat.id, '✅ Bot telah diaktifkan untuk group ini!');
  }
});

// ✅ Endpoint khas dari Google Sheets
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

    console.log("✅ Caption dihantar ke Telegram:", text);
    res.status(200).send("✅ Caption berjaya dihantar ke Telegram");
  } catch (err) {
    console.error("❌ Telegram Error:", err.message);
    res.status(500).send("❌ Gagal hantar ke Telegram: " + err.message);
  }
});

// ✅ Start Express server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Express server aktif di port ${PORT}`);
});
