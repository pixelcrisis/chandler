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
      let newID = opts[0].substring(2, opts[0].length - 1)
      let newCH = msg.channel.guild.channels.get(newID)
      if (!newCH) {
        let response = Util.parse(lang.noChannel)
        return msg.channel.send(response)
      } else {
        chan = msg.channel.guild.channels.get(chan)
        DB.set(msg.guild.id, 'speak', newID)
        let response = Util.parse(lang.speaking, newCH.name)
        if (chan) response = Util.parse(lang.switch, chan.name, newCH.name)
        return msg.channel.send(response)
      }
    } 

    else if (!opts || !opts.length) {
      chan = msg.channel.guild.channels.get(chan)
      let options = chan ? chan.name : ''
      let message = chan ? lang.speaking : lang.unset
      let response = Util.parse(message, options)
      return msg.channel.send(response)
    }

    else {
      let response = Util.parse(lang.useage)
      return msg.channel.send(response)
    }
  },

  say: async function(msg, opts) {
    let chan = await DB.get(msg.guild.id, 'speak')
    if (!chan) {
      let response = Util.parse(lang.unset)
      return msg.channel.send(response)
    } else {
      chan = msg.channel.guild.channels.get(chan)
    }
    if (opts.length) chan.send(opts.join(' '))
  }

};