// botlist.js - interacting with discordbotlist

const DBL = require('dblapi.js')

module.exports = Chandler => {

  if (Chandler.Conf.dbl.use) {
    // Define DBL Api with webhook (to listen for votes)
    Chandler.Dbl = new DBL(Chandler.Conf.dbl.token, {
      webhookPort: 5000, webhookAuth: Chandler.Conf.dbl.auth
    }, Chandler)

    Chandler.Dbl.on('posted', () => Chandler.log('DBL Count Posted'))
    Chandler.Dbl.on('error', err => Chandler.post(err, 'DBL Error'))
    Chandler.Dbl.webhook.on('ready', () => Chandler.log('DBL Running'))
  }

}
