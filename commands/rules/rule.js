module.exports = {

  name: 'rule',
  
  level: 5,

  lang: {},

  help: {
    name: "{pre}rule [required] (optional)",
    desc: "This is just an empty command.\n" +
          "It isn't supposed to do anything."
  },

  fire: function(Bot, msg, opts, lvl) {
    
  },

  test: async function(Bot, msg, data) {
    Bot.reply(msg, {
      name: "Testing {pre}rule",
      desc: "`{pre}rule` - response\n" +
            "`{pre}rule arg` - response",
      color: 16549991
    })

    // tests for the command go here
    
    return Bot.reply(msg, "{pre}rule test complete.")
  }

}