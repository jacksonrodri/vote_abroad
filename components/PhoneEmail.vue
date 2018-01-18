<template>
  <section>
    <b-field
      label="Type your email address or phone number to start a secure session."
      message="hello world"
      type="is-danger"
      label-for="emailOrPhone">
      <b-field>
        <p class="control">
          <b-icon
            icon="us"
            pack="flag-icon"
            @click.native="$refs.country.focus()">
          </b-icon>
        </p>
        <b-input
          id="emailOrPhone"
          placeholder="e.g. somebody@gmail.com -- or -- +852 9669 9279"
          expanded>
        </b-input>
      </b-field>
    </b-field>
  </section>
</template>

<script>
export default {
  name: 'phone-email'
}
</script>

<style lang="sass">
$flag-icon-css-path: '../node_modules/flag-icon-css/flags'
@import '../node_modules/flag-icon-css/sass/flag-icon.scss'

.flag-icon
  width: 3rem;
  height: 100%;
  line-height: inherit;

.icon
  height: 2.2rem
  width: 3rem

// .flag-container
//   width: 3em;

// .flag-container > span
//   width: 100%;
//   height: 100%;
</style>
