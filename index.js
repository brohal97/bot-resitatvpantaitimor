// 📦 Setup Asas
require('dotenv').config();
const express = require('express');
const TelegramBot = require('node-telegram-bot-api');

const app = express();
app.use(express.json());

// 🤖 Aktifkan BOT dengan Polling
const bot = new TelegramBot(process.env.BOT_TOKEN, { polling: true });
console.log("🤖 BOT AKTIF (POLLING MODE)");

// 📩 Terima mesej dari Google Sheets / Postman
app.post('/hantar-caption', async (req, res) => {
  const { text } = req.body;

  try {
    const sent = await bot.sendMessage(process.env.GROUP_ID, text + '\n\n#trigger_gsheet_caption', {
      reply_markup: {
        inline_keyboard: [
          [{ text: '📸 Upload Gambar Produk', callback_data: 'upload_produk' }]
        ]
      }
    });

    res.status(200).send('✅ Caption dihantar oleh bot');
  } catch (err) {
    console.error('❌ Gagal hantar caption:', err.response?.data || err.message);
    res.status(500).send('❌ Gagal hantar caption: ' + (err.response?.data?.description || err.message));
  }
});

// 🚀 Aktifkan Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server aktif di port ${PORT}`);
});
