module.exports = {

  name: 'time',
  
  level: 1,

  lang: {
    none: "You need to add your zone first! `{pre}zone`",
    when: "Couldn't figure out when `{val1}` is."
  },

  help: {
    name: "{pre}time (time)",
    desc: "Gets current time in all tracked timezones.\n" +
          "Can pass a `time` to see what time it would be."
  },

  fire: function(Bot, msg, opts, lvl) {
    if (opts.length > 1) return Bot.reply(msg, this.help)
    let when = opts.length == 1

    const zone = Bot.getZone(msg.guild.id, msg.author.id)
    if (!zone) return Bot.reply(msg, this.lang.none)

    let zones = Bot.zones.get(msg.guild.id)

    // find time if any
    if (when) {
      when = Bot.findTime(opts[0], zone)
      if (!when) return Bot.reply(msg, this.lang.when, opts[0])
    }

    const title = when ? `Time @ ${opts[0]}` : 'Current Time'
    const table = Bot.sortTimeZones(zones, when)

    // simply sort table
    let result = []
    for (var i = 0; i < table.length; i++) {
      let t = table[i]
      result.push(`**${t.time}** - ${t.name} (${t.users.length})`)
    }

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