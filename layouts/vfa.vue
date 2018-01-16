<template>
  <section class="bg">
      <div class="columns">
        <div class="column is-12 navbar is-vfa">
          <a class="logo" href="https://bulma.io">
            <img src="/vfa-white.svg" alt="VoteFromAbroad.org -- Absentee ballots for US Citizens Abroad">
          </a>
        </div>
      </div>
      <div class="columns is-mobile">
        <div class="column is-hidden-touch"></div>
        <div class="columns column is-5-desktop is-mobile">
          <div class="column is-one-third-desktop navbar is-vfa has-text-centered is-paddingless">
            <b-dropdown hoverable class="navbar-item">
              <button class="button is-radiusless is-vfa" slot="trigger">
                <span>Elections</span>
                <b-icon icon="menu-down"></b-icon>
              </button>

              <b-dropdown-item>Action</b-dropdown-item>
              <b-dropdown-item>Another action</b-dropdown-item>
              <b-dropdown-item>Something else</b-dropdown-item>
            </b-dropdown>
          </div>
          <div class="column is-one-third-desktop navbar is-vfa has-text-centered is-paddingless">
            <b-dropdown hoverable class="navbar-item">
              <button class="button is-radiusless is-vfa" slot="trigger">
                <span>FAQs</span>
                <b-icon icon="menu-down"></b-icon>
              </button>

              <b-dropdown-item>Action</b-dropdown-item>
              <b-dropdown-item>Another action</b-dropdown-item>
              <b-dropdown-item>Something else</b-dropdown-item>
            </b-dropdown>
          </div>
          <div class="column is-one-third-desktop navbar is-vfa has-text-centered is-paddingless">
            <b-dropdown hoverable position="is-bottom-left" class="navbar-item ">
              <a class="is-radiusless button is-vfa" slot="trigger">
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
      </div>
    <nuxt/>
    <nav class="navbar is-fixed-bottom is-vfa">
    </nav>
  </section>
</template>

<script>
export default {
  data () {
    return {
      something: null
    }
  }
}
</script>

<style lang="sass" scoped>
// .navbar-item img
//     max-height: 3rem
.logo
  max-height: 8rem;
  > img
    max-height: 6rem;
    margin: 1rem;
    max-width: 90vw;

.bg
  background: #fff url(/votefromabroad-bg.jpg) no-repeat center top;
  min-height: 611px;
  height: 970px;
  background-size: cover;
  background-position: center 6rem;
</style>

