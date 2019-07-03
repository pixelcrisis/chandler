// Chandler
// A Discord Bot

let bot = require('./data/config.json')

const Discord = require('discord.js')

const speaks = require('./plugins/speaks.js')
const editor = require('./plugins/editor.js')
const shifty = require('./plugins/shifty.js')
const zoning = require('./plugins/zoning.js')

const Client = new Discord.Client()

Client.on('ready', () => {
  Client.user.setActivity('stuff.', { type: 'LISTENING' })
  console.info("Booted.")
  bot.ready = true
})

Client.on('message', (msg) => {
  if (!bot.ready || !msg.member || msg.author.bot) return
  if (msg.content.indexOf(bot.prefix) !== 0) return

  let opts = msg.content.slice(bot.prefix.length).trim().split(/ +/g)
  let cmd = opts.shift().toLowerCase()

  if (zoning[cmd]) return zoning[cmd](msg, opts)

  // these plugin commands are mod-gated
  if (!msg.member.roles.has(bot.modID)) return
  if (speaks[cmd]) return speaks[cmd](msg, opts)
  if (editor[cmd]) return editor[cmd](msg, opts)
  if (shifty[cmd]) return shifty[cmd](msg, opts)
})

Client.login(bot.token)