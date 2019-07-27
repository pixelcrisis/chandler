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
    Bot.dbl.webhook.on('vote', (e) => Bot.votes.set(e.user, Date.now()));
  }

  Bot.hasVoted = (user) => {
    if (!Bot.dbl) return true
    const now = Date.now()
    const lastVote = Bot.votes.ensure(user, 0)
    const threeDaysAgo = now - 259200000

    if (lastVote > threeDaysAgo) return true
    const voted = Bot.dbl.hasVoted(user)
    if (voted) Bot.votes.set(user, now)
    return voted
  }

  Bot.gotLove = (user, detail) => {
    let voted = Bot.hasVoted(user)
    let loved = voted ? `ily ♡ <@${user}>` : Bot.lang.gotLove
    detail = detail ? ` · ${detail}` : ''
    return `\n${loved}${detail}`
  }

}