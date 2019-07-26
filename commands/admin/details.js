module.exports = {

  name: 'details',
  
  level: 9,

  help: {
    name: "{pre}details",
    desc: "Reports back the details of the bot."
  },

  fire: function(Bot, msg, opts, lvl) {

    Bot.exec('pm2 list', (err, yay, nay) => {
      if (err) return Bot.reply(msg, 'Nay')
      yay = yay.split('online')[1].split(' ').join('').split('│')

      const result = [
        '```js',
        `Guilds:       ${Bot.guilds.keyArray().length}`,
        `Restarts:     ${yay[1]}`,
        `Uptime:       ${yay[2]}`,
        `CPU Use:      ${yay[3]}`,
        `Memory:       ${yay[4]}`,
        '```'
      ]

      return Bot.listReply(msg, 'Chandler Details', result)
    })

  },

  test: async function(Bot, msg, data) {
    Bot.reply(msg, "No tests.")
  }

}