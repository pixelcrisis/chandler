module.exports = {
  
  name: 'erase',
  level: 3,
  alias: ['untag'],

  help: {
    name: "{pre}erase [note]",
    desc: "Removes `{pre}note`\n" +
          "You can set a note with `{pre}note"
  },

  lang: {
    done: "Removed Note: `{val1}`",
    none: "`{val1}` isn't a note."
  },

  fire: async function (Bot, evt) {
    if (evt.options.length != 1) return Bot.reply(evt, this.help)
    
    const note = evt.options[0].toLowerCase()
    const curr = Bot.$getNotes(evt, note) 

    if (!curr) return Bot.reply(evt, this.lang.none, note)

    Bot.$remNote(evt, note)
    return Bot.reply(evt, this.lang.done, note)
  },

  test: async function (Bot, evt, data) {
    evt.options = ['hello']
    await this.fire(Bot, evt)
  }

}