// command.js - for handling commands

module.exports = Chandler => {

  Chandler.findCommand = name => {
    name = name.toLowerCase()
    return Chandler.commands[name] || Chandler.commands[Chandler.aka[name]]
  }

  // Check commands, aliases, and links
  Chandler.commandExists = name => {
    name = name.toLowerCase()
    let command = Chandler.findCommand(name)
    if (!command) command = Chandler.linked[name]
    return command ? true : false
  }

  // Command Processor 
  Chandler.tryCommand = async (Chandler, Msg) => {
    // Don't f we aren't booted, not in a guild, or it's a bot
    if (!Chandler.booted || !Msg.member || Msg.author.bot) return false

    // attach config and access to event
    // this allows the command to access this data
    Msg.config = Chandler.$get('confs', Msg)
    Msg.access = Chandler.verifyAccess(Msg)

    // check to see if the bot is prefixed
    const mention = `<@${Chandler.user.id}>`
    const isPrefixed = Msg.content.indexOf(Msg.config.prefix) === 0
    const hasMention = Msg.content.indexOf(mention) === 0
    // if the message doesn't tag the bot, ignore it
    if (!isPrefixed && !hasMention) return false

    // figure out how much to trim off for the prefix
    const trim = isPrefixed ? Msg.config.prefix.length : mention.length

    // trim and split the string, bind variables to event
    Msg.args = Msg.content.slice(trim).trim().split(/ +/g)

    // the first argument is the command (hopefully)
    // if there is no trigger at all, send the help command
    let trigger = Msg.args.shift().toLowerCase()
    let command = Chandler.findCommand(trigger || 'help')

    if (!command) {
      // check and see if it's a linked command
      // linked commands are shorthand to subcommands
      // so we need to replace the command and add arguments
      if (Chandler.linked[trigger]) {
        let linked = Chandler.linked[trigger].linked.split(' ')
        trigger = linked.shift().toLowerCase()
        Msg.args = [ ...linked, ...Msg.args ]
        command = Chandler.findCommand(trigger)
      }
    }

    if (!command) {
      // if STILL no command, check for a note
      let note = Chandler.$get('notes', Msg, trigger)
      if (note) {
        Chandler.reply(Msg, note)
        Chandler.log(`${Msg.guild.name} > Note: ${trigger}`)
      }
    }

    else {
      // otherwise fire the command we found!
      // but only if we have permission to
      if (Msg.access.level >= command.gate){
        // Log the command before executing
        Chandler.log(`${Msg.guild.name} > ${trigger} ${Msg.args.join(' ')}`)
        await command.fire(Chandler, Msg)
      }

      // If no access, send toggleable warning
      else if (Msg.config.warnings) {
        return Chandler.reply(Msg, Chandler.EN.access)
      }
    }
  }

  // some commands work best if we delete the trigger as well
  Chandler.deleteTrigger = Msg => {
    if (Chandler.canManageMessages(Msg) && !Msg.test) return Msg.delete()
    else return false
  }

}
