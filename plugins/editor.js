// Message Editor Plugin
// For Editing Bot Messages
// Including Embed Support!
// (Good For Notices/Rules)

const Reply = require('../utils/reply.js')
const lang = require('../data/lang.json').editor

module.exports = {

  print: async function(msg, opts, test) {
    let total = opts.length ? parseInt(opts[0]) : 1
    if (total > 5) return Reply.to(msg, lang.limit)
    for (var i = 0; i < total; i++) {
      await msg.channel.send('_ _').then(m => m.edit(m.id))
    }
    return test ? true : msg.delete()
  },

  embed: function(msg, opts, test) {
    if (!opts) return Reply.to(msg, lang.embed.use)
    else {
      let embed = Reply.getEmbed(opts.join(' '))
      if (embed) msg.channel.send(embed)
      else return Reply.to(msg, lang.embed.bad)
    }
    return test ? true : msg.delete()
  },

  edit: function(msg, opts, test) {
    if (opts.length <= 1) return Reply.to(msg, lang.edit.use)

    let id = opts.shift()
    msg.channel.fetchMessage(id)
      .then((m) => {
        let newMsg = opts.join(' ')
        // if not an embed, just push the edit
        if (newMsg.indexOf('{') !== 0) m.edit(newMsg)
        else {
          // else try to parse the embed
          let embed = Reply.getEmbed(newMsg)
          if (embed) m.edit(m.content, embed)
          else {
            // we couldn't parse the embed
            return Reply.to(msg, lang.embed.bad)
          }
        }
      })
      .catch(() => {
        // we couldn't find the message
        return Reply.to(msg, lang.edit.none)
      })
    return test ? true : msg.delete()
  }

}