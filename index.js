/*********************************/
/**  Chandler - A Discord Bot.  **/
/*********************************/

const Discord = require('discord.js')
const Bot = new Discord.Client()

Bot.conf = require('./config.json')
Bot.lang = require('./language.json')

const init = async () => {
  Bot.login(Bot.conf.token)
}

init()



// // Chandler
// // A Discord Bot

// const Discord = require('discord.js')
// const Events  = require('./utility/events.js')
// const config  = require('./data/config.json')

// const plugins = {
//   manager: require('./plugins/manager.js'),
//   editing: require('./plugins/editing.js'),
//   locking: require('./plugins/locking.js'),
//   shifter: require('./plugins/shifter.js'),
//   talking: require('./plugins/talking.js'),
//   zoneing: require('./plugins/zoneing.js'),
//   aliases: require('./plugins/aliases.js')
// }

// const Client = new Discord.Client()

// Client.on('ready',       e => Events.onBoot(Client, config))
// Client.on('message',     e => Events.onMessage(e, plugins))
// Client.on('guildCreate', e => Events.updateGuilds(Client, e))
// Client.on('guildDelete', e => Events.updateGuilds(Client, e))

// Client.on('guildMemberAdd',    e => Events.logJoin(e))
// Client.on('guildMemberRemove', e => Events.logLeave(e))

// Client.on('error', error => Events.log(error))

// Client.login(config.token)