module.exports = {
  
  name: 'rmrf',
  level: 3,

  help: {
    name: "{pre}rmrf [amount]",
    desc: "Delete `amount` messages from current channel.\n" +
          "Using `{pre}clear` is faster, but has limitations.\n" +
          "For performance, limited to 300 messages at a time."
  },

  lang: {
    rem:   "Cleared {val1} messages.",
    max:   "Can only clear 300 messages at a time.",
    done:  "Removed {val1} messages.",
    start: "Deleting Messages, Please Wait...",
    vote:  "[You'll need to vote]({vote}) to use `{pre}rmrf`, as it is an intensive process."
  },

  fire: async function (Bot, evt) {
    if (evt.options.length != 1)      return Bot.reply(evt, this.help)
    if (!Bot.hasVoted(evt.author.id)) return Bot.reply(evt, this.lang.vote)

    const perm = Bot.canDelete(evt)
    if (!perm) return Bot.reply(evt, Bot.EN.cant.delete, evt.channel.id)

    const amount = parseInt(evt.options[0])
    if (isNaN(amount)) return Bot.reply(evt, this.help)
    if (amount > 300)  return Bot.reply(evt, this.lang.max)

    Bot.hold[evt.guild.id] = true

    const batches = Math.floor(amount / 100)
    const remains = amount - (batches * 100)
    let progress = 0

    for (var i = batches; i >= 0; i--) {
      let limit = i == 0 ? remains + 1 : 100
      const batch = await evt.channel.fetchMessages({ limit })

      if (batch.size) {
        const status = await Bot.reply(evt, this.lang.start)

        for (const msg of batch) {
          if (progress < amount) progress += 1
          await msg[1].delete()
          await status.edit(`Removed ${progress}/${amount} Messages...`)
        }

        await status.delete()
      }
    }

    Bot.hold[evt.guild.id] = false
    Bot.replyFlash(evt, this.lang.done, progress)
  },

  test: async function (Bot, evt, data) {
    evt.options = ['4']

    await evt.channel.send('rmrf Test 1')
    await evt.channel.send('rmrf Test 2')
    await evt.channel.send('rmrf Test 3')
    await evt.channel.send('rmrf Test 4')
    await evt.channel.send('~/rmrf')

    await this.fire(Bot, evt)
  }

}