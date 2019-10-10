module.exports = {

  name: 'setzone',
  
  level: 3,

  lang: {
    done: "Set <@{val1}> timezone to `{val2}`"
  },

  help: {
    name: "{pre}setzone [user] [timezone]",
    desc: "Sets `timezone` for `user`."
  },

  fire: function(Bot, msg, opts, lvl) {
    if (opts.length < 2) return Bot.reply(msg, this.help)

    const userID = opts.shift()
    const user = Bot.verifyUser(msg, userID)
    if (!user) return Bot.reply(msg, Bot.lang.bad.args, userID)

    const zone = Bot.findTimeZone(opts)
    if (!zone) return Bot.reply(msg, Bot.lang.bad.args, opts.join(' '))

    Bot.$setZone(msg, user.id, zone.name)
    return Bot.reply(msg, this.lang.done, user.id, zone.name)
  },

  test: async function(Bot, msg, data) {
    Bot.reply(msg, {
      name: "Testing {pre}setzone",
      desc: "`{pre}setzone` - Help\n" +
            "`{pre}setzone arg arg` - Bad User\n" +
            "`{pre}setzone user a/c` - Set Zone",
      color: 16549991
    })

    await this.fire(Bot, msg, [])
    await this.fire(Bot, msg, ['arg', 'arg'])
    await this.fire(Bot, msg, [data.user, 'America/Chicago'])
    
    return Bot.reply(msg, "{pre}setzone test complete.")
  }

}