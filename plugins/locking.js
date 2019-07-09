// Channel Locking Plugin
// Stores Current Data in DB, Locks
// Unlocks, restores data from DB

const Reply = require('../utils/reply.js')
const State = require('../utils/state.js')
const lang = require('../data/lang.json').locking

module.exports = {

  async lock(msg, opts) {
    let perms = msg.channel.permissionOverwrites.array()
    let data = State.find(msg.guild.id, 'locks', msg.channel.id)
    if (data) return Reply.with(msg, lang.locked)

    let now = new Date()
    let everyone = msg.channel.guild.defaultRole
    let modID = State.get(msg.guild.id, 'modID')
    let time = `${now.toDateString()} - ${now.toTimeString()}`
    let newTopic = `${msg.channel.name} was locked @ ${time}.`

    State.push(msg.guild.id, 'locks', { 
      id: msg.channel.id,
      name: msg.channel.name,
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
    let data = State.find(msg.guild.id, 'locks', msg.channel.id)
    if (!data) return Reply.with(msg, lang.unlocked)

    await msg.channel.setName(data.name)
    await msg.channel.setTopic(data.topic)
    await msg.channel.replacePermissionOverwrites({
      overwrites: data.perms,
      reason: "Channel was unlocked by Chandler."
    })
    return State.pull(msg.guild.id, 'locks', data)
  },

}