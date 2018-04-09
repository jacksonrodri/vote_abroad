<template>
  <div class="media">
      <div class="media-left">
        <b-checkbox size="is-medium"></b-checkbox>
      </div>
    <div class="media-content">
      {{$t(`dashboard.${value}.title`)}}
      <transition name="fade">
      <article v-if="showContent" class="media">
        <figure class="media-left icon is-large">
          <i :class="['fa', 'fa-3x', 'fa-'+$t(`dashboard.${value}.icon`)]"></i>
        </figure>
        <div class="media-content">
          <p v-html="$t(`dashboard.${value}.content`)">
          </p>
          <nav class="level">
            <div class="level-left">

            </div>
            <div class="level-right">
              <button class="button is-primary is-medium">{{$t(`dashboard.${value}.actionText`)}}</button>
            </div>
          </nav>
        </div>
      </article>
    </transition>
    </div>
    <div class="media-right">
      <a @click="showContent=!showContent" class="button is-white media-right">
        <span class="icon is-medium">
          <i :class="['fas', showContent ? 'fa-angle-down' : 'fa-angle-up']"></i>
        </span>
      </a>
    </div>
  </div>
</template>

<script>
export default {
  props: [
    'value'
  ],
  data () {
    return {
      showContent: false
    }
  }

}
</script>

<style>

</style>
