// sudo.js - for admin commands

module.exports = {
  gate: 9,

  help: {
    name: '~/sudo (command) (options)',
    desc: 'Commands: `logs`, `details`, `reboot`, `update`, `eval`'
  },

  fire: async function (Chandler, Msg) {
    if (!Msg.args.length) return Chandler.reply(Msg, this.help)

    // Set up our subcommand executor
    const cmd = Msg.args.shift().toLowerCase()
    const opt = Msg.args.join(' ')
    if (this[`_${cmd}`]) return this[`_${cmd}`](Chandler, Msg, opt)
  },

  _logs: function (Chandler, Msg) {
    let response = { name: 'Latest Logs', desc: Chandler.logBook.join('\n') }
    return Chandler.reply(Msg, response)
  },

  _reboot: function (Chandler, Msg) {
    Chandler.post('Going Dark.', 'Rebooting...')
    Chandler.Exec('pm2 restart 0', (err, yay, nay) => {
      if (err) return Chandler.reply(Msg, `Nay ${Chandler.clean(nay)}`)
      else return Chandler.reply(Msg, `Yay ${Chandler.clean(yay)}`)
    })
  },

  _update: function (Chandler, Msg) {
    Chandler.Exec('git pull', async (err, yay, nay) => {
      if (err || !yay) return Chandler.reply(Msg, 'Nay')
      await Chandler.reply(Msg, Chandler.clean(yay))
      if (yay.indexOf('up to date') == -1) {
        Chandler.reply(Msg, 'Updating...')
        Chandler.Exec('pm2 restart 0')
      }
    })
  },

  _eval: async function (Chandler, Msg, opt) {
    try {
      const ran = await(eval(opt))
      Chandler.reply(Msg, Chandler.clean(ran))
    }
    catch (err) { Chandler.reply(Msg, Chandler.clean(err)) }
  },

  _details: function (Chandler, Msg) {
    Chandler.Exec('pm2 list', (err, yay, nay) => {
      if (err || !yay) return Chandler.reply(Msg, 'Nay?')
      // convert the table into something readable, hopefully
      yay = yay.split('online')[1].split(' ').join('').split('|')

      const response = {
        name: 'Chandler Details',
        desc: ['```js',
          `Guilds:       ${Chandler.guilds.cache.keyArray().length}`,
          `Restarts:     ${yay[1]}`,
          `Uptime:       ${yay[2]}`,
          `CPU Use:      ${yay[3]}`,
          `Memory:       ${yay[4]}`,
        '```'].join('\n')
      }

      return Chandler.reply(Msg, response)
    })
  },

  test: async function (Chandler, Msg, data) {
    return Chandler.reply(Msg, 'No Tests Available.')
  }
}