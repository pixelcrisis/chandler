module.exports = {

  name: 'update',
  
  level: 9,

  help: {
    name: "{pre}update",
    desc: "Updates the bot."
  },

  fire: function(Bot, msg, opts, lvl) {

    Bot.exec('git pull', (err, yay, nay) => {
      if (err) return Bot.reply(msg, 'Nay')
      return msg.channel.send(Bot.clean(yay))
    })

  },

  test: async function(Bot, msg, data) {
    Bot.reply(msg, "No tests.")
  }

}