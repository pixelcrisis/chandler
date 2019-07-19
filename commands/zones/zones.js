module.exports = {

  name: 'zones',
  
  level: 1,

  lang: {
    name: "Active Time Zones",
    line: "-----------------",
    none: "You need to add your zone first! `{pre}zone`",
    full: "Too many users in this guild, try `{pre}time`"
  },

  help: {
    name: "{pre}zones",
    desc: "Gets current time in all tracked timezones.\n" +
          "Includes users listed in each timezone for reference."
  },

  fire: function(Bot, msg, opts, lvl) {
    const user = Bot.getZone(msg.guild.id, msg.author.id)
    if (!user) return Bot.reply(msg, this.lang.none)

    let fields = [] // for embed!
    
    const zones = Bot.zones.get(msg.guild.id)
    const table = Bot.sortTimeZones(zones)

    if (table.length > 30) return Bot.reply(msg, this.lang.full)
    // only print zone info if there's less than 30 users
    
    for (var i = 0; i < table.length; i++) {
      let field = { 
        name: `${table[i].time} - ${table[i].name}`, 
        value: '', inline: true 
      }
      for (var id in table[i].users) {
        field.value += `<@${table[i].users[id]}>\n`
      }
      fields.push(field)
    }

    Bot.reply(msg, {
      name: this.lang.name,
      desc: this.lang.line,
      fields: fields
    })
  },

  test: async function(Bot, msg, data) {
    Bot.reply(msg, {
      name: "Testing {pre}zones",
      desc: "`{pre}zones` - List",
      color: 16549991
    })

    await this.fire(Bot, msg, [])
    
    return Bot.reply(msg, "{pre}zones test complete.")
  }

}