module.exports = {

  name: 'cmds',
  
  level: 1,
  alias: [ 'commands' ],

  help: {
    name: "{pre}cmds",
    desc: "Prints a list of commands you have access to."
  },

  fire: function(Bot, msg, opts, lvl) {
    let list = []
    for (var cmd in Bot.commands) {
      if (lvl >= Bot.commands[cmd].level) list.push(cmd)
    }
    return Bot.listReply(msg, "Chandler Commands", list, ', ')
  },

  test: async function(Bot, msg) {
    Bot.reply(msg, {
      name: "Testing {pre}cmds",
      desc: "`{pre}cmds` - List (Few, level 1)\n" +
            "`{pre}cmds` - List (All, level 9)",
      color: 16549991
    })
    
    await this.fire(Bot, msg, [], 1)
    await this.fire(Bot, msg, [], 9)

    Bot.reply(msg, "{pre}cmds test complete.")
  }

}