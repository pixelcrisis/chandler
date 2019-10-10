module.exports = {
  // an empty command file with docs.
  // call it a template.

  name: 'template',
  // this is the trigger for the command
  
  level: 1,
  // this is the permission level required
  // perms are defined in plugins/utils.js
  // 1: User, 3: Mod, 5: Admin, 7: Owner, 9: Me (or you)
  alias: [],
  // these are other triggers that can fire this command

  lang: {},
  // strings that the command output goes here

  help: {
    name: "{pre}template [required] (optional)",
    desc: "This is just an empty command.\n" +
          "It isn't supposed to do anything."
  },
  // help name and desc for quick use with >help command

  fire: function(Bot, msg, opts, lvl) {
    // actual bot function would go here
  },

  test: async function(Bot, msg, data) {
    Bot.reply(msg, {
      name: "Testing {pre}template",
      desc: "`{pre}template` - response\n" +
            "`{pre}template arg` - response",
      color: 16549991
    })

    // tests for the command go here
    
    return Bot.reply(msg, "{pre}template test complete.")
  }

}