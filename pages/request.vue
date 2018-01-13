<template>
  <section class="section columns is-centered">
    <div class="column is-three-fifths">
      <b-tabs type="is-boxed" v-model="currentRequest" @change="addRequest($event)">
        <b-tab-item v-for="(request) in tabs" :key="request.id" :label="request.firstName || 'new request'">
          <h1 class="title">{{ `${request.firstName ? request.firstName + '\'s' : 'New'} Request`}}</h1>
          <h2 class="subtitle">30% complete</h2>
          <progress class="progress is-link" value="30" max="100">30%</progress>
          <nuxt-child>
          </nuxt-child>
        </b-tab-item>
      </b-tabs>
      <button @click="removeRequest" class="button is-danger">Delete this Request</button>
    </div>
  </section>
</template>

<script>
export default {
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
