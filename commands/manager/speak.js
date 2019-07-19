module.exports = {

  name: 'speak',
  
  level: 3,

  lang: {
    curr: "Now speaking in <#{val1}>.",
    none: "Speaking is not currently set. `>speak #channel`"
  },

  help: {
    name: "{pre}speak (channel)",
    desc: "Sets `channel` to `{pre}say` messages in.\n" +
          "If no channel provided, returns current speaking channel."
  },

  fire: function(Bot, msg, opts, lvl) {
    const chan = Bot.getConf(msg.guild.id, 'speak')

    if (opts.length == 1) {
      const newCh = Bot.verifyChannel(msg, opts[0])
      if (!newCh) return Bot.reply(msg, Bot.lang.noChan, opts[0])
      Bot.setConf(msg.guild.id, 'speak', newCh.id)
      return Bot.reply(msg, this.lang.curr, newCh.id)
    }

    else if (!opts.length) {
      if (!chan) return Bot.reply(msg, this.lang.none)
      return Bot.reply(msg, this.lang.curr, chan)
    }

    else return Bot.reply(msg, this.help)
  },

  test: async function(Bot, msg, data) {
    Bot.reply(msg, {
      name: "Testing {pre}speak",
      desc: "`{pre}speak` - Curr\n" +
            "`{pre}speak oh` - Bad Chan\n" +
            "`{pre}speak chan` - Switched\n" +
            "`{pre}speak oh chan` - Help",
      color: 16549991
    })

    await this.fire(Bot, msg, [])
    await this.fire(Bot, msg, ['oh'])
    await this.fire(Bot, msg, [data.channel])
    await this.fire(Bot, msg, ['oh', data.channel])
    
    return Bot.reply(msg, "{pre}speak test complete.")
  }

}