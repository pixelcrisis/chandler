module.exports = {
  
  name: 'note',
  level: 3,
  alias: ['tag'],

  help: {
    name: "{pre}note [title] [message]",
    desc: "Sets `{pre}title` to `message`\n" +
          "You can remove with `{pre}erase"
  },

  lang: {
    added: "Set `{pre}{val1}` to `{val2}`",
    updated: "Updated `{val1}` to `{val2}`",
    exists: "`{val1}` is a command already."
  },

  fire: async function (Bot, evt) {
    if (evt.options.length < 2) return Bot.reply(evt, this.help)

    let command = evt.options.shift().toLowerCase()
    let message = evt.options.join(' ')

    const exists = Bot.findCommand(command)
    if (exists) return Bot.reply(evt, this.lang.exists, command)

    const curr = Bot.$getNotes(evt, command)
    Bot.$setNote(evt, command, message)

    const newMsg = Bot.escape(message)
    const oldMsg = curr ? `${command}/${Bot.escape(curr)}` : curr

    if (!oldMsg) return Bot.reply(evt, this.lang.added, command, newMsg)
    else return Bot.reply(evt, this.lang.updated, oldMsg, newMsg)
  },

  test: async function (Bot, evt, data) {
    evt.options = ['hello', 'oh hello']
    await this.fire(Bot, evt)

    evt.options = ['hello', 'well hi there']
    await this.fire(Bot, evt)
  }

}