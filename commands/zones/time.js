module.exports = {
  
  name: 'time',
  level: 1,

  help: {
    name: "{pre}time (time/username)",
    desc: "Gets current time in all tracked timezones.\n" +
          "Can pass a `time` to see what time it would be.\n" +
          "Can pass `username` to see what time it is for them.\n" +
          "(only works if they've set it - don't @ them in case it's late!)"
  },

  lang: {
    user: "<@{val1}> hasn't set a timezone yet."
  },

  fire: async function (Bot, evt) {
    let zone = Bot.$getZones(evt, evt.author.id)
    if (!zone) return Bot.reply(evt, Bot.EN.zone.none)

    const opts = evt.options.join(' ')
    const when = Bot.findTime(opts, zone)
    const user = Bot.verifyUser(evt, opts)

    let name = when ? `Time @ ${opts}` : 'Current Time'
    let desc = []

    if (user) {
      zone = Bot.$getZones(evt, user.id)
      if (!zone) return Bot.reply(evt, this.lang.user, user.id)

      let time = Bot.getTime(zone)
      desc.push(`**${time.time}** for <@${user.id}> in ${time.name}`)
    }

    else if (when) {
      const zones = Bot.$getZones(evt)
      const table = Bot.sortZones(zones, when)

      for (let time in table) {
        let count = time.users.length
        let ping = time.name == zone.split('/')[1] ? `<@${evt.author.id}>` : ''
        desc.push(`**${time.time}** - ${time.name} (${count}) ${ping}`)
      }
    }

    Bot.reply(evt, { name, desc })
    return Bot.deleteTrigger(evt)
  },

  test: async function (Bot, evt, data) {
    evt.options = ['9pm']
    await this.fire(Bot, evt)

    evt.options = ['pixel']
    await this.fire(Bot, evt)
  }

}