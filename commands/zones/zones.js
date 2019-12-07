module.exports = {
  
  name: 'zones',
  level: 1,

  help: {
    name: "{pre}zones",
    desc: "Gets current time in all tracked timezones.\n" +
          "Includes users listed in each timezone for reference."
  },

  lang: {
    full: "Too many users in this server, try `{pre}time`"
  },

  fire: async function (Bot, evt) {
    const list = Bot.$getZones(evt)
    const user = list[evt.author.id]
    if (!user) return Bot.reply(evt, Bot.EN.zone.none)

    const table = Bot.sortZones(list)
    if (table.length > 30) return Bot.reply(evt, this.lang.full)

    let fields = []
    let name = `${evt.guild.name} Zones`
    let desc = '··································'
    console.log(table)

    for (let zone of table) {
      let field = { name: `${zone.time} - ${zone.name}`, inline: true, value: '' }
      for (let user of zone.users) field.value += `<@${user}>\n`
      fields.push(field)
    }

    Bot.reply(evt, { name, desc, fields })
    return Bot.deleteTrigger(evt)

  },

  test: async function (Bot, evt, data) {
    evt.options = []
    await this.fire(Bot, evt)
  }

}