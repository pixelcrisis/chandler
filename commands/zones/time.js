module.exports = {

  name: 'time',
  
  level: 1,

  lang: {
    user: "<@{val1}> hasn't set a timezone yet. `{pre}zone`"
  },

  help: {
    name: "{pre}time (time/username)",
    desc: "Gets current time in all tracked timezones.\n" +
          "Can pass a `time` to see what time it would be.\n" +
          "Can pass `username` to see what time it is for them.\n" +
          "(only works if they've set it - don't @ them in case it's late!)"
  },

  fire: function(Bot, msg, opts, lvl) {
    const zone = Bot.getZone(msg.guild.id, msg.author.id)
    if (!zone) return Bot.reply(msg, Bot.lang.noZone)

    let zones = Bot.zones.get(msg.guild.id)
    opts = opts.join(' ')

    // find time? or user?

    let when = false, user = false
    if (opts) when = Bot.findTime(opts, zone)
    if (opts && !when) user = Bot.verifyUser(msg, opts)
    if (opts && !when && !user) return Bot.reply(msg, Bot.lang.badArgs, opts)

    let title = 'Current Time', result = []

    // if user, just look them up
    if (user) {
      const target = Bot.getZone(msg.guild.id, user.id)
      if (!target) return Bot.reply(msg, this.lang.user, user.id)
      const time = Bot.timeFor(target)
      result.push(`**${time.timeStr}** for <@${user.id}> in ${time.nameStr}`)
    }

    // else get all the zones
    else {
      if (when) title = `Time @ ${opts}`
      const table = Bot.sortTimeZones(zones, when)
      for (var i = 0; i < table.length; i++) {
        let t = table[i]
        result.push(`**${t.time}** - ${t.name} (${t.users.length})`)
      }
    }

    result.push(Bot.gotLove(msg.author.id, '`{pre}help time`'))

    Bot.listReply(msg, title, result)
    return Bot.deleteTrigger(msg)
  },

  test: async function(Bot, msg, data) {
    Bot.reply(msg, {
      name: "Testing {pre}time",
      desc: "`{pre}time` - Current\n" +
            "`{pre}time arg` - Bad Time\n" +
            "`{pre}time 9pm` - Time @ 9pm",
      color: 16549991
    })

    await this.fire(Bot, msg, [])
    await this.fire(Bot, msg, ['arg'])
    await this.fire(Bot, msg, ['9pm'])
    
    return Bot.reply(msg, "{pre}time test complete.")
  }

}