<template>
  <div class="hero-body columns is-centered">
    <div class="column is-9 is-12-touch">
      <!-- level menu -->
      <div class="level is-mobile">
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
          <div class="level-item">
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
            <b-message title="Success/warning message following request process" type="is-success" has-icon>
              custom message here depending on the status of the voter's ballot request
            </b-message>
            <!-- ballot request status area -->
            <div class="columns">
              <div class="column">

                <!-- voter status -->
                <div class="hero is-vfa">
                  <div class="hero-head">
                    <!-- <div class="hero is-vfa">
                      <div class="hero-head"> -->
                        <nav class="navbar">
                          <div class="navbar-brand">
                            <h1 class="navbar-item title is-4 has-text-light">Your Voting Progress</h1>
                          </div>
                        </nav>
                      </div>
                      <div class="hero-foot">
                        <div class="columns is-gapless">
                          <a class="column has-text-centered hero is-vfalight">
                              <p class="title is-hidden-mobile">
                                <span class="icon">
                                  <i class="fas fa-pencil-alt"></i>
                                </span>
                              </p>
                              <p class="subtitle has-text-white">
                                <span class="heading is-size-6-mobile"><i class="fas fa-pencil-alt is-hidden-tablet"></i>Fill in Ballot Request</span>
                              </p>
                          </a>
                          <a class="column has-text-centered">
                              <p class="title is-hidden-mobile">
                                <span class="icon">
                                  <i class="fas fa-paper-plane"></i>
                                </span>
                              </p>
                              <p class="subtitle has-text-white">
                                <span class="heading is-size-6-mobile"><i class="fas fa-pencil-alt is-hidden-tablet"></i>Send in Ballot Request</span>
                              </p>
                          </a>
                          <a class="column has-text-centered">
                              <p class="title is-hidden-mobile">
                                <span class="icon">
                                  <i class="fas fa-phone"></i>
                                </span>
                              </p>
                              <p class="subtitle has-text-white">
                                <span class="heading is-size-6-mobile"><i class="fas fa-pencil-alt is-hidden-tablet"></i>Confirm Request Received</span>
                              </p>
                          </a>
                          <a class="column has-text-centered">
                              <p class="title is-hidden-mobile">
                                <span class="icon">
                                  <i class="fas fa-inbox"></i>
                                </span>
                              </p>
                              <p class="subtitle has-text-white">
                                <span class="heading is-size-6-mobile"><i class="fas fa-pencil-alt is-hidden-tablet"></i>Receive ballot</span>
                              </p>
                          </a>
                          <a class="column has-text-centered">
                              <p class="title is-hidden-mobile">
                                <span class="icon">
                                  <i class="fas fa-check"></i>
                                </span>
                              </p>
                              <p class="subtitle has-text-white">
                                <span class="heading is-size-6-mobile"><i class="fas fa-pencil-alt is-hidden-tablet"></i>Vote your ballot</span>
                              </p>
                          </a>
                        </div>
                      <!-- </div>
                    </div> -->
                  </div>
                  <div class="hero-body">Content</div>
                  <div class="hero-foot">Foot</div>
                </div>

              </div>
            </div>
            <!-- dashboard area -->
            <div class="columns is-multiline">
              <div class="column is-12-tablet is-6-desktop">
                <div class="card">
                  <header class="card-header">
                    <p class="card-header-title title is-5">
                      Your upcoming elections
                    </p>
                    <div class="card-header-icon">
                      <div class="select">
                        <select>
                          <option selected>2018</option>
                          <option>2019</option>
                          <option>2020</option>
                        </select>
                      </div>
                    </div>
                  </header>
                  <div class="card-content">
                    <div>Elections content</div>
                  </div>
                  <footer class="card-footer">
                    <p class="card-footer-item">
                    </p>
                    <p class="card-footer-item">
                      <span>
                        Are we missing an election?
                      </span>
                    </p>
                  </footer>
                </div>
              </div>

              <div class="column is-12-tablet is-6-desktop">
                <div class="card">
                  <header class="card-header">
                    <p class="card-header-title title is-5">
                      Your family's ballot requests
                    </p>
                    <div class="card-header-icon">
                      <div class="select">
                        <select>
                          <option selected>2018</option>
                          <option>2019</option>
                          <option>2020</option>
                        </select>
                      </div>
                    </div>
                  </header>
                  <div class="card-content">
                    <div v-for="(request, index) in requests" :key="index">
                      <div class="level is-marginless">
                        <div class="level-left">
                          <div>
                            <p class="title is-5 is-marginless">
                              <nuxt-link :to="localePath({ name: 'request-stage', params: { stage: 'your-information'} })" exact >{{ request && request.firstName ? request.firstName : '' }} {{ request && request.lastName ? request.lastName : ''}}</nuxt-link>
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
                    </div>

                    <!-- <a class="button is-link is-outlined" href="orders.html">Add a family member</a> -->
                    <!-- <nuxt-link class="button is-link is-outlined" :to="localePath({ name: 'request-stage', params: { stage: 'your-information'} })" exact >Add a family member</nuxt-link> -->
                  </div>
                  <footer class="card-footer">
                    <p class="card-footer-item">
                    </p>
                    <nuxt-link class="card-footer-item has-text-link" :to="localePath({ name: 'request-stage', params: { stage: 'your-information'} })" exact >Add a family member</nuxt-link>
                  </footer>
                </div>
              </div>
            </div>

          <!-- stats and buttons -->
          <div class="columns is-multiline">
            <div class="column is-12-tablet is-6-desktop is-3-widescreen">
              <div class="notification is-info has-text">
                <p class="title is-3">Learn</p>
                <p class="subtitle is-6">about your voting rights</p>
              </div>
            </div>

            <div class="column is-12-tablet is-6-desktop is-3-widescreen">
              <div class="notification is-danger has-text">
                <p class="title is-3">Share</p>
                <p class="subtitle is-6">on social media</p>
              </div>
            </div>

            <div class="column is-12-tablet is-6-desktop is-3-widescreen">
              <div class="notification is-warning has-text">
                <p class="title is-3">Ask</p>
                <p class="subtitle is-6">a friend to vote from abroad</p>
              </div>
            </div>

            <div class="column is-12-tablet is-6-desktop is-3-widescreen">
              <div class="notification is-success has-text">
                <p class="title is-3">Support</p>
                <p class="subtitle is-6">votefromabroad.org</p>
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
    name () { return this.user && this.user.firstName ? this.user.firstName : this.requests && this.requests[0] && this.requests[0].firstName ? this.requests[0].firstName : '' }
  }
}
</script>

<style>

</style>
