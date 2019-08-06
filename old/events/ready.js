// Ready Event
// This is where the init happens.
// Connect to database, start the bot.

module.exports = async (Bot) => {

  if (Bot.conf.logs) Bot._logger = Bot.channels.get(Bot.conf.logs)

  Bot.updateStatus = (bot) => {
    const status = [
      `v${Bot.version}`, `${Bot.guilds.keyArray().length} Servers`,
      '@Chandler time', '@Chandler help', '@Chandler zones'
    ]

    const random = Math.floor(Math.random() * status.length)
    Bot.user.setActivity(status[random], { type: 'WATCHING' })
  }

  // Update To Our Default Status
  Bot.user.setActivity(`v${Bot.version}`, { type: 'WATCHING' })

  // Set a random status every 5 minutes
  const fiveMin = 1000 * 60 * 5
  Bot.statusUpdates = setInterval(Bot.updateStatus, fiveMin)

  Bot.booted = true
  Bot.log("Loaded Everything, Booted Up v" + Bot.version)

}