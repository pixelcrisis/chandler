/**********************************/
/**   Chandler - A Discord Bot.  **/
/**------------------------------**/
/**   Inspriation From:          **/
/**   KevinNovak/Friend-Time     **/
/**   AnIdiotsGuide/guidebot     **/
/**------------------------------**/
/**********************************/

const Discord = require('discord.js')
const Bot = new Discord.Client()

Bot.conf = require('./config/config.json')
// general system language
// every command also has its own lang object
Bot.lang = require('./config/language.json')
// we need this for some system commands
Bot.exec = require('child_process').exec

Bot.version = require('./package.json').version

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