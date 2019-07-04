// Chandler
// A Discord Bot

let bot  = require('./data/config.json')
const DB = require('./utils/db.js')

const Discord = require('discord.js')

const plugins = [
  require('./plugins/speaks.js'),
  require('./plugins/editor.js'),
  require('./plugins/shifty.js'),
  require('./plugins/zoning.js')  
]

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

  const canExecute = plugin => {
    // is it free? (can anyone use it)
    if (plugin.free && plugin.free.includes(cmd)) return true
    // mods and the owner can always execute
    if (msg.member.user.id == msg.member.guild.ownerID) return true
    else return msg.member.roles.has(modID)
  }

  for (var p in plugins) {
    let plugin = plugins[p]
    if (plugin[cmd] && canExecute(plugin)) {
      return plugin[cmd](msg, opts)
    }
  }
})

Client.login(bot.token)