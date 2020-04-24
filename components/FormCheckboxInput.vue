<template>
  <label class="checkbox">
    <input
      :value="value"
      type="checkbox"
      @input="$emit('input', $event.target.checked)"
    >
    {{ message }}
  </label>
</template>

<script>
export default {
  props: ['value', 'message']
}
</script>
