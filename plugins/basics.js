// Message Shifting Plugin
// Moves X messages from one channel
// to a different channel.

const Util = require('../utils/util.js')
const lang = require('../data/lang.json').basics

module.exports = {

  invite: function(msg, opts) {
    return msg.channel.send({
      embed: {
        title: "Let Me Help!",
        description: lang.invite
      }
    })
  }

}