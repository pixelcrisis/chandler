// Message Shifting Plugin
// Moves X messages from one channel
// to a different channel.

const Reply = require('../utils/reply.js')
const lang = require('../data/lang.json').shifty

module.exports = {

  shift: async function(msg, opts) {
    if (opts.length != 2) return Reply.to(msg, lang.use)

    let shifted = []
    let max = parseInt(opts[0])
    let channel = Reply.strip(opts[1])

    // get the channel
    channel = msg.channel.guild.channels.get(channel)
    if (!channel) return Reply.to(msg, lang.none)

    // fetch X messages, store them, delete them.
    await msg.channel.fetchMessages({ limit: max + 1 }).then(fetched => {
      fetched.forEach(message => {
        let ago = Reply.past(message.createdTimestamp)
        shifted.push(`<@${message.author.id}>: **${message.content}** (${ago})`)
      })
      msg.channel.bulkDelete(fetched)
    })

    // split at 2k characters
    let trigger = shifted.shift() // don't reprint the command
    shifted = Reply.split(shifted, '\n\n')

    // reprint conversation
    for (var i = 0; i < shifted.length; i++) {
      let divide = Reply.parse(lang.line)
      let title  = `${divide} (${i + 1}/${shifted.length})`
      let author = Reply.parse(lang.move, max, msg.channel.name)
      Reply.embed({ channel }, author, shifted[i], { title })
    }

    // relocation message
    let desc = Reply.parse(lang.here, max, channel.id)
    return Reply.embed(msg, null, desc)
  },

  // aliases
  move: async function(msg, opts){ this.__shift(msg, opts) }

}