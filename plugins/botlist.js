// botlist.js
// for interacting with discordbotlist api

const DBL = require('dblapi.js')

module.exports = Bot => {

  if (Bot.conf.dbl.use) {
    const options = { webhookPort: 5000, webhookAuth: Bot.conf.db.auth }
    Bot.dbl = new DBL(Bot.conf.dbl.token, options, Bot)

    Bot.dbl.on('posted', () => Bot.log('DBL Bot Count Posted.'))
    Bot.dbl.on('error', err => Bot.log(`DBL Error: ${err}`))

    Bot.dbl.webhook.on('ready', e => Bot.log('DBL Webhook Running.'))
    Bot.dbl.webhook.on('vote',  e => Bot.$setVote(e.user, Date.now()))
  }

  Bot.hasVoted = user => {
    if (!user) return false
    if (!Bot.dbl) return true

    const now          = Date.now()
    const lastVote     = Bot.$getVote(user)
    const threeDaysAgo = now - 259200000

    if (lastVote > threeDaysAgo) return true
      
    const voted = Bot.dbl.hasVoted(user)
    if (voted) Bot.$setVote(user, now)
    return voted
  }

  Bot.hasLove = user => {
    let voted = Bot.hasVoted(user)
    return voted ? `ily <@${user}> <3` : `[Vote! <3](${Bot.URL.vote})`
  }

}