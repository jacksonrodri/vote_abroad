<template>
  <div class="wrapper has-background-warning" :hide="!show">
    <!-- <button
      class="wrapper-close-btn button is-small is-transparent"
      @click="$emit('close')"
    >
      <span class="icon is-small has-text-primary">
        <i class="fa fa-times fa-2x"></i>
      </span>
    </button> -->
    <h1 class="wrapper-title has-text-primary">
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

<style scoped>
  .wrapper .wrapper-close-btn {
    position: absolute;
    top: 10px;
    right: 10px;
  }
  .wrapper .wrapper-title {
    font-size: 22px;
    font-weight: bold;
    padding: 2px;
  }
  .wrapper[hide] {
    visibility: hidden !important;
  }
  @media screen and (max-width: 600px) {
    .wrapper {
      position: fixed !important;
      bottom: 0 !important;
      left: 0 !important;
      right: 0 !important;
      bottom: auto !important;
    }
    .wrapper .wrapper-title {
      font-size: 12px;
      padding: 10px;
    }
  }
</style>
