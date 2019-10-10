module.exports = {
  
  name: 'notes',
  level: 1,
  alias: ['tags'],

  help: {
    name: "{pre}notes",
    desc: "Returns a list of notes set in the server.\n" +
          "Add a note with `{pre}note`, remove with `{pre}erase`"
  },

  lang: {
    none: "Server has no notes set. Mods can set some with `{pre}note`"
  },

  fire: async function (Bot, evt) {
    const notes = Bot.$getNotes(evt)

    let response = { name: `${evt.guild.name} Notes`, desc: [] }
    for (let title in notes) {
      response.desc.push(`**${title}**: ${notes[title]}`)
    }

    if (!response.desc.length) return Bot.reply(evt, this.lang.none)
    else return Bot.reply(evt, response)
  },

  test: async function (Bot, evt, data) {
    evt.options = []
    await this.fire(Bot, evt)
  }

}