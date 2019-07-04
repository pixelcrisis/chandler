// Message Editor Plugin
// For Editing Bot Messages
// Including Embed Support!
// (Good For Notices/Rules)

const Util = require('../utils/util.js')
const lang = require('../data/lang.json').editor

module.exports = {

  print: function(msg, opts) {
    let total = opts.length ? parseInt(opts[0]) : 0
    for (var i = 0; i < total; i++) {
      msg.channel.send('_ _').then(m => m.edit(m.id))
    }
    msg.delete()
  },

  embed: function(msg, opts) {
    let useage = Util.parse(lang.embed.use)
    if (!opts) msg.channel.send(useage)
    else {
      let embed = Util.getEmbed(opts.join(' '))
      if (embed) msg.channel.send(embed)
      else {
        let badEmbed = Util.parse(lang.embed.bad)
        msg.channel.send(badEmbed)
      }
    }
    msg.delete()
  },

  edit: function(msg, opts) {
    let useage = Util.parse(lang.edit.use)
    if (opts.length <= 1) return msg.channel.send(useage)

    let id = opts.shift()
    msg.channel.fetchMessage(id)
      .then((m) => {
        let newMsg = opts.join(' ')
        // if not an embed, just push the edit
        if (newMsg.indexOf('{') !== 0) m.edit(newMsg)
        else {
          // else try to parse the embed
          let embed = Util.getEmbed(newMsg)
          if (embed) m.edit(m.content, embed)
          else {
            // we couldn't parse the embed
            let badEmbed = Util.parse(lang.embed.bad)
            return msg.channel.send(badEmbed)
          }
        }
      })
      .catch(() => {
        // we couldn't find the message
        let noMessage = Util.parse(lang.edit.none)
        return msg.channel.send(noMessage)
      })
    msg.delete()
  }

}