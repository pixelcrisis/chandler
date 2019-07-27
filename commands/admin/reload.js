module.exports = {

  name: 'reload',
  
  level: 9,

  help: {
    name: "{pre}reload cmd",
    desc: "Reloads a cmd."
  },

  fire: function(Bot, msg, opts, lvl) {

    if (opts.length) {
      const cmd = Bot.findCommand(opts[0])
      if (!cmd) return msg.channel.send("What command?")

      const unload = Bot.unloadCommand(cmd)
      const reload = Bot.loadCommand(cmd.group, cmd.name)
      msg.channel.send("Reloaded!")
    }

  },

  test: async function(Bot, msg, data) {
    Bot.reply(msg, "No tests.")
  }

}