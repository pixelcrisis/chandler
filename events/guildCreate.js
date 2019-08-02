// New Guild Event

module.exports = async (Bot, guild, test) => {

  const msg = {
    color: 48268,
    icon: guild.iconURL,
    name: "Added to {guild.name} ({guilds})",
    desc: "Server Owner: **{guild.owner}** - " +
          "Total Users: **{guild.count}**"
  }
  return Bot.log(msg, { guild })

}