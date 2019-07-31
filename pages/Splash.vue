<template>
  <div id="splash">
    <nav-bar active="splash"></nav-bar>

    <div class="container content text-center">
      <img src="logo.png" width="200px">
      <iframe id="framed" src="frame.html" frameborder="0" scrolling="no"></iframe>
    </div>
  </div>
</template>

<script>
  import NavBar from '../parts/NavBar.vue'

  export default {
    components: { NavBar }
  }
</script>