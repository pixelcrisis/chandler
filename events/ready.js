// ready.js

module.exports = async Bot => {

  await Bot.wait(1000)

  Bot.updateStatus = key => {
    const statusPool = [
      `v${Bot.vers} in ${Bot.guilds.keyArray().length} Servers`,
      `~/help - v${Bot.vers}`,
      `~/time - v${Bot.vers}`
    ]

    key = key ? 0 : Math.floor(Math.random() * statusPool.length)
    Bot.user.setActivity(statusPool[key], { type: 'WATCHING' })
  }

  Bot.updateStatus(true)

  const twoMins = 1000 * 60 * 2
  Bot.statsUpdates = setInterval(Bot.updateStatus, twoMins)

  Bot.booted = true
  Bot.log(`Loaded Everything, Booted v${Bot.vers}`)

}