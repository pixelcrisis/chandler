/*********************************/
/**  Chandler - A Discord Bot.  **/
/*********************************/
/**                             **/
/**   Inspriation From:         **/
/**   KevinNovak/Friend-Time    **/
/**   AnIdiotsGuide/guidebot    **/
/**                             **/
/*********************************/

const Discord = require('discord.js')
const Bot = new Discord.Client()

Bot.conf = require('./config.json')
// general system language
// every command also has its own lang object
Bot.lang = require('./language.json')

// Load our everything
// Changes to `Bot` happen here.
require('./plugins/loader.js')(Bot)

const init = async () => {
  await Bot.loadEvents()
  await Bot.loadCommands()
  // The REAL init 
  // is in events/ready.js
  Bot.login(Bot.conf.token)
}

init()