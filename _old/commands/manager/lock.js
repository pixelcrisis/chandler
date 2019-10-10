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
          "Restore with `{pre}unlock`"
  },

  fire: async function(Bot, msg, opts, lvl) {
    const role = Bot.canRoles(msg.guild.me, msg.channel)
    const chan = Bot.canChannel(msg.guild.me, msg.channel)
    if (!role) return Bot.reply(msg, Bot.lang.cant.roles, msg.channel.id)
    if (!chan) return Bot.reply(msg, Bot.lang.cant.manage, msg.channel.id)
    let curr = Bot.$getLock(msg, msg.channel.id)
    if (curr) return Bot.reply(msg, this.lang.curr)
    
    const perms = msg.channel.permissionOverwrites.array()
    const store = { name: msg.channel.name, topic: msg.channel.topic, perms }
    Bot.$setLock(msg, msg.channel.id, store)

    const denied = (id) => {
      let view = msg.channel.permissionsFor(id).has('READ_MESSAGES')
      return view ? [ 'SEND_MESSAGES' ] : [ 'SEND_MESSAGES', 'READ_MESSAGES' ]
    }

    let overwrites = []
    perms.forEach(perm => {
      perm.denied.add('SEND_MESSAGES')
      perm.allowed.remove('SEND_MESSAGES')
      overwrites.push(perm)
      perm.delete()
    })

    overwrites.push({ id: Bot.user.id, allow: ['SEND_MESSAGES']})

    await msg.channel.setTopic(msg.channel.name)
    await msg.channel.setName('locked')
    await msg.channel.replacePermissionOverwrites({ reason: "Locked.", overwrites })

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