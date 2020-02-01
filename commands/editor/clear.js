module.exports = {
  
  name: 'clear',
  level: 3,
  alias: ['clean', 'delete', 'rm', 'remove'],

  help: {
    name: "{pre}clear [amount]",
    desc: "Delete `amount` messages from current channel.\n" +
          "Due to discord limits, can only delete 99 messages at a time.\n" +
          "Can only delete messages from within the last two weeks.\n" +
          "Check out `{pre}rmrf` for more powerful cleaning."
  },

  lang: {
    rem: "Cleared {val1} messages.",
    max: "Can only clear 99 messages at a time. Try `{pre}rmrf` instead.",
    old: "These messages are too old to bulk delete. Try `{pre}rmrf` instead."
  },

  fire: async function (Bot, evt) {
    if (evt.options.length != 1) return Bot.reply(evt, this.help)

    const perm = Bot.canDelete(evt)
    if (!perm) return Bot.reply(evt, Bot.EN.cant.delete, evt.channel.id)

    const amount = parseInt(evt.options[0])
    if (isNaN(amount)) return Bot.reply(evt, this.help)
    if (amount > 99)  return Bot.reply(evt, this.lang.max)

    const batch = await evt.channel.fetchMessages({ limit: amount + 1 })

    try {
      await evt.channel.bulkDelete(batch)
      Bot.replyFlash(evt, this.lang.rem, amount)
    }

    catch(e) {
      Bot.replyFlash(evt, this.lang.old)
    }
  },

  test: async function (Bot, evt, data) {
    evt.options = ['2']

    await evt.channel.send('Clear Test 1')
    await evt.channel.send('Clear Test 2')
    await evt.channel.send('~/clear')

    await this.fire(Bot, evt)
  }

}