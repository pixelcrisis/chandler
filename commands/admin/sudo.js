module.exports = {
  
  name: 'sudo',
  level: 9,

  help: {
    name: "{pre}sudo (command) (options)",
    desc: "`details`, `reboot`, `update`, `eval`"
  },

  fire: async function (Bot, evt) {
    if (!evt.options.length) return Bot.reply(evt, this.help)
    const opt = evt.options.shift().toLowerCase()
    const val = evt.options.join(' ')
    if (this[`__${opt}`]) return this[`__${opt}`](Bot, evt, val)
  },

  __logs: function (Bot, evt) {
    return Bot.reply(evt, { name: "Latest Logs", desc: Bot.logBook })
  },

  __details: function (Bot, evt) {
    Bot.exec('pm2 list', (err, yay, nay) => {
      if (err) return Bot.reply(evt, 'Nay')
      yay = yay.split('online')[1].split(' ').join('').split('│')

      const response = {
        name: 'Chandler Details',
        desc: [ '```js',
          `Guilds:       ${Bot.guilds.keyArray().length}`,
          `Restarts:     ${yay[1]}`,
          `Uptime:       ${yay[2]}`,
          `CPU Use:      ${yay[3]}`,
          `Memory:       ${yay[4]}`,
        '```']
      }

      return Bot.reply(evt, response)
    })
  },

  __reboot: function (Bot, evt) {
    Bot.log('Going Dark.')
    Bot.exec('pm2 restart 0', (err, yay, nay) => {
      if (err) return Bot.reply(evt, `Nay ${Bot.clean(nay)}`)
      else return evt.channel.send(Bot.clean(yay))
    })
  },

  __update: function (Bot, evt) {
    Bot.exec('git pull', async (err, yay, nay) => {
      if (err) return Bot.reply(evt, 'Nay')
      console.log(Bot.clean(yay))
      await evt.channel.send(Bot.clean(yay))
      if (yay.indexOf('up to date') == -1) {
        Bot.log('Updating...')
        Bot.exec('pm2 restart 0')
      }
    })
  },

  __eval: async function (Bot, evt, val) {
    try {
      const ran = await(eval(val))
      evt.channel.send(Bot.clean(ran))
    }
    catch (err) {
      evt.channel.send(Bot.clean(err))
    }
  },

  test: async function (Bot, evt, data) {
    return Bot.reply(evt, 'no tests available')
  }

}