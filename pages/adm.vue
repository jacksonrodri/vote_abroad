<template>
  <div></div>
</template>

<script>
export default {
  layout: 'blank',
  head: {
    script: [
      { src: 'https://identity.netlify.com/v1/netlify-identity-widget.js' },
      { src: 'https://unpkg.com/netlify-cms@^1.0.0/dist/cms.js' }
    ],
    link: [
      { rel: 'stylesheet', href: 'https://unpkg.com/netlify-cms@^1.0.0/dist/cms.css' }
    ]
  }
}
</script>
