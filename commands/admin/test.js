module.exports = {
  
  name: 'test',
  level: 9,

  help: {
    name: "{pre}test (command)",
    desc: "This one is pretty obvious."
  },

  data: {
    user: '200944208855433220',
    role: '596192935138033675',
    chan: '596837986356690954'
  },

  lang: {
    run: { desc: 'Starting {args} Test(s)', color: 16736084 },
    end: { desc: 'Finished {args} Test(s)', color: 16736084 }
  },

  fire: async function (Bot, evt) {
    if (!evt.options.length) return Bot.reply(evt, this.help)
    else Bot.reply(evt, this.lang.run)

    evt.chained = true

    for (let opt of evt.options) {
      if (opt == 'logs') {
        await Bot.emit('guildCreate', evt.guild, true)
        await Bot.emit('guildDelete', evt.guild, true)
      }

      else {
        let cmd = Bot.findCommand(opt)
        if (cmd) await cmd.test(Bot, evt, this.data)
      }
    }

    return Bot.reply(evt, this.lang.end)
  },

  test: async function (Bot, evt, data) {
    return Bot.reply(evt, 'inception')
  }

}