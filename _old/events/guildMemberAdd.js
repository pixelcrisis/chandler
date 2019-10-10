// guildMemeberAdd Event
// Used with onjoin

module.exports = async (Bot, member) => {

  const onjoin = Bot.$getConf(member, 'onjoin')

  if (onjoin && onjoin.channel) {
    const parse = {
      guild: member.guild,
      author: member.user,
      channel: member.guild.channels.get(onjoin.channel)
    }
    Bot.reply(parse, onjoin.message)
  }

}