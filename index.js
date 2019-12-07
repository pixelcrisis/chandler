/**********************************/
/**   Chandler - A Discord Bot.  **/
/**------------------------------**/
/**   Inspriation From:          **/
/**   KevinNovak/Friend-Time     **/
/**   AnIdiotsGuide/guidebot     **/
/**------------------------------**/
/**********************************/

const Discord = require('discord.js')
const Bot     = new Discord.Client()

Bot.conf = require('./config.json')
Bot.exec = require('child_process').exec
Bot.vers = require('./package.json').version

require('./loader.js')(Bot)

const init = async () => {
  await Bot.loadPlugins()
  await Bot.loadEvents()
  await Bot.loadCommands()
  await Bot.loadHandlers()

  Bot.login(Bot.conf.token)
}

init()