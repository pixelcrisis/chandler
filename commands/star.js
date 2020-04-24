// star.js - for the starboard

module.exports = {
  gate: 9,
  also: ['starboard'],

  help: {
    name: "~/star (option) (value)",
    desc: "Options: `create`, `limit`, `emoji`, `destroy`\n\n" +
          "`create` creates and enables the starboard.\n" +
          "`limit` is the reactions needed to be posted.\n" +
          "`emoji` is the emoji you want to use.\n" +
          "`destroy` deletes and disables the starboard.\n" +
          "{{ ~/star create || ~/star limit 5\n" + 
          "~/star emoji :star: }}"
  },

  lang: {
    on: "The starboard is already on?"
  },

  fire: async function (Chandler, Msg) {
    // If no args, return the help message
    if (!Msg.args.length) return Chandler.reply(Msg, this.help)

    // Set up our subcommand executor
    const cmd = Msg.args.shift().toLowerCase()
    const opt = Msg.args.join(' ')

    // we need an option for this, error out if no
    if (!opt) return Chandler.reply(Msg, Chandler.EN.option)
    if (this[`_${cmd}`]) return this[`_${cmd}`](Chandler, Msg, opt)
  },

  _create: function (Chandler, Msg, opt) {
    if (Msg.config.star) return Chandler.reply(Msg, this.lang.on)


  },

  _mods: function (Chandler, Msg, opt) {
    // make sure the option is a valid role
    const role = Chandler.verifyRole(Msg, opt)
    if (!role) return Chandler.reply(Msg, Chandler.EN.verify, opt)
    // save the role to db, verify with message
    Chandler.$set('confs', Msg, 'modsID', role.id)
    return Chandler.reply(Msg, this.lang.modsID, role.id)
  },

  _warnings: function (Chandler, Msg, opt) {
    let on = Chandler.isYes(opt)
    Chandler.$set('confs', Msg, 'warnings', on)
    return Chandler.reply(Msg, this.lang.warned, on ? 'On' : 'Off')
  },

  _conf: function (Chandler, Msg) {
    let response = { name: `${Msg.guild.name} Config`, desc: '' }    

    // have we set mods or no?
    const mods = Msg.config.modsID ? `<@&${Msg.config.modsID}>` : 'Unset'
    // convert boolean to text
    const warn = Chandler.onOff(Msg.config.warnings)

    response.desc += `**Prefix**: ~/\n`
    response.desc += `**Mods**: ${mods}\n`
    response.desc += `**Warnings**: ${warn}\n`
    response.desc += '\nUse `~/help set` for more details.'

    return Chandler.reply(Msg, response)
  },

  test: async function (Chandler, Msg, data) {
    Msg.args = ['prefix', '?']
    await this.fire(Chandler, Msg)

    Msg.args = ['mods', data.role]
    await this.fire(Chandler, Msg)

    Msg.args = []
    await this.fire(Chandler, Msg)
  }
}