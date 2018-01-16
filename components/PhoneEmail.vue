<template>
<section>
  <b-field label="Email"
    type="is-danger"
    message="This email is invalid">
    <b-input type="email"
      value="john@"
      maxlength="30">
    </b-input>
  </b-field>
</section>
</template>

<script>
export default {
  name: 'phone-email'
}
</script>
