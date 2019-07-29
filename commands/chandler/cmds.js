module.exports = {

  name: 'cmds',
  
  level: 1,
  alias: [ 'commands' ],

  help: {
    name: "{pre}cmds",
    desc: "Prints a list of commands you have access to."
  },

  fire: function(Bot, msg, opts, access) {
    let pool = {}, response = { name: "Chandler Commands", desc: [] }
    const commands = Bot.commands.filter(cmd => access >= cmd.level)

    commands.forEach(cmd => {
      const level = Bot.nameAccess(cmd.level)
      if (!pool[level]) pool[level] = [ cmd.name ]
      else pool[level].push(cmd.name)
    })

    for (var level in pool) {
      response.desc.push(`**${level}**: ${pool[level].join(', ')}`)
    }

    return Bot.reply(msg, response)
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