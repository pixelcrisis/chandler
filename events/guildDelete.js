// Delete Guild Event

module.exports = async (Bot, guild, test) => {

  const cmds = Bot.$getConf({ guild }, 'logged')
  const desc = cmds.length ? `Last Commands: \`${cmds.join('`, `')}\`` : ''

  const msg = {
    color: 16736084,
    icon: guild.iconURL,
    foot: "Now In {guilds} Servers.",
    name: "Removed from {guild.name} ({guilds})",
    desc
  }

  if (!test) Bot.$remConf(guild.id)
  return Bot.log(msg, { guild })

}