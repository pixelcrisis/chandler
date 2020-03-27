<template>
  <div class="chunk content container">
    <div class="accordion" id="zones">
      <h5>Tracking Timezones</h5>

      <doc-block cmd="Adding a timezone" group="zones" name="add" show="true">
        You can add your own timezone by using <code>~/zone [timezone]</code>. <br>
        You can set someone else's timezone (if you're a mod) by doing <code>~/setzone [timezone]</code> <br><br>
        You can click <a href="http://kevalbhatt.github.io/timezone-picker/">This Link</a> to 
        go to a timezone picker. Running <code>~/help time</code> will also return this link.
        <code class="example">~/zone new york</code>
        <code class="example">~/setzone username sydney</code>
      </doc-block>

      <doc-block cmd="Getting The Time" group="zones" name="custom">
        <code class="example">~/time</code>
        <code class="example">~/time 9pm</code>
        <code class="example">~/time username</code>
      </doc-block>
    </div>

    <div class="accordion" id="notes">
      <h5>Using Custom Notes</h5>

      <doc-block cmd="Image / Gif Responses" group="notes" name="image" show="true">
        Using notes for images and gifs is easy, just set the URL as the note, and it gets embedded when Chandler fires the note!
        <code class="example">~/note mondays https://gfycat.com/regalhelplessgreyhounddog</code>
        <code class="example">~/mondays</code>
        <code class="outputs">https://gfycat.com/regalhelplessgreyhounddog</code>
      </doc-block>

      <doc-block cmd="Custom Responses" group="notes" name="custom">
        You can use <code>{msg}</code> to pass a message to a note.
        <code class="example">~/note hugs *hugs {msg}*</code>
        <code class="example">~/hugs everybody!</code>
        <code class="outputs">*hugs everybody!*</code>
      </doc-block>
    </div>
  </div>
</template>

<script>
  import DocBlock from '../parts/DocBlock.vue'
  export default { components: { DocBlock } }
</script>