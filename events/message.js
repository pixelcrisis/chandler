// Message Event
// Command Processing

module.exports = async (Bot, msg) => {
  if (!Bot.booted || !msg.member || msg.author.bot) return

  const prefix = Bot.getConfig(msg.guild.id, 'prefix')
  const modsID = Bot.getConfig(msg.guild.id, 'modsID')
  const mention = `<@${Bot.user.id}>`

  const hasPrefix = msg.content.indexOf(prefix) === 0
  const hasMention = msg.content.indexOf(mention) === 0
  if (!hasPrefix && !hasMention) return

  const amount = hasPrefix ? prefix.length : mention.length
  const options = msg.content.slice(amount).trim().split(/ +/g)
  const command = options.shift().toLowerCase()

  // todo tests

  const cmd = Bot.findCommand(command)
  if (!cmd) return

  if (Bot.getAccess(msg, modsID) >= cmd.level) {
    cmd.fire(Bot, msg, options)
  }

}