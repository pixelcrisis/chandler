// access.js
// for user access / bot permissions

module.exports = Bot => {

  const findMatch = (a, b) => {
    return (a && b) ? a.toLowerCase() == b.toLowerCase() : false
  }

  const byName = name => e => findMatch(name, e.name)
  const byUser = name => e => findMatch(name, e.user.username)
  const byNick = name => e => findMatch(name, e.nickname)

  const stripIDs = str => {
    if (!str) return ''
    if (str.indexOf('<') != 0) return str
    let trim = str.indexOf('@&') == 1 ? 3 : 2
    return str.substring(trim, str.length - 1)
  }

  Bot.accessLevels = {
    1: { level: 1, name: 'User '},
    3: { level: 3, name: 'Mod' },
    5: { level: 5, name: 'Admin' },
    7: { level: 7, name: 'Owner' },
    9: { level: 9, name: 'Author' },
  }

  Bot.verifyAccess = evt => {
    const mods    = ['mod', 'mods', 'moderator', 'moderators']
    const generic = evt.guild.roles.find(r => mods.includes(r.name.toLowerCase()))
    const member  = evt.member

    if (member.user.id == Bot.conf.owner)        return Bot.accessLevels[9]
    if (member.user.id == member.guild.ownerID)  return Bot.accessLevels[7]
    if (member.hasPermission('ADMINISTRATOR'))   return Bot.accessLevels[5]
    if (member.roles.has(evt.config.modsID))     return Bot.accessLevels[3]
    if (generic && member.roles.has(generic.id)) return Bot.accessLevels[3]

    return Bot.accessLevels[1]
  }

  Bot.verifyUser = (evt, data) => {
    let user = evt.guild.members.get(stripIDs(data))
    if (!user) user = evt.guild.members.find(byUser(data))
    if (!user) user = evt.guild.members.find(byNick(data))
    return user
  }

  Bot.verifyChannel = (evt, data) => {
    let chan = evt.guild.channels.get(stripIDs(data))
    if (!chan) chan = evt.guild.channels.find(byName(data))
    return chan
  }

  Bot.verifyRole = (evt, data) => {
    let role = evt.guild.roles.get(stripIDs(data))
    if (!role) role = evt.guild.roles.find(byName(data))
    return role
  }

  const checkPerms = (flag, evt, channel) => {
    if (evt.isLog && evt.channel) return true

    if (!Bot.booted || !evt || !evt.guild) return false

    channel = channel || evt.channel
    return channel.permissionsFor(evt.guild.me).has(flag, false)
  }

  Bot.canChat   = (evt, chan) => checkPerms('SEND_MESSAGES', evt, chan)
  Bot.canRole   = (evt, chan) => checkPerms('MANAGE_ROLES', evt, chan)
  Bot.canManage = (evt, chan) => checkPerms('MANAGE_CHANNELS', evt, chan)
  Bot.canDelete = (evt, chan) => checkPerms('MANAGE_MESSAGES', evt, chan)

}