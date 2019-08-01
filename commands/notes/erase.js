module.exports = {

  name: 'erase',
  alias: [ 'untag' ],
  
  level: 3,

  lang: {
    none: "`{val1}` isn't a note.",
    done: "Removed note: `{val1}`"
  },

  help: {
    name: "{pre}erase [note]",
    desc: "Removes `note`\n" +
          "Use `{pre}note` to set a note."
  },

  fire: function(Bot, msg, opts, lvl) {
    if (opts.length != 1) return Bot.reply(msg, this.help)
    const command = opts[0].toLowerCase()

    const note = Bot.$getNote(msg, command)
    if (!note) return Bot.reply(msg, this.lang.none, command)
    Bot.$remNote(msg, command)
    return Bot.reply(msg, this.lang.done, command)
  },

  test: async function(Bot, msg, data) {
    Bot.reply(msg, {
      name: "Testing {pre}erase",
      desc: "`{pre}erase` - Help\n" +
            "`{pre}erase tester` - Remove/Delete",
      color: 16549991
    })

    await this.fire(Bot, msg, [])
    await this.fire(Bot, msg, ['tester'])
    
    return Bot.reply(msg, "{pre}erase test complete.")
  }

}