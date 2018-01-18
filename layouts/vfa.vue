<template>
<div>
<div class="hero is-fullheight bg">
    <div class="hero-head">
      <header class="navbar is-vfa">
        <div class="container">
          <div class="navbar-brand">
            <a class="navbar-item logo">
              <!-- <img src="/vfa_blue.svg" alt="VoteFromAbroad.org -- Absentee ballots for US Citizens Abroad"> -->
            </a>
            <!-- <span class="navbar-burger burger" data-target="navbarMenuHeroC">
              <span></span>
              <span></span>
              <span></span>
            </span> -->
          </div>
          <div id="navbarMenuHeroC" class="navbar-menu is-active is-paddingless">
            <div class="navbar-end">
              <div class="navbar-item lang">
                <button class="button is-outlined is-danger is-small">En Español</button>
              </div>
              <b-dropdown hoverable class="navbar-item has-dropdown is-hidden-mobile">
                <a class="navbar-item navbar-link" slot="trigger">
                  <span>FAQs</span>
                  <b-icon icon="menu-down"></b-icon>
                </a>

                <b-dropdown-item>Action</b-dropdown-item>
                <b-dropdown-item>Another action</b-dropdown-item>
                <b-dropdown-item>Something else</b-dropdown-item>
              </b-dropdown>
              <b-dropdown hoverable class="navbar-item has-dropdown">
                <a class="navbar-item navbar-link" slot="trigger">
                  <span><span class="is-hidden-mobile">Upcoming </span>Elections</span>
                  <b-icon icon="menu-down"></b-icon>
                </a>

                <b-dropdown-item>Action</b-dropdown-item>
                <b-dropdown-item>Another action</b-dropdown-item>
                <b-dropdown-item>Something else</b-dropdown-item>
              </b-dropdown>
              <b-dropdown hoverable position="is-bottom-left" class="navbar-item has-dropdown">
                <a class="navbar-item navbar-link" slot="trigger">
                  <span>Login</span>
                  <b-icon icon="menu-down"></b-icon>
                </a>
                <b-dropdown-item custom paddingless>
                  <form action="">
                    <div class="modal-card" style="width:300px;">
                      <section class="modal-card-body">
                        <phone-email></phone-email>
                        <!-- <b-field label="Email">
                          <b-input
                            type="email"
                            placeholder="Your email"
                            required>
                          </b-input>
                        </b-field>

                        <b-field label="Password">
                          <b-input
                            type="password"
                            password-reveal
                            placeholder="Your password"
                            required>
                          </b-input>
                        </b-field> -->

                        <b-checkbox>Remember me</b-checkbox>
                      </section>
                      <footer class="modal-card-foot">
                        <button class="button is-vfa">Login</button>
                      </footer>
                    </div>
                  </form>
                </b-dropdown-item>
              </b-dropdown>
            </div>
          </div>
        </div>
      </header>
      <!-- <div class="navbar is-vfa">
        <a class="logo" href="https://bulma.io">
          <img src="/vfa-white.svg" alt="VoteFromAbroad.org -- Absentee ballots for US Citizens Abroad">
        </a>
      </div>
      <div class="columns is-mobile">
        <div class="column is-hidden-touch"></div>
        <div class="columns column is-5-desktop is-mobile">
          <div class="column is-one-third-desktop navbar is-vfalight has-text-centered is-paddingless">
            <b-dropdown hoverable class="navbar-item">
              <button class="button is-radiusless is-vfalight" slot="trigger">
                <span>Elections</span>
                <b-icon icon="menu-down"></b-icon>
              </button>

              <b-dropdown-item>Action</b-dropdown-item>
              <b-dropdown-item>Another action</b-dropdown-item>
              <b-dropdown-item>Something else</b-dropdown-item>
            </b-dropdown>
          </div>
          <div class="column is-one-third-desktop navbar is-vfalight has-text-centered is-paddingless">
            <b-dropdown hoverable class="navbar-item">
              <button class="button is-radiusless is-vfalight" slot="trigger">
                <span>FAQs</span>
                <b-icon icon="menu-down"></b-icon>
              </button>

              <b-dropdown-item>Action</b-dropdown-item>
              <b-dropdown-item>Another action</b-dropdown-item>
              <b-dropdown-item>Something else</b-dropdown-item>
            </b-dropdown>
          </div>
          <div class="column is-one-third-desktop navbar is-vfalight has-text-centered is-paddingless">
            <b-dropdown hoverable position="is-bottom-left" class="navbar-item ">
              <a class="is-radiusless button is-vfalight" slot="trigger">
                <span>Login</span>
                <b-icon icon="menu-down"></b-icon>
              </a>
              <b-dropdown-item custom paddingless>
                <form action="">
                  <div class="modal-card" style="width:300px;">
                    <section class="modal-card-body">
                      <b-field label="Email">
                        <b-input
                          type="email"
                          placeholder="Your email"
                          required>
                        </b-input>
                      </b-field>

                      <b-field label="Password">
                        <b-input
                          type="password"
                          password-reveal
                          placeholder="Your password"
                          required>
                        </b-input>
                      </b-field>

                      <b-checkbox>Remember me</b-checkbox>
                    </section>
                    <footer class="modal-card-foot">
                      <button class="button is-vfa">Login</button>
                    </footer>
                  </div>
                </form>
              </b-dropdown-item>
            </b-dropdown>
          </div>
        </div>
      </div> -->
      </div>
    <nuxt/>
    <div class="hero-foot">
      <nav class="tabs is-boxed is-fullwidth">
        <div class="container">
          <ul>
            <li class="is-active"><a>How to<span class="is-hidden-touch">&nbsp;Vote From Abroad</span></a></li>
            <li><a><span class="is-hidden-touch">Voter Help Desk/</span>FAQ</a></li>
            <li><a>About Us</a></li>
            <li><a>Election Official Directory</a></li>
          </ul>
        </div>
      </nav>
    </div>
</div>
<section class="hero is-vfa">
  <div class="hero-body">
    <div class="container">
      <nav class="level">
        <p class="level-item has-text-centered">
          <a class="link is-info">Privacy</a>
        </p>
        <p class="level-item has-text-centered is-size-7">
          Public Service provided by Democratic Party Committee Abroad (DemocratsAbroad.org).<br/>
This communication is not authorized by any candidate or candidate's committee.
        </p>
        <p class="level-item has-text-centered">
          <a class="link is-info">Terms of Use</a>
        </p>
      </nav>
    </div>
  </div>
</section>
</div>
</template>

<script>
import PhoneEmail from '~/components/PhoneEmail.vue'

export default {
  data () {
    return {
      something: null
    }
  },
  components: {
    PhoneEmail
  }
}
</script>

<style lang="sass" scoped>
// .navbar-item img
//     max-height: 3rem
// .logo
//   max-height: 8rem;
//   > img
//     max-height: 6rem;
//     margin: 1rem;
//     max-width: 90vw;
.navbar
    background-color: hsl(227, 59%, 22%);

.navbar-item
  display: inline-flex;
  flex-grow: 1;
  flex-shrink: 1;

.navbar-end
  flex-grow: 0;
  flex-shrink: 1;
  display: flex;

.navbar-link
  padding-right: 1em;

.navbar-item.logo
  background-image: url(/vfa_white.svg);
  background-color: hsl(227, 59%, 22%);
  background-size: contain;
  background-position: 50%;
  background-repeat: no-repeat;
  width: 40vw;
  height: 5rem;
  margin: 10px;
  padding: 0 20px;
  &:hover
    background-image: url(/vfa_white.svg);
    background-color: hsl(227, 59%, 22%);

.tabs:not(:last-child)
  margin-bottom: 0;

.bg
  background: #fff url(/votefromabroad-bg.jpg) no-repeat center top;
  // min-height: 611px;
  // height: 970px;
  background-size: cover;
</style>

