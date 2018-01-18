<template>
<div class="hero is-fullheight bg">
    <div class="hero-head">
      <header class="navbar is-vfa">
        <div class="container">
          <div class="navbar-brand">
            <a class="navbar-item logo">
              <!-- <img src="/vfa_blue.svg" alt="VoteFromAbroad.org -- Absentee ballots for US Citizens Abroad"> -->
            </a>
            <span class="navbar-burger burger" data-target="navbarMenuHeroC">
              <span></span>
              <span></span>
              <span></span>
            </span>
          </div>
          <div id="navbarMenuHeroC" class="navbar-menu">
            <div class="navbar-end">
              <a class="navbar-item is-active">
                Home
              </a>
              <a class="navbar-item">
                Examples
              </a>
              <a class="navbar-item">
                Documentation
              </a>
              <b-dropdown hoverable position="is-bottom-left">
                <a class="navbar-item" slot="trigger">
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
            <li class="is-active"><a>Overview</a></li>
            <li><a>Modifiers</a></li>
            <li><a>Grid</a></li>
            <li><a>Elements</a></li>
            <li><a>Components</a></li>
            <li><a>Layout</a></li>
          </ul>
        </div>
      </nav>
    </div>
    <!-- <nav class="navbar is-transparent is-fixed-bottom"> -->

    <!-- <footer class="footer">
      <nav class="tabs is-boxed is-fullwidth">
      <ul>
        <li class="is-active"><a>Overview</a></li>
        <li><a>Modifiers</a></li>
        <li><a>Grid</a></li>
        <li><a>Elements</a></li>
        <li><a>Components</a></li>
        <li><a>Layout</a></li>
      </ul>
    </nav>
      <nav class="navbar is-vfa is-fullwidth">
        Democrats Abroad
      </nav>
    </footer> -->
    <!-- </nav> -->
</div>
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
// .logo
//   max-height: 8rem;
//   > img
//     max-height: 6rem;
//     margin: 1rem;
//     max-width: 90vw;

.navbar-item.logo
  background-image: url(/vfa_blue.svg);
  background-size: contain;
  background-position: 50%;
  background-repeat: no-repeat;
  width: 40vw;
  height: 5rem;
  margin: 0 10px;
  padding: 0 20px;
  &:hover
    background-image: url(/vfa_white.svg);

.bg
  background: #fff url(/votefromabroad-bg.jpg) no-repeat center top;
  // min-height: 611px;
  // height: 970px;
  background-size: cover;
</style>

