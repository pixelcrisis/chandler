module.exports = {

  name: 'tag',
  
  level: 3,

  lang: {
    done: "Set `{pre}{val1}` to `{val2}`",
    replaced: "Replaced `{val1}` with `{val2}`",
    command: "`{val1}` is already a command."
  },

  help: {
    name: "{pre}tag [command] [message]",
    desc: "Sets `{pre}command` to `message`\n" +
          "You can unset with `{pre}untag`"
  },

  fire: function(Bot, msg, opts, lvl) {
    if (opts.length < 2) return Bot.reply(msg, this.help)
    const curr = Bot.getTag(msg.guild.id, command)

    let command = opts.shift()
    let message = opts.join(' ')

    const isCommand = Bot.findCommand(command)
    if (isCommand) return Bot.reply(msg, this.lang.command, command)
    Bot.setTag(msg.guild.id, { id: command, message })

    const oldMsg = curr ? Bot.escape(curr.message) : curr
    const newMsg = Bot.escape(message)

    if (oldMsg) return Bot.reply(msg, this.lang.replaced, oldMsg, newMsg)
    else return Bot.reply(msg, this.lang.done, command, newMsg)
  },

  test: async function(Bot, msg, data) {
    Bot.reply(msg, {
      name: "Testing {pre}tag",
      desc: "`{pre}tag` - Help\n" +
            "`{pre}tag oh` - Help\n" +
            "`{pre}tag tester hello world!` - world!",
      color: 16549991
    })

    await this.fire(Bot, msg, [])
    await this.fire(Bot, msg, ['oh'])
    await this.fire(Bot, msg, ['tester', 'hello', 'world!'])
    
    return Bot.reply(msg, "{pre}tag test complete.")
  }

}