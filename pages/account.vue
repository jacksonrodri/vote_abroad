<template>
  <div class="hero-body columns is-centered">
    <div class="column is-9 is-12-touch">
      <!-- level menu -->
      <div class="level">
        <div class="level-left">
          <h1 class="subtitle is-3">
            <span class="has-text-grey-light">Hello </span><span><strong>{{ name }}</strong></span>
          </h1>
        </div>
        <div v-if="isAdmin" class="level-right">
          <div class="select">
            <select>
              <option>2018</option>
              <option>2016</option>
              <option>2017</option>
              <option selected>2018</option>
              <option>2019</option>
              <option>2020</option>
            </select>
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
          <!-- dashboard area -->
        <div class="columns is-multiline">
          <div class="column is-12-tablet is-6-desktop is-3-widescreen">
            <div class="notification is-link has-text">
              <p class="title is-3">9,000,000</p>
              <p class="subtitle is-6">Eligible Voters Abroad</p>
            </div>
          </div>

          <div class="column is-12-tablet is-6-desktop is-3-widescreen">
            <div class="notification is-info has-text">
              <p class="title is-3">Mar 6</p>
              <p class="subtitle is-6">Next Election</p>
            </div>
          </div>

          <!-- <div class="column is-12-tablet is-6-desktop is-3-widescreen">
            <div class="notification is-primary has-text">
              <p class="title is-3">Mar 5</p>
              <p class="subtitle is-6">Ballot Request Deadline</p>
            </div>
          </div> -->

          <div class="column is-12-tablet is-6-desktop is-3-widescreen">
            <div class="notification is-success has-text">
              <p class="title is-3">Invite</p>
              <p class="subtitle is-6">a friend</p>
            </div>
          </div>
        </div>
        </div>
      </div>

      <!-- details -->
      <div class="column is-12-tablet is-6-desktop is-4-fullhd">
        <div class="card">
          <div class="card-content">
            <h2 class="title is-4">
              2018 Ballot Requests
            </h2>

            <div v-for="(request, index) in requests" :key="index" class="level">
              <div class="level-left">
                <div>
                  <p class="title is-5 is-marginless">
                    <a href="edit-order.html">{{ request.firstName }} {{ request.lastName }}</a>
                  </p>
                  <small class="tag is-warning">
                    must be received by Nov 6
                  </small>
                </div>
              </div>
              <div class="level-right">
                <div class="has-text-right">
                  <p class="title is-5 is-marginless">
                    {{request.votAdr.administrativearea}}
                  </p>
                  <a class="button is-link is-outlined">Continue</a>
                </div>
              </div>
            </div>

            <a class="button is-link is-outlined" href="orders.html">Add a family member</a>
          </div>
        </div>
      </div>
      <!-- user dashboard -->
      <!-- <user-dashboard></user-dashboard> -->
    </div>
  </div>
</template>

<script>
import UserDashboard from '~/components/UserDashboard'

export default {
  name: 'User-Account',
  components: {
    UserDashboard
  },
  data () {
    return {
      isAdmin: false
    }
  },
  computed: {
    user () { return this.$store.state.userauth.user },
    requests () { return this.$store.state.requests.requests },
    currentRequest () { return this.$store.state.requests.currentRequest },
    states () { return new Set(this.requests.map(x => x.votAdr.regionCode)) },
    name () { return this.user.firstName ? this.user.firstName : this.requests[0].firstName || '' }
  }
}
</script>

<style>

</style>
