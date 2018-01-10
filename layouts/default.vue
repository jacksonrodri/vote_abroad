<template>
  <section class="hero is-light is-fullheight">
    <!-- Hero head: will stick at the top -->
    <div class="hero-head">
      <header class="navbar">
        <div class="container">
          <div class="navbar-brand">
            <a class="navbar-item">
              <img src="/icon.png" alt="Logo"> <h2 class="subtitle is-4">&nbsp;&nbsp;&nbsp;VoteFromAbroad</h2>
            </a>
            <div class="navbar-item is-expanded has-text-right is-hidden-desktop is-block-touch" >
              <!-- <a class="button is-info is-outlined is-small" v-show="$i18n.locale === 'en'" href="https://bulma.io">Español
              </a> -->
              <nuxt-link :to="switchLocalePath('es')" class="button is-info is-outlined is-small" v-show="$i18n.locale === 'en'">Español</nuxt-link>
              <nuxt-link :to="switchLocalePath('en')" class="button is-info is-outlined is-small" v-show="$i18n.locale === 'es'">English</nuxt-link>
            </div>
            <span class="navbar-burger burger" data-target="navbarMenuHeroC">
              <span></span>
              <span></span>
              <span></span>
            </span>
          </div>
          <div id="navbarMenuHeroC" class="navbar-menu">
            <div class="navbar-end">
              <a class="navbar-item is-active">
                Upcoming Elections
              </a>
              <a class="navbar-item">
                FAQs
              </a>
              <nuxt-link :to="switchLocalePath('es')" class="navbar-item is-tab" v-show="$i18n.locale === 'en'">Español</nuxt-link>
              <nuxt-link :to="switchLocalePath('en')" class="navbar-item is-tab" v-show="$i18n.locale === 'es'">English</nuxt-link>
              <!-- <div class="navbar-item">
                <div class="field is-grouped">
                  <nuxt-link :to="switchLocalePath('en')" class="navbar-item is-tab" :class="$i18n.locale=='en'?'is-active':''" exact>EN</nuxt-link>
                  <nuxt-link :to="switchLocalePath('es')" class="navbar-item is-tab" :class="$i18n.locale=='es'?'is-active':''" exact>ES</nuxt-link>
                </div>
              </div> -->
            </div>
          </div>
        </div>
      </header>
    </div>

    <nuxt/>

    <!-- Hero footer: will stick at the bottom -->
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
  </section>
</template>
