// Ready Event
// This is where the init happens.
// Connect to database, start the bot.

module.exports = async (Bot) => {

  // Set up our logger in server mode
  if (Bot.conf.serverMode && Bot.conf.serverLogs) {
    Bot._logger = Bot.channels.get(Bot.conf.serverLogs)
  }

  const updateStatus = () => {
    const status = [
      '@Chandler time',
      '@Chandler help',
      '@Chandler zones'
    ], random = Math.floor(Math.random() * status.length)

    Bot.user.setActivity(status[random], { type: 'PLAYING' })
  }
  updateStatus()

  const fiveMin = 1000 * 60 * 5
  Bot.statusUpdates = setInterval(updateStatus, fiveMin)

  Bot.booted = true
  Bot.log("Loaded Everything, Booted Up.")

}