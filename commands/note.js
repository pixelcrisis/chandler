// note.js - managing simple text return commands

module.exports = {
  gate: 1,

  link: {
    'write': {
      access: 3,
      linked: 'note add'
    },
    'erase': {
      access: 3,
      linked: 'note delete'
    },
    'notes': {
      access: 1,
      linked: 'note list'
    }
  },

  help: {
    name: "Using Chandler's Notes (Simple Commands)",
    desc: "`~/write [key] [text]` will add a new note.\n" +
          "`~/erase [key]` will delete a note.\n" +
          "`~/notes` will list currently set notes.\n" +
          "{{ ~/write hello hello world || ~/erase hello  }}"
  },

  lang: {
    empty: "There aren't any notes yet! Set one with `~/write`",
    prior: "The command `{val1}` already exists!",
    added: "Set `~/{val1}` to `{val2}`",
    renew: "Updated `{val1}` to `{val2}`",
    exist: "Couldn't find the note: `{val1}`",
    trash: "Removed Note: `{val1}`"
  },

  fire: async function (Chandler, Msg) {
    Msg.notes = Chandler.$get('notes', Msg)
    if (Msg.args.length < 1) return Chandler.reply(Msg, this.help)

    // Set up our subcommand executor
    const cmd = Msg.args.shift().toLowerCase()
    const opt = Msg.args.join(' ')

    // we need an option for this (unless listing), error out if no
    if (!opt && cmd != 'list') return Chandler.reply(Msg, Chandler.EN.option)
    if (this[`_${cmd}`]) return this[`_${cmd}`](Chandler, Msg, opt)
  },

  _list: async function (Chandler, Msg) {
    let list = []
    // collect all of our note details in an array
    for (let title in Msg.notes) list.push(`**${title}**: ${Msg.notes[title]}`)
    // attach the info to our response
    let response = { name: `${Msg.guild.name} Notes`, desc: list.join('\n') }
    // if the list is empty, tell them, otherwise print the list!
    if (!response.desc) return Chandler.reply(Msg, this.lang.empty)
    else return Chandler.reply(Msg, response)
  },

  _add: async function (Chandler, Msg, opt) {
    if (Msg.access.level < 3) return

    let message = opt.split(' ')
    let trigger = message.shift().toLowerCase()

    message = message.join(' ')

    // cancel if we don't have anything to set it to
    if (!message) return Chandler.reply(Msg, Chandler.EN.option)

    // make sure that a regular command doesn't supercede
    const exists = Chandler.commandExists(trigger)
    if (exists) return Chandler.reply(Msg, this.lang.prior, trigger)

    // get current note (if any) for update message
    let current = Chandler.$get('notes', Msg, trigger)
    let oldMsg = current ? `${trigger}/${Chandler.escape(current)}` : current

    // set the new note and return the confirmation
    let newMsg = Chandler.escape(message)
    Chandler.$set('notes', Msg, trigger, message)

    if (oldMsg) return Chandler.reply(Msg, this.lang.renew, oldMsg, newMsg)
    else return Chandler.reply(Msg, this.lang.added, trigger, newMsg)
  },

  _delete: async function (Chandler, Msg, opt) {
    if (Msg.access.level < 3) return

    const note = opt.toLowerCase()
    const curr = Chandler.$get('notes', Msg, note)

    if (!curr) return Chandler.reply(Msg, this.lang.exist, note)

    Chandler.$rem('notes', Msg, note)
    return Chandler.reply(Msg, this.lang.trash, note)
  },

  test: async function (Chandler, Msg, data) {
    Msg.args = ['add', 'tester', 'the', 'test', 'was', 'successful']
    await this.fire(Chandler, Msg)

    Msg.args = ['list']
    await this.fire(Chandler, Msg)

    Msg.args = ['add', 'tester', 'the', 'edit', 'was', 'successful']
    await this.fire(Chandler, Msg)

    Msg.args = ['list']
    await this.fire(Chandler, Msg)

    Msg.args = ['delete', 'tester']
    await this.fire(Chandler, Msg)

    Msg.args = ['list']
    await this.fire(Chandler, Msg)
  }
}