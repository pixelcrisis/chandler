// guildDelete.js - Handles bot being removed from guild

module.exports = (Chandler, guild) => {

  let name = `Removed from ${guild.name}`
  let description = `Now In ${Chandler.guild.cache.keyArray().length} servers.`
  
  return Chandler.post(description, name)

}