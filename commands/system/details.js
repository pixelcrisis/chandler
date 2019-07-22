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
      yay = yay.split('online')[1].split('root')[0]
      yay = yay.replace(/ +(?= )/g,'').split('│').join(' - ')
      const total = Bot.guilds.keyArray().length

      const result = [
        '```js',
        'Guilds - ' + total,
        'Details' + yay,
        '```'
      ]

      return Bot.listReply(msg, 'Chandler Details', result)
    })

  },

  test: async function(Bot, msg, data) {
    Bot.reply(msg, "No tests.")
  }

}