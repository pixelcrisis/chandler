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
    const zone = Bot.$getZone(msg, msg.author.id)
    if (!zone) return Bot.reply(msg, Bot.lang.noZone)

    opts = opts.join(' ')

    // find time? or user?

    let when = false, user = false
    if (opts) when = Bot.findTime(opts, zone)
    if (opts && !when) user = Bot.verifyUser(msg, opts)
    if (opts && !when && !user) return Bot.reply(msg, Bot.lang.badArgs, opts)

    let response = { title: 'Current Time', desc: [] }

    // if user, just look them up
    if (user) {
      const target = Bot.$getZone(msg, user.id)
      if (!target) return Bot.reply(msg, this.lang.user, user.id)
      const time = Bot.timeFor(target)
      response.desc.push(`**${time.timeStr}** for <@${user.id}> in ${time.nameStr}`)
    }

    // else get all the zones
    else {
      const zones = Bot.$getZone(msg)
      if (when) response.title = `Time @ ${opts}`
      const table = Bot.sortTimeZones(zones, when)
      for (var i = 0; i < table.length; i++) {
        let t = table[i]
        let ping = t.name == zone.split('/')[1] ? `<@${msg.author.id}>` : ''
        response.desc.push(`**${t.time}** - ${t.name} (${t.users.length}) ${ping}`)
      }
    }

    Bot.reply(msg, response)
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