// Chandler
// A Discord Bot

let bot  = require('./data/config.json')
const DB = require('./utils/db.js')

const Discord = require('discord.js')

const speaks = require('./plugins/speaks.js')
const editor = require('./plugins/editor.js')
const shifty = require('./plugins/shifty.js')
const zoning = require('./plugins/zoning.js')

const Client = new Discord.Client()

Client.on('ready', async () => {
  // migrate our databases
  console.info("Loading Servers...")
  let servers = Client.guilds.keyArray()
  let count = `${servers.length} Servers.`
  bot.conf = await DB.loadAll(servers)
  console.info("Loaded " + count)

  Client.user.setActivity(count, { type: 'LISTENING' })
  console.info("Booted.")
  bot.ready = true
})

Client.on('message', async (msg) => {
  let modID = await DB.get(msg.guild.id, 'modID')
  let prefix = await DB.get(msg.guild.id, 'prefix')
  if (!bot.ready || !msg.member || msg.author.bot) return
  if (msg.content.indexOf(prefix) !== 0) return

  let opts = msg.content.slice(prefix.length).trim().split(/ +/g)
  let cmd = opts.shift().toLowerCase()

  if (zoning[cmd]) return zoning[cmd](msg, opts)

  // these plugin commands are mod-gated
  const isMod = () => {
    if (msg.member.user.id == msg.member.guild.ownerID) return true
    else return msg.member.roles.has(modID)
  }

  if (!isMod) return
  if (speaks[cmd]) return speaks[cmd](msg, opts)
  if (editor[cmd]) return editor[cmd](msg, opts)
  if (shifty[cmd]) return shifty[cmd](msg, opts)
})

Client.login(bot.token)