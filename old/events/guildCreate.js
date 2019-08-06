// New Guild Event

module.exports = async (Bot, guild, test) => {

  const msg = {
    color: 48268,
    icon: guild.iconURL,
    foot: "Now In {guilds} Servers.",
    name: "Added to {guild.name}",
    desc: "Server Owner: **{guild.owner}** - " +
          "Total Users: **{guild.count}**"
  }
  console.info('Added to ' + guild.name)
  return Bot.log(msg, { guild })

}