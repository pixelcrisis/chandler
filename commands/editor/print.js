module.exports = {
  
  name: 'print',
  level: 3,

  help: {
    name: "{pre}print [message]",
    desc: "Outputs `message` in the current channel."
  },

  fire: async function (Bot, evt) {
    if (!evt.options.length) return Bot.reply(evt, this.help)
    evt.channel.send(evt.options.join(' '))
    return Bot.deleteTrigger(evt)
  },

  test: async function (Bot, evt, data) {
    evt.options = []
    await this.fire(Bot, evt)

    evt.options = ['print arg', '~']
    await this.fire(Bot, evt)
  }

}