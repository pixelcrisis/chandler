// Channel Locking Plugin
// Stores Current Data in DB, Locks
// Unlocks, restores data from DB

const DB   = require('../utils/db.js')
const Util = require('../utils/util.js')
const lang = require('../data/lang.json').locked

module.exports = {

  lock: async function(msg, opts) {
    let perms = msg.channel.permissionOverwrites.array()
    let data = await DB.find(msg.guild.id, 'locks', msg.channel.id)
    if (data) {
      let isLocked = Util.parse(lang.locked)
      return msg.channel.send(isLocked)
    }

    let now = new Date()
    let everyone = msg.channel.guild.defaultRole
    let modID = await DB.get(msg.guild.id, 'modID')
    let time = `${now.toDateString()} - ${now.toTimeString()}`
    let newTopic = `${msg.channel.name} was locked @ ${time}.`

    DB.add(msg.guild.id, 'locks', { 
      id: msg.channel.id,
      name: msg.channel.name,
      topic: msg.channel.topic,
      perms: perms
    })
    perms.forEach(perm => perm.delete())

    await msg.channel.setName('locked')
    await msg.channel.setTopic(newTopic)
    msg.channel.replacePermissionOverwrites({
      overwrites: [{ id: everyone, denied: ['SEND_MESSAGES'] }],
      reason: "Channel was locked by Chandler."
    })
  },

  unlock: async function(msg, opts) {
    let data  = await DB.find(msg.guild.id, 'locks', msg.channel.id)
    if (!data) {
      let isUnlocked = Util.parse(lang.unlocked)
      return msg.channel.send(isUnlocked)
    }

    await msg.channel.setName(data.name)
    await msg.channel.setTopic(data.topic)
    await msg.channel.replacePermissionOverwrites({
      overwrites: data.perms
    })
    DB.rem(msg.guild.id, 'locks', data)
  },

}