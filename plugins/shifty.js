// Message Shifting Plugin
// Moves X messages from one channel
// to a different channel.

const Reply = require('../utils/reply.js')
const lang = require('../data/lang.json').shifty

module.exports = {

  shift: async function(msg, opts) {
    if (opts.length != 2) return Reply.with(msg, lang.use)

    let shifted = []
    let max = parseInt(opts[0])
    let channel = Reply.strip(opts[1])

    // get the channel
    channel = msg.channel.guild.channels.get(channel)
    if (!channel) return Reply.with(msg, lang.none)

    // fetch X messages, store them, delete them.
    await msg.channel.fetchMessages({ limit: max + 1 }).then(fetched => {
      fetched.forEach(message => {
        let ago = Reply.when(message.createdTimestamp)
        shifted.push(`<@${message.author.id}>: **${message.content}** (${ago})`)
      })
      msg.channel.bulkDelete(fetched)
    })

    let trigger = shifted.shift() // don't reprint the command

    // reprint conversation
    let title = Reply.parse(lang.move, max, msg.channel.name)
    Reply.list(msg, title, shifted, '\n\n')
    return Reply.with(msg, lang.here, max, channel.id)
  },

  // aliases
  move: async function(msg, opts){ this.__shift(msg, opts) }

}