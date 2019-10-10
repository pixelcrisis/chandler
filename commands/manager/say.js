module.exports = {
  
  name: 'say',
  level: 3,

  help: {
    name: "{pre}say [message]",
    desc: "Sends `message` to channel set by `{pre}speak`"
  },

  lang: {
    none: "Speaking hasn't been set yet. `{pre}speak #channel`"
  },

  fire: async function (Bot, evt) {
    if (!evt.options.length) return Bot.reply(evt, this.help)
    if (!evt.config.speak) return Bot.reply(evt, this.none)
    const chan = Bot.verifyChannel(evt.config.speak)
    if (chan) return chan.send(evt.options.join(' '))
  },

  test: async function (Bot, evt, data) {
    evt.options = [ 'hello', 'there!' ]
    await this.fire(Bot, evt)
  }

}