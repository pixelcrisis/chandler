// Chandler Utilities
// Core Features/Functions
// Added to main Bot object.

module.exports = (Bot) => {

  Bot.booted = false

  Bot.log = (message) => {
    console.info(message)
    // Always print logs in console
    // If Server mode, print in channel
    if (Bot._logger) Bot._logger.send(message)
  }

  Bot.getAccess = (msg, modsID) => {
    const member = msg.member
    if (msg.member.user.id == Bot.conf.owner) return 9
    if (msg.member.user.id == msg.member.guild.ownerID) return 7
    if (msg.member.hasPermission('ADMINISTRATOR')) return 5
    if (msg.memeber.roles.has(modsID)) return 3
    return 1
  }

  Bot.findCommand = (cmd) => {
    return Bot.commands[cmd] || Bot.commands[Bot.aliases[cmd]]
  }

}