/*********************************/
/**  Chandler - A Discord Bot.  **/
/*********************************/

const Discord = require('discord.js')
const Bot = new Discord.Client()

Bot.conf = require('./config.json')
Bot.lang = require('./language.json')

// Build out our utilities
require('./plugins/utils.js')(Bot)
require('./plugins/state.js')(Bot)
require('./plugins/loader.js')(Bot)
// Most changes to `Bot` happen here.

const init = async () => {
  await Bot.loadCommands()
  await Bot.loadEvents()
  // this is really only the first
  // init step. more initializing is
  // done in events/ready.js
  Bot.login(Bot.conf.token)
}

init()