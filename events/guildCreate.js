// guildCreate.js - Handles bot being added to guild

module.exports = (Chandler, guild) => {

  let name = `Added to ${guild.name}`
  let description = [
    `Total Users: ${guild.memberCount}`,
    `Server Owner: ${guild.owner.user.username}`,
    `Now In ${Chandler.guilds.cache.keyArray().length} servers.`
  ].join('\n')

  return Chandler.post(description, name)

}