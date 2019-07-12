module.exports = {

  name: 'test',
  
  level: 9,

  response: {
    start: "Starting {val1} Test(s)",
    finish: "Finished {val1} Test(s)"
  },

  help: {
    name: "{pre}test (command)",
    desc: "If you don't know what this does..."
  },

  fire: async function(Bot, msg, opts, lvl) {
    if (!opts.length) return Bot.reply(msg, this.help)
    const color = 16736084

    Bot.reply(msg, { desc: this.response.start, color }, opts.length)
    Bot.booted = false

    if (opts.length) {
      for (var i = 0; i < opts.length; i++) {
        let cmd = Bot.findCommand(opts[i])
        if (cmd) await cmd.test(Bot, msg)
      }
    }

    Bot.booted = true
    Bot.reply(msg, { desc: this.response.finish, color }, opts.length)
  },

  test: async function(Bot, msg) {
    Bot.reply(msg, "i n c e p t i o n")
  }

}