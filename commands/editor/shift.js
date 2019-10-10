module.exports = {
  
  name: 'shift',
  level: 3,
  alias: ['move'],

  help: {
    name: "{pre}shift [amount] [channel]",
    desc: "Moves `amount` messages from current c hannel to `channel`"
  },

  lang: {
    max: "You can only shift up to 99 recent messages at a time.",
    new: "Moved {val1} messages here from {val2}",
    old: "Moved {val1} messages to <#{val2}>"
  },

  fire: async function (Bot, evt) {
    if (evt.options.length != 2) return Bot.reply(evt, this.help)

    const cleared = parseInt(evt.options[0])
    const channel = Bot.verifyChannel(evt, evt.options[1])

    if (isNaN(cleared)) return Bot.reply(evt, this.help)
    if (cleared > 99) return Bot.reply(evt, this.lang.max)
    if (!channel) return Bot.reply(evt, Bot.EN.bad.arg, evt.options[1])

    const perm1 = Bot.canChat(evt, channel)
    const perm2 = Bot.canDelete(evt)

    if (!perm1) return Bot.reply(evt, Bot.EN.cant.message, channel.id)
    if (!perm2) return Bot.reply(evt, Bot.EN.cant.delete, evt.channel.id)

    let shifted = []
    await evt.channel.fetchMessages({ limit: cleared + 1 }).then(batch => {
      batch.forEach(msg => {
        let when = Bot.when(msg.createdTimestamp)
        shifted.push(`<@${msg.author.id}>: **${msg.content}** (${when})`)
      })
      evt.channel.bulkDelete(batch)
    })

    const trigger = shifted.shift()
    const response = { name: this.lang.new, desc: shifted.reverse() }
    const location = Object.assign(evt, { channel })
    Bot.reply(location, response, cleared, evt.channel.name)
    return Bot.reply(evt, this.lang.old, cleared, channel.id)
  },

  test: async function (Bot, evt, data) {
    evt.options = ['2', data.chan]

    await evt.channel.send('Shift Test 1')
    await evt.channel.send('Shift Test 2')
    await evt.channel.send('~/shift')

    await this.fire(Bot, evt)
  }

}