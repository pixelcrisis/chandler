// guildMemeberRemove Event
// Used with onleave

module.exports = async (Bot, member) => {

  const onleave = Bot.$getConf(member, 'onleave')

  if (onleave && onleave.channel) {
    const channel = member.guild.channels.get(onleave.channel)
    Bot.reply({ guild: member.guild, member, channel }, onleave.message)
  }

}