// conf.js - for changing bot settings

module.exports = {
  gate: 5,
  also: ['status', 'set', 'config'],

  help: {
    name: "~/set (option) (value)",
    desc: "Options: `prefix`, `mods`, `warnings`\n\n" +
          "`prefix` changes the trigger for the bot.\n" +
          "`mods` assigns a role as bot moderators.\n" +
          "`warnings` toggles the command access warning.\n" +
          "{{ ~/set prefix ? || ~/set mods @Role || ~/set warnings off }}"
  },

  lang: {
    modsID: "Set modsID to <@&{val1}>.",
    prefix: "Set prefix to `{val1}`.\nFYI: You can always {bot} as a prefix!",
    warned: "Toggled command warnings {val1}",
    reset:  "Successfully reset configs."
  },

  fire: async function (Chandler, Msg) {
    // If no args, return the current status
    if (!Msg.args.length) return this._conf(Chandler, Msg)

    // Set up our subcommand executor
    const cmd = Msg.args.shift().toLowerCase()
    const opt = Msg.args.join(' ')

    // we need an option for this, error out if no
    if (!opt && cmd != 'reset') return Chandler.reply(Msg, Chandler.EN.option)
    if (this[`_${cmd}`]) return this[`_${cmd}`](Chandler, Msg, opt)
  },

  _prefix: function (Chandler, Msg, opt) {
    // save the prefix to db, verify with message
    Chandler.$set('confs', Msg, 'prefix', opt)
    return Chandler.reply(Msg, this.lang.prefix, opt)
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

  _reset: function (Chandler, Msg) {
    Chandler.reply(Msg, this.lang.reset)
    Chandler.$default('confs', Msg)
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