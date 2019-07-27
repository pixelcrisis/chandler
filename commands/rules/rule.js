module.exports = {

  name: 'rule',
  
  level: 5,

  lang: {},

  help: {
    name: "{pre}rule [option] (value)",
    desc: "*Available Options:*\n\n" +
          "`add` - add *value* as a new rule.\n" +
          "`#` - Changes Rule # `option` to *value*\n\n" +
          "`post` - print out the official rules post.\n" +
          "*the official post automatically updates with new rules!*\n\n" +
          "`title` - changes title of official rules post.\n" +
          "`color` - changes color of official rules post.\n" +
          "`image` - changes image of official rules post.\n" +
          "`intro` - adds intro to the official rules post.\n" +
          "`outro` - adds outro to the official rules post."
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