module.exports = {

  name: 'roles',
  
  level: 3,

  help: {
    name: "{pre}roles",
    desc: "Returns server roles + ids."
  },

  fire: function(Bot, msg, opts, lvl) {
    const roles  = msg.guild.roles.array()
    let response = { name: `${msg.guild.name} Roles`, desc: [] } 

    for (var i = 0; i < roles.length; i++) {
      response.desc.push("`" + roles[i].id + "` - " + roles[i].name)
    }
    return Bot.reply(msg, response)
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