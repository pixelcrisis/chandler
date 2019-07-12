/*********************************/
/**  Chandler - A Discord Bot.  **/
/*********************************/

const Discord = require('discord.js')
const Bot = new Discord.Client()

Bot.conf = require('./config.json')

// Build out our utilities
// Changes to `Bot` happen here.
require('./plugins/loader.js')(Bot)

const init = async () => {
  await Bot.loadEvents()
  await Bot.loadCommands()
  // this is really only the first
  // init step. more initializing is
  // done in events/ready.js
  Bot.login(Bot.conf.token)
}

init()