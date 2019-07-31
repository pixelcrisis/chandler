<template>
  <div id="chandler">
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
            <router-link tag="li" class="nav-item" active-class="active" to="/" exact>
              <a class="nav-link">Home</a>
            </router-link>

            <router-link tag="li" class="nav-item" active-class="active" to="/cmds">
              <a class="nav-link">Commands</a>
            </router-link>

            <router-link tag="li" class="nav-item" active-class="active" to="/guides">
              <a class="nav-link">Guides</a>
            </router-link>
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

    <router-view></router-view>
  </div>
</template>