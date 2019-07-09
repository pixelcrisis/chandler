// Message Editing Plugin
// For Editing Bot Messages
// Including Embed Support!
// (Good For Notices/Rules)

const Reply = require('../utils/reply.js')
const lang = require('../data/lang.json').editing

module.exports = {

  async print(msg, opts, test) {
    msg.channel.send('_ _').then(m => m.edit(m.id))
    return test ? true : msg.delete()
  },

  clear(msg, opts) {
    if (opts.length !== 1) return Reply.with(msg, lang.clear)
    return msg.channel.fetchMessages({ limit: parseInt(opts[0]) + 1 })
      .then(got => { msg.channel.bulkDelete(got) })
  },

  embed(msg, opts, test) {
    if (!opts) return Reply.with(msg, lang.embed.use)
    else {
      let embed = Reply.getEmbed(opts.join(' '))
      if (embed) msg.channel.send(embed)
      else return Reply.with(msg, lang.embed.bad)
    }
    return test ? true : msg.delete()
  },

  async edit(msg, opts, test) {
    if (opts.length <= 1) return Reply.with(msg, lang.edit.use)

    let id = opts.shift()
    await msg.channel.fetchMessage(id)
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
            return Reply.with(msg, lang.embed.bad)
          }
        }
      })
      .catch(() => {
        // we couldn't find the message
        return Reply.with(msg, lang.edit.none, id)
      })
    return test ? true : msg.delete()
  }

}