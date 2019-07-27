// guildMemeberAdd Event
// Used with onjoin

module.exports = async (Bot, member) => {

  const onjoin = Bot.confs.get(member.guild.id, 'onjoin')

  if (onjoin && onjoin.channel) {
    const channel = member.guild.channels.get(onjoin.channel)
    Bot.reply({ guild: member.guild, member, channel }, onjoin.message)
  }

}