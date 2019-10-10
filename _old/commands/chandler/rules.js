module.exports = {

  name: 'rules',
  alias: [ 'rule' ],
  
  level: 1,

  lang: {
    val: "You need to provide a value.",
    nan: "Value needs to be a number.",
    rule: "Couldn't find that rule.",
    none: "No rules yet! Add some with `{pre}rules add new rule`",
    long: "Your rules have gotten too long! Try shortening them.",
    post: "These posts will automatically update, so don't bury/delete it!",
    title: "Updated post title to: {val1}",
    intro: "Updated post intro to: {val1}",
    outro: "Updated post outro to: {val1}",
    image: "Updated post image.",
    image: "Updated post color to: `{val1}`",
    added: "Added rule: {val1}",
    removed: "Removed rule: {val1}",
    updated: "Changed rule {val1} to `{val2}`"
  },

  help: {
    name: "{pre}rules",
    desc: "Returns the server rules."
  },

  helpAdmin: {
    name: "{pre}rules [option] (value)",
    desc: "*Available Options:*\n\n" +
          "`add` - add *value* as a new rule.\n" +
          "`rem` - Removes rule number *value*\n" +
          "`#` - Changes Rule # `option` to *value*\n\n" +
          "`post` - print out the official rules post.\n" +
          "*the official post automatically updates with new rules!*\n\n" +
          "`title` - changes title of official rules post.\n" +
          "`color` - changes color of official rules post (#hex).\n" +
          "`image` - changes image of official rules post.\n" +
          "`intro` - adds intro to the official rules post.\n" +
          "`outro` - adds outro to the official rules post."
  },

  defaults: {
    post: null,
    list: [],
    intro: "Rule breaking may lead to being kicked or banned!",
    outro: "Thanks for reading, enjoy the server!"
  },

  fire: function(Bot, msg, opts, access) {
    if (access < 5 || !opts.length) return this.send(Bot, msg)
    const rules = Bot.$getRule(msg)

    const opt = opts.shift().toLowerCase()
    const val = opts.join(' ')

    if (!isNaN(opt)) return this.__edit(Bot, msg, rules, opt, val)
    else if (this[`__${opt}`]) return this[`__${opt}`](Bot, msg, rules, val)
  },

  __post: async function(Bot, msg, rules, val) {
    const message = await msg.channel.send('_ _')
    const spacer1 = await msg.channel.send('_ _')
    const spacer2 = await msg.channel.send('_ _')
    if (!message || !spacer1 || !spacer2) return
    const post = {
      channel: msg.channel.id,
      messages: [ message.id, spacer1.id, spacer2.id ]
    }
    Bot.$setRule(msg, 'post', post)
    Bot.replyFlash(msg, this.lang.post)
    return this.update(Bot, msg)
  },

  __add: function(Bot, msg, rules, val) {
    if (!val) return Bot.reply(msg, this.lang.val)
    Bot.$addRule(msg, 'list', val)
    Bot.replyFlash(msg, this.lang.added, val)
    return this.update(Bot, msg)
  },

  __rem: function(Bot, msg, rules, val) {
    if (!val) return Bot.reply(msg, this.lang.val)
    if (isNaN(val)) return Bot.reply(msg, this.lang.nan)
    const rule = rules.list[parseInt(val - 1)]
    if (!rule) return Bot.reply(msg, this.lang.rule)
    Bot.$remRule(msg, rule, 'list')
    Bot.replyFlash(msg, this.lang.removed, rule)
    return this.update(Bot, msg)
  },

  __edit: function(Bot, msg, rules, opt, val) {
    if (!val) return Bot.reply(msg, this.lang.val)
    if (!rules.list[parseInt(opt - 1)]) return Bot.reply(msg, this.lang.rule)
    rules.list[parseInt(opt - 1)] = val
    Bot.$setRule(msg, 'list', rules.list)
    Bot.replyFlash(msg, this.lang.updated, opt, val)
    return this.update(Bot, msg)
  },

  __title: function(Bot, msg, rules, val) {
    if (!val) return Bot.reply(msg, this.lang.val)
    Bot.$setRule(msg, 'title', val)
    Bot.replyFlash(msg, this.lang.title, val)
    return this.update(Bot, msg)
  },

  __intro: function(Bot, msg, rules, val) {
    Bot.$setRule(msg, 'intro', val)
    Bot.replyFlash(msg, this.lang.intro, val)
    return this.update(Bot, msg)
  },

  __outro: function(Bot, msg, rules, val) {
    Bot.$setRule(msg, 'outro', val)
    Bot.replyFlash(msg, this.lang.outro, val)
    return this.update(Bot, msg)
  },

  __image: function(Bot, msg, rules, val) {
    Bot.$setRule(msg, 'image', val)
    Bot.replyFlash(msg, this.lang.image, val)
    return this.update(Bot, msg)
  },

  __color: function(Bot, msg, rules, val) {
    val = Bot.getColor(val)
    Bot.$setRule(msg, 'color', val)
    Bot.replyFlash(msg, this.lang.color, val)
    return this.update(Bot, msg)
  },

  send: function(Bot, msg) {
    const rules = Bot.$getRule(msg)
    const response = this.make(Bot, msg, rules)
    if (!response.length) return
    for (var i = 0; i < response.length; i++) {
      msg.channel.send(response[i])
    }
  },

  make: function(Bot, msg, rules) {
    if (!rules) return false

    let embed = { 
      desc: [],
      image: { url: rules.image },
      author: { name: rules.title }
    }
    if (rules.color) embed.color = rules.color
    embed.desc.push(rules.intro + '_ _\n')
    if (!rules.list.length) embed.desc.push(this.lang.none)
    for (var i = 0; i < rules.list.length; i++) {
      embed.desc.push(`**${i + 1}: ${rules.list[i]}**`)
    }
    embed.desc.push('\n' + rules.outro)

    const response = Bot.response(msg, embed)
    return response.length > 3 ? [] : response
  },

  update: async function(Bot, msg) {
    const rules = Bot.$getRule(msg)

    if (rules.post) {
      const newPost = this.make(Bot, msg, rules)
      if (!newPost.length) return Bot.reply(msg, this.lang.long)
      const channel = Bot.verifyChannel(msg, rules.post.channel)
      if (!channel) return Bot.$setRule(msg, 'post', false)
      for (var i = 0; i < newPost.length; i++) {
        const message = await channel.fetchMessage(rules.post.messages[i])
        if (!message) return Bot.$setRule(msg, 'post', false)
        message.edit(newPost[i])
      }
    }

    Bot.deleteTrigger(msg)
  },

  test: async function(Bot, msg, data) {
    Bot.reply(msg, {
      name: "Testing {pre}rules",
      desc: "`{pre}rules` - response\n" +
            "`{pre}rules arg` - response",
      color: 16549991
    })

    const rules = Bot.$getRule(msg, 'list')
    const index = rules.length + 1

    await this.fire(Bot, msg, ['post'])
    await this.fire(Bot, msg, ['add', 'testing rule'])
    await this.fire(Bot, msg, [index, 'new rule testing'])
    await this.fire(Bot, msg, ['rem', index])
    await this.fire(Bot, msg, ['title', 'Title Change 1'])
    await this.fire(Bot, msg, ['title', 'Title Change 2'])
    
    return Bot.reply(msg, "{pre}rules test complete.")
  }

}