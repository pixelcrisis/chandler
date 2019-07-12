module.exports = {

  name: 'prefix',
  
  level: 5,

  resp: "Set Prefix to: `{val1}`\n" +
        "Reminder: You can @Chandler as a prefix if something goes sideways.",

  help: {
    name: "{pre}prefix [symbol]",
    desc: "Changes the prefix for Chandler.\n" +
          "Example: `{pre}prefix !` or `{pre}prefix ~`"
  },

  fire: function(Bot, msg, opts, lvl) {
    if (!opts.length) return Bot.reply(msg, this.help)
    Bot.setConfig(msg.guild.id, { prefix: opts.join(' ') })
    return Bot.reply(msg, this.resp, opts.join(' '))
  },

  test: async function(Bot, msg) {
    Bot.reply(msg, {
      name: "Testing {pre}prefix",
      desc: "`{pre}prefix` - Useage\n" +
            "`{pre}prefix ~` - Set",
      color: 16549991
    })

    await this.fire(Bot, msg, [])
    await this.fire(Bot, msg, ['~'])
  }

}