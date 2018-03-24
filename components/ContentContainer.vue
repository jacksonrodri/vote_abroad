<template>
<div class="section">
  <slot name="lead"></slot>
  <br>
  <div class="content">
    <slot name="content"></slot>
  </div>
  <slot name="closer"></slot>
  <div class="content-footer">
    <nuxt-link to="/FAQs" class="back-home">Back to FAQs</nuxt-link>
  </div>
</div>
</template>

