<template>
  <b-tooltip :label="message" type="is-info">
    <b-message type="is-info" style="margin: 10px auto;">
      <p class="wrapper" v-text="message" />
    </b-message>
  </b-tooltip>
</template>

<script>
export default {
  props: {
    message: {
      type: String,
      required: true,
      default: () => ''
    }
  }
}
</script>

<style scoped>
  .wrapper {
    display: block;
    display: -webkit-box;
    max-width: 200px;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
  }
</style>
