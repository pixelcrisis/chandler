// roles.js - for listing the server roles/ids

module.exports = {
  gate: 3,

  help: {
    name: "~/roles",
    desc: "Lists the roles in the server, with their IDs."
  },

  fire: async function (Chandler, Msg) {
    // fetch the roles, define the response
    const roles = Msg.guild.roles.cache.array()
    let response = { name: '{guild.name} Roles', desc: '' }

    // add roles to the response
    for (const role of roles) {
      response.desc += `\`${role.id}\` = ${role.name}\n`
    }

    return Chandler.reply(Msg, response)
  },

  test: async function (Chandler, Msg, data) {
    await this.fire(Chandler, Msg)
  }
}