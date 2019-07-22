const exec = require("child_process").exec

module.exports = {

  name: 'details',
  
  level: 5,

  help: {
    name: "{pre}details",
    desc: "Reports back the details of the bot."
  },

  fire: function(Bot, msg, opts, lvl) {

    Bot.exec('pm2 list', (err, yay, nay) => {
      if (err) return Bot.reply(msg, 'Nay')
      yay = yay.split('online')[1].split('root')[0]
      yay = yay.replace(/ +(?= )/g,'').split('│').join(' - ')

      return Bot.listReply(msg, 'Chandler Details', [
        '```js\n' + yay + '```',
        `Total Guilds: ${Bot.guilds.keyArray().length}`
      ])
    })
    
  },

  test: async function(Bot, msg, data) {
    Bot.reply(msg, {
      name: "Testing {pre}details",
      desc: "`{pre}details` - De",
      color: 16549991
    })

    await this.fire(Bot, msg, [])

    return Bot.reply(msg, "{pre}details test complete.")
  }

}