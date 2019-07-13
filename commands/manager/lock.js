module.exports = {

  name: 'lock',
  
  level: 3,

  lang: {
    already: "This channel is already locked!",
    locked: "Channel was locked by {user} for: {val1}"
  },

  help: {
    name: "{pre}lock (reason)",
    desc: "Locks the current channel.\n" +
          "Cache channel permissions and replace with:\n\n" +
          "`@everyone` - `Send Messages: False`\n\n" +
          "Restore with `>unlock`"
  },

  fire: async function(Bot, msg, opts, lvl) {
    let perms = msg.channel.permissionOverwrites.array()
    let curr = Bot.getLock(msg.guild.id, msg.channel.id)
    if (curr) return Bot.reply(msg, this.lang.already)

    Bot.setLock(msg.guild.id, {
      id: msg.channel.id,
      name: msg.channel.name,
      topic: msg.channel.topic,
      perms: perms
    })

    perms.forEach(perm => perm.delete())

    const everyone = msg.guild.defaultRole
    await msg.channel.setName('locked')
    await msg.channel.setTopic('')
    await msg.channel.replacePermissionOverwrites({
      reason: "Channel was locked by Chandler.",
      overwrites: [{ id: everyone, denied: ['SEND_MESSAGES'] }]
    })

    const reason = opts.length ? opts.join(' ') : 'No Reason'
    return Bot.reply(msg, this.lang.locked, reason)
  },

  test: async function(Bot, msg, data) {
    Bot.reply(msg, {
      name: "Testing {pre}lock",
      desc: "`{pre}lock` requires custom testing.",
      color: 16549991
    })
  }

}