// command.js
// for finding and executing commands

module.exports = Bot => {

  Bot.hold = {}

  Bot.findCommand = name => {
    return Bot.commands[name] || Bot.commands[Bot.aliases[name]]
  }

  Bot.tryCommand = async (Bot, evt) => {
    if (!Bot.booted || !evt.member || evt.author.bot) return

    evt.config = Bot.$getConfs(evt)
    evt.access = Bot.verifyAccess(evt)
    evt.silent = true

    const mentioned  = `<@${Bot.user.id}>`
    const isPrefixed = evt.content.indexOf(evt.config.prefix) === 0
    const hasMention = evt.content.indexOf(mentioned) === 0

    if (!isPrefixed && !hasMention) return
    const trim = isPrefixed ? evt.config.prefix.length : mentioned.length

    const chained = evt.content.split(' && ')
    if (chained.length > 3) return Bot.reply(evt,  Bot.EN.bad.chain)
    evt.chained = chained.length > 1

    for (let link of chained) {
      evt.options = link.slice(trim).trim().split(/ +/g)

      const trigger = evt.options.shift().toLowerCase()
      const command = Bot.findCommand(trigger || 'help')

      if (command) {
        evt.log = `${command.name} ${evt.options.join(' ')}`

        if (evt.access.level >= command.level) {
          if (Bot.hold[evt.guild.id]) {
            return Bot.reply(evt, Bot.EN.cant.fire)
          }

          await command.fire(Bot, evt)
          Bot.log(evt)
        }

        else if (evt.config.warnings) {
          const hasLvl = evt.access.name
          const reqLvl = Bot.accessLevels[command.level].name
          Bot.reply(evt, Bot.EN.bad.lvl, hasLvl, reqLvl)
        }
      }

      else {
        let note = Bot.$getNotes(evt, trigger)
        if (note)  Bot.reply(evt, note)
      }
    }
  }

}