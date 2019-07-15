module.exports = {

  name: 'clear',
  
  level: 3,
  alias: ['clean', 'delete', 'remove'],

  lang: {
    done: "Cleared {val1} Messages.",
    over: "Can only clear 99 messages at a time."
  },

  help: {
    name: "{pre}clear [amount]",
    desc: "Delete `amount` of messages from the channel.\n" +
          "Due to discord limits, can only delete 99 messages at a time."
  },

  fire: async function(Bot, msg, opts, lvl) {
    if (!opts.length || opts.length > 1) return Bot.reply(msg, this.help)
    const amount = parseInt(opts.shift())
    if (isNaN(amount)) return Bot.reply(msg, this.help)
    if (amount > 99) return Bot.reply(msg, this.lang.over)

    // todo - delete by user
    // todo - double check date (2 week limit)

    await msg.channel.fetchMessages({ limit: amount + 1 })
          .then(async got => { await msg.channel.bulkDelete(got) })

    return Bot.flashReply(msg, this.lang.done, amount)
  },

  test: async function(Bot, msg, data) {
    Bot.reply(msg, {
      name: "Testing {pre}clear",
      desc: "`{pre}clear 2` - Cleared Messages\n" +
            "`{pre}clear arg` - Help",
      color: 16549991
    })

    await msg.channel.send('Deleted 1')
    await msg.channel.send('Deleted 2')
    await msg.channel.send('sim >clear')
    await this.fire(Bot, msg, ['2'])
    await this.fire(Bot, msg, [])
    
    return Bot.reply(msg, "{pre}clear test complete.")
  }

}