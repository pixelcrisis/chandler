// Message Shifting Plugin
// Moves X messages from one channel
// to a different channel.

const Util = require('../utils/util.js')
const lang = require('../data/lang.json').shifty

module.exports = {

  shift: async function(msg, opts) {
    let useage = Util.parse(lang.use)
    if (opts.length != 2) return msg.channel.send(useage)

    let shifted = []
    let max = parseInt(opts[0])
    let channel = Util.strip(opts[1])

    // get the channel
    channel = msg.channel.guild.channels.get(channel)
    if (!channel) {
      let response = Util.parse(lang.noChannel)
      return msg.channel.send(response)
    }

    // fetch X messages, store them, delete them.
    await msg.channel.fetchMessages({ limit: max + 1 }).then(fetched => {
      fetched.forEach(message => {
        let ago = Util.ago(message.createdTimestamp)
        shifted.push(`<@${message.author.id}>: **${message.content}** (${ago})`)
      })
      msg.channel.bulkDelete(fetched)
    })

    // split at 2k characters
    let trigger = shifted.shift() // don't reprint the command
    shifted = Util.split(shifted, '\n\n')

    // reprint conversation
    for (var i = 0; i < shifted.length; i++) {
      let divide = '-----------------------------------------'
      let title  = `${divide} (${i + 1}/${shifted.length})`
      let author = Util.parse(lang.here, max, msg.channel.id)
      let embed1 = Util.box(shifted[i], author, { title })
      channel.send(embed1)
    }

    // relocation message
    let embed = Util.box(Util.parse(lang.from, max, channel.id))
    let response = `Moved ${max} Messages To <#${channel.id}>`
    msg.channel.send(Util.box(response))
  },

  // aliases
  move: async function(msg, opts){ this.__shift(msg, opts) }

}