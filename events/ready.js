// Ready Event
// This is where the init happens.
// Connect to database, start the bot.

module.exports = async (Bot) => {

  // Set up our logger in server mode
  if (Bot.serverMode && Bot.serverLogs) {
    Bot._logger = Bot.channels.get(Bot.serverLogs)
  }

  const guilds = Bot.guilds.keyArray()
  const active = { type: 'LISTENING' }
  const status = `${guilds.length} Servers.`
  Bot.user.setActivity(status, active)

  // Start loading all the data
  await Bot.getGuilds(guilds)

  Bot.booted = true
  Bot.log("Loaded Everything, Booted Up.")

}