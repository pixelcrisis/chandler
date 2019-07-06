// Chandler
// A Discord Bot

let bot = require('./data/config.json')
const Tests = require('./utils/tests.js')
const State = require('./utils/state.js')

const Discord = require('discord.js')

const plugins = {
  basics: require('./plugins/basics.js'),
  manage: require('./plugins/manage.js'),
  editor: require('./plugins/editor.js'),
  locked: require('./plugins/locked.js'),
  shifty: require('./plugins/shifty.js'),
  speaks: require('./plugins/speaks.js'),
  zoning: require('./plugins/zoning.js'),
  custom: require('./plugins/custom.js')
}

const Client = new Discord.Client()

const getCount = () => Client.guilds.keyArray()
const setCount = amt => {
  let count = `${amt} Servers.`
  Client.user.setActivity(count, { type: 'LISTENING' })
  return count
}

const Log = msg => {
  console.info(msg)
  if (!bot.debug || !bot.debugID) return
  let chann = Client.channels.get(bot.debugID)
  chann.send(msg)
}

Client.on('ready', async () => {
  Log("Booting: Loading Servers...")
  let servers = getCount()
  let count = setCount(servers.length)
  bot.conf = await State.loadAll(servers)
  Log(`Booting: Loaded ${count} Complete.`)
  bot.ready = true
})

Client.on('message', async msg => {
  if (!bot.ready || !msg.member || msg.author.bot) return
  let modID = await State.get(msg.guild.id, 'modID')
  let prefix = await State.get(msg.guild.id, 'prefix')
  if (msg.content.indexOf(prefix) !== 0) return

  let opts = msg.content.slice(prefix.length).trim().split(/ +/g)
  let cmd = opts.shift().toLowerCase()

  if (cmd == 'test' && msg.member.user.id == bot.owner) {
    bot.ready = false
    let tests = await Tests.run(msg, plugins)
    bot.ready = true
    return msg.channel.send('Testing Completed')
  }

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

  plugins['custom'].__run(msg, cmd)
})

Client.on('guildCreate', async guild => {
  let servers = getCount()
  let count = setCount(servers.length)
  bot.conf[guild.id] = await State.load(guild.id)
  Log(`Added to ${guild.name} : ${guild.id}`)
})

Client.on('guildDelete', async guild => {
  let servers = getCount()
  let count = setCount(servers.length)
  Log(`Removed From ${guild.name} : ${guild.id}`)
})

Client.on('error', error => Log(error))

Client.login(bot.token)