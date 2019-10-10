module.exports = {

  name: 'print',
  
  level: 3,

  help: {
    name: "{pre}print [message]",
    desc: "Outputs `message` in the channel."
  },

  fire: function(Bot, msg, opts, lvl) {
    if (!opts.length) return Bot.reply(msg, this.help)
    msg.channel.send(opts.join(' '))
    return Bot.deleteTrigger(msg)
  },

  test: async function(Bot, msg, data) {
    Bot.reply(msg, {
      name: "Testing {pre}print",
      desc: "`{pre}print` - Help\n" +
            "`{pre}print arg` - Arg",
      color: 16549991
    })

    await this.fire(Bot, msg, [])
    await this.fire(Bot, msg, ['arg'])
    
    return Bot.reply(msg, "{pre}print test complete.")
  }

}