// Chandler DBL plugin
// For use with DBL, obviously

const DBL = require('dblapi.js')

module.exports = (Bot) => {

  if (Bot.conf.dbl.use && Bot.conf.serverMode) {
    Bot.dbl = new DBL(Bot.conf.dbl.token, Bot)

    Bot.dbl.on('posted', () => Bot.log('DBL count posted!'))
    Bot.dbl.on('error', (e) => Bot.log(`DBL error: ${e}`))
  }

}