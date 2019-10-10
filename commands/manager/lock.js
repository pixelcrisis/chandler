module.exports = {
  
  name: 'lock',
  level: 3,

  help: {
    name: "{pre}lock (channel) (reason)",
    desc: "Locks a provided (or current) channel.\n" +
          "If no `channel` provided, locks current channel.\n" +
          "Cache channel permissions and replace with:\n\n" +
          "`@everyone` - `Send Messages: False`\n\n" +
          "Restore with `{pre}unlock`"
  },

  lang: {
    curr: "This channel is already locked!",
    done: "Channel was locked by {user} for: {val1}"
  },

  fire: async function (Bot, evt) {

    let reason = evt.options
    let target = reason.length ? Bot.verifyChannel(evt, reason[0]) : false

    if (target) reason.shift()
    else target = evt.channel

    const perm1 = Bot.canRoles(evt, target)
    const perm2 = Bot.canManage(evt, target)
    if (!perm1) return Bot.reply(evt, Bot.EN.cant.roles)
    if (!perm2) return Bot.reply(evt, Bot.EN.cant.manage)

    const curr = Bot.$getLock(evt, target.id)
    if (curr) return Bot.reply(evt, this.lang.curr)

    const cache = target.permissionOverwrites.array()
    const store = { name: target.name, topic: target.topic, cache }
    Bot.$setLock(evt, target.id, store)

    const denied = (id) => {
      let view = target.permissionsFor(id).has('READ_MESSAGES')
      return view ? [ 'SEND_MESSAGES' ] : [ 'SEND_MESSAGES', 'READ_MESSAGES' ]
    }

    let overwrites = []
    cache.forEach(perm => {
      perm.denied.add('SEND_MESSAGES')
      perm.allowed.remove('SEND_MESSAGES')
      overwrites.push(perm)
      perm.delete()
    })

    overwrites.push({ id: Bot.user.id, allow: ['SEND_MESSAGES']})

    reason = Bot.parse(evt, this.lang.done, reason || 'No Reason')

    await target.setTopic(target.name)
    await target.setName('locked')
    await target.replacePermissionOverwrites({ reason, overwrites })

    return Bot.reply(evt, this.lang.done, reason)
  },

  test: async function (Bot, evt, data) {
    Bot.reply(evt, 'Requires Custom Testing.')
  }

}