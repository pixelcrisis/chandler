module.exports = {
  
  name: 'unlock',
  level: 3,

  help: {
    name: "{pre}unlock",
    desc: "Unlocks a locked channel.\n" +
          "If no `channel` provided, unlocks current channel.\n" +
          "Replaces locked permissions with cached data."
  },

  lang: {
    curr: "This channel is already unlocked!",
    done: "Channel was unlocked by {user}"
  },

  fire: async function (Bot, evt) {

    let target = evt.channel
    if (evt.options.length) target = Bot.verifyChannel(evt, evt.options[0])

    if (!target) return Bot.reply(evt, Bot.EN.bad.arg, evt.options.join(' '))

    const perm1 = Bot.canRole(evt, target)
    const perm2 = Bot.canManage(evt, target)
    if (!perm1) return Bot.reply(evt, Bot.EN.cant.roles)
    if (!perm2) return Bot.reply(evt, Bot.EN.cant.manage)

    const curr = Bot.$getLocks(evt, target.id)
    if (!curr) return Bot.reply(evt, this.lang.curr)

    let overwrites = []
    curr.cache.forEach(perm => {
      overwrites.push({
        id: perm.id,
        deny: Bot.perm(perm.deny),
        allow: Bot.perm(perm.allow)
      })
    })

    const reason = Bot.parse(evt, this.lang.done)

    await target.setName(curr.name)
    await target.setTopic(curr.topic)
    await target.replacePermissionOverwrites({ reason, overwrites })

    Bot.$remLock(evt, target.id)
    return Bot.reply(evt, reason)
  },

  test: async function (Bot, evt, data) {
    Bot.reply(evt, 'Requires Custom Testing.')
  }

}