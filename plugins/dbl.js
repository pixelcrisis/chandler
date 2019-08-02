// Chandler DBL plugin
// For use with DBL, obviously

const DBL = require('dblapi.js')

module.exports = (Bot) => {

  if (Bot.conf.dbl.use && Bot.conf.serverMode) {
    const options = { webhookPort: 5000, webhookAuth: Bot.conf.dbl.auth }
    Bot.dbl = new DBL(Bot.conf.dbl.token, options, Bot)

    Bot.dbl.on('posted', () => console.log('DBL count posted.'))
    Bot.dbl.on('error', (e) => Bot.log(`DBL error: ${e}`))

    Bot.dbl.webhook.on('ready', (e) => console.log(`Webhook running.`));
    Bot.dbl.webhook.on('vote', (e) => Bot.$setVote(e.user, Date.now()));
  }

  Bot.hasVoted = (user) => {
    if (!user) return false
    if (!Bot.dbl) return true
    const now = Date.now()
    const lastVote = Bot.$getVote(user)
    const threeDaysAgo = now - 259200000

    if (lastVote > threeDaysAgo) return true
    const voted = Bot.dbl.hasVoted(user)
    if (voted) Bot.$setVote(user, now)
    return voted
  }

  Bot.gotLove = (user) => {
    let voted = Bot.hasVoted(user)
    return voted ? `ily <@${user}> <3` : Bot.lang.gotLove
  }

}