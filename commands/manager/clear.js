module.exports = {

  name: 'clear',
  
  level: 3,
  alias: ['clean', 'delete', 'remove'],

  lang: {
    done: "Cleared {val1} Messages.",
    over: "Can only clear 99 messages at a time.",
    old: "These messages are over 14 days old, discord won't let me bulk delete them. Try using `{pre}rmrf` instead"
  },

  help: {
    name: "{pre}clear [amount]",
    desc: "Delete `amount` of messages from the channel.\n" +
          "Due to discord limits, can only delete 99 messages at a time."
  },

  fire: async function(Bot, msg, opts, lvl) {
    const can = Bot.canDelete(msg.guild.me, msg.channel)
    if (!can) return Bot.reply(msg, Bot.lang.cant.delete, msg.channel.id)
    if (!opts.length || opts.length > 1) return Bot.reply(msg, this.help)
    const amount = parseInt(opts.shift())
    if (isNaN(amount)) return Bot.reply(msg, this.help)
    if (amount > 99) return Bot.reply(msg, this.lang.over)

    const fetched = await msg.channel.fetchMessages({ limit: amount + 1 })
    
    msg.channel.bulkDelete(fetched)
      .then(msgs => Bot.replyFlash(msg, this.lang.done, amount))
      .catch(err => Bot.replyFlash(msg, this.lang.old))
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