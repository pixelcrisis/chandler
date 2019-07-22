// Chandler DBL plugin
// For use with DBL, obviously

const DBL = require('dblapi.js')

module.exports = (Bot) => {

  if (Bot.conf.dbl.use && Bot.conf.serverMode) {
    const options = { webhookPort: 5000, webhookAuth: Bot.conf.dbl.auth }
    Bot.dbl = new DBL(Bot.conf.dbl.token, options, Bot)

    Bot.dbl.on('posted', () => Bot.log('DBL count posted.'))
    Bot.dbl.on('error', (e) => Bot.log(`DBL error: ${e}`))

    Bot.dbl.webhook.on('ready', (e) => console.log(`Webhook running.`));
    Bot.dbl.webhook.on('vote', (e) => console.log(`${e.user} voted.`));
    Bot.dbl.webhook.on('test', (e) => console.log(`Test: ${e}.`));
  }

  Bot.hasVoted = (user) => {
    if (!Bot.dbl) return true
    const now = Date.now()
    const weekAgo = now - 604800000
    const lastVote = Bot.getVote(user)

    if (lastVote > weekAgo) return true
    const voted = Bot.dbl.hasVoted(user)
    if (voted) Bot.setVote(user, now)
    return voted
  }

}