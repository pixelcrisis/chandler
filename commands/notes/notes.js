module.exports = {

  name: 'notes',
  alias: [ 'tags' ],
  
  level: 1,

  lang: {
    none: "Server has no notes set. Mods can set some with `{pre}note`"
  },

  help: {
    name: "{pre}notes",
    desc: "Returns a lits of notes in the server.\n" +
          "Set with `{pre}note`, remove with `{pre}erase`"
  },

  fire: function(Bot, msg, opts, lvl) {
    const notes = Bot.$getNOte(msg)
    let response = { name: `${msg.guild.name} Notes`, desc: [] }
    for (var title in notes) {
      response.desc.push("**" + title + "**: `" + notes[title] + "`")
    }
    if (!response.desc.length) return Bot.reply(msg, this.lang.none)
    return Bot.reply(msg, response)
  },

  test: async function(Bot, msg, data) {
    Bot.reply(msg, {
      name: "Testing {pre}notes",
      desc: "`{pre}notes` - List",
      color: 16549991
    })

    await this.fire(Bot, msg, [])
    
    return Bot.reply(msg, "{pre}notes test complete.")
  }

}