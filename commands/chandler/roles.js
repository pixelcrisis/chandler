module.exports = {

  name: 'roles',
  
  level: 3,

  help: {
    name: "{pre}roles",
    desc: "Returns server roles + ids."
  },

  fire: function(Bot, msg, opts, lvl) {
    let list = [], roles = msg.guild.roles.array()
    for (var i = 0; i < roles.length; i++) {
      list.push("`" + roles[i].id + "` - " + roles[i].name)
    }
    return Bot.listReply(msg, "Server Roles", list)
  },

  test: async function(Bot, msg, data) {
    Bot.reply(msg, {
      name: "Testing {pre}roles",
      desc: "`{pre}roles` - list",
      color: 16549991
    })
    
    await this.fire(Bot, msg, [])

    return Bot.reply(msg, "{pre}roles test complete.")
  }

}