// Message Event
// Command Processing

module.exports = async (Bot, msg) => {
  if (!Bot.booted || !msg.member || msg.author.bot) return

  const config = Bot.getConf(msg.guild.id)
  const access = Bot.verifyAccess(msg, config.modsID)
  const mention = `<@${Bot.user.id}>`

  const hasPrefix = msg.content.indexOf(config.prefix) === 0
  const hasMention = msg.content.indexOf(mention) === 0
  if (!hasPrefix && !hasMention) return

  const amount = hasPrefix ? config.prefix.length : mention.length
  const options = msg.content.slice(amount).trim().split(/ +/g)
  const command = options.shift().toLowerCase()

  // return help on empty commands
  let trigger = command ? command : 'help'
  const cmd = Bot.findCommand(trigger)

  if (cmd) {
    if (access >= cmd.level) cmd.fire(Bot, msg, options, access)

    else if (config.warnings) {
      const hasLvl = Bot.nameAccess(access)
      const reqLvl = Bot.nameAccess(cmd.level)
      return Bot.reply(msg, Bot.lang.warning, reqLvl, hasLvl)
    }

    else return
  }

  // check for note
  let note = Bot.getNote(msg.guild.id, command)
  note = note ? note.split('{msg}').join(options.join( )) : false
  if (note) return msg.channel.send(note)
}