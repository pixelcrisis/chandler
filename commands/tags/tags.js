module.exports = {

  name: 'tags',
  
  level: 3,

  lang: {
    none: "Server has no aliases set."
  },

  help: {
    name: "{pre}tags",
    desc: "Returns a lits of tags in the server.\n" +
          "Set with `{pre}tag`, remove with `{pre}untag`"
  },

  fire: function(Bot, msg, opts, lvl) {
    let list = []
    const data = Bot.get(msg.guild.id, 'tags')
    for (var i = 0; i < data.length; i++) {
      list.push("**" + data[i].id + "**: `" + data[i].message + "`")
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