module.exports = {

  name: 'note',
  alias: [ 'tag' ],
  
  level: 3,

  lang: {
    done: "Set `{pre}{val1}` to `{val2}`",
    replaced: "Replaced `{val1}` with `{val2}`",
    command: "`{val1}` is already a note."
  },

  help: {
    name: "{pre}note [title] [message]",
    desc: "Sets `{pre}title` to `message`\n" +
          "You can remove with `{pre}erase`"
  },

  fire: function(Bot, msg, opts, lvl) {
    if (opts.length < 2) return Bot.reply(msg, this.help)

    let command = opts.shift()
    let message = opts.join(' ')

    const isCommand = Bot.findCommand(command)
    if (isCommand) return Bot.reply(msg, this.lang.command, command)

    const curr = Bot.getNote(msg.guild.id, command)
    Bot.setNote(msg.guild.id, command, message)

    const oldMsg = curr ? Bot.escape(curr) : curr
    const newMsg = Bot.escape(message)

    if (oldMsg) return Bot.reply(msg, this.lang.replaced, oldMsg, newMsg)
    else return Bot.reply(msg, this.lang.done, command, newMsg)
  },

  test: async function(Bot, msg, data) {
    Bot.reply(msg, {
      name: "Testing {pre}note",
      desc: "`{pre}note` - Help\n" +
            "`{pre}note oh` - Help\n" +
            "`{pre}note tester hello world!` - world!",
      color: 16549991
    })

    await this.fire(Bot, msg, [])
    await this.fire(Bot, msg, ['oh'])
    await this.fire(Bot, msg, ['tester', 'hello', 'world!'])
    
    return Bot.reply(msg, "{pre}note test complete.")
  }

}