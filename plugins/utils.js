// Chandler Utilities
// Core Features/Functions
// Added to main Bot object.

module.exports = (Bot) => {

  Bot.booted = false

  Bot.no = ['off', 'false', 'disable']
  Bot.yes = ['on', 'true', 'enable']

  Bot.sleep = require("util").promisify(setTimeout);

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

  Bot.stripIDs = (str) => {
    if (str.indexOf('<') == 0) {
      let trim = str.indexOf('@&') == 1 ? 3 : 2
      return str.substring(trim, str.length - 1)
    } else return str
  }

  Bot.verifyChannel = (msg, data) => {
    let channel = msg.guild.channels.get(Bot.stripIDs(data))
    if (!channel) {
      channel = msg.guild.channels.find(by => by.name == data)
    }
    return channel
  }

  Bot.verifyRole = (msg, data) => {
    let role = msg.guild.roles.get(Bot.stripIDs(data))
    if (!role) {
      role = msg.guild.roles.find(by => by.name == data)
    }
    return role
  }

}