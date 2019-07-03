// Message Shifting Plugin
// Moves X messages from one channel
// to a different channel.

const Util = require('../utils/util.js')
const lang = require('../data/lang.json').shifty

module.exports = {

  shift: async function(msg, opts) {
    if (opts.length != 2) {
      let response = Util.parse(lang.useage)
      return msg.channel.send(response)
    }

    let shifted = []
    let max = parseInt(opts[0])
    // channel comes in as: <#CHANNEL_ID>
    // we need to strip the <#>
    let channel = opts[1].substring(2, opts[1].length - 1)

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
      let author = `Moved ${max} Messages Here From #${msg.channel.name}`
      channel.send(Util.box(shifted[i], author, { title }))
    }

    // relocation message
    let response = `Moved ${max} Messages To <#${channel.id}>`
    msg.channel.send(Util.box(response))
  },

  // aliases
  move: async function(msg, opts){ this.__shift(msg, opts) }

}