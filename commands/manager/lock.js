module.exports = {

  name: 'lock',
  
  level: 3,

  lang: {
    curr: "This channel is already locked!",
    done: "Channel was locked by {user} for: {val1}"
  },

  help: {
    name: "{pre}lock (reason)",
    desc: "Locks the current channel.\n" +
          "Cache channel permissions and replace with:\n\n" +
          "`@everyone` - `Send Messages: False`\n\n" +
          "Restore with `>unlock`"
  },

  fire: async function(Bot, msg, opts, lvl) {
    const role = Bot.canRoles(msg.guild.me, msg.channel)
    const chan = Bot.canChannel(msg.guild.me, msg.channel)
    if (!role) return Bot.reply(msg, Bot.lang.cantDoPerms, msg.channel.id)
    if (!chan) return Bot.reply(msg, Bot.lang.cantChannel, msg.channel.id)
    let curr = Bot.locks.get(msg.guild.id, msg.channel.id)
    if (curr) return Bot.reply(msg, this.lang.curr)
    
    const perms = msg.channel.permissionOverwrites.array()
    const store = { name: msg.channel.name, perms }
    Bot.locks.set(msg.guild.id, store, msg.channel.id)

    perms.forEach(perm => perm.delete())

    const everyone = msg.guild.defaultRole
    await msg.channel.setName('locked')
    await msg.channel.replacePermissionOverwrites({
      reason: "Channel was locked by Chandler.",
      overwrites: [
        { id: everyone, denied: ['SEND_MESSAGES'] },
        { id: Bot.user.id, allowed: ['SEND_MESSAGES'] }
      ]
    })

    const reason = opts.length ? opts.join(' ') : 'No Reason'
    return Bot.reply(msg, this.lang.done, reason)
  },

  test: async function(Bot, msg, data) {
    Bot.reply(msg, {
      name: "Testing {pre}lock",
      desc: "`{pre}lock` requires custom testing.",
      color: 16549991
    })
  }

}