<template>
  <div class="chunk" id="guides">
    <nav-bar active="guides"></nav-bar>

    <div class="content container">

      <div class="accordion" id="set">
        <h5>Configuration</h5>

        <doc-block cmd="~/set prefix (symbol)" group="set" name="prefix" show="true">
          Change the default <strong>prefix</strong> for commands in your server.
          <code class="example">~/set prefix ~</code>
        </doc-block>

        <doc-block cmd="~/set mods (role)" group="set" name="mods">
          Set your <strong>mods role</strong> so they have permission to use Mod commands. If you can't mention the role, use <strong>~/roles</strong> to get the ID.
          <code class="example">~/set mods @Staff</code>
        </doc-block>

        <doc-block cmd="~/set warnings (on/off)" group="set" name="warnings">
          Enable or Disable the "You dont' have permssion to use this command" warnings.
        </doc-block>

        <doc-block cmd="~/set onjoin (channel) (message)" group="set" name="join">
          Enable or Disable entry logging in <strong>#channel</strong>. <strong>message</strong> is optional, defaults to <strong>{user} joined.</strong>
          <code class="example">~/set onjoin off</code>
          <code class="example">~/set onjoin #modlogs</code>
          <code class="example">~/set onjoin #welcome {user} joined in!</code>
          <code class="options">{user} {user.name} {user.id}</code>
        </doc-block>

        <doc-block cmd="~/set onleave (channel) (message)" group="set" name="leave">
          Enable or Disable entry logging in <strong>#channel</strong>. <strong>message</strong> is optional, defaults to <strong>{user.name} left.</strong>
          <code class="example">~/set onleave off</code>
          <code class="example">~/set onleave #modlogs</code>
          <code class="example">~/set onleave #welcome {user} joined in!</code>
          <code class="options">{user} {user.name} {user.id}</code>
        </doc-block>
      </div>
      
      <div class="accordion" id="rules">
        <h5>Setting Up Your Rules Post</h5>

        <doc-block cmd="~/rules post" group="rules" name="post">
          Prints out the <em>official</em> rules post. This post will get automatically updated, so it's best stashed in an entry channel.
        </doc-block>

        <doc-block cmd="~/rules add [rule]" group="rules" name="add">
          Adds <code>(rule)</code> as a new Server Rule.
          <code class="example">~/rules add Be Quiet.</code>
        </doc-block>

        <doc-block cmd="~/rules rem #" group="rules" name="rem">
          Deletes Rule <code>#</code>
          <code class="example">~/rules rem 1</code>
        </doc-block>

        <doc-block cmd="~/rules edit # [rule]" group="rules" name="edit">
          Edits Rule <code>#</code> to <code>(rule)</code>
          <code class="example">~/rules edit 1 Be Quieter.</code>
        </doc-block>

        <doc-block cmd="~/rules title [value]" group="rules" name="title">
          Changes the title of the Rules Post.
          <code class="example">~/rules title Welcome To Our Server!</code>
        </doc-block>

        <doc-block cmd="~/rules intro [value]" group="rules" name="intro">
          Edits the intro paragraph posted before the rules.
          <code class="example">~/rules intro Please Read Carefully!</code>
        </doc-block>

        <doc-block cmd="~/rules outro [value]" group="rules" name="outro">
          Changes the outry paragraph posted after the rules.
          <code class="example">~/rules outro Thanks For Reading!</code>
        </doc-block>

        <doc-block cmd="~/rules image [url]" group="rules" name="image">
          Add/Change the image for your Rules Post.
          <code class="example">~/rules image https://example.com/image.jpg</code>
        </doc-block>

        <doc-block cmd="~/rules color [hex]" group="rules" name="color">
          Changes the color of the rules post to <code>(hex)</code>.
          <code class="example">~/rules color #ffffff</code>
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

  </div>
</template>

<script>
  import NavBar   from '../parts/NavBar.vue'
  import DocBlock from '../parts/DocBlock.vue'

  export default {
    components: { NavBar, DocBlock }
  }
</script>