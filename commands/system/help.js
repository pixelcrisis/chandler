module.exports = {

  name: 'help',
  
  level: 1,
  alias: [ 'what', 'invite' ],

  response: {
    name: "Chandler Help",
    desc: "View the {website} for Docs, or join the {support}!\n" +
          "You can use this {invite} to bring Chandler to your server!"
  },

  help: {
    name: "{pre}help (command)",
    desc: "Without a `command`, returns a link to the website and support server. " +
          "Otherwise, returns the help documentation for `command`"
  },

  fire: function(Bot, msg, opts) {
    if (!opts.length) {
      // if no command specified,
      // print the general response
      return Bot.reply(msg, this.response)
    }
    // otherwise get the help message for a command
    else if (opts.length == 1) {
      let cmd = Bot.findCommand(opts[0])
      if (cmd) return Bot.reply(msg, cmd.help)
    }
  }

}