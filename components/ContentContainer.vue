<template>
<div class="content-container">
  <slot name="lead"></slot>
  <div class="content">
    <slot name="content"></slot>
  </div>
  <slot name="closer"></slot>
  <div class="content-footer">
    <nuxt-link to="/" class="back-home">Back Home</nuxt-link>
  </div>
</div>
</template>

