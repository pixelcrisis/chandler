// Message Shifting Plugin
// Moves X messages from one channel
// to a different channel.

const Utils = require('../utils/utils.js')
const Embed = require('../utils/embed.js')
const lang = require('../data/lang.json').shifty

module.exports = {

  shift: async function(msg, opts) {
    let useage = Utils.parse(lang.use)
    if (opts.length != 2) return msg.channel.send(useage)

    let shifted = []
    let max = parseInt(opts[0])
    let channel = Utils.strip(opts[1])

    // get the channel
    channel = msg.channel.guild.channels.get(channel)
    if (!channel) {
      let noChannel = Utils.parse(lang.none)
      return msg.channel.send(noChannel)
    }

    // fetch X messages, store them, delete them.
    await msg.channel.fetchMessages({ limit: max + 1 }).then(fetched => {
      fetched.forEach(message => {
        let ago = Utils.ago(message.createdTimestamp)
        shifted.push(`<@${message.author.id}>: **${message.content}** (${ago})`)
      })
      msg.channel.bulkDelete(fetched)
    })

    // split at 2k characters
    let trigger = shifted.shift() // don't reprint the command
    shifted = Utils.split(shifted, '\n\n')

    // reprint conversation
    for (var i = 0; i < shifted.length; i++) {
      let divide = Utils.parse(lang.line)
      let title  = `${divide} (${i + 1}/${shifted.length})`
      let author = Utils.parse(lang.move, max, msg.channel.name)
      let embed1 = Embed.make(shifted[i], author, { title })
      channel.send(embed1)
    }

    // relocation message
    let desc = Utils.parse(lang.here, max, channel.id)
    let embed2 = Embed.make(desc)
    return msg.channel.send(embed2)
  },

  // aliases
  move: async function(msg, opts){ this.__shift(msg, opts) }

}