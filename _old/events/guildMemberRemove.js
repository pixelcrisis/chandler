// guildMemeberRemove Event
// Used with onleave

module.exports = async (Bot, member) => {

  const onleave = Bot.$getConf(member, 'onleave')

  if (onleave && onleave.channel) {
    const parse = {
      guild: member.guild,
      author: member.user,
      channel: member.guild.channels.get(onleave.channel)
    }
    Bot.reply(parse, onleave.message)
  }

}