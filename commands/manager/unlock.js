const { Permissions } = require('discord.js')

module.exports = {

  name: 'unlock',
  
  level: 3,

  lang: {
    curr: "This channel is already unlocked!",
    done: "Channel was unlocked by {user}"
  },

  help: {
    name: "{pre}unlock",
    desc: "Unlocks the current channel.\n" +
          "Replaces locked data with cached data."
  },

  fire: async function(Bot, msg, opts, lvl) {
    let curr = Bot.getLock(msg.guild.id, msg.channel.id)
    if (!curr) return Bot.reply(msg, this.lang.curr)

    let perms = []
    for (var i = 0; i < curr.perms.length; i++) {
      perms.push({
        id: curr.perms[i].id,
        deny: new Permissions(curr.perms[i].deny),
        allow: new Permissions(curr.perms[i].allow)
      })
    }

    await msg.channel.setName(curr.name)
    await msg.channel.replacePermissionOverwrites({
      overwrites: perms, reason: "Channel was unlocked by Chandler."
    })

    Bot.remLock(msg.guild.id, msg.channel.id)
    return Bot.reply(msg, this.lang.done)
  },

  test: async function(Bot, msg, data) {
    Bot.reply(msg, {
      name: "Testing {pre}unlock",
      desc: "`{pre}unlock` requires custom testing.",
      color: 16549991
    })
  }

}