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
      await msg.channel.send(Bot.clean(yay))
      if (yay.indexOf('up-to-date') == -1) {
        // if we updated, reboot!
        Bot.log('Updating...')
        Bot.exec('pm2 restart 0')
      }
    })

  },

  test: async function(Bot, msg, data) {
    Bot.reply(msg, "No tests.")
  }

}