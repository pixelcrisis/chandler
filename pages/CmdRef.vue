<template>
  <div class="chunk container content">
      
    <div class="text-muted text-center mb-4">
      [args] are required, (args) are optional.
    </div>

    <div class="accordion" id="sys">
      <doc-block cmd="~/help (command)" group="sys" level="1" show="true">
        Returns a link to this site and the support server, as well as an invite link for the bot. When passed a <code>(command)</code>, returns the help string for that command.
        <code class="alias">~/invite</code>
      </doc-block>

      <doc-block cmd="~/commands" group="sys" level="1">
        Returns all commands available to you.
        <code class="alias">~/cmds</code>
      </doc-block>
    </div>

    <div class="accordion" id="zone">
      <h5>Tracking Timezones</h5>

      <doc-block cmd="~/time (time/username)" group="zone" level="1" show="true">
        Gets the time at <code>(time)</code> for all the timezones on the server. If <code>(time)</code> is not provided, gets time now. <br>
        Remember, try not to ding a user if looking up what time it is, just in case. You can look up by nickname or username!
        <code class="example">~/time</code>
        <code class="example">~/time 9pm</code>
        <code class="example">~/time Username</code>
      </doc-block>

      <doc-block cmd="~/when (time) (month) (day)" group="zone" level="1" show="true">
        The when command is a simple countdown timer. It will return a countdown to a date, if any is set. Mods can set a countdown by passing a time, month, and day. The month and day can be omitted for same-day countdowns.
        <code class="example">~/when 9pm</code>
        <code class="example">~/when 9pm Dec 31</code>
      </doc-block>

      <doc-block cmd="~/zones" group="zone" level="1">
        Prints out all the active timezones and their users in the server. Disabled on servers with over 30 users registered with timezones for brevity.
      </doc-block>

      <doc-block cmd="~/zone [timezone]" group="zone" level="1">
        Sets your timezone for local time management. Takes a timezone string, or the city name your timezone is based on, like <code>New York</code>, <code>Amsterdam</code>, or <code>Melbourne</code>. You can use <a href="http://kevalbhatt.github.io/timezone-picker/" target="_blank">this site</a> to find your <code>timezone</code>.
        <code class="example">~/zone Los Angeles</code>
        <code class="example">~/zone Europe/Berlin</code>
      </doc-block>

      <doc-block cmd="~/setzone [user] [timezone]" group="zone" level="3">
        Sets user's timezone for local time management. Takes a timezone string, see <code>(~/zone)</code> above for more.
        <code class="example">~/zone user Los Angeles</code>
        <code class="example">~/zone user Europe/Berlin</code>
      </doc-block>
    </div>

    <div class="accordion" id="note">
      <h5>Custom Notes / Commands</h5>

      <doc-block cmd="~/notes" group="note" level="1">
        Returns a list of the notes in the server.
      </doc-block>

      <doc-block cmd="~/note [cmd] [message]" group="note" level="3" show="true">
        Creates a note for <code>(message)</code> that can be accessed via <code>~/cmd</code>. Only mods can create a note, but anyone can use them.
        <code class="example">~/note yo hello there</code>
        <code class="example">~/yo</code>
        <code class="outputs">hello there</code>
      </doc-block>

      <doc-block cmd="~/erase [note]" group="note" level="3">
        Deletes <code>note.</code>.
      </doc-block>
    </div>

    <div class="accordion" id="conf">
      <h5>Bot Configuration</h5>

      <doc-block cmd="~/status" group="conf" level="5">
        Returns details about current bot configuration.
        <code class="alias">~/configs</code>
      </doc-block>

      <doc-block cmd="~/set [option] [value]" group="conf" level="5">
        Check out the <a href="guides.html">Guides</a> for all options!
        <code class="alias">~/config</code>
      </doc-block>

      <doc-block cmd="~/rules [option] [value]" group="conf" level="5">
        Check out the <a href="guides.html">Guides</a> for all options!
      </doc-block>

      <doc-block cmd="~/roles" group="conf" level="3">
        Prints out all the roles in the server and their IDs.
      </doc-block>
    </div>

    <div class="accordion" id="mods">
      <h5>Server Management</h5>

      <doc-block cmd="~/print" group="mods" level="3">
        Prints <code>(message)</code> in the channel.
        <code class="example">~/print this is a message</code>
      </doc-block>

      <doc-block cmd="~/embed [object]" group="mods" level="3">
        Input an <code>(embed object)</code>, such as the one generated from <a href="https://leovoel.github.io/embed-visualizer/" target="_blank">here</a>, and the bot embeds it in the channel.
        <code class="example">~/embed { "title": "hello!" }</code>
      </doc-block>

      <doc-block cmd="~/edit [messageID] [content/embed]" group="mods" level="3">
        Edit message (sent by the bot!) with id <code>(messageID)</code>, and replace it with <code>(content/embed)</code>. <br>
        Follow <a href="https://support.discordapp.com/hc/en-us/articles/206346498-Where-can-I-find-my-User-Server-Message-ID-" target="_blank">this link</a> to learn how to copy Discord message IDs.
        <code class="example">~/edit MESSAGE hello!</code>
        <code class="example">~/edit MESSAGE { "title": "hello!" }</code>
      </doc-block>

      <doc-block cmd="~/lock" group="mods" level="3">
        Locks the current channel - sets all perms to Can't Send Messages.
      </doc-block>

      <doc-block cmd="~/unlock" group="mods" level="3">
        Unlocks the current channel - resets all perms to original state.
      </doc-block>

      <doc-block cmd="~/speak (channel)" group="mods" level="3">
        Confirms the channel currently set to <code>~/say</code> things in.<br>Change the speaking channel by passing a new <code>(#channel)</code>
        <code class="example">~/speak #general</code>
      </doc-block>

      <doc-block cmd="~/say [message]" group="mods" level="3">
        Sends <code>message</code> to the channel set by <code>~/speak</code>.
        <code class="example">~/say hello!</code>
      </doc-block>
    </div>

  </div>
</template>

<script>
  import DocBlock from '../parts/DocBlock.vue'
  export default { components: { DocBlock } }
</script>