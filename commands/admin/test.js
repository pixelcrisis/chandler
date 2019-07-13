module.exports = {

  name: 'test',
  
  level: 9,

  resp: {
    start: { desc: "Starting {val1} Test(s)", color: 16736084 },
    finish: { desc: "Finished {val1} Test(s)", color: 16736084 }
  },

  help: {
    name: "{pre}test (command)",
    desc: "If you don't know what this does..."
  },

  testData: {
    user: '200944208855433220',
    role: '596192935138033675',
    channel: '596837986356690954'
  },

  fire: async function(Bot, msg, opts, lvl) {
    if (!opts.length) return Bot.reply(msg, this.help)

    Bot.reply(msg, this.resp.start, opts.length)
    Bot.booted = false

    if (opts.length) {
      for (var i = 0; i < opts.length; i++) {
        let cmd = Bot.findCommand(opts[i])
        if (cmd) await cmd.test(Bot, msg, this.testData)
      }
    }

    Bot.booted = true
    return Bot.reply(msg, this.resp.finish, opts.length)
  },

  test: async function(Bot, msg) {
    return Bot.reply(msg, "i n c e p t i o n")
  }

}