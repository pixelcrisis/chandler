module.exports = (Bot, guild) => {

  let response  = { guild }
  response.conf = Bot.$getConfs(response)

  response.log = {
    color: 48268,
    icon: guild.iconURL,
    name: `Added to ${guild.name}`,
    foot: 'Now in {guilds} servers.',
    desc: 'Server Owner: **{guild.owner}** - Total Users: **{guild.count}**'
  }
  
  Bot.log(response)

}