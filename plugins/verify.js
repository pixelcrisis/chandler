// verify.js - for making sure things exist

module.exports = Chandler => {

  // define a/b comparison helper
  const findMatch = (a, b) => {
    return (a && b) ? a.toLowerCase() == b.toLowerCase() : false
  }

  // define helpers to compare to various profile names
  const byName = name => data => findMatch(name, data.name)
  const byUser = name => data => findMatch(name, data.user.username)
  const byNick = name => data => findMatch(name, data.nickname)

  // define helper to trim IDs in chat
  // they are formatted in the style of <#NUMBER>
  const stripIDs = str => {
    if (!str) return ''
    if (str.indexOf('<') != 0) return str
    // if contains the double prefix, trim 3
    // otherwise, assume a single prefix for 2
    let trim = str.indexOf('@&') == 1 ? 3 : 2
    // trim the 2 or 3 leading characters, "<#"
    // and the final bracket ">"
    return str.substring(trim, str.length - 1)
  }

  Chandler.badges = {
    1: { level: 1, name: 'User' },
    3: { level: 3, name: 'Moderator' },
    5: { level: 5, name: 'Admin' },
    7: { level: 7, name: 'Owner' },
    9: { level: 9, name: 'Author' }
  }

  // determine a user's access level
  Chandler.verifyAccess = Msg => {
    const data = Msg.member

    // check for generic 'moderator role'
    const mods = ['mod', 'mods', 'moderator', 'moderators']
    const role = Msg.guild.roles.cache.find(r => {
      return mods.includes(r.name.toLowerCase())
    })

    if (data.user.id == Chandler.Conf.owner) return Chandler.badges[9]
    if (data.user.id == data.guild.ownerID) return Chandler.badges[7]
    if (data.hasPermission('ADMINISTRATOR')) return Chandler.badges[5]
    if (data.roles.cache.has(Msg.config.modsID)) return Chandler.badges[3]
    if (role && data.roles.cache.has(role.id)) return Chandler.badges[3]

    return Chandler.badges[1]
  }

  // make sure things exist
  Chandler.verifyUser = (Msg, data) => {
    let user = Msg.guild.members.cache.get(stripIDs(data))
    if (!user) user = Msg.guild.members.cache.find(byUser(data))
    if (!user) user = Msg.guild.members.cache.find(byNick(data))
    return user
  }

  Chandler.verifyChannel = (Msg, data) => {
    let chan = Msg.guild.channels.get(stripIDs(data))
    if (!chan) chan = Msg.guild.channels.find(byName(data))
    return chan
  }

  Chandler.verifyRole = (Msg, data) => {
    let role = Msg.guild.roles.cache.get(stripIDs(data))
    if (!role) role = Msg.guild.roles.cache.find(byName(data))
    return role
  }

  Chandler.verifyEmbed = str => {
    try {
      let embed = JSON.parse(str)
      return embed.embed ? embed : { embed }
      // make sure it's wrapped in an object
    } catch (e) {
      return false
    }
  }

  // define helper to check permissions
  const can = (Msg, flag, channel) => {
    if (!Chandler.booted || !Msg) return false
    channel = channel || Msg.channel
    return channel.permissionsFor(channel.guild.me).has(flag, false)
  }

  // user helper for quick bot permissions checks
  Chandler.canSendMessages = (Msg, chan) => can(Msg, 'SEND_MESSAGES', chan)
  Chandler.canManageRoles = (Msg, chan) => can(Msg, 'MANAGE_ROLES', chan)
  Chandler.canManageChannels = (Msg, chan) => can(Msg, 'MANAGE_CHANNELS', chan)
  Chandler.canManageMessages = (Msg, chan) => can(Msg, 'MANAGE_MESSAGES', chan)

}
