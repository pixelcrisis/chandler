module.exports = {

  name: 'setzone',
  
  level: 3,

  lang: {
    none: "Couldn't find `{val1}` as a timezone.",
    done: "Set <@{val1}> timezone to `{val2}`"
  },

  help: {
    name: "{pre}setzone [user] [timezone]",
    desc: "Sets `timezone` for `user`." +
          "Step 1: Find timezone code here:\n" +
          "<http://kevalbhatt.github.io/timezone-picker/>\n\n" +
          "Step 2: Use `>setzone !user America/Chicago`\n" +
          "But replace with their timezone!"
  },

  fire: function(Bot, msg, opts, lvl) {
    if (opts.length < 2) return Bot.reply(msg, this.help)

    const user = Bot.verifyUser(msg, opts.shift())
    if (!user) return Bot.reply(msg, Bot.lang.badUser)

    const zone = Bot.findZone(opts)
    if (!zone) return Bot.reply(msg, this.lang.none, opts.join(' '))

    Bot.setZone(msg.guild.id, { id: user.id, zone: zone.name })
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