// guildMemeberRemove Event
// Used with onleave

module.exports = async (Bot, member) => {

  const data = Bot.getConfig(member.guild.id, 'onleave')
  if (data && data.channel) {
    const channel = member.guild.channels.get(data.channel)
    const message = Bot.reply({ member, channel }, data.message)
  }


}