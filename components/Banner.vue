<template>
  <div class="wrapper has-background-info" :hide="!show">
    <button
      class="wrapper-close-btn button is-large is-transparent"
      @click="$emit('close')"
    >
      <span class="icon is-medium has-text-white">
        <i class="fa fa-times fa-2x"></i>
      </span>
    </button>
    <section class="hero" style="height: 100%;">
      <div class="hero-body">
        <div class="container">
          <h1 class="wrapper-title has-text-white">
            Overseas voters can VOTE NOW using a Federal Write-in Absentee Ballot. For more information:
            <a href="https://www.votefromabroad.org/fwab/" target="_blank">Click here</a>
          </h1>
        </div>
      </div>
    </section>
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
  .wrapper {
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    width: 900px;
    z-index: 1000;
    box-shadow: 0 0 48px rgb(17, 17, 17);
    transition: all 0.2s ease-in-out;
  }
  .wrapper .wrapper-close-btn {
    position: absolute;
    top: 10px;
    right: 10px;
  }
  .wrapper .wrapper-title {
    font-size: 54px;
    font-weight: bold;
    padding: 10px;
  }
  .wrapper[hide] {
    left: -100%;
  }
  @media screen and (max-width: 600px) {
    .wrapper {
      bottom: 20vh;
      width: 100%;
    }
    .wrapper .wrapper-title {
      font-size: 32px;
      padding: 2px;
    }
  }
</style>
