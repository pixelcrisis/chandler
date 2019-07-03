// Speaking Plugin
// Allows mods to speak through the bot.
// for fun or moderation.

const DB   = require('../utils/db.js')
const Util = require('../utils/util.js')
const lang = require('../data/lang.json').speaks

module.exports = {

  speak: function(msg, opts) {
    let chan = DB.get('speaking')
    if (!chan) {
      let response = Util.parse(lang.unset)
      return msg.channel.send(response)
    } else {
      chan = msg.channel.guild.channels.get(chan)
    }

    if (!opts || !opts.length) {
      let response = Util.parse(lang.speaking, chan.name)
      return msg.channel.send(response)
    }

    else if (opts.length == 1) {
      let newID = opts[0].substring(2, opts[0].length - 1)
      let newCH = msg.channel.guild.channels.get(newID)
      if (!newCH) {
        let response = Util.parse(lang.noChannel)
        return msg.channel.send(response)
      } else {
        DB.set('speaking', newID)
        let response = Util.parse(lang.speaking, newCH.name)
        if (chan) response = Util.parse(lang.switch, chan.name, newCH.name)
        return msg.channel.send(response)
      }
    } 

    else {
      let response = Util.parse(lang.useage)
      return msg.channel.send(response)
    }
  },

  say: function(msg, opts) {
    let chan = DB.get('speaking')
    if (!chan) {
      let response = Util.parse(lang.unset)
      return msg.channel.send(response)
    } else {
      chan = msg.channel.guild.channels.get(chan)
    }
    if (opts.length) chan.send(opts.join(' '))
  }

};