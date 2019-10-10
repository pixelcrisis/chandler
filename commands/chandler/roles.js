module.exports = {
  
  name: 'roles',
  level: 3,

  help: {
    name: "{pre}roles",
    desc: "Prints a list of server roles + their IDs."
  },

  fire: async function (Bot, evt) {
    const roles  = evt.guild.roles.array()
    let response = { name: '{guild.name} Roles', desc: [] }

    for (const r of roles) response.desc.push(`\`${r.id}\` - ${r.name}`)

    return Bot.reply(evt, response)
  },

  test: async function (Bot, evt, data) {
    await this.fire(Bot, evt)
  }

}