<template>
  <div class="card">

    <div class="card-header" 
         data-toggle="collapse"
         v-bind:data-target="'#' + getID">

      <code>{{ cmd }}</code>

      <span :class="badgeClass">{{ getLevel }}</span>
    </div>

    <div :id="getID" :class="showBlock" v-bind:data-parent="'#' + group">
      <slot></slot>
    </div>

  </div>
</template>

<script>
  export default {
    props: ['cmd', 'group', 'level', 'show', 'name'],
    computed: {
      getID() {
        if (this.name) return this.name
        return `${this.group}${this.cmd.split(' ')[0].slice(2) }`
      },
      getLevel() {
        if (this.level == '5') return 'Admin'
        if (this.level == '3') return 'Mod'
        if (this.level == '1') return 'User'
        return ''
      },
      badgeClass() {
        let classes = 'badge badge-pill'
        if (this.level == '1') return `${classes} badge-success`
        if (this.level == '3') return `${classes} badge-info`
        if (this.level == '5') return `${classes} badge-danger`
        return classes
      },
      showBlock() {
        let classes = 'card-body collapse'
        return this.show ? `${classes} show` : classes
      }
    }
  }
</script>