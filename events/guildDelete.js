// guildDelete.js - Handles bot being removed from guild

module.exports = (Chandler, guild) => {

  let name = `Removed from ${guild.name}`
  let count = Chandler.guilds.cache.keyArray().length
  let description = `Now In ${count} servers.`
  
  return Chandler.post(description, name)

}