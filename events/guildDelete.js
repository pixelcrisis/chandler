module.exports = (Bot, guild) => {

  let response = { guild }
  let lastLogs = Bot.$getConfs(response, 'logged') || []
  let guildLog = 'Last Logs: \n `' + lastLogs.join('`\n`') + '`'

  response.log = {
    color: 16736084,
    icon: guild.iconURL,
    name: `Removed from ${guild.name}`,
    foot: 'Now in {guilds} servers.',
    desc: lastLogs.length ? guildLog : ''
  }

  Bot.log(response)

}