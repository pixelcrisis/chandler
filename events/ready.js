// Ready Event
// This is where the init happens.
// Connect to database, start the bot.

module.exports = async (Bot) => {

  // Set up our logger in server mode
  if (Bot.conf.serverMode && Bot.conf.serverLogs) {
    Bot._logger = Bot.channels.get(Bot.conf.serverLogs)
  }

  // Set a random status with helpful tips!
  Bot.updateStatus = (bot) => {
    const status = [
      `with v${Bot.version}`, `in ${Bot.guilds.keyArray().length} Servers`,
      '@Chandler time', '@Chandler help', '@Chandler zones'
    ]

    const random = Math.floor(Math.random() * status.length)
    Bot.user.setActivity(status[random], { type: 'PLAYING' })
  }

  // Update To Our Default Status
  Bot.user.setActivity(`with v${Bot.version}`, { type: 'PLAYING' })

  // Set a random status every 5 minutes
  const fiveMin = 1000 * 60 * 5
  Bot.statusUpdates = setInterval(Bot.updateStatus, 30000)

  Bot.booted = true
  Bot.log("Loaded Everything, Booted Up.")

}