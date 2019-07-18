module.exports = {

  name: 'zone',
  
  level: 1,

  lang: {
    none: "Couldn't find `{val1}` as a timezone.",
    done: "Set your timezone to `{val1}`"
  },

  help: {
    name: "{pre}zone [timezone]",
    desc: "Step 1: Find your timezone code here:\n" +
          "<http://kevalbhatt.github.io/timezone-picker/>\n\n" +
          "Step 2: Use `>zone America/Chicago` but replace with your timezone!"
  },

  fire: function(Bot, msg, opts, lvl) {
    if (!opts.length) return Bot.reply(msg, this.help)

    let zone = Bot.findTimeZone(opts)
    if (!zone) return Bot.reply(msg, this.lang.none, opts.join(' '))

    Bot.setZone(msg.guild.id, msg.author.id, zone.name)
    return Bot.reply(msg, this.lang.done, opts.join(' '))
  },

  test: async function(Bot, msg, data) {
    Bot.reply(msg, {
      name: "Testing {pre}zone",
      desc: "`{pre}zone` - Help\n" +
            "`{pre}zone arg` - Bad Zone\n" +
            "`{pre}zone a/c` - Set Zone",
      color: 16549991
    })

    await this.fire(Bot, msg, [])
    await this.fire(Bot, msg, ['arg'])
    await this.fire(Bot, msg, ['America/Chicago'])
    
    return Bot.reply(msg, "{pre}zone test complete.")
  }

}