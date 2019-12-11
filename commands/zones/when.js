module.exports = {
  
  name: 'when',
  level: 1,

  help: {
    name: "{pre}when",
    desc: "Returns the countdown timer, if any."
  },

  setup: {
    name: "{pre}when (time) (month) (day)",
    desc: "Returns or sets sets a countdown timer. " +
          "For same day countdowns, month and day are optional.\n" +
          "Example: `{pre}when 12am Dec 25` or `{pre}when 8:30pm`" 
  },

  lang: {
    now: "It should be happening? Don't ask me.",
    none: "I have no idea when it is.",
    update: "Set to: about {val1} from now, {val2}",
    count: "It's in about {val1} from now, {val2}",
    zone: "use `{pre}zone` to find local time."
  },

  fire: async function (Bot, evt) {
    if (evt.access.level < 3 || !evt.options.length) {
      const count = this.count(Bot, evt)
      return Bot.reply(evt, count.msg, count.when, count.time)

      if (count) return Bot.reply(evt, this.lang.count, count)
      else if (count === 0) return Bot.reply(evt, this.lang.now)
      else return Bot.reply(evt, this.lang.none)
    } else return this.update(Bot, evt)
  },

  count: function(Bot, evt) {
    let result = { msg: this.lang.none }
    let zone = Bot.$getZones(evt, evt.author.id)

    const curr = Bot.getTime('America/Chicago')
    const then = Bot.strTime(evt.config.when, 'America/Chicago')
    const diff = then.diff(curr)

    result.when = Bot.diffTime(diff)
    if (diff > 0) result.msg = this.lang.count
    else if (diff > -3600000) result.msg = this.lang.now

    if (!zone) result.time = this.lang.zone
    else {
      let time = Bot.timeStr(Bot.strTime(evt.config.when, zone)).split(' ')
      result.time = `at ${time[1]}${time[2].toLowerCase()} on ${time[0]}`
    }
    
    return result
  },

  update: function (Bot, evt) {
    let zone = Bot.$getZones(evt, evt.author.id)
    if (!zone) return Bot.reply(evt, Bot.EN.zone.none)

    const time  = evt.options[0]
    const month = evt.options[1]
    const date  = evt.options[2]

    let when = Bot.findTime(time, zone, month, date)
    if (!when) return Bot.reply(evt, Bot.EN.bad.arg, evt.options.join(' '))

    evt.config.when = Bot.timeStr(when.tz('America/Chicago'))
    Bot.$setConf(evt, 'when', evt.config.when)

    const count = this.count(Bot, evt)
    return Bot.reply(evt, this.lang.update, count)
  },

  test: async function (Bot, evt, data) {
    evt.options = ['9pm', 'Dec', '25']
    await this.fire(Bot, evt)
  }

}