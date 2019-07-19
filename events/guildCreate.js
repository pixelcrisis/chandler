// New Guild Event

module.exports = async (Bot, guild) => {

  let guilds = Bot.guilds.keyArray()
  Bot.log(`Added to **${guild.name}** - Now In ${guilds.length} Servers.`)

}