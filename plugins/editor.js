// Message Editor Plugin
// For Editing Bot Messages
// Including Embed Support!
// (Good For Notices/Rules)

const Utils = require('../utils/utils.js')
const Embed = require('../utils/embed.js')
const lang = require('../data/lang.json').editor

module.exports = {

  print: async function(msg, opts, test) {
    let total = opts.length ? parseInt(opts[0]) : 0
    if (total > 5) {
      let limited = Utils.parse(lang.limit)
      return msg.channel.send(limited)
    }
    for (var i = 0; i < total; i++) {
      await msg.channel.send('_ _').then(m => m.edit(m.id))
    }
    return test ? true : msg.delete()
  },

  embed: function(msg, opts, test) {
    let useage = Utils.parse(lang.embed.use)
    if (!opts) return msg.channel.send(useage)
    else {
      let embed = Embed.parse(opts.join(' '))
      if (embed) msg.channel.send(embed)
      else {
        let badEmbed = Utils.parse(lang.embed.bad)
        msg.channel.send(badEmbed)
      }
    }
    return test ? true : msg.delete()
  },

  edit: function(msg, opts, test) {
    let useage = Utils.parse(lang.edit.use)
    if (opts.length <= 1) return msg.channel.send(useage)

    let id = opts.shift()
    msg.channel.fetchMessage(id)
      .then((m) => {
        let newMsg = opts.join(' ')
        // if not an embed, just push the edit
        if (newMsg.indexOf('{') !== 0) m.edit(newMsg)
        else {
          // else try to parse the embed
          let embed = Embed.parse(newMsg)
          if (embed) m.edit(m.content, embed)
          else {
            // we couldn't parse the embed
            let badEmbed = Utils.parse(lang.embed.bad)
            return msg.channel.send(badEmbed)
          }
        }
      })
      .catch(() => {
        // we couldn't find the message
        let noMessage = Utils.parse(lang.edit.none)
        return msg.channel.send(noMessage)
      })
    return test ? true : msg.delete()
  }

}