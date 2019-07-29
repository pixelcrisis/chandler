module.exports = {

  name: 'reboot',
  
  level: 9,

  help: {
    name: "{pre}reboot",
    desc: "Reboots the bot."
  },

  fire: function(Bot, msg, opts, access) {

    msg.react('✅')
    Bot.log("Going Dark.")
    Bot.exec('pm2 restart 0', (err, yay, nay) => {
      if (err) return Bot.reply(msg, 'Nay' + Bot.clean(nay))
      return msg.channel.send(Bot.clean(yay))
    })

  },

  test: async function(Bot, msg, data) {
    Bot.reply(msg, "No tests.")
  }

}