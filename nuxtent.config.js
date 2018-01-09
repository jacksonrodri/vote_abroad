module.exports = {
  content: [
    ['en/pages', {
      page: '/page',
      permalink: ':slug',
      isPost: false,
      generate: [
        'get'
      ]
    }]
    // ['projects', {
    //   page: '/projects/_project',
    //   isPost: false
    // }]
  ]
  // api: {
  //   baseURL: process.env.NODE_ENV === 'production'
  //     ? 'https://condescending-hermann-429ba3.netlify.com'
  //     : 'http://localhost:3000'
  // }
}
