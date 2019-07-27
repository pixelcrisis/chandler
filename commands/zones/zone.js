module.exports = {

  name: 'zone',
  
  level: 1,

  lang: {
    done: "Set your timezone to `{val1}`"
  },

  help: {
    name: "{pre}zone [timezone]",
    desc: "Replace `timezone` with the nearest city your time is based on!\n" +
          "`{pre}zone London` or `{pre}zone New York` or `{pre}zone Melbourne`\n\n" +
          "If you don't know, find your timezone code here:\n" +
          "<http://kevalbhatt.github.io/timezone-picker/>\n\n" +
          "Then try `>zone America/Chicago` but replace with your timezone!"
  },

  fire: function(Bot, msg, opts, lvl) {
    const loved = Bot.gotLove(msg.author.id)
    const help = { name: this.help.name, desc: this.help.desc + '\n' + loved }
    if (!opts.length) return Bot.reply(msg, help)

    let zone = Bot.findTimeZone(opts)
    if (!zone) return Bot.reply(msg, Bot.lang.badArgs, opts.join(' '))

    Bot.zones.set(msg.guild.id, zone.name, msg.author.id)
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