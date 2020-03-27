// language.js - the language of the bot

module.exports = Chandler => {

  Chandler.EN = {

    access: "Sorry, you don't have access to that.",
    delete: "Hm, I can't manage messages in <#{val1}>.",
    option: "You need to provide an option.",
    verify: "Hm, I couldn't make sense of `{val1}`.",
    number: "The option needs to be a number for this to work."
    // bad: {
    //   num:   "This option requires a number.",
    //   val:   "You need to provide a value.",
    //   opt:   "You need to provide an option.",
    //   arg:   "I couldn't make sense of `{val1}`",
    //   lvl:   "Oops! You're only a **{val1}**, only **{val2}s** can do that.",
    //   zone:  "You haven't set your zone yet! `{pre}zone`",
    //   embed: "I couldn't parse that embed.",
    //   chain: "You can only chain up to 3 commands."
    // },

    // cant: {
    //   fire:    "Give me a second, I'm currently busy in this server.",
    //   roles:   "Oops! I can't manage roles in <#{val1}>",
    //   delete:  "Oops! I can't manage messages in <#{val1}>",
    //   manage:  "Oops! I can't manage channel: <#{val1}>",
    //   message: "Oops! I can't speak in <#{val1}>"
    // },

    // zone: {
    //   none: "You haven't set a zone yet! `{pre}zone`"
    // }
  }

  Chandler.URL = {
    docs:   "https://chandler.12px.io/#/cmds",
    help:   "https://chandler.12px.io/#/guides",
    vote:   "https://discordbots.org/bot/596194094275887116/vote",
    guild:  "https://discord.gg/uyVcGKu",
    zones:  "http://kevalbhatt.github.io/timezone-picker",
    embed:  "https://leovoel.github.io/embed-visualizer/",
    getids: "https://support.discordapp.com/hc/en-us/articles/206346498-Where-can-I-find-my-User-Server-Message-ID-",
    invite: "https://discordapp.com/oauth2/authorize?client_id=596194094275887116&scope=bot&permissions=268512312"
  }

}
