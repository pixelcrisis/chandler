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
      if (!newCH) return Reply.to(msg, lang.none)
      else {
        chan = msg.channel.guild.channels.get(chan)
        State.set(msg.guild.id, 'speak', newID)
        if (chan) return Reply.to(msg, lang.swap, chan.id, newCH.id)
        else return Reply.to(msg, lang.curr, newCH.id)
      }
    } 

    else if (!opts || !opts.length) {
      chan = msg.channel.guild.channels.get(chan)
      if (chan) return Reply.to(msg, lang.curr, chan.id)
      else return Reply.to(msg, lang.none)
    }

    else return Reply.to(msg, lang.use)
  },

  say: function(msg, opts) {
    if (!opts) return Reply.to(msg, lang.say)

    let chan = State.get(msg.guild.id, 'speak')
    if (!chan) return Reply.to(msg, lang.none)
    else chan = msg.channel.guild.channels.get(chan)
    if (opts.length) return Reply.to(msg, opts.join(' '))
  }

};