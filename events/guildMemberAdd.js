// guildMemeberAdd Event
// Used with onjoin

module.exports = async (Bot, member) => {

  const data = Bot.getConfig(member.guild.id, 'onjoin')
  if (data && data.channel) {
    const channel = member.guild.channels.get(data.channel)
    const message = Bot.reply({ member, channel }, data.message)
  }


}