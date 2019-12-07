module.exports = {
  
  name: 'speak',
  level: 3,

  help: {
    name: "{pre}speak (channel)",
    desc: "Sets `channel` to `{pre}say` messages in.\n" +
          "If no `channel` is provided, returns current speaking channel."
  },

  lang: {
    curr: "Now speaking in <#{val1}>",
    none: "Speaking hasn't been set yet. `{pre}speak #channel`"
  },

  fire: async function (Bot, evt) {
    const chan = evt.config.speak

    if (evt.options.length == 1) {
      const newch = Bot.verifyChannel(evt, evt.options[0])
      if (!newch) return Bot.reply(evt, Bot.EN.bad.arg, evt.options[0])

      Bot.$setConf(evt, 'speak', newch.id)
      return Bot.reply(evt, this.lang.curr, newch.id)
    }

    else if (!evt.options.length) {
      Bot.reply(evt, chan ? this.lang.curr : this.lang.none, chan)
    }

    else return Bot.reply(evt, this.help)
  },

  test: async function (Bot, evt, data) {
    evt.options = [ data.chan ]
    await this.fire(Bot, evt)
  }

}