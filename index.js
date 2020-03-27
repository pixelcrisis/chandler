/**********************************/
/**   Chandler - A Discord Bot.  **/
/**------------------------------**/
/**   Inspriation From:          **/
/**   KevinNovak/Friend-Time     **/
/**   AnIdiotsGuide/guidebot     **/
/**------------------------------**/
/**********************************/

const Discord = require('discord.js')
const Chandler = new Discord.Client()

// Load some dependencies
Chandler.Info = require('./package.json')
Chandler.Conf = require('./config.json')
Chandler.Exec = require('child_process').exec

// Pass Chandler to loader.js
// To get loaded up with other files
require('./loader.js')(Chandler)

// Async requires a function, so 
// we wrap it in a function!
const init = async () => {

  // Call the functions from loader.js
  await Chandler.loadPlugins()
  await Chandler.loadEvents()
  await Chandler.loadCommands()
  await Chandler.loadHandlers()

  // Once we've loaded all the files
  // We can login to Discord!
  Chandler.login(Chandler.Conf.token)
}

// Nothing left to define, here we go!
// Check events/ready.js for the next steps.
init()