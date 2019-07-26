module.exports = {

  name: 'cmds',
  
  level: 1,
  alias: [ 'commands' ],

  help: {
    name: "{pre}cmds",
    desc: "Prints a list of commands you have access to."
  },

  fire: function(Bot, msg, opts, access) {
    let pool = {}, list = []

    for (var cmd in Bot.commands) {
      const level = Bot.commands[cmd].level
      const named = Bot.nameAccess(level)

      if (access >= level) {
        if (!pool[named]) pool[named] = []
        pool[named].push(cmd)
      }
    }

    for (var level in pool) {
      list.push(`**${level}**: ${pool[level].join(', ')}`)
    }
    return Bot.listReply(msg, "Chandler Commands", list, '\n')
  },

  test: async function(Bot, msg, data) {
    Bot.reply(msg, {
      name: "Testing {pre}cmds",
      desc: "`{pre}cmds` - List (Few, level 1)\n" +
            "`{pre}cmds` - List (All, level 9)",
      color: 16549991
    })
    
    await this.fire(Bot, msg, [], 1)
    await this.fire(Bot, msg, [], 9)

    return Bot.reply(msg, "{pre}cmds test complete.")
  }

}