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
    let embed = Util.getEmbed(opts.join(' '))
    if (embed) msg.channel.send(embed)
    else {
      let response = Util.parse(lang.badEmbed)
      msg.channel.send(response)
    }
    msg.delete()
  },

  edit: function(msg, opts) {
    if (opts.length <= 1) {
      let response = Util.parse(lang.usage)
      return msg.channel.send(response)
    }
    let id = opts.shift()
    msg.channel.fetchMessage(id)
      .then((m) => {
        let newMsg = opts.join(' ')
        // if not an embed, just push the edit
        if (newMsg.indexOf('{') !== 0) m.edit(newMsg)
        else {
          // else try to parse the embed
          let embed = Util.getEmbed(newMsg)
          if (newMsg) m.edit(m.content, { embed: obj })
          else {
            // we couldn't parse the embed
            let response = Util.parse(lang.badEmbed)
            return msg.channel.send(response)
          }
        }
      })
      .catch(() => {
        // we couldn't find the message
        let response = Util.parse(lang.noMessage)
        return msg.channel.send(response)
      })
    msg.delete()
  }

}