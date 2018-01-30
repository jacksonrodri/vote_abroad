<template>
<div class="container is-widescreen">
  <!-- :style="$route.fullPath === '/request/canvas' ? 'overflow-x: scroll;' : ''" -->
  <section class="columns is-centered is-multiline">
    <div class="column is-three-fifths">
      <b-tabs type="is-boxed" v-model="currentRequest" @change="addRequest($event)">
        <b-tab-item v-for="(request) in tabs" :key="request.id" :label="request.firstName || 'new request'">
        </b-tab-item>
        <nuxt-child v-if="$route.fullPath !== '/request/canvas2'">
        </nuxt-child>
      </b-tabs>
      <!-- <button @click="removeRequest" class="button is-text is-small">Delete this Request</button> -->
    </div>
    <div class="column is-10" v-if="$route.fullPath === '/request/canvas2'">
      <nuxt-child></nuxt-child>
    </div>
  </section>
  </div>
</template>

<script>
export default {
  transition: 'test',
  // async mounted () {
  //   var cur = this.$store.state.requests.currentRequest
  //   await this.$store.commit('requests/changeCurrent', 0)
  //   this.$store.commit('requests/changeCurrent', cur)
  // },
  computed: {
    requests: function () {
      return this.$store.state.requests.requests ? this.$store.state.requests.requests : []
    },
    currentRequest: {
      get () {
        return this.$store.state.requests.currentRequest
      },
      set (value) {
        this.$store.commit('requests/changeCurrent', value)
      }
    },
    tabs: function () {
      return this.requests.concat([{
        id: (function b (a) { return a ? (a ^ Math.random() * 16 >> a / 4).toString(16) : ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, b) })(),
        firstName: 'add a family member'
      }])
    }
  },
  methods: {
    addRequest: function (event) {
      console.log(event, this.tabs.length)
      // add a request if at end
      if (event === this.tabs.length - 1) {
        this.$store.commit('requests/add')
        // this.activeTab = event
      }
    },
    removeRequest: function () {
      this.$store.dispatch('requests/removeCurrent')
    }
  }
}
</script>
