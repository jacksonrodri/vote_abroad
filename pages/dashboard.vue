<template>
<div class="hero-head">
  <div>
    <h1 class="has-text-centered title is-3">Ballot Request Status</h1>
    <h3 class="has-text-centered subtitle is-4">Next Steps...</h3>
  </div>
  <div class="hero-body columns is-centered">
    <div class="column is-12 is-8-desktop is-7-widescreen is-6-fullhd">
      <!-- level menu -->
      <div v-if="isAuthenticated" class="level is-mobile">
        <div class="level-left">
          <span class="level-item">
            <h1 class="subtitle is-3">
              <span class="has-text-grey-light">Hello </span><span><strong>{{ name }}</strong></span>
            </h1>
          </span>
        </div>
        <div class="level-right">
          <div v-if="isAdmin" class="select level-item">
            <select>
              <option>2018</option>
              <option>2016</option>
              <option>2017</option>
              <option selected>2018</option>
              <option>2019</option>
              <option>2020</option>
            </select>
          </div>
          <div class="level-item"  @click="$store.dispatch('userauth/logout')">
            <h1 class="subtitle is-5 has-text-grey">
              <span class="icon">
                <i class="fas fa-sign-out-alt"></i>
              </span>
              Logout
            </h1>
          </div>
        </div>
      </div>

      <!-- main section -->
      <div class="columns">
        <div v-if="isAdmin" class="column is-4-tablet is-3-desktop is-2-widescreen">
          <!-- The sidebar -->
          <nav class="menu">
            <p class="menu-label">
              Menu
            </p>
            <ul class="menu-list">
              <li>
                <a href="dashboard.html">
                  <span class="icon">
                    <i class="fa fa-tachometer-alt"></i>
                  </span>
                  Dashboard
                  </a>
              </li>
              <li>
                <a class="is-active" href="books.html">
                  <span class="icon">
                    <i class="fa fa-book"></i>
                  </span>
                  Books
                </a>
              </li>
              <li>
                <a href="customers.html">
                  <span class="icon">
                    <i class="fa fa-address-book"></i>
                  </span>
                  Customers
                </a>
              </li>
              <li>
                <a href="orders.html">
                  <span class="icon">
                    <i class="fa fa-file-text-o"></i>
                  </span>
                  Orders
                </a>
              </li>
            </ul>
          </nav>
        </div>
          <div class="column">
            <div class="columns">
              <div class="column">
                <!-- <request-stage></request-stage> -->
                <article class="message is-info">
                  <div class="message-body">
                    Thank you for using www.votefromabroad.org to generate your Voter Registration/Ballot Request form.
                    (Text to be added with relevent instructions)
                    If you need any help, contact our volunteer voter support team at: help@votefromabroad.org.
                    Thanks for voting!
                  </div>
                </article>
              </div>
            </div>

          <!-- stats and buttons -->
          <div class="columns is-multiline is-centered">
            <div class="column">
              <nuxt-link to="/FAQs">
                <div class="notification is-info has-text">
                  <div class="media">
                    <div class="media-left">
                      <span class="icon is-large">
                        <i class="fas fa-3x fa-graduation-cap"></i>
                      </span>
                    </div>
                    <div class="media-content" style="overflow:hidden;">
                      <p class="title is-3">Learn</p>
                      <p class="subtitle is-6">about your rights as a voter abroad</p>
                    </div>
                  </div>
                </div>
              </nuxt-link>
            </div>

            <div class="column">
              <a @click="share">
                <div class="notification is-danger has-text">
                  <div class="media">
                    <div class="media-left">
                      <span class="icon is-large">
                        <i class="fas fa-3x fa-share"></i>
                      </span>
                    </div>
                    <div class="media-content" style="overflow:hidden;">
                      <p class="title is-3">Share</p>
                      <p class="subtitle is-6">Ask your friends to vote from abroad</p>
                    </div>
                  </div>
                </div>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
</template>

<script>
import UserDashboard from '~/components/UserDashboard'
// import VueMarkdown from 'vue-markdown'
import RequestStage from '~/components/RequestStage'

export default {
  name: 'User-Account',
  components: {
    UserDashboard,
    // VueMarkdown,
    RequestStage
  },
  data () {
    return {
      isAdmin: false,
      currentRequestStage: 'Fill & Sign',
      requestStages: [
        {
          title: 'Fill & Sign',
          icon: 'edit',
          content: 'You must completely fill out your ballot request, sign and date it before sending it in.',
          actionText: 'Edit my form',
          faqs: ['What state can I vote in?', 'Do I have to do this every year?']
        },
        {
          title: 'Send in Request',
          icon: 'paper-plane',
          content: 'You must submit your request to your local election official in your town, county or state.  blah blah blah',
          actionText: 'Send Request electronically',
          faqs: []
        },
        {
          title: 'Receive Ballot',
          icon: 'inbox',
          content: 'States must send out ballots at least 45 days prior to an election.  We recomend confirming with your local election official that they have accepted your request.',
          actionText: 'Email my election official'
        },
        {
          title: 'Vote',
          icon: 'check',
          content: 'Be sure to send in your voted ballot by the deadline of.... ',
          actionText: 'Check my deadlines',
          completeText: 'I\'ve already voted'
        }
      ]
    }
  },
  computed: {
    user () { return this.$store.state.userauth.user },
    requests () { return this.$store.state.requests.requests },
    currentRequest () { return this.$store.state.requests.currentRequest },
    currentRequestObject () { return this.$store.getters['requests/getCurrent'] },
    stage () { return this.currentRequestObject && this.currentRequestObject.status ? this.currentRequestObject.status : 'start' },
    states () { return new Set(this.requests.map(x => x.votAdr.stateISO)) },
    name () { return this.user && this.user.firstName ? this.user.firstName : this.requests && this.requests[0] && this.requests[0].firstName ? this.requests[0].firstName : '' },
    isAuthenticated: function () { return this.$store.getters['userauth/isAuthenticated'] }
    // currentRequestStage () { return this.currentRequest && this.currentRequest.stage ? this.currentRequest.stage : 'fill' }
  },
  methods: {
    share () {
      this.$dialog.alert({
        title: 'Tell a friend about VoteFromAbroad',
        message: 'To be added after launch',
        confirmText: 'OK',
        type: 'is-danger',
        hasIcon: true,
        icon: 'share',
        iconPack: 'fas'
      })
    }
  }
}
</script>

<style>

</style>
