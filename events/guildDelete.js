// Delete Guild Event

module.exports = async (Bot, guild, test) => {

  const msg = {
    color: 16736084,
    icon: guild.iconURL,
    name: "Removed from {guild.name} ({guilds})"
  }

  if (!test) Bot.$remConf(guild.id)
  return Bot.log(msg, { guild })

}