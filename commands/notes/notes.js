module.exports = {

  name: 'notes',
  alias: [ 'tags' ],
  
  level: 3,

  lang: {
    none: "Server has no notes set."
  },

  help: {
    name: "{pre}notes",
    desc: "Returns a lits of notes in the server.\n" +
          "Set with `{pre}note`, remove with `{pre}erase`"
  },

  fire: function(Bot, msg, opts, lvl) {
    let list = []
    const notes = Bot.notes.get(msg.guild.id)
    for (var title in notes) {
      list.push("**" + title + "**: `" + notes[title] + "`")
    }
    if (!list.length) return Bot.reply(msg, this.lang.none)
    return Bot.listReply(msg, "Server Tags", list)
  },

  test: async function(Bot, msg, data) {
    Bot.reply(msg, {
      name: "Testing {pre}tags",
      desc: "`{pre}tags` - List",
      color: 16549991
    })

    await this.fire(Bot, msg, [])
    
    return Bot.reply(msg, "{pre}tags test complete.")
  }

}