require('dotenv').config();
const express = require('express');
const TelegramBot = require('node-telegram-bot-api');

const bot = new TelegramBot(process.env.BOT_TOKEN, { polling: true });
const app = express();
app.use(express.json());

let latestCaption = null;
let originalCaptionMessageId = null;
let waitingForProduk = null;

bot.on('message', async (msg) => {
  const chatId = msg.chat.id;
  const messageId = msg.message_id;
  const text = msg.text;

  if (!text || msg.photo || msg.document || msg.caption || msg.reply_to_message) return;

  await bot.deleteMessage(chatId, messageId).catch(() => {});
  const sent = await bot.sendMessage(chatId, `*${text}*`, {
    parse_mode: "Markdown",
    reply_markup: {
      inline_keyboard: [
        [{ text: "✅ Upload Resit", callback_data: `upload_${messageId}` }]
      ]
    }
  });

  latestCaption = text;
  originalCaptionMessageId = sent.message_id;
  waitingForProduk = sent.message_id;
});

bot.on('callback_query', async (query) => {
  const chatId = query.message.chat.id;
  const messageId = query.message.message_id;
  const data = query.data;

  if (data === 'upload_produk') {
    const sent = await bot.sendMessage(chatId, '❗️𝐒𝐢𝐥𝐚 𝐇𝐚𝐧𝐭𝐚𝐫 𝐑𝐞𝐬𝐢𝐭 𝐒𝐞𝐠𝐞𝐫𝐚❗️', {
      reply_markup: { force_reply: true },
      reply_to_message_id: messageId
    });

    setTimeout(() => {
      bot.deleteMessage(chatId, sent.message_id).catch(() => {});
    }, 60000);

    waitingForProduk = sent.message_id;
  }
});

app.post('/hantar-caption', async (req, res) => {
  const { text, groupId } = req.body;

  if (!text || !groupId) {
    return res.status(400).send("❌ 'text' atau 'groupId' tidak lengkap");
  }

  try {
    const sent = await bot.sendMessage(groupId, text, {
      reply_markup: {
        inline_keyboard: [[{ text: '📸 Upload Resit', callback_data: 'upload_produk' }]]
      }
    });

    latestCaption = text;
    originalCaptionMessageId = sent.message_id;
    waitingForProduk = sent.message_id;

    console.log("✅ Caption dari Google Sheet dihantar:", sent.message_id);
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
