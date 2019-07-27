// Message Event
// Command Processing

module.exports = async (Bot, msg) => {
  if (!Bot.booted || !msg.member || msg.author.bot) return

  const prefix  = Bot.confs.ensure(msg.guild.id, '~/', 'prefix')
  const warning = Bot.confs.ensure(msg.guild.id, true, 'warnings')
  const modsID  = Bot.confs.get(msg.guild.id, 'modsID')

  const access  = Bot.verifyAccess(msg, modsID)
  const mention = `<@${Bot.user.id}>`

  const hasPrefix  = msg.content.indexOf(prefix) === 0
  const hasMention = msg.content.indexOf(mention) === 0

  if (!hasPrefix && !hasMention) return

  const amount  = hasPrefix ? prefix.length : mention.length
  const options = msg.content.slice(amount).trim().split(/ +/g)
  const command = options.shift().toLowerCase()

  // return help on empty commands
  let trigger = command ? command : 'help'
  const cmd = Bot.findCommand(trigger)

  if (cmd) {
    if (access >= cmd.level) cmd.fire(Bot, msg, options, access)

    else if (warning) {
      const hasLvl = Bot.nameAccess(access)
      const reqLvl = Bot.nameAccess(cmd.level)
      return Bot.reply(msg, Bot.lang.noAccess, reqLvl, hasLvl)
    }

    else return
  }

  // check for note
  const notes = Bot.notes.ensure(msg.guild.id, {})
  if (notes[command]) {
    const note = notes[command].split('{msg}').join(options.join(' '))
    return msg.channel.send(note)
  }
}