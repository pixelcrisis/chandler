<template>
  <nav class="navbar navbar-expand-lg navbar-light bg-light fixed-top">
    <div class="container">
      <a class="navbar-brand" href="/">
        <img src="logo.png">
      </a>
      <a class="navbar-toggler" href="#" data-toggle="collapse" data-target="#menu">
        <span class="navbar-toggler-icon"></span>
      </a>

      <div class="collapse navbar-collapse" id="menu">
        <ul class="navbar-nav mr-auto">
          <li :class="['nav-item', { active: active == 'splash'}]">
            <a class="nav-link" href="/">Home</a>
          </li>
          <li :class="['nav-item', { active: active == 'commands'}]">
            <a class="nav-link" href="/commands">Commands </a>
          </li>
          <li :class="['nav-item', { active: active == 'guides'}]">
            <a class="nav-link" href="/guides">Guides</a>
          </li>
        </ul>
        <ul class="navbar-nav">
          <li class="nav-item">
            <a class="nav-link" href="https://discord.gg/tjRC7E4">Support Server</a>
          </li>
          <li class="nav-item">
            <a class="nav-link" href="https://github.com/12px/chandler">Github</a>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>

<script>
  export default {
    props: ['active']
  }
</script>