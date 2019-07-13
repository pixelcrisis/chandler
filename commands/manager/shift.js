module.exports = {

  name: 'shift',
  
  level: 3,
  alias: ['move'],

  lang: {
    channel: "Sorry, couldn't find that channel.",
    done: "Moved {val1} messages to <#{val2}>"
  },

  help: {
    name: "{pre}shift [amount] [channel]",
    desc: "Moves `amount` messages from the current channel to `channel`."
  },

  fire: async function(Bot, msg, opts, lvl) {
    if (opts.length != 2) return Bot.reply(msg, this.help)

    let shifted = []
    let amount = parseInt(opts[0])
    let channel = Bot.verifyChannel(msg, opts[1])
    if (isNaN(amount)) return Bot.reply(msg, this.help)
    if (!channel) return Bot.reply(msg, this.lang.channel)

    await msg.channel.fetchMessages({ limit: amount + 1}).then(got => {
      got.forEach(message => {
        let when = Bot.when(message.createdTimestamp)
        shifted.push(`<@${message.author.id}>: **${message.content}** (${when})`)
      })
      msg.channel.bulkDelete(got)
    })

    let trigger = shifted.shift() // don't reprint command
    let title = `Moved ${amount} Messages Here From ${msg.channel.name}`
    shifted = shifted.reverse() // preserve proper order w/loops
    Bot.listReply({ channel }, title, shifted, '\n\n')
    return Bot.reply(msg, this.lang.done, amount, channel.id)
  },

  test: async function(Bot, msg, data) {
    Bot.reply(msg, {
      name: "Testing {pre}shift",
      desc: "`{pre}shift` - Help\n" +
            "`{pre}shift 2 chan` - Shifted",
      color: 16549991
    })

    await this.fire(Bot, msg, [])
    await msg.channel.send('Shift Test 1')
    await msg.channel.send('Shift Test 2')
    await msg.channel.send('sim >shift')
    await this.fire(Bot, msg, ['2', data.channel])
    
    return Bot.reply(msg, "{pre}shift test complete.")
  }

}