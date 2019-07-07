// Speaking Plugin
// Allows mods to speak through the bot.
// for fun or moderation.

const Reply = require('../utils/reply.js')
const State = require('../utils/state.js')
const lang = require('../data/lang.json').speaks

module.exports = {

  speak: function(msg, opts) {
    let chan = State.get(msg.guild.id, 'speak')

    if (opts.length == 1) {
      let newID = Reply.strip(opts[0])
      let newCH = msg.channel.guild.channels.get(newID)
      if (!newCH) return Reply.with(msg, lang.none)
      else {
        chan = msg.channel.guild.channels.get(chan)
        State.set(msg.guild.id, 'speak', newID)
        if (chan) return Reply.with(msg, lang.swap, chan.id, newCH.id)
        else return Reply.with(msg, lang.curr, newCH.id)
      }
    } 

    else if (!opts || !opts.length) {
      chan = msg.channel.guild.channels.get(chan)
      if (chan) return Reply.with(msg, lang.curr, chan.id)
      else return Reply.with(msg, lang.none)
    }

    else return Reply.with(msg, lang.use)
  },

  say: function(msg, opts) {
    if (!opts) return Reply.with(msg, lang.say)

    let chan = State.get(msg.guild.id, 'speak')
    if (!chan) return Reply.with(msg, lang.none)
    else chan = msg.channel.guild.channels.get(chan)
    if (opts.length) return msg.channel.send(opts.join(' '))
  }

};