// Ready Event
// This is where the init happens.
// Connect to database, start the bot.

module.exports = async (Bot) => {

  // Set up our logger in server mode
  if (Bot.serverMode && Bot.serverLogs) {
    Bot._logger = Bot.channels.get(Bot.serverLogs)
  }

  Bot.user.setActivity('@Chandler help', { type: 'PLAYING' })

  Bot.booted = true
  Bot.log("Loaded Everything, Booted Up.")

}