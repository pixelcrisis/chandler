// Chandler Utilities
// Core Features/Functions
// Added to main Bot object.

const Moment = require('moment')

module.exports = (Bot) => {

  Bot.booted = false
  // don't execute commands unless bot is booted

  Bot.no = ['n', 'no', 'off', 'false', 'disable']
  Bot.yes = ['y', 'yes', 'on', 'true', 'enable']
  // use Bot.yes.includes(thing) to for yes/no check

  Bot.sleep = require("util").promisify(setTimeout)
  Bot.when = time => Moment(time).fromNow()
  // use this to turn timestamps into "x ago"

  Bot.log = (message) => {
    console.info(message)
    // Always print logs in console
    // If Server mode, print in channel
    if (Bot._logger) Bot._logger.send(message)
  }

  Bot.parseEmbed = (str) => {
    try {
      let obj = JSON.parse(str)
      return obj.embed ? obj : { embed: obj }
    }
    catch(e) { return false }
  }

  Bot.deleteTrigger = (msg) => {
    if (Bot.canDelete(msg.guild.me, msg.channel) && Bot.booted && !Bot.chaining) {
      return msg.delete()
    }
  }

  Bot.stripIDs = (str) => {
    if (str.indexOf('<') == 0) {
      let trim = str.indexOf('@&') == 1 ? 3 : 2
      return str.substring(trim, str.length - 1)
    } else return str
  }

  Bot.nameAccess = (i) => {
    if (i == 9) return 'Author'
    if (i == 7) return 'Owner'
    if (i == 5) return 'Admin'
    if (i == 3) return 'Mod'
    return 'User'
  }

  Bot.verifyAccess = (msg, modsID) => {
    let genericMod = msg.guild.roles.find(role => {
      return ['mods', 'moderators'].includes(role.name.toLowerCase())
    })
    if (msg.member.user.id == Bot.conf.owner) return 9
    if (msg.member.user.id == msg.member.guild.ownerID) return 7
    if (msg.member.hasPermission('ADMINISTRATOR')) return 5
    if (msg.member.roles.has(modsID)) return 3
    if (genericMod && msg.member.roles.has(genericMod.id)) return 3
    return 1
  }

  const byName = (name) => { 
    return el => el.name.toLowerCase() == name.toLowerCase() 
  }
  const byUser = (name) => { 
    return el => el.user.username.toLowerCase() == name.toLowerCase() 
  }
  const byNick = (name) => { 
    return el => el.nickname && el.nickname.toLowerCase() == name.toLowerCase() 
  }

  Bot.verifyUser = (msg, data) => {
    let user = msg.guild.members.get(Bot.stripIDs(data))
    if (!user) user = msg.guild.members.find(byUser(data))
    if (!user) user = msg.guild.members.find(byNick(data))
    return user
  }

  Bot.verifyChannel = (msg, data) => {
    let chan = msg.guild.channels.get(Bot.stripIDs(data))
    if (!chan) chan = msg.guild.channels.find(byName(data))
    return chan
  }

  Bot.verifyRole = (msg, data) => {
    let role = msg.guild.roles.get(Bot.stripIDs(data))
    if (!role) role = msg.guild.roles.find(byName(data))
    return role
  }

  Bot.canChat = (self, channel) => {
    return channel.permissionsFor(self).has("SEND_MESSAGES", false)
  }

  Bot.canRoles = (self, channel) => {
    return channel.permissionsFor(self).has("MANAGE_ROLES", false)
  }

  Bot.canDelete = (self, channel) => {
    return channel.permissionsFor(self).has("MANAGE_MESSAGES", false)
  }

  Bot.canChannel = (self, channel) => {
    return channel.permissionsFor(self).has("MANAGE_CHANNELS", false)
  }

}