// Delete Guild Event

module.exports = async (Bot, guild, test) => {

  const cmds = Bot.$getConf({ guild }, 'logged')

  const msg = {
    color: 16736084,
    icon: guild.iconURL,
    foot: "Now In {guilds} Servers.",
    name: "Removed from {guild.name} ({guilds})",
    desc: cmds && cmds.length ? `Last Ran: \`${cmds.join('`, `')}\`` : ''
  }

  if (!test) Bot.$remConf(guild.id)
  console.info('Removed from ' + guild.name)
  return Bot.log(msg, { guild })

}