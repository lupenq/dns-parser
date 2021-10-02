import puppeteer from 'puppeteer'
import TelegramBot from 'node-telegram-bot-api'
import dotenv from  'dotenv'

dotenv.config()

const TOKEN = process.env.TELEGRAM_TOKEN
const CHAT_ID = process.env.CHAT_ID

const HASHES = ['027b1e6d3e890811', '313bfd9ae69beb76']

const bot = new TelegramBot(TOKEN, { polling: true });

const checkDNS = async hash => {
  const browser = await puppeteer.launch({ headless: false });
  const context = await browser.createIncognitoBrowserContext();
  const page = await context.newPage();

  try {
    await page.goto(`https://www.dns-shop.ru/ordering/${hash}/data/avails.json`);
    const response = JSON.parse(await page.$eval('body', e => e.textContent))

    if (!Object.values(response).filter(Boolean).length) {
      await bot.sendMessage(CHAT_ID, `GO https://www.dns-shop.ru/ordering/${hash}/`)
    }
  } catch (e) {
    console.error(e)
  }

  await browser.close();
};

setInterval(() => {
  HASHES.forEach(checkDNS)
}, 10000)