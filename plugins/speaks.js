// Speaking Plugin
// Allows mods to speak through the bot.
// for fun or moderation.

const Utils = require('../utils/utils.js')
const State = require('../utils/state.js')
const lang = require('../data/lang.json').speaks

module.exports = {

  speak: function(msg, opts) {
    let chan = State.get(msg.guild.id, 'speak')

    if (opts.length == 1) {
      let newID = Utils.strip(opts[0])
      let newCH = msg.channel.guild.channels.get(newID)
      if (!newCH) {
        let noChannel = Utils.parse(lang.none)
        return msg.channel.send(noChannel)
      } else {
        chan = msg.channel.guild.channels.get(chan)
        State.set(msg.guild.id, 'speak', newID)
        let swap = Utils.parse(lang.curr, newCH.id)
        if (chan) swap = Utils.parse(lang.swap, chan.id, newCH.id)
        return msg.channel.send(swap)
      }
    } 

    else if (!opts || !opts.length) {
      chan = msg.channel.guild.channels.get(chan)
      let options = chan ? chan.id : ''
      let message = chan ? lang.curr : lang.none
      let response = Utils.parse(message, options)
      return msg.channel.send(response)
    }

    else {
      let useage = Utils.parse(lang.use)
      return msg.channel.send(useage)
    }
  },

  say: function(msg, opts) {
    let useage = Utils.parse(lang.say)
    if (!opts) return msg.channel.send(useage)

    let chan = State.get(msg.guild.id, 'speak')
    if (!chan) {
      let noChannel = Utils.parse(lang.none)
      return msg.channel.send(noChannel)
    } else {
      chan = msg.channel.guild.channels.get(chan)
    }
    if (opts.length) return chan.send(opts.join(' '))
  }

};