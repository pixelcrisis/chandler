// Message Event
// Command Processing

module.exports = async (Bot, msg) => {
  if (!Bot.booted || !msg.member || msg.author.bot) return

  const config  = Bot.$getConf(msg.guild.id)
  const access  = Bot.verifyAccess(msg, config.modsID)
  const mention = `<@${Bot.user.id}>`

  const hasPrefix  = msg.content.indexOf(config.prefix) === 0
  const hasMention = msg.content.indexOf(mention) === 0

  if (!hasPrefix && !hasMention) return
  const trim  = hasPrefix ? config.prefix.length : mention.length

  const chained = msg.content.split(' && ')
  if (chained.length > 3) return Bot.reply(msg, Bot.lang.badChain)
  Bot.chaining = chained.length > 1

  for (var i = 0; i < chained.length; i++) {
    const options = chained[i].slice(trim).trim().split(/ +/g)
    const command = options.shift().toLowerCase()

    // return help on empty commands
    let trigger = command ? command : 'help'
    const cmd = Bot.findCommand(trigger)

    if (!cmd) {
      // check for a note
      const note = Bot.$getNote(msg, command)
      if (note) {
        const message = note.split('{msg}').join(options.join(' '))
        return msg.channel.send(note)
      }
    }

    else {
      if (access >= cmd.level) await cmd.fire(Bot, msg, options, access)

      else if (config.warnings) {
        const hasLvl = Bot.nameAccess(access)
        const reqLvl = Bot.nameAccess(cmd.level)
        return Bot.reply(msg, Bot.lang.noAccess, reqLvl, hasLvl)
      }

      else return
    }
  }

  Bot.chaining = false
}