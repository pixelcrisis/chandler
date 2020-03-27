// time.js - for tracking user time
// heavily uses the plugins/timezone.js options

module.exports = {
  gate: 1,

  link: {
    'time': {
      access: 1,
      linked: 'zones get'
    },
    'zone': {
      access: 1,
      linked: 'zones set'
    },
    'setzone': {
      access: 3,
      linked: 'zones add'
    }
  },

  help: {
    name: "Using Chandler to Track Timezones",
    desc: "`~/time` will display the current tracked time.\n" +
          "`~/zone` will set your timezone to `timezone`.\n" +
          "{{ ~/time || ~/time 9pm || ~/time user }}" +
          "{{ ~/zone New York }}",
    mods: "Mods: You can use `~/setzone` to set a timezone for a user.\n" +
          "{{ ~/setzone @user New York }}"
  },

  lang: {
    none: "You haven't set a timezone yet! `~/zone`",
    done: "Set your timezone to `{val1}`",
    user: "<@{val1}> hasn't set a timezone yet.",
    zone: "Set **{val1}** to the timezone `{val2}`",
    info: "\nTry *~/time 9pm* or *~/time user*",
    curr: "Current Time in {guild.name}",
    when: "Time @ {val1} for {guild.name}"
  },

  fire: async function (Chandler, Msg) {
    Msg.notes = Chandler.$get('notes', Msg)
    if (Msg.args.length < 1) return Chandler.reply(Msg, this.help)

    // Set up our subcommand executor
    const cmd = Msg.args.shift().toLowerCase()
    const opt = Msg.args.join(' ')

    // we need an option for this (unless listing), error out if no
    if (!opt && cmd != 'get') return Chandler.reply(Msg, Chandler.EN.option)
    if (this[`_${cmd}`]) return this[`_${cmd}`](Chandler, Msg, opt)
  },

  _get: async function (Chandler, Msg, opt) {
    // first, make sure the calling user is set
    let zone = Chandler.$get('zones', Msg, Msg.author.id)
    if (!zone) return Chandler.reply(Msg, this.lang.none)

    // check and see if the opt is a user or a time
    const user = Chandler.verifyUser(Msg, opt)
    const when = Chandler.getTimeFromString(opt, zone)

    let results = []
    let title = when ? this.lang.when : this.lang.curr 

    if (user) {
      // jk, we're getting someone else's
      zone = Chandler.$get('zones', Msg, user.id)
      if (!zone) return Chandler.reply(Msg, this.lang.user, user.id)

      let time = Chandler.getTimeInZone(zone)
      results.push(`**${time.time}** for <@${user.id}> in ${time.name}`)
    }

    else {
      // if no user, just get the time table
      const zones = Chandler.$get('zones', Msg)
      const table = Chandler.getTimeZoneTable(zones, when)

      // add the table to the results
      for (let time of table) {
        results.push(`**${time.time}** - ${time.name} (${time.users.length})`)
      }
    }

    // remind people they can check for times and users
    results.push(this.lang.info)

    // compile our results with the title, and send it out!
    Chandler.reply(Msg, { name: title, desc: results.join('\n') }, opt)
    return Chandler.deleteTrigger(Msg)
  },

  _set: async function (Chandler, Msg, opt) {
    const zone = Chandler.getTimeZone(opt)
    if (!zone) return Chandler.reply(Msg, Chandler.EN.verify, opt)

    Chandler.$set('zones', Msg, Msg.author.id, zone.name)
    return Chandler.reply(Msg, this.lang.done, opt)
  },

  _add: async function (Chandler, Msg, opt) {
    // only for mods!
    if (Msg.access.level < 3) return
    // split the username from the time zone
    let zone = opt.split(' ')
    let user = zone.shift()

    // make sure our user is valid
    user = Chandler.verifyUser(Msg, user)
    if (!user) return Chandler.reply(Msg, Chandler.EN.verify, user)

    // make sure the timezone is valid
    zone = Chandler.getTimeZone(zone.join('_'))
    if (!zone) return Chandler.reply(Msg, Chandler.EN.verify, zone)

    // if both are valid, set the zone for user
    Chandler.$set('zones', Msg, user.user.id, zone.name)
    return Chandler.reply(Msg, this.lang.zone, user.user.username, zone.name)
  },

  test: async function (Chandler, Msg, data) {
    Msg.args = ['get']
    await this.fire(Chandler, Msg)

    Msg.args = ['get', '9pm']
    await this.fire(Chandler, Msg)

    Msg.args = ['get', 'whydalton']
    await this.fire(Chandler, Msg)

    Msg.args = ['set', 'chicago']
    await this.fire(Chandler, Msg)

    Msg.args = ['add', 'whydalton', 'denver']
    await this.fire(Chandler, Msg)
  }
}