// test.js - for testing other commands

module.exports = {
  gate: 9,

  help: {
    name: "~/test (command)",
    desc: "This one is pretty obvious."
  },

  data: {
    user: "200944208855433220",
    role: "596192935138033675",
    chan: "596837986356690954"
  },

  lang: {
    run: { desc: "Starting {val1} Test(s)", color: 16736084 },
    end: { desc: "Finished {val1} Test(s)", color: 16736084 }
  },

  fire: async function (Chandler, Msg) {
    let total = Msg.args.length
    if (!total) return Chandler.reply(Msg, this.help)
    else Chandler.reply(Msg, this.lang.run, total)
    
    for (let opt of Msg.args) {
      let command = Chandler.findCommand(opt)
      if (command) await command.test(Chandler, Msg, this.data)
    }

    return Chandler.reply(Msg, this.lang.end, total)
  },

  test: async function (Chandler, Msg, data) {
    return Chandler.reply(Msg, 'Inception!')
  }
}