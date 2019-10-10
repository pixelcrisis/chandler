module.exports = {
  
  name: 'zone',
  level: 1,

  help: {
    name: "{pre}zone [timezone]",
    desc: "Replace `timezone` with the nearest city your time is based on!\n" +
          "`{pre}zone London` or `{pre}zone New York` or `{pre}zone Melbourne`\n\n" +
          "If you don't know, find your timezone code here:\n<{timezones}>\n\n" +
          "Then try `>zone America/Chicago` but replace with your timezone!"
  },

  lang: {
    done: "Set your timezone `{val1}`"
  },

  fire: async function (Bot, evt) {
    if (!evt.options.length) return Bot.reply(evt, this.help)
    const opts = evt.options.join(' ')

    const zone = Bot.findZone(evt.options)
    if (!zone) return Bot.reply(evt, Bot.EN.bad.arg, opts)

    Bot.$setZone(evt, evt.author.id, zone.name)
    return Bot.reply(evt, this.lang.done, opts)
  },

  test: async function (Bot, evt, data) {
    evt.options = ['Chicago']
    await this.fire(Bot, evt)
  }

}