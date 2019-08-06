module.exports = {

  name: 'rmrf',
  
  level: 3,

  lang: {
    done: "Removed {val1} Messages.",
    over: "Can only remove 99 messages at a time.",
    start: "Deleting messages, please wait...",
    vote: "[You'll need to vote]({vote}) to use `{pre}rmrf`, as it is an intensive process."
  },

  help: {
    name: "{pre}rmrf [amount]",
    desc: "Delete `amount` of messages from the channel.\n" +
          "Due to discord limits, can only delete 99 messages at a time."
  },

  fire: async function(Bot, msg, opts, lvl) {
    const can = Bot.canDelete(msg.guild.me, msg.channel)
    if (!can) return Bot.reply(msg, Bot.lang.cant.delete, msg.channel.id)
    if (!opts.length || opts.length > 1) return Bot.reply(msg, this.help)
    if (!Bot.hasVoted(msg.author.id)) return Bot.reply(msg, this.lang.vote)
    const amount = parseInt(opts.shift())
    if (isNaN(amount)) return Bot.reply(msg, this.help)
    if (amount > 99) return Bot.reply(msg, this.lang.over)

    msg.channel.startTyping()
    const fetched = await msg.channel.fetchMessages({ limit: amount + 1 })
    const started = await Bot.reply(msg, this.lang.start)
    for (const msg of fetched) { await msg[1].delete() }
    started.delete()
    Bot.replyFlash(msg, this.lang.done, amount)
    msg.channel.stopTyping()
  },

  test: async function(Bot, msg, data) {
    Bot.reply(msg, {
      name: "Testing {pre}rmrf",
      desc: "`{pre}rmrf 2` - Removed Messages\n" +
            "`{pre}rmrf arg` - Help",
      color: 16549991
    })

    await msg.channel.send('Deleted 1')
    await msg.channel.send('Deleted 2')
    await msg.channel.send('sim >rmrf')
    await this.fire(Bot, msg, ['2'])
    await this.fire(Bot, msg, [])
    
    return Bot.reply(msg, "{pre}rmrf test complete.")
  }

}