// Delete Guild Event

module.exports = async (Bot, guild) => {

  Bot.log(`Removed from **${guild.name}**`)
  Bot.remConfs(guild.id)

}