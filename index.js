require('dotenv').config();
const TelegramBot = require('node-telegram-bot-api');

const bot = new TelegramBot(process.env.BOT_TOKEN, { polling: true });

bot.on('polling_error', (err) => console.error(err.message));

bot.sendMessage('-1004788635418', '✅ Ujian pengaktifan bot dari local');
console.log('🤖 Bot tempatan sedang aktif...');
