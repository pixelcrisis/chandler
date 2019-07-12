module.exports = {

  name: 'prefix',
  
  level: 5,

  response: "Set Prefix to: `{val1}`\n" +
            "Reminder: You can @Chandler as a prefix if something goes sideways.",

  help: {
    name: "{pre}prefix [symbol]",
    desc: "Changes the prefix for Chandler.\n" +
          "Example: `{pre}prefix !` or `{pre}prefix ~`"
  },

  fire: function(Bot, msg, opts) {
    if (!opts.length) return Bot.reply(msg, this.help)
    Bot.setConfig(msg.guild.id, { prefix: opts.join(' ') })
    return Bot.reply(msg, this.response, opts.join(' '))
  }

}