// Delete Guild Event

module.exports = async (Bot, guild) => {

  let guilds = Bot.guilds.keyArray()
  Bot.log(`Removed from **${guild.name}** - Now In ${guilds.length} Servers.`)
  if (Bot.confs.has(guild.id)) Bot.confs.delete(guild.id)

}