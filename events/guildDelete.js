// Delete Guild Event

module.exports = async (Bot, guild) => {

  let guilds = Bot.guilds.keyArray()
  Bot.log(`Removed from **${guild.name}** - Now In ${guilds.length} Servers.`)
  Bot.remConf(guild.id)

}