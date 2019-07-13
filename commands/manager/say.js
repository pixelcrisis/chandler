module.exports = {

  name: 'say',
  
  level: 3,

  lang: {
    none: "Speaking is not currently set. `>speak #channel`"
  },

  help: {
    name: "{pre}say [message]",
    desc: "Sends `message` to channel set by `{pre}speak`."
  },

  fire: function(Bot, msg, opts, lvl) {
    if (!opts.length) return Bot.reply(msg, this.help)
    const id = Bot.getConfig(msg.guild.id, 'speak')
    if (!id) return Bot.reply(msg, this.lang.none)
    const chan = msg.guild.channels.get(id)
    if (opts.length) return msg.channel.send(opts.join(' '))
  },

  test: async function(Bot, msg, data) {
    Bot.reply(msg, {
      name: "Testing {pre}say",
      desc: "`{pre}say` - Help\n" +
            "`{pre}say hello there!` - hello there!",
      color: 16549991
    })

    await this.fire(Bot, msg, [])
    await this.fire(Bot, msg, ['hello', 'there!'])
    
    return Bot.reply(msg, "{pre}say test complete.")
  }

}