<template>
  <div class="hero-body columns is-centered">
    <div class="column is-9 is-12-touch">
      <!-- level menu -->
      <div class="level">
        <div class="level-left">
          <span class="level-item">
            <h1 class="subtitle is-3">
              <span class="has-text-grey-light">Hello </span><span><strong>{{ name }}</strong></span>
            </h1>
          </span>
          <!-- <span class="level-item">
            <h1 class="subtitle is-3">
              <span class="has-text-primary"> Next Steps</span>
            </h1>
          </span> -->
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
      <div class="level">
        <div class="level-left">
          <div class="level-item">
            <h1 class="title is-3">Next Steps</h1>
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
        <div class="columns is-multiline is-gapless">
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

          <div class="column is-12-tablet is-6-desktop is-3-widescreen">
            <div class="notification is-success has-text">
              <p class="title is-3">Invite</p>
              <p class="subtitle is-6">a friend</p>
            </div>
          </div>

          <div class="column is-12-tablet is-6-desktop is-3-widescreen">
            <div class="hero is-primary">
              <div class="hero-body">
                <div class="container">
                  <h1 class="title">
                    Hero title
                  </h1>
                  <h2 class="subtitle">
                    Hero subtitle
                  </h2>
                </div>
              </div>
            </div>
          </div>


          <div class="column is-12-tablet is-6-desktop is-3-widescreen">
            <div class="notification is-paddingless is-radiusless card is-success">
              <div class="card-content">
                <h2 class="title is-4">
                  Most popular books
                </h2>
                <div class="media">
                  <!-- <div class="media-left">
                    <p>
                      <span class="icon is-large has-text-success has-text-centered">
                        <i class="fas fa-check fa-2x"></i>
                      </span>
                    </p>
                    <p>
                      <span class="has-text-centered">complete</span>
                    </p>
                  </div> -->
                  <div class="media-content">
                    <p class="title is-5 is-spaced is-marginless">
                      <a href="edit-book.html">Learning Swift</a>
                    </p>
                  </div>
                  <div class="media-right">
                    <p>
                      <span class="icon is-large has-text-white has-text-centered">
                        <i class="fas fa-check fa-2x"></i>
                      </span>
                    </p>
                    <p>
                      <span class="has-text-centered">complete</span>
                    </p>
                  </div>
                </div>
              </div>
              <footer class="card-footer">
                <a href="#" class="card-footer-item">Save</a>
                <a href="#" class="card-footer-item">Edit</a>
                <a href="#" class="card-footer-item">Delete</a>
              </footer>
            </div>
          </div>

          <div class="column is-12-tablet is-6-desktop is-3-widescreen">
            <div class="notification is-paddingless is-radiusless card is-danger">
              <div class="card-content">
                <h2 class="title is-4">
                  Most popular books
                </h2>
                <div class="media">
                  <div class="media-content">
                    <p class="title is-5 is-spaced is-marginless">
                      <a href="edit-book.html">Learning Swift</a>
                    </p>
                  </div>
                  <div class="media-right">
                    146 sold
                  </div>
                </div>
              </div>
              <footer class="card-footer">
                <a href="#" class="card-footer-item">Save</a>
                <a href="#" class="card-footer-item">Edit</a>
                <a href="#" class="card-footer-item">Delete</a>
              </footer>
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

            <div v-for="(request, index) in requests" :key="index">
              <hr>
              <div class="level is-marginless">
                <div class="level-left">
                  <div>
                    <p class="title is-5 is-marginless">
                      <nuxt-link :to="localePath({ name: 'request-stage', params: { stage: 'your-information'} })" exact >{{ request.firstName }} {{ request.lastName }}</nuxt-link>
                    </p>
                  </div>
                </div>
                <div class="level-right">
                  <div class="has-text-right">
                    <span class="tag is-warning">In progress</span>
                  </div>
                </div>
              </div>
              <div class="level is-marginless">
                <div class="level-item">
                  <nav class="breadcrumb is-small is-centered has-arrow-separator" aria-label="breadcrumbs">
                    <ul>
                      <li class="is-active"><a href="#"><strong class="has-text-info">Request a ballot</strong></a></li>
                      <li><a href="#">Receive your ballot</a></li>
                      <li><a href="#">Vote</a></li>
                    </ul>
                  </nav>
                </div>
                <div class="level-right">
                </div>
              </div>
              <div class="level">
                <div class="level-left">
                </div>
                <div class="level-right">
                <div class="has-text-right">
                  <span class="button is-link is-outlined">Continue</span>
                </div>
                </div>
              </div>
              <hr>
            </div>

            <!-- <div class="level">
              <div class="level-left">
                <div>
                  <p class="title is-5 is-marginless">
                    <a href="edit-order.html">918478</a>
                  </p>
                  <small>
                    Nov 12, 21:57 by <a href="edit-customer.html">Simon Jefferson</a>
                  </small>
                </div>
              </div>
              <div class="level-right">
                <div class="has-text-right">
                  <p class="title is-5 is-marginless">
                    $22.99
                  </p>
                  <span class="tag is-danger">Failed</span>
                </div>
              </div>
            </div> -->

            <!-- <a class="button is-link is-outlined" href="orders.html">Add a family member</a> -->
            <nuxt-link class="button is-link is-outlined" :to="localePath({ name: 'request-stage', params: { stage: 'your-information'} })" exact >Add a family member</nuxt-link>
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
