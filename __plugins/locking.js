// Channel Locking Plugin
// Stores Current Data in DB, Locks
// Unlocks, restores data from DB

const { Permissions } = require('discord.js')
const Reply = require('../utility/reply.js')
const State = require('../utility/state.js')
const lang = require('../data/lang.json').locking

module.exports = {

  async lock(msg, opts) {
    let perms = msg.channel.permissionOverwrites.array()
    let curr = State.getLock(msg.guild.id, msg.channel.id)
    if (curr) return Reply.with(msg, lang.locked)

    let now      = new Date()
    let everyone = msg.channel.guild.defaultRole
    let modID    = State.getConfig(msg.guild.id, 'modID')
    let time     = `${now.toDateString()} - ${now.toTimeString()}`
    let newTopic = `${msg.channel.name} was locked @ ${time}.`

    State.addLock(msg.guild.id, {
      id:    msg.channel.id,
      name:  msg.channel.name,
      topic: msg.channel.topic,
      perms: perms
    })

    perms.forEach(perm => perm.delete())

    await msg.channel.setName('locked')
    await msg.channel.setTopic(newTopic)
    return msg.channel.replacePermissionOverwrites({
      overwrites: [{ id: everyone, denied: ['SEND_MESSAGES'] }],
      reason: "Channel was locked by Chandler."
    })
  },

  async unlock(msg, opts) {
    let data = State.getLock(msg.guild.id, msg.channel.id)
    if (!data) return Reply.with(msg, lang.unlocked)
    let perms = []
    for (var i = 0; i < data.perms.length; i++) {
      perms.push({
        id: data.perms[i].id,
        deny: new Permissions(data.perms[i].deny),
        allow: new Permissions(data.perms[i].allow)
      })
    }
    await msg.channel.setName(data.name)
    await msg.channel.setTopic(data.topic)
    await msg.channel.replacePermissionOverwrites({
      overwrites: perms,
      reason: "Channel was unlocked by Chandler."
    })
    return State.remLock(msg.guild.id, msg.channel.id)
  },

}