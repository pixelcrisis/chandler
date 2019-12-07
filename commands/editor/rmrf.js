module.exports = {
  
  name: 'rmrf',
  level: 3,

  help: {
    name: "{pre}rmrf [amount]",
    desc: "Delete `amount` messages from current channel.\n" +
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

    const batch = await evt.channel.fetchMessages({ limit: amount + 1 })

    const status = await Bot.reply(evt, this.lang.start)
    Bot.hold[evt.guild.id] = true

    let progress = 0
    for (const msg of batch) { 
      if (progress < amount) progress += 1
      // since we delete the  trigger
      // prevent removed 2/1 message
      
      await msg[1].delete()
      status.edit(`Removed ${progress}/${amount} Messages...`)
    }

    Bot.hold[evt.guild.id] = false
    status.delete()

    Bot.replyFlash(evt, this.lang.done, amount)
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