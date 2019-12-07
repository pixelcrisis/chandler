module.exports = {
  
  name: 'setzone',
  level: 3,

  help: {
    name: "{pre}setzone [user] [timezone]",
    desc: "Sets `timezone` for `user`."
  },

  lang: {
    done: "Set <@{val1}> timezone to `{val2}`"
  },

  fire: async function (Bot, evt) {
    if (evt.options.length < 2) return Bot.reply(evt, this.help)

    const data = evt.options.shift()
    const user = Bot.verifyUser(evt, data)
    if (!user) return Bot.reply(evt, Bot.EN.bad.arg, data)

    const zone = Bot.findZone(evt.options)
    if (!zone) return Bot.reply(evt, Bot.EN.bad.arg, evt.options.join(' '))

    Bot.$setZone(evt, user.id, zone.name)
    return Bot.reply(evt, this.lang.done, user.id, zone.name)
  },

  test: async function (Bot, evt, data) {
    evt.options = [data.user, 'Chicago']
    await this.fire(Bot, evt)
  }

}