<template>
  <div class="notification has-background-warning" :hide="!show">
    <!-- <button
      class="wrapper-close-btn button is-small is-transparent"
      @click="$emit('close')"
    >
      <span class="icon is-small has-text-primary">
        <i class="fa fa-times fa-2x"></i>
      </span>
    </button> -->
    <h1 class="subtitle is-size-3 is-size-5 has-text-primary">
      Overseas voters can VOTE NOW using a Federal Write-in Absentee Ballot. For more information:
      <a class="has-text-primary" href="https://www.votefromabroad.org/fwab/" target="_blank">CLICK HERE</a>
    </h1>
  </div>
</template>

<script>
export default {
  props: {
    show: {
      type: Boolean,
      required: false,
      default: () => false
    }
  },
  watch: {
    show (value) {
      if (!value) {
        const delay = setInterval(() => {
          this.$destroy()
          clearInterval(delay)
        }, 1200)
      }
    }
  }
}
</script>
