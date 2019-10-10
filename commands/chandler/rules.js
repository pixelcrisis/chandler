module.exports = {
  
  name: 'rules',
  level: 1,
  alias: ['rule'],

  help: {
    name: "{pre}rules",
    desc: "Returns the server rules post."
  },

  admin: {
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

  lang: {
    fresh:  "No rules yet! Add some with `{pre}rules add new rule`",
    noRule: "That rule doesn't seem to exist, sorry.",
    length: "Your rules post has gotten too long! Try removing some.",
    posted: "Rules posted! This post will auto-update, so don't bury/delete it!",
    added:  "Added new rule: `{val1}`",
    remove: "Removed rule `{val1}`: `{val2}`",
    update: "Updated rule `{val1}` to: `{val2}`",
    title:  "Updated post title to: {val1}",
    intro:  "Updated post intro to: {val1}",
    outro:  "Updated post outro to: {val1}",
    image:  "Updated post image.",
    color:  "Updated post color to: `{val1}`"
  },

  fire: async function (Bot, evt) {
    evt.rules = Bot.$getRules(evt)

    if (evt.access.level < 5) return this.send(Bot, evt)
    if (!evt.options.length)  return Bot.reply(evt, this.admin)

    let opt = evt.options.shift()
    let val = evt.options.join(' ')

    opt = isNaN(opt) ? opt.toLowerCase() : parseInt(opt)

    if (opt != 'post' && !val) return Bot.reply(evt, Bot.EN.bad.opt)

    if (this[`__${opt}`]) return this[`__${opt}`](Bot, evt, val)
    else if (!isNaN(opt)) return this.__edit(Bot, evt, opt, val)
  },

  send: function (Bot, evt) {
    evt.channel.send(this.make(Bot, evt, evt.rules))
  },

  make: function (Bot, evt, rules) {
    let embed = {
      color: rules.color || 0,
      image: { url: rules.image },
      author: { name: rules.title },
      desc: [ `${rules.intro}_ _\n` ]
    }

    if (!rules.list.length) embed.desc.push(this.lang.fresh)
    for (let i = 0; i < rules.list.length; i++) {
      embed.desc.push(`**${i + 1}: ${rules.list[i]}**`)
    }
    embed.desc.push(`\n${rules.outro}`)

    const response = Bot.response(evt, embed)
    return response.length > 1 ? false : response[0]
  },

  sync: async function (Bot, evt) {
    const rules = Bot.$getRules(evt)

    if (rules.post) {
      const newPost = this.make(Bot,evt, rules)
      if (!newPost) return Bot.reply(evt, this.lang.length)

      const channel = Bot.verifyChannel(evt, rules.post.channel)
      if (!channel) return Bot.$setRule(evt, 'post', false)

      const message = await channel.fetchMessage(rules.post.message)
      if (!message) return Bot.$setRule(evt, 'post', false)
      message.edit(newPost)

      Bot.deleteTrigger(evt)
    }
  },

  __post: async function (Bot, evt, val) {
    const message = await evt.channel.send('_ _')
    if (!message) return

    Bot.$setRule(evt, 'post', {
      channel: evt.channel.id, message: message.id
    })

    Bot.replyFlash(evt, this.lang.posted)
    return this.sync(Bot, evt)
  },

  __add: function (Bot, evt, val) {
    Bot.$addRule(evt, 'list', val)
    Bot.replyFlash(evt, this.lang.added, val)
    return this.sync(Bot, evt)
  },

  __rem: function (Bot, evt, val) {
    if (isNaN(val)) return Bot.reply(evt, Bot.EN.bad.num)
    
    const rule = evt.rules.list[parseInt(val - 1)]
    if (!rule) return Bot.reply(evt, this.lang.noRule)

    Bot.$remRule(evt, rule, 'list')
    Bot.replyFlash(evt, this.lang.remove, val, rule)
    return this.sync(Bot, evt)
  },

  __edit: function (Bot, evt, opt, val) {
    let rule = evt.rules.list[parseInt(opt - 1)]
    if (!rule) return Bot.reply(evt, this.lang.noRule)

    rule = val
    Bot.$setRule(evt, 'list', evt.rules.list)
    Bot.replyFlash(evt, this.lang.update, opt, val)
  },

  __title: function (Bot, evt, val) {
    Bot.$setRule(evt, 'title', val)
    Bot.replyFlash(evt, this.lang.title, val)
    return this.sync(Bot, evt)
  },

  __intro: function (Bot, evt, val) {
    Bot.$setRule(evt, 'intro', val)
    Bot.replyFlash(evt, this.lang.intro, val)
    return this.sync(Bot, evt)
  },

  __outro: function (Bot, evt, val) {
    Bot.$setRule(evt, 'outro', val)
    Bot.replyFlash(evt, this.lang.outro, val)
    return this.sync(Bot, evt)
  },

  __image: function (Bot, evt, val) {
    Bot.$setRule(evt, 'image', val)
    Bot.replyFlash(evt, this.lang.image, val)
    return this.sync(Bot, evt)
  },

  __color: function (Bot, evt, val) {
    Bot.$setRule(evt, 'color', val)
    Bot.replyFlash(evt, this.lang.color, val)
    return this.sync(Bot, evt)
  },

  test: async function (Bot, evt, data) {
    evt.options = ['post']
    await this.fire(Bot, evt)

    evt.options = ['add', 'testing rule']
    await this.fire(Bot, evt)

    evt.options = ['1', 'edited rule']
    await this.fire(Bot, evt)

    evt.options = ['rem', '1']
    await this.fire(Bot, evt)

    evt.options = ['title', 'Title Change 1']
    await this.fire(Bot, evt)

    evt.options = ['title', 'Title Change 2']
    await this.fire(Bot, evt)
  }

}