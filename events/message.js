// Message Event
// Command Processing

module.exports = async (Bot, msg) => {
  if (!Bot.booted || !msg.member || msg.author.bot) return

  const prefix = Bot.getConf(msg.guild.id, 'prefix')
  const modsID = Bot.getConf(msg.guild.id, 'modsID')
  const access = Bot.verifyAccess(msg, modsID)
  const mention = `<@${Bot.user.id}>`

  const hasPrefix = msg.content.indexOf(prefix) === 0
  const hasMention = msg.content.indexOf(mention) === 0
  if (!hasPrefix && !hasMention) return

  const amount = hasPrefix ? prefix.length : mention.length
  const options = msg.content.slice(amount).trim().split(/ +/g)
  const command = options.shift().toLowerCase()

  // return help on empty commands
  let trigger = command ? command : 'help'
  const cmd = Bot.findCommand(trigger)
  if (cmd) {
    // if has access, fire, else return
    return access >= cmd.level ? cmd.fire(Bot, msg, options, access) : false
  }

  // check for note
  let note = Bot.getNote(msg.guild.id, command)
  note = note ? note.split('{msg}').join(options.join( )) : false
  if (note) return msg.channel.send(note)
}