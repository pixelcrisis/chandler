// Errot Event
// We should log these

module.exports = async (Bot, error) => {

  Bot.log(`DISCORD.JS ERROR D:\n\n${JSON.stringify(error)}`)

}