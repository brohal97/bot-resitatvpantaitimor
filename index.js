require('dotenv').config();
const TelegramBot = require('node-telegram-bot-api');
const express = require('express');
const app = express();
app.use(express.json());

const bot = new TelegramBot(process.env.BOT_TOKEN, { polling: true });
console.log("🤖 BOT AKTIF (POLLING MODE)");

const GROUP_ID = process.env.GROUP_ID;

// Endpoint untuk terima mesej dari Google Sheets atau Postman
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
