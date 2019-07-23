module.exports = {

  name: 'set',
  
  level: 5,

  lang: {
    prefix: "Set Prefix to `{val1}`\nReminder: You can @Chandler as a prefix if something goes sideways."
  },

  help: {
    name: "{pre}set [option] [value]",
    desc: "Changes Chandler Settings - {guides}\n\n" +
          "Available Options:\n" +
          "`prefix`, `mods`, `warnings`, `onjoin`, `onleave`\n\n" +
          "Example: `{pre}set prefix !` or `{pre}set mods @Staff`"
  },

  fire: function(Bot, msg, opts, lvl) {
    if (opts.length < 2) return Bot.reply(msg, this.help)
    const opt = opts.shift().toLowerCase()
    const val = opts.join(' ')

    if (opt == 'prefix') {
      Bot.setConf(msg.guild.id, 'prefix', val)
      return Bot.reply(msg, this.lang.prefix, val)
    }
  },

  test: async function(Bot, msg, data) {
    Bot.reply(msg, {
      name: "Testing {pre}set",
      desc: "`{pre}set` - Help\n" +
            "`{pre}set prefix ~` - Set",
      color: 16549991
    })

    await this.fire(Bot, msg, [])
    await this.fire(Bot, msg, ['prefix', '~'])

    return Bot.reply(msg, "{pre}set test complete.")
  }

}