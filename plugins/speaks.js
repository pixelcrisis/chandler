// Speaking Plugin
// Allows mods to speak through the bot.
// for fun or moderation.

const DB   = require('../utils/db.js')
const Util = require('../utils/util.js')
const lang = require('../data/lang.json').speaks

module.exports = {

  speak: async function(msg, opts) {
    let chan = await DB.get(msg.guild.id, 'speak')

    if (opts.length == 1) {
      let newID = Util.strip(opts[0])
      let newCH = msg.channel.guild.channels.get(newID)
      if (!newCH) {
        let noChannel = Util.parse(lang.none)
        return msg.channel.send(noChannel)
      } else {
        chan = msg.channel.guild.channels.get(chan)
        DB.set(msg.guild.id, 'speak', newID)
        let swap = Util.parse(lang.curr, newCH.name)
        if (chan) swap = Util.parse(lang.swap, chan.name, newCH.name)
        return msg.channel.send(swap)
      }
    } 

    else if (!opts || !opts.length) {
      chan = msg.channel.guild.channels.get(chan)
      let options = chan ? chan.name : ''
      let message = chan ? lang.curr : lang.none
      let response = Util.parse(message, options)
      return msg.channel.send(response)
    }

    else {
      let useage = Util.parse(lang.use)
      return msg.channel.send(useage)
    }
  },

  say: async function(msg, opts) {
    let useage = Util.parse(lang.say)
    if (!opts) return msg.channel.send(useage)

    let chan = await DB.get(msg.guild.id, 'speak')
    if (!chan) {
      let noChannel = Util.parse(lang.none)
      return msg.channel.send(noChannel)
    } else {
      chan = msg.channel.guild.channels.get(chan)
    }
    if (opts.length) chan.send(opts.join(' '))
  }

};