// ready.js - on startup

module.exports = async Chandler => {
  
  const version = Chandler.Info.version

  // I don't trust we're ready yet, tbh
  await Chandler.wait(1000)

  // change bot status
  Chandler.updateStatus = init => {
    const guilds = Chandler.guilds.cache.keyArray().length
    const status = [
      `v${version} in ${guilds} Servers`, 
      `~/help - v${version}`,
      `~/time - v${version}`
    ]
    // get a random status unless init is true
    let key = init ? 0 : Math.floor(Math.random() * status.length)
    Chandler.user.setActivity(status[key], { type: 'WATCHING' })
  }

  // Fire the first status update
  Chandler.updateStatus(true)

  // Set it to update randomly every two minutes
  const twoMins = 1000 * 60 * 2
  Chandler.statusUpdates = setInterval(Chandler.updateStatus, twoMins)

  // Now we've booted up!
  Chandler.booted = true
  Chandler.post(`Loaded Everything, Booted v${version}`)

}